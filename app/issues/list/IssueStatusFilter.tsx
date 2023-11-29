'use client';
import { Status } from '@prisma/client';
import { Select } from '@radix-ui/themes';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

const statuses: { label: string; value?: Status }[] = [
  { label: 'All' },
  { label: 'Open', value: 'OPEN' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Closed', value: 'CLOSED' },
];

const IssueStatusFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Select.Root
      defaultValue={searchParams.get('status') || ''}
      onValueChange={(selectedStatus) => {
        const params = new URLSearchParams();
        if (selectedStatus) params.append('status', selectedStatus);
        if (searchParams.get('orderBy')) {
          params.set('orderBy', searchParams.get('orderBy')!);
          params.set('sortOrder', searchParams.get('sortOrder') || 'asc');
        }
        const query = params.size ? `?${params.toString()}` : '';
        router.push('/issues/list' + query);
      }}>
      <Select.Trigger placeholder="Filter by status..." />
      <Select.Content>
        <Select.Group>
          {statuses.map((status) => (
            <Select.Item key={status.label} value={status.value || 'all'}>
              {status.label}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default IssueStatusFilter;
