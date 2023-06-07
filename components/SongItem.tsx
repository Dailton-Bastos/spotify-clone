'use client';

import React from 'react';

import Image from 'next/image';

import { useLoadImage } from '@/hooks/useLoadImage';

import { PlayButton } from './PlayButton';

import type { Song } from '@/@types/types';

interface SongItemProps {
  data: Song;
  onClick: (id: string) => void;
}

export const SongItem: React.FC<SongItemProps> = ({
  data,
  onClick,
}): JSX.Element => {
  const imagePage = useLoadImage(data);

  return (
    <div
      onClick={() => {}}
      className="
        relative
        group
        flex
        flex-col
        items-center
        justify-center
        rounded-md
        overflow-hidden
        gap-x-4
        bg-neutral-400/5
        cursor-pointer
        hover:bg-neutral-400/10
        transition
        p-3
      "
    >
      <div
        className="
        relative
        aspect-square
        w-full
        h-full
        rounded-md
        overflow-hidden
        "
      >
        <Image
          className="object-cover"
          src={imagePage || '/image/liked.png'}
          fill
          sizes="388"
          priority
          alt={data.title}
        />
      </div>

      <div
        className="
          flex
          flex-col
          items-start
          w-full
          pt-4
          gap-y-1
        "
      >
        <p className="font-semibold truncate w-full">{data.title}</p>

        <p className="text-neutral-400 text-sm pb-4 truncate w-full">
          By {data.author}
        </p>
      </div>

      <div className="absolute bottom-24 right-5">
        <PlayButton />
      </div>
    </div>
  );
};
