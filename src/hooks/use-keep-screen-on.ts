import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useEffect } from 'react';

import { useSettingsStore } from '@/store/useSettingsStore';

/**
 * Impede a tela de apagar enquanto a tela atual estiver aberta — só quando o
 * usuário ligou a opção nas Configurações.
 *
 * Cada chamada usa uma tag própria para que duas telas ativas ao mesmo tempo
 * não desliguem o bloqueio uma da outra ao sair.
 */
export function useKeepScreenOn(tag: string): void {
  const keepAwake = useSettingsStore((s) => s.keepAwake);

  useEffect(() => {
    if (!keepAwake) return;
    activateKeepAwakeAsync(tag).catch(() => {});
    return () => {
      try {
        deactivateKeepAwake(tag);
      } catch {
        // a tela já pode ter sido liberada — não há o que fazer aqui
      }
    };
  }, [keepAwake, tag]);
}
