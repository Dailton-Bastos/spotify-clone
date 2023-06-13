import type { Price } from '@/@types/types';

export const getURL = () => {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    'http://localhost:3000/';

  url = url.includes('http') ? url : `https://${url}`;
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;

  return url;
};

export const postData = async ({
  url,
  data,
}: {
  url: string;
  data?: { price: Price };
}) => {
  console.log('POST REQUEST:', url, data);

  const res: Response = await fetch(url, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
    credentials: 'same-origin',
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.error('Error in POST', { url, data, res });

    throw new Error(res.statusText);
  }

  return res.json();
};

export const toDateTime = (secs: number) => {
  let t = new Date('1970-01-01T00:30:00Z');

  t.setSeconds(secs);

  return t;
};

export const formatPrice = (price: Price) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: price?.currency ?? 'BRL',
    minimumFractionDigits: 2,
  }).format((price?.unit_amount ?? 0) / 100);
};
