import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Estado do Professor de Teologia: histórico do chat + cota diária.
 *
 * Cotas (escopo do modelo freemium):
 *   FREE_DAILY_LIMIT    = 2 perguntas/dia
 *   PREMIUM_DAILY_LIMIT = 30 perguntas/dia
 *
 * A cota aqui é a experiência do usuário; quando o backend (Cloud Function)
 * estiver ativo, ele REVALIDA a cota no servidor — o cliente sozinho não é
 * barreira de segurança.
 */
export const FREE_DAILY_LIMIT = 2;
export const PREMIUM_DAILY_LIMIT = 30;

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: number;
};

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

type AgentState = {
  messages: ChatMessage[];
  usageDate: string;
  usageCount: number;
  addMessage: (msg: Omit<ChatMessage, 'id' | 'createdAt'>) => void;
  /** Conta 1 pergunta respondida hoje (zera automaticamente ao virar o dia). */
  registerQuestion: () => void;
  usedToday: () => number;
  clearChat: () => void;
};

export const useAgentStore = create<AgentState>()(
  persist(
    (set, get) => ({
      messages: [],
      usageDate: todayKey(),
      usageCount: 0,
      addMessage: (msg) =>
        set((s) => ({
          messages: [
            ...s.messages.slice(-60), // mantém o chat enxuto no storage
            {
              ...msg,
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              createdAt: Date.now(),
            },
          ],
        })),
      registerQuestion: () => {
        const today = todayKey();
        set((s) =>
          s.usageDate === today
            ? { usageCount: s.usageCount + 1 }
            : { usageDate: today, usageCount: 1 },
        );
      },
      usedToday: () => {
        const s = get();
        return s.usageDate === todayKey() ? s.usageCount : 0;
      },
      clearChat: () => set({ messages: [] }),
    }),
    {
      name: 'agent-store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
