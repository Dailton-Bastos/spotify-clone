'use client';

import React from 'react';
import { BsPauseFill, BsPlayFill } from 'react-icons/bs';
import { AiFillStepBackward, AiFillStepForward } from 'react-icons/ai';
import { HiSpeakerXMark, HiSpeakerWave } from 'react-icons/hi2';

import useSound from 'use-sound';

import { MediaItem } from './MediaItem';
import { LikeButton } from './LikeButton';
import { Slider } from './Slider';

import type { Song } from '@/@types/types';
import { usePlayer } from '@/hooks/usePlayer';

interface PlayContentProps {
  song: Song;
  songUlr: string;
}

export const PlayContent: React.FC<PlayContentProps> = ({ song, songUlr }) => {
  const [volume, setVolume] = React.useState(1);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const player = usePlayer();

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const onPlayNext = React.useCallback(() => {
    if (player.ids.length === 0) return;

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);

    const nextSong = player.ids[currentIndex + 1];

    if (!nextSong) return player.setId(player.ids[0]);

    player.setId(nextSong);
  }, [player]);

  const onPlayPrevious = React.useCallback(() => {
    if (player.ids.length === 0) return;

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);

    const previousSong = player.ids[currentIndex - 1];

    if (!previousSong) return player.setId(player.ids[player.ids.length - 1]);

    player.setId(previousSong);
  }, [player]);

  const [play, { pause, sound }] = useSound(songUlr, {
    volume,
    onplay: () => setIsPlaying(true),
    onend: () => {
      setIsPlaying(false);
      onPlayNext();
    },
    onpause: () => setIsPlaying(false),
    format: ['mp3'],
  });

  React.useEffect(() => {
    sound?.play();

    return () => sound?.unload();
  }, [sound]);

  const handlePlay = React.useCallback(() => {
    if (!isPlaying) {
      play();
    } else {
      pause();
    }
  }, [isPlaying, play, pause]);

  const toggleMusic = React.useCallback(() => {
    if (volume === 0) {
      setVolume(1);
    } else {
      setVolume(0);
    }
  }, [volume]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 h-full">
      <div className="flex w-full justify-start">
        <div className="flex items-center gap-x-4">
          <MediaItem data={song} />

          <LikeButton songId={song.id} />
        </div>
      </div>

      <div className="flex md:hidden col-auto w-full justify-end items-center">
        <div
          className="
            h-10
            w-10
            flex
            items-center
            justify-center
            rounded-full
            bg-white
            p-1
            cursor-pointer
          "
          onClick={handlePlay}
        >
          <Icon size={30} className="text-black" />
        </div>
      </div>

      <div
        className="
          hidden
          h-full
          md:flex
          justify-center
          items-center
          w-full
          max-w-[722px]
          gap-x-6
        "
      >
        <AiFillStepBackward
          onClick={onPlayPrevious}
          size={30}
          className="
            text-neutral-400
            cursor-pointer
            hover:text-white
            transition
          "
        />

        <div
          className="
          flex
          items-center
          justify-center
          w-10
          h-10
          rounded-full
          bg-white
          p-1
          cursor-pointer
        "
          onClick={handlePlay}
        >
          <Icon size={30} className="text-black" />
        </div>

        <AiFillStepForward
          onClick={onPlayNext}
          size={30}
          className="
            text-neutral-400
            cursor-pointer
            hover:text-white
            transition
          "
        />
      </div>

      <div className="hidden md:flex w-full justify-end pr-2">
        <div className="flex items-center gap-x-2 w-[120px]">
          <VolumeIcon
            size={34}
            onClick={toggleMusic}
            className="cursor-pointer"
          />

          <Slider value={volume} onChange={(value) => setVolume(value)} />
        </div>
      </div>
    </div>
  );
};
