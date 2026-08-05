/**
 * Login com Google (@react-native-google-signin/google-signin).
 *
 * ⚠️ É um módulo NATIVO: não funciona no Expo Go, só em development build
 * ou no app publicado. Por isso ele é carregado de forma protegida — no
 * Expo Go o app continua abrindo normalmente e o botão avisa que precisa
 * de um build.
 *
 * Precisa do Web Client ID do Google (mesmo no Android/iOS: o ID token é
 * emitido para o cliente Web). Ver SETUP.md.
 */
import Constants, { ExecutionEnvironment } from 'expo-constants';

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

/** Estamos rodando dentro do Expo Go? (lá o módulo nativo não existe) */
export const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

/** O Web Client ID foi informado no .env? */
export const isGoogleConfigured = Boolean(WEB_CLIENT_ID);

/** Resultado do login: perfil do Google + o ID token para o Firebase. */
export type GoogleAccount = {
  id: string;
  name: string;
  email: string;
  photo: string | null;
  idToken: string | null;
};

type GoogleSigninModule = typeof import('@react-native-google-signin/google-signin');

let mod: GoogleSigninModule | null = null;
let configured = false;

/**
 * Carrega o módulo nativo. Devolve null quando ele não está disponível
 * (Expo Go, ou build sem o plugin) em vez de derrubar o app.
 */
function loadModule(): GoogleSigninModule | null {
  if (mod) return mod;
  if (isExpoGo) return null;
  try {
    // require (e não import) para o módulo nativo não ser tocado no Expo Go.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    mod = require('@react-native-google-signin/google-signin') as GoogleSigninModule;
    return mod;
  } catch {
    return null;
  }
}

/** Motivo pelo qual o login com Google não está disponível, ou null se estiver. */
export function googleUnavailableReason(): 'expo-go' | 'not-configured' | null {
  if (isExpoGo) return 'expo-go';
  if (!isGoogleConfigured) return 'not-configured';
  if (!loadModule()) return 'expo-go';
  return null;
}

/** Erro lançado quando o usuário fecha a janela do Google. */
export class GoogleCancelledError extends Error {
  constructor() {
    super('cancelled');
    this.name = 'GoogleCancelledError';
  }
}

/**
 * Abre o fluxo do Google e devolve a conta escolhida.
 * Lança GoogleCancelledError se o usuário desistir.
 */
export async function signInWithGoogleNative(): Promise<GoogleAccount> {
  const google = loadModule();
  if (!google) {
    throw new Error('google-unavailable');
  }
  const { GoogleSignin, isSuccessResponse, isCancelledResponse } = google;

  if (!configured) {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      iosClientId: IOS_CLIENT_ID,
      // serverAuthCode só é emitido com offlineAccess; não precisamos dele.
      offlineAccess: false,
    });
    configured = true;
  }

  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const response = await GoogleSignin.signIn();

  if (isCancelledResponse(response)) throw new GoogleCancelledError();
  if (!isSuccessResponse(response)) throw new Error('google-failed');

  const { user, idToken } = response.data;
  return {
    id: user.id,
    name: user.name ?? user.givenName ?? user.email.split('@')[0],
    email: user.email,
    photo: user.photo,
    idToken,
  };
}

/** Encerra a sessão do Google (o logout do app chama junto com o do Firebase). */
export async function signOutGoogle(): Promise<void> {
  const google = loadModule();
  if (!google) return;
  try {
    await google.GoogleSignin.signOut();
  } catch {
    // sem sessão do Google para encerrar — segue o logout normalmente
  }
}
