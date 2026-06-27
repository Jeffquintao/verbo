/**
 * Inicialização do Firebase (Auth + Firestore).
 *
 * Init é GUARDADO: só conecta se as variáveis EXPO_PUBLIC_FIREBASE_* existirem.
 * Sem elas, o app roda em "modo visitante" (auth/db = null) e tudo continua
 * funcionando localmente. Para ligar o backend, crie um .env (ver .env.example)
 * com as chaves do seu projeto Firebase.
 *
 * Ver escopo seção 4.1 (Stack Técnica).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
// @ts-expect-error getReactNativePersistence existe em runtime mas não é tipado em todas as versões
import { getAuth, getReactNativePersistence, initializeAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

/** true quando há configuração suficiente para conectar ao Firebase. */
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // Já inicializado (fast refresh) — recupera a instância existente.
    auth = getAuth(app);
  }
  db = getFirestore(app);
}

export { auth, db };
