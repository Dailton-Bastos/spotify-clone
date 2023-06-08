import React from 'react';

import { usePlayer } from './usePlayer';
import { useAuthModal } from './useAuthModal';
import { useUser } from './useUser';

import type { Song } from '@/@types/types';

export const useOnPlay = (songs: Song[]) => {
  const player = usePlayer();
  const authModl = useAuthModal();

  const { user } = useUser();

  const onPlay = React.useCallback(
    (id: string) => {
      if (!user) return authModl.onOpen();

      player.setId(id);
      player.setIds(songs?.map((song) => song.id));
    },
    [user, authModl, player, songs]
  );

  return { onPlay };
};
