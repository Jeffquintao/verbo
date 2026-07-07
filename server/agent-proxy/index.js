/**
 * Verbo — Professor de Teologia (proxy de backend)
 *
 * Cloud Function (Firebase) que recebe a pergunta do app e chama a API da
 * Anthropic com a chave guardada NO SERVIDOR. O app nunca vê a chave.
 *
 * Deploy:
 *   1. npm install -g firebase-tools && firebase login
 *   2. firebase init functions  (aponte para este diretório ou copie os arquivos)
 *   3. firebase functions:secrets:set ANTHROPIC_API_KEY
 *   4. firebase deploy --only functions:askTheologian
 *   5. Coloque a URL da função em EXPO_PUBLIC_AGENT_API_URL no .env do app
 *
 * TODO (quando o Firebase Auth estiver ligado no app):
 *   - Validar o ID token do usuário (Authorization: Bearer <token>)
 *   - Revalidar a cota diária no Firestore (2 grátis / 30 premium) — a cota
 *     do cliente é experiência de UX, não barreira de segurança.
 */
const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const Anthropic = require('@anthropic-ai/sdk');

const anthropicApiKey = defineSecret('ANTHROPIC_API_KEY');

const MODEL = 'claude-opus-4-8';

const SYSTEM_PROMPT = `Você é o Professor de Teologia do Verbo, um app bíblico brasileiro. Você responde dúvidas sobre a Bíblia, teologia, história bíblica e vida cristã.

Diretrizes:
- Responda em português do Brasil, com tom acolhedor e didático, como um professor paciente.
- Fundamente as respostas na Bíblia, citando as referências (livro, capítulo e versículo). NUNCA invente uma citação: se não tiver certeza da referência exata, diga o livro/contexto sem inventar número de versículo.
- Em temas onde denominações cristãs divergem (batismo, dons, escatologia etc.), apresente as principais visões com respeito e neutralidade, sem impor uma posição.
- Seja honesto sobre incertezas históricas ou textuais quando existirem.
- Mantenha as respostas concisas para leitura no celular: idealmente 2 a 5 parágrafos curtos. Aprofunde só se a pergunta pedir.
- Se perguntarem algo fora do tema bíblico/cristão, redirecione com gentileza para o propósito do app.
- Não substitua aconselhamento pastoral, médico ou psicológico; em temas sensíveis (luto, depressão etc.), acolha e sugira buscar ajuda pastoral/profissional junto com o apoio das Escrituras.`;

exports.askTheologian = onRequest(
  { secrets: [anthropicApiKey], cors: true, region: 'southamerica-east1' },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Use POST.' });
      return;
    }

    const { messages } = req.body ?? {};
    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Corpo inválido: esperado { messages: [...] }.' });
      return;
    }

    try {
      const client = new Anthropic({ apiKey: anthropicApiKey.value() });
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: 4096, // respostas de chat para celular — deliberadamente curtas
        thinking: { type: 'adaptive' },
        system: SYSTEM_PROMPT,
        messages,
      });

      const answer = response.content
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('\n')
        .trim();

      if (!answer) {
        res.status(502).json({ error: 'Resposta vazia do modelo.' });
        return;
      }
      res.json({ answer });
    } catch (err) {
      if (err instanceof Anthropic.RateLimitError) {
        res.status(429).json({ error: 'Muitas perguntas agora. Tente em instantes.' });
      } else if (err instanceof Anthropic.APIError) {
        console.error('Anthropic APIError', err.status, err.message);
        res.status(502).json({ error: 'O professor está indisponível agora.' });
      } else {
        console.error('Erro inesperado', err);
        res.status(500).json({ error: 'Erro interno.' });
      }
    }
  },
);
