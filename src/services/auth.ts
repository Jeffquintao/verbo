/**
 * Serviço de autenticação do app.
 *
 * O método principal é o Google (ver googleAuth.ts). Quando o Firebase está
 * configurado, a conta do Google vira uma sessão do Firebase — é o que
 * habilita sincronizar dados entre aparelhos. Sem Firebase, o login ainda
 * funciona localmente (perfil do Google, sem sync), para dar pra testar
 * com uma configuração só.
 */
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth';

import { useAuthStore, type User } from '@/store/useAuthStore';

import { auth, isFirebaseConfigured } from './firebase';
import {
  GoogleCancelledError,
  googleUnavailableReason,
  isGoogleConfigured,
  signInWithGoogleNative,
  signOutGoogle,
} from './googleAuth';

function mapUser(fbUser: FirebaseUser): User {
  return {
    id: fbUser.uid,
    name: fbUser.displayName ?? fbUser.email?.split('@')[0] ?? 'Usuário',
    email: fbUser.email ?? '',
  };
}

/** Erros do login com Google, para a tela traduzir a mensagem. */
export type GoogleSignInError = 'expo-go' | 'not-configured' | 'cancelled' | 'failed';

export class GoogleError extends Error {
  reason: GoogleSignInError;
  constructor(reason: GoogleSignInError) {
    super(reason);
    this.name = 'GoogleError';
    this.reason = reason;
  }
}

/**
 * Login com Google — método principal do app.
 *
 * Precisa de development build (o módulo do Google é nativo) e do
 * EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID no .env. Ver SETUP.md.
 */
export async function signInWithGoogle(): Promise<User> {
  const unavailable = googleUnavailableReason();
  if (unavailable) throw new GoogleError(unavailable);

  let account;
  try {
    account = await signInWithGoogleNative();
  } catch (err) {
    if (err instanceof GoogleCancelledError) throw new GoogleError('cancelled');
    throw new GoogleError('failed');
  }

  // Com Firebase: vira sessão do Firebase (habilita sync entre aparelhos).
  if (auth && account.idToken) {
    const credential = GoogleAuthProvider.credential(account.idToken);
    const result = await signInWithCredential(auth, credential);
    return mapUser(result.user);
  }

  // Sem Firebase: sessão local com o perfil do Google (sem sync).
  const user: User = {
    id: account.id,
    name: account.name,
    email: account.email,
  };
  useAuthStore.getState().setUser(user);
  return user;
}

/** Login com Apple — ainda não disponível. */
export async function signInWithApple(): Promise<User> {
  throw new Error('apple-unavailable');
}

export async function logout(): Promise<void> {
  await signOutGoogle();
  if (auth) {
    await signOut(auth);
  } else {
    // Sem Firebase não há listener para limpar o estado: limpa aqui.
    useAuthStore.getState().setUser(null);
  }
}

/**
 * Observa o estado de auth do Firebase.
 * Sem Firebase, o estado é gerido direto pela store (login local).
 */
export function subscribeToAuth(onChange: (user: User | null) => void): () => void {
  if (!auth) {
    // Não sobrescreve um login local já existente.
    if (!useAuthStore.getState().user) onChange(null);
    return () => {};
  }
  return onAuthStateChanged(auth, (fbUser) => {
    onChange(fbUser ? mapUser(fbUser) : null);
  });
}

export { isFirebaseConfigured, isGoogleConfigured };
