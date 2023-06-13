'use client';

import React from 'react';
import { toast } from 'react-hot-toast';

import { Modal } from './Modal';
import { Button } from './Button';

import { formatPrice, postData } from '@/libs/helpers';
import { useUser } from '@/hooks/useUser';
import { getStripe } from '@/libs/stripeClient';
import type { Price, ProductWithPrice } from '@/@types/types';
import { useSubscribeModal } from '@/hooks/useSubscribeModal';

interface SubscribeModalProps {
  products: ProductWithPrice[];
}

export const SubscribeModal: React.FC<SubscribeModalProps> = ({
  products,
}): JSX.Element => {
  const [priceIdLoading, setPriceIdLoading] = React.useState<
    string | undefined
  >(undefined);

  const { user, subscription, isLoading } = useUser();
  const subscribeModal = useSubscribeModal();

  const onChange = (open: boolean) => {
    if (!open) subscribeModal.onClose();
  };

  const handleCheckout = React.useCallback(
    async (price: Price) => {
      setPriceIdLoading(price.id);

      if (!user) {
        setPriceIdLoading(undefined);

        return toast.error('Must be logged in');
      }

      if (subscription) {
        setPriceIdLoading(undefined);

        return toast('Already subscribed');
      }

      try {
        const { sessionId } = await postData({
          url: '/api/create-checkout-session',
          data: { price },
        });

        const stripe = await getStripe();

        stripe?.redirectToCheckout({ sessionId });
      } catch (error) {
        toast.error((error as Error)?.message);
      } finally {
        setPriceIdLoading(undefined);
      }
    },
    [user, subscription]
  );

  let content = <div className="text-center">No products available</div>;

  if (products.length) {
    content = (
      <div>
        {products?.map((product) => {
          if (!product.prices?.length) {
            return <div key={product.id}>No prices available</div>;
          }

          return product?.prices?.map((price) => (
            <Button
              key={price.id}
              onClick={() => handleCheckout(price)}
              disabled={isLoading || price.id === priceIdLoading}
              className="mt-4"
            >
              {`Subscribe for ${formatPrice(price)} a ${price.interval}`}
            </Button>
          ));
        })}
      </div>
    );
  }

  if (subscription) {
    content = <div className="text-center">Already subscribed</div>;
  }

  return (
    <Modal
      title="Only for Premium Users"
      description="Listen to music with Spotify Premium"
      isOpen={subscribeModal.isOpen}
      onChange={onChange}
    >
      {content}
    </Modal>
  );
};
