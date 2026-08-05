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

O código já está pronto (`src/services/googleAuth.ts` + `auth.ts`). Falta só a
sua configuração no Google.

> ⚠️ **Não funciona no Expo Go.** A biblioteca do Google é um módulo nativo,
> então exige um **development build**. No Expo Go o app abre normalmente e o
> botão apenas avisa isso — nada quebra.

**1. Criar o OAuth client ID**

Pelo Firebase (recomendado, porque também habilita o sync):
1. https://console.firebase.google.com → seu projeto → **Authentication** →
   **Sign-in method** → ative **Google**
2. Isso cria automaticamente um **Web client ID** — copie-o
3. Preencha também as chaves `EXPO_PUBLIC_FIREBASE_*` no `.env`

Sem Firebase também funciona (login local, sem sincronizar): crie um projeto em
https://console.cloud.google.com → **APIs e serviços** → **Credenciais** →
**Criar credenciais** → **ID do cliente OAuth** → tipo **Aplicativo da Web**.

**2. Colocar no `.env`**

```
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=1234-abc.apps.googleusercontent.com
```

Use o **Web** client ID mesmo no Android e no iOS — é para ele que o ID token
é emitido. No Android é preciso ainda cadastrar a **impressão digital SHA-1**
do seu build no Firebase/Google Cloud (o `eas credentials` mostra a sua).

**3. Gerar um development build e testar**

```bash
eas build --profile development --platform android
```

Instale o APK gerado e rode `npx expo start --dev-client`.

**iOS:** adicione o `iosUrlScheme` ao plugin no `app.json` (o valor é o iOS
client ID invertido, `com.googleusercontent.apps.SEU-ID`) e preencha
`EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`.

Enquanto nada disso estiver feito, o app continua funcionando em **modo
visitante** — só o botão do Google fica indisponível.

## O que é Premium

Bloqueado por `usePremiumStore` (persistido, e independente de login — um
visitante pode assinar):

| Recurso | Grátis | Premium |
|---|---|---|
| Leitura, busca, notas, destaques, plano | ✅ | ✅ |
| Quiz, Corrida da Fé, Mídia | ✅ | ✅ |
| Versões da Bíblia | a 1ª do idioma | todas |
| Comparar versões | ❌ | ✅ |
| Bíblia em áudio | ❌ | ✅ |
| Textos originais (grego/hebraico) | ❌ | ✅ |
| Lugares históricos | ❌ | ✅ |
| Professor de Teologia | 2 perguntas/dia | 30/dia |

Para proteger uma tela nova, envolva-a em `<PremiumGate>` (ver
`src/components/premium-gate.tsx`).

> Isso é experiência do usuário, não segurança. O que precisa mesmo ser
> protegido (a cota do Professor) é revalidado no servidor.

**Testar como assinante:** enquanto o RevenueCat não estiver configurado, a
tela de Premium em **build de desenvolvimento** ativa a assinatura localmente
(sem cobrança) e mostra um aviso de "Modo de teste", com botão para desligar.
Em APK de produção `__DEV__` é `false` e esse caminho não existe — sem a loja
configurada o app diz que a assinatura ainda não está disponível.

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

**`npx eas-cli` falha com `Cannot find module './lib/picomatch'`.** O cache do
`npx` baixou o pacote pela metade. Apague a pasta do cache correspondente em
`%LOCALAPPDATA%\npm-cache\_npx\`, rode `npm cache verify` e reinstale. Melhor
ainda: instale de vez com `npm install -g eas-cli` e use `eas` direto (o `npx`
rebaixa o CLI inteiro a cada chamada).

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
