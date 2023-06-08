'use client';

import React from 'react';

import { useGetSongById } from '@/hooks/useGetSongById';
import { useLoadSongUrl } from '@/hooks/useLoadSongUrl';
import { usePlayer } from '@/hooks/usePlayer';

import type { Song } from '@/@types/types';
import { PlayContent } from './PlayContent';

export const Player = () => {
  const { activeId } = usePlayer();
  const { song } = useGetSongById(activeId);

  const songUrl = useLoadSongUrl(song as Song);

  if (!song || !songUrl || !activeId) return null;

  return (
    <div
      className="
        fixed
        bottom-0
        bg-black
        w-full
        py-2
        h-[80px]
        px-4
      "
    >
      <PlayContent song={song} songUlr={songUrl} key={songUrl} />
    </div>
  );
};
