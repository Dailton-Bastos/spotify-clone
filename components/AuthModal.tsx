'use client';

import React from 'react';

import {
  useSupabaseClient,
  useSessionContext,
} from '@supabase/auth-helpers-react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

import { useRouter } from 'next/navigation';

import { useAuthModal } from '@/hooks/useAuthModal';

import { Modal } from './Modal';

export const AuthModal = () => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const { session } = useSessionContext();
  const { onClose, isOpen } = useAuthModal();

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  React.useEffect(() => {
    if (session) {
      router.refresh();

      onClose();
    }
  }, [session, onClose, router]);

  return (
    <Modal
      title="Welcome back"
      description="Login to your account"
      isOpen={isOpen}
      onChange={onChange}
    >
      <Auth
        theme="dark"
        providers={['github']}
        magicLink
        supabaseClient={supabaseClient}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#404040',
                brandAccent: '#22c552',
              },
            },
          },
        }}
      />
    </Modal>
  );
};
