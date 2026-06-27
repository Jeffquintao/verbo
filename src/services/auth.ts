/**
 * Serviço de autenticação (Firebase Auth — email/senha).
 *
 * Google Sign-In: requer config nativa (OAuth client IDs + expo-auth-session
 * ou @react-native-google-signin). Fica como próximo passo — ver TODO no fim.
 */
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';

import { auth, isFirebaseConfigured } from './firebase';
import type { User } from '@/store/useAuthStore';

function mapUser(fbUser: FirebaseUser): User {
  return {
    id: fbUser.uid,
    name: fbUser.displayName ?? fbUser.email?.split('@')[0] ?? 'Usuário',
    email: fbUser.email ?? '',
    isPremium: false, // será resolvido pelo RevenueCat / Firestore
  };
}

class AuthNotConfiguredError extends Error {
  constructor() {
    super(
      'Firebase não configurado. Adicione as chaves no .env ou use o modo visitante.',
    );
    this.name = 'AuthNotConfiguredError';
  }
}

export async function registerWithEmail(
  name: string,
  email: string,
  password: string,
): Promise<User> {
  if (!auth) throw new AuthNotConfiguredError();
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (name) await updateProfile(cred.user, { displayName: name });
  return mapUser(cred.user);
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  if (!auth) throw new AuthNotConfiguredError();
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return mapUser(cred.user);
}

export async function logout(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}

/** Observa o estado de auth do Firebase. Retorna unsubscribe (ou no-op). */
export function subscribeToAuth(onChange: (user: User | null) => void): () => void {
  if (!auth) {
    onChange(null);
    return () => {};
  }
  return onAuthStateChanged(auth, (fbUser) => {
    onChange(fbUser ? mapUser(fbUser) : null);
  });
}

/**
 * Login com Google. Método principal de autenticação do app.
 *
 * Requer config nativa (não roda só com Expo Go genérico):
 *  1. npx expo install expo-auth-session expo-web-browser
 *  2. Criar OAuth client IDs (Web + Android + iOS) no Google Cloud Console
 *  3. Ativar provedor Google no Firebase Auth e preencher as chaves no .env
 *  4. Usar useAuthRequest do expo-auth-session p/ obter idToken e então
 *     signInWithCredential(auth, GoogleAuthProvider.credential(idToken))
 *
 * Enquanto não configurado, lança mensagem amigável.
 */
export async function signInWithGoogle(): Promise<User> {
  throw new Error(
    'Login com Google ainda não configurado. Falta o OAuth client ID do Google + chaves do Firebase (ver SETUP.md). Por enquanto, use “Continuar como visitante”.',
  );
}

/** Login com Apple — placeholder (ainda não disponível). */
export async function signInWithApple(): Promise<User> {
  throw new Error('Login com Apple ainda não disponível.');
}

export { isFirebaseConfigured };
