'use client';
import { Select } from '@radix-ui/themes';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { pageSizes } from './paginationConfig';

interface Props {
  pageSize: number;
}

const PageSizeSelector = ({ pageSize }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const changePageSize = (size: string) => {
    const newSize = parseInt(size, 10);
    const params = new URLSearchParams(searchParams);
    params.set('pageSize', newSize.toString());
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  return (
    <Select.Root
      onValueChange={changePageSize}
      defaultValue={pageSize.toString()}>
      <Select.Trigger>{pageSize}</Select.Trigger>
      <Select.Content>
        <Select.Group>
          <Select.Label>Page Size</Select.Label>
          {pageSizes.map((size) => (
            <Select.Item key={size} value={size.toString()}>
              {size}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default PageSizeSelector;
