import { useEffect } from 'react';

import { subscribeToAuth } from '@/services/auth';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * Assina o estado de auth do Firebase uma vez na montagem do app.
 * Em modo visitante (sem config), define status = 'guest' imediatamente.
 */
export function useAuthInit() {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const unsubscribe = subscribeToAuth(setUser);
    return unsubscribe;
  }, [setUser]);
}
