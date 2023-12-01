'use client';
import { Skeleton } from '@/app/components';
import { Issue, User } from '@prisma/client';
import { Select } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const AssigneeSelect = ({ issue }: { issue: Issue }) => {
  const { data: users, error, isLoading } = useUsers();
  if (isLoading) return <Skeleton />;
  if (error) return null;

  const router = useRouter();
  const assignIssue = (userId: string) => {
    const assignedToUserId = userId === 'unassigned' ? null : userId;

    axios
      .patch(`/api/issues/${issue.id}`, { assignedToUserId })
      .then(() => {
        if (assignedToUserId) {
          return axios.patch(`/api/issues/${issue.id}`, {
            status: 'IN_PROGRESS',
          });
        }
      })
      .then(() => {
        toast.success('Assignee updated successfully.');
      })
      .catch(() => {
        toast.error('Changes could not be saved.');
      })
      .finally(() => {
        router.refresh();
      });
  };

  return (
    <>
      <Select.Root
        defaultValue={issue.assignedToUserId || 'unassigned'}
        onValueChange={assignIssue}>
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

const useUsers = () =>
  useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => axios.get('/api/users').then((res) => res.data),
    staleTime: 1000 * 60 * 60,
    retry: 3,
  });

export default AssigneeSelect;
