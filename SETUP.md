# Verbo — Setup

App bíblico Android — React Native + Expo (**SDK 54**). Modelo freemium + Premium.

> **Por que SDK 54?** O Expo Go das lojas (Play Store/App Store) suporta até a
> SDK 54; as SDKs 55/56 só rodam via dev build / `eas go`. Para testar no Expo Go
> padrão, o projeto fica na 54.

## Rodar em desenvolvimento

```bash
npm install
npx expo start
```

Leia o QR code com o app **Expo Go** (Android) ou tecle `w` para abrir no navegador.

O app roda em **modo visitante** sem nenhuma chave configurada — Bíblia, busca,
highlights, notas e plano de leitura funcionam 100% offline/local.

## O que já está implementado (Fase 1)

| Recurso | Status |
|---|---|
| Bíblia ACF + NVI (offline, ambas em português) | ✅ |
| Leitor de capítulos + navegação livro/capítulo | ✅ |
| Busca de versículos (texto + referência) | ✅ |
| Highlights (5 cores) e notas pessoais | ✅ |
| Plano de leitura 365 dias com progresso | ✅ |
| Versículo do dia | ✅ |
| Quiz diário (10 perguntas, timer, Talentos) | ✅ |
| Corrida da Fé (GPS, distância, Talentos) | ✅ |
| Login Google/Apple (UI) | ✅ UI (pluga OAuth) |
| Paywall Premium (3 planos) | ✅ UI (pluga RevenueCat) |

## Login com Google (método principal)

O login do app é via Google (Apple virá depois). Requer config nativa:

```bash
npx expo install expo-auth-session expo-web-browser
```

1. Crie um projeto em https://console.firebase.google.com e ative o provedor
   **Google** em Authentication
2. Crie OAuth client IDs (Web + Android + iOS) no Google Cloud Console
3. Preencha `.env` (copie de `.env.example`) com as chaves do Firebase
4. Implemente o fluxo em `src/services/auth.ts` → `signInWithGoogle` (TODO marcado)

Sem isso, o login fica desativado e o app segue em modo visitante.

## Ligar assinaturas (RevenueCat) — precisa de dev build

O SDK `react-native-purchases` **não roda no Expo Go**. Para ativar:

```bash
npx expo install react-native-purchases
```

1. Adicione `"react-native-purchases"` em `plugins` no `app.json`
2. Crie conta no RevenueCat e produtos no Google Play Console
3. Preencha `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` no `.env`
4. Implemente as chamadas em `src/services/subscriptions.ts` (TODOs marcados)
5. Gere um **dev build** (não Expo Go): `eas build --profile development`

## Professor de Teologia (agente IA)

Chat de dúvidas bíblicas com IA (Claude). Cotas: **2 perguntas/dia grátis**,
**30/dia no Premium** (constantes em `src/store/useAgentStore.ts`).

**Testar agora (dev):** crie uma chave em https://console.anthropic.com →
API Keys e coloque no `.env`:

```
EXPO_PUBLIC_ANTHROPIC_KEY=sk-ant-...
```

⚠️ Chave no app é só para desenvolvimento — nunca publique assim (qualquer
chave embutida em app publicado pode ser extraída).

**Produção:** faça o deploy do proxy em `server/agent-proxy/` (Cloud Function;
instruções no topo do `index.js`) e aponte o app para ele:

```
EXPO_PUBLIC_AGENT_API_URL=https://southamerica-east1-SEU-PROJETO.cloudfunctions.net/askTheologian
```

A chave fica no servidor (Secret Manager). Quando o Firebase Auth estiver
ligado, o proxy deve revalidar a cota diária no Firestore (TODO marcado).

## Build para a Play Store (EAS)

```bash
npm install -g eas-cli
eas login
eas build --profile preview      # APK para testar
eas build --profile production    # AAB para a Play Store
eas submit --profile production   # envio para a Play Store
```

Perfis configurados em `eas.json`. Package Android: `com.verbo.bibleapp`.

## Solução de problemas

**`expo export` falha no passo `hermesc` (Windows).** Resolvido fixando o
`babel-preset-expo` na versão da SDK 54. Se reaparecer, garanta que pacotes do
ecossistema Expo sejam instalados com `npx expo install <pkg>` (que escolhe a
versão da SDK), nunca `npm install <pkg>` (pega a latest, incompatível).

## Regenerar os dados bíblicos

```bash
node scripts/build-bible.js
```

Fontes (domínio público): ACF e NVI de `thiagobodruk/biblia`. Saída em
`src/data/bible/` (`acf.json`, `nvi.json`, `books.json`).

## Estrutura

```
src/
├── app/                 # rotas (Expo Router)
│   ├── (tabs)/          # Início, Bíblia, Corrida, Quiz, Perfil
│   ├── (auth)/login     # login (Google/Apple)
│   ├── bible/[book]/    # seletor de capítulo + leitor
│   ├── bible/search     # busca
│   ├── quiz/play        # quiz jogável
│   ├── notes, plan, premium
├── components/          # VerseActionSheet, etc.
├── services/            # firebase, auth, bible, subscriptions, readingPlan
├── store/               # zustand: auth, bible, library, plan, talents
├── data/bible/          # acf.json, nvi.json, books.json
└── constants/           # colors, verses, quiz
```
