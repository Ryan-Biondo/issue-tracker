'use client';
import { Skeleton } from '@/app/components';
import { Issue, User } from '@prisma/client';
import { Select } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const AssigneeSelect = ({ issue }: { issue: Issue }) => {
  const {
    data: users,
    error,
    isLoading,
  } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => axios.get('/api/users').then((res) => res.data),
    staleTime: 1000 * 60,
    retry: 3,
  });

  if (isLoading) return <Skeleton />;
  if (error) return null;

  return (
    <>
      <Select.Root
        defaultValue={issue.assignedToUserId || 'unassigned'}
        onValueChange={(userId) => {
          const assignedToUserId = userId === 'unassigned' ? null : userId;
          axios
            .patch('/api/issues/' + issue.id, {
              assignedToUserId: assignedToUserId,
            })
            .catch(() => {
              toast.error('Changes could not be saved.');
            });
        }}>
        <Select.Trigger placeholder="Assign..." />
        <Select.Content>
          <Select.Group>
            <Select.Label>Suggestions</Select.Label>
            <Select.Item value="unassigned">Unassigned</Select.Item>
            {users?.map((user) => (
              <Select.Item key={user.id} value={user.id}>
                {user.name}
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

export default AssigneeSelect;
