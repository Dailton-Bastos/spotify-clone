import React from 'react';

import { usePlayer } from './usePlayer';
import { useAuthModal } from './useAuthModal';
import { useUser } from './useUser';

import type { Song } from '@/@types/types';
import { useSubscribeModal } from './useSubscribeModal';

export const useOnPlay = (songs: Song[]) => {
  const player = usePlayer();
  const authModal = useAuthModal();
  const subscribeModal = useSubscribeModal();

  const { user, subscription } = useUser();

  const onPlay = React.useCallback(
    (id: string) => {
      if (!user) return authModal.onOpen();

      if (!subscription) {
        return subscribeModal.onOpen();
      }

      player.setId(id);
      player.setIds(songs?.map((song) => song.id));
    },
    [user, authModal, player, songs, subscription, subscribeModal]
  );

  return { onPlay };
};
