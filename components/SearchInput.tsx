'use client';

import React from 'react';

import { useRouter } from 'next/navigation';
import queryString from 'query-string';

import { useDebounce } from '@/hooks/useDebounce';
import { Input } from './Input';

export const SearchInput = () => {
  const [value, setValue] = React.useState('');

  const router = useRouter();

  const debouncedValue = useDebounce<string>(value, 500);

  React.useEffect(() => {
    const query = { title: debouncedValue };

    const url = queryString.stringifyUrl({
      url: '/search',
      query,
    });

    router.push(url);
  }, [debouncedValue, router]);
  return (
    <Input
      placeholder="What do you want to listen to?"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};
