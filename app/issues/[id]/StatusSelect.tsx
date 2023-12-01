'use client';
import React from 'react';
import { Issue, Status } from '@prisma/client';
import { Select } from '@radix-ui/themes';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { statusMap } from '@/app/components/statusUtils';
import { useRouter } from 'next/navigation';

interface StatusSelectProps {
  issue: Issue;
}

const StatusSelect = ({ issue }: StatusSelectProps) => {
  const router = useRouter();
  const changeStatus = async (status: Status) => {
    try {
      await axios.patch(`/api/issues/${issue.id}`, { status });
      router.refresh();
      toast.success('Status updated successfully.');
    } catch (error) {
      toast.error('Status update failed.');
    }
  };

  return (
    <>
      <Select.Root
        key={issue.status}
        defaultValue={issue.status}
        onValueChange={changeStatus}>
        <Select.Trigger placeholder="Select status..." />
        <Select.Content>
          <Select.Group>
            {Object.entries(statusMap).map(([key, { label }]) => (
              <Select.Item key={key} value={key}>
                {label}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Toaster
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
        position="bottom-center"
        reverseOrder={false}
      />
    </>
  );
};

export default StatusSelect;
