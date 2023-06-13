import { cookies } from 'next/headers';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import type { ProductWithPrice } from '@/@types/types';

export const getActiveProductWithPrices = async (): Promise<
  ProductWithPrice[]
> => {
  const supabase = createServerComponentClient({
    cookies,
  });

  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { foreignTable: 'prices' });

  if (error) console.error(error);

  return (data as any) || [];
};
