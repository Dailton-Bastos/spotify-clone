import React, { useMemo } from 'react';
import { toast } from 'react-hot-toast';

import { useSessionContext } from '@supabase/auth-helpers-react';

import type { Song } from '@/@types/types';

export const useGetSongById = (id?: string) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [song, setSong] = React.useState<Song | undefined>(undefined);

  const { supabaseClient } = useSessionContext();

  const fetchSong = React.useCallback(async () => {
    const { data, error } = await supabaseClient
      .from('songs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      setIsLoading(false);

      return toast.error(error.message);
    }

    setSong(data as Song);
    setIsLoading(false);
  }, [id, supabaseClient]);

  React.useEffect(() => {
    if (!id) return;

    setIsLoading(true);

    fetchSong();
  }, [id, fetchSong]);

  return useMemo(
    () => ({
      isLoading,
      song,
    }),
    [isLoading, song]
  );
};
