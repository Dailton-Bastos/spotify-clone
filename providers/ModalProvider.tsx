'use client';

import React from 'react';

import { AuthModal } from '@/components/AuthModal';
import { UploadModal } from '@/components/UploadModal';
import { SubscribeModal } from '@/components/SubscribeModal';
import type { ProductWithPrice } from '@/@types/types';

interface ModalProviderProps {
  products: ProductWithPrice[];
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ products }) => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <AuthModal />
      <UploadModal />
      <SubscribeModal products={products} />
    </>
  );
};
