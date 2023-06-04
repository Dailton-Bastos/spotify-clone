'use client';

import React from 'react';

import { AuthModal } from '@/components/AuthModal';

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return <AuthModal />;
};
