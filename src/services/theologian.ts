/**
 * Professor de Teologia — agente de dúvidas bíblicas (IA Claude).
 *
 * O app fala um contrato único: pergunta + histórico → resposta em texto.
 * Dois modos de atendimento, nesta ordem:
 *
 *  1. PRODUÇÃO — EXPO_PUBLIC_AGENT_API_URL aponta para o seu backend
 *     (Cloud Function em server/agent-proxy/). A chave da Anthropic fica
 *     NO SERVIDOR, nunca no app. O servidor também revalida a cota.
 *
 *  2. DEV — EXPO_PUBLIC_ANTHROPIC_KEY no .env chama a API da Anthropic
 *     direto do app. SÓ PARA TESTAR EM DESENVOLVIMENTO: qualquer chave
 *     embutida num app publicado pode ser extraída. Não publique assim.
 *
 * Sem nenhum dos dois, lança erro amigável (recurso "em breve").
 */

export type AgentTurn = { role: 'user' | 'assistant'; text: string };

const AGENT_API_URL = process.env.EXPO_PUBLIC_AGENT_API_URL;
const DEV_ANTHROPIC_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_KEY;
const MODEL = process.env.EXPO_PUBLIC_AGENT_MODEL || 'claude-opus-4-8';

export const isAgentConfigured = Boolean(AGENT_API_URL || DEV_ANTHROPIC_KEY);

/** Quantas mensagens recentes do histórico enviamos como contexto. */
const HISTORY_WINDOW = 10;

export const THEOLOGIAN_SYSTEM_PROMPT = `Você é o Professor de Teologia do Verbo, um app bíblico brasileiro. Você responde dúvidas sobre a Bíblia, teologia, história bíblica e vida cristã.

Diretrizes:
- Responda em português do Brasil, com tom acolhedor e didático, como um professor paciente.
- Fundamente as respostas na Bíblia, citando as referências (livro, capítulo e versículo). NUNCA invente uma citação: se não tiver certeza da referência exata, diga o livro/contexto sem inventar número de versículo.
- Em temas onde denominações cristãs divergem (batismo, dons, escatologia etc.), apresente as principais visões com respeito e neutralidade, sem impor uma posição.
- Seja honesto sobre incertezas históricas ou textuais quando existirem.
- Mantenha as respostas concisas para leitura no celular: idealmente 2 a 5 parágrafos curtos. Aprofunde só se a pergunta pedir.
- Se perguntarem algo fora do tema bíblico/cristão, redirecione com gentileza para o propósito do app.
- Não substitua aconselhamento pastoral, médico ou psicológico; em temas sensíveis (luto, depressão etc.), acolha e sugira buscar ajuda pastoral/profissional junto com o apoio das Escrituras.`;

function buildApiMessages(history: AgentTurn[], question: string) {
  const recent = history.slice(-HISTORY_WINDOW);
  return [
    ...recent.map((t) => ({ role: t.role, content: t.text })),
    { role: 'user' as const, content: question },
  ];
}

/**
 * Envia a pergunta e devolve a resposta do professor.
 * Lança Error com mensagem amigável em caso de falha/não configurado.
 */
export async function askTheologian(question: string, history: AgentTurn[]): Promise<string> {
  const messages = buildApiMessages(history, question);

  // 1) Backend próprio (produção)
  if (AGENT_API_URL) {
    const res = await fetch(AGENT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    if (!res.ok) {
      throw new Error('O professor está indisponível agora. Tente novamente em instantes.');
    }
    const json = (await res.json()) as { answer?: string; error?: string };
    if (!json.answer) throw new Error(json.error ?? 'Resposta vazia do servidor.');
    return json.answer;
  }

  // 2) Chamada direta (APENAS desenvolvimento — não publicar com chave no app)
  if (DEV_ANTHROPIC_KEY) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': DEV_ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        // Respostas de chat p/ celular — limite deliberadamente curto.
        max_tokens: 4096,
        thinking: { type: 'adaptive' },
        system: THEOLOGIAN_SYSTEM_PROMPT,
        messages,
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.warn('Anthropic API error:', res.status, body.slice(0, 300));
      throw new Error(
        res.status === 401
          ? 'Chave da API inválida. Confira EXPO_PUBLIC_ANTHROPIC_KEY no .env.'
          : 'O professor está indisponível agora. Tente novamente em instantes.',
      );
    }
    const json = (await res.json()) as {
      content?: { type: string; text?: string }[];
      stop_reason?: string;
    };
    const text = (json.content ?? [])
      .filter((b) => b.type === 'text' && b.text)
      .map((b) => b.text)
      .join('\n')
      .trim();
    if (!text) throw new Error('Não consegui gerar uma resposta. Tente reformular a pergunta.');
    return text;
  }

  throw new Error(
    'O Professor de Teologia ainda não está configurado. Adicione EXPO_PUBLIC_AGENT_API_URL (backend) ou EXPO_PUBLIC_ANTHROPIC_KEY (dev) no .env — ver SETUP.md.',
  );
}
