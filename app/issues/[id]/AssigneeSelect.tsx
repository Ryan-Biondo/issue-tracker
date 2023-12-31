'use client';
import { Skeleton } from '@/app/components';
import { Issue, User } from '@prisma/client';
import { Select } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

const AssigneeSelect = ({ issue }: { issue: Issue }) => {
  const { data: users, error, isLoading } = useUsers();
  const router = useRouter();
  if (isLoading) return <Skeleton />;
  if (error) return null;

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
        router.refresh();
      })
      .catch(() => {
        toast.error('Changes could not be saved.');
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
    retry: 3,
  });

export default AssigneeSelect;
