'use client';

import React from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { useSessionContext } from '@supabase/auth-helpers-react';
import { useAuthModal } from '@/hooks/useAuthModal';
import { useUser } from '@/hooks/useUser';

interface LikeButtonProps {
  songId: string;
}

export const LikeButton: React.FC<LikeButtonProps> = ({ songId }) => {
  const [isLiked, setIsLiked] = React.useState(false);

  const router = useRouter();

  const { supabaseClient } = useSessionContext();

  const authModal = useAuthModal();

  const { user } = useUser();

  const fetchData = React.useCallback(async () => {
    const { data, error } = await supabaseClient
      .from('liked_songs')
      .select('*')
      .eq('user_id', user?.id)
      .eq('song_id', songId)
      .single();

    if (!error && data) setIsLiked(true);
  }, [supabaseClient, user, songId]);

  const handleLike = async () => {
    if (!user) {
      return authModal.onOpen();
    }

    if (isLiked) {
      const { error } = await supabaseClient
        .from('liked_songs')
        .delete()
        .eq('user_id', user?.id)
        .eq('song_id', songId);

      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(false);
      }
    } else {
      const { error } = await supabaseClient.from('liked_songs').insert({
        user_id: user?.id,
        song_id: songId,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(true);

        toast.success('Liked');
      }
    }

    router.refresh();
  };

  React.useEffect(() => {
    if (!user?.id) return;

    fetchData();
  }, [user, fetchData]);

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  return (
    <button onClick={handleLike} className="hover:opacity-75 transition">
      <Icon color={isLiked ? '#22c55e' : '#fff'} size={25} />
    </button>
  );
};
