import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { PLAN_DAYS } from '@/services/readingPlan';

/**
 * Progresso do plano de leitura de 365 dias. Persistido localmente.
 * "Dia atual" = primeiro dia ainda não concluído (plano sequencial).
 */
type PlanState = {
  completed: Record<number, boolean>; // dia (1-based) -> concluído
  toggleDay: (day: number) => void;
  isDone: (day: number) => boolean;
  completedCount: () => number;
  currentDay: () => number;
};

export const usePlanStore = create<PlanState>()(
  persist(
    (set, get) => ({
      completed: {},
      toggleDay: (day) =>
        set((s) => {
          const next = { ...s.completed };
          if (next[day]) delete next[day];
          else next[day] = true;
          return { completed: next };
        }),
      isDone: (day) => Boolean(get().completed[day]),
      completedCount: () => Object.keys(get().completed).length,
      currentDay: () => {
        const { completed } = get();
        for (let d = 1; d <= PLAN_DAYS; d++) if (!completed[d]) return d;
        return PLAN_DAYS;
      },
    }),
    {
      name: 'plan-store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
