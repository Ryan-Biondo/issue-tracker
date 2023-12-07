'use client';
import React, { useState } from 'react';
import { Spinner } from '@/app/components';
import { AlertDialog, Button, Flex } from '@radix-ui/themes';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const DeleteCommentButton = ({
  commentId,
  issueId,
}: {
  commentId: number;
  issueId: number;
}) => {
  const router = useRouter();
  const [isDeleting, setDeleting] = useState(false);
  const [error, setError] = useState(false);

  const deleteComment = async () => {
    try {
      setDeleting(true);
      await axios.delete(`/api/issues/${issueId}/comments/${commentId}`);
      router.refresh();
    } catch (error) {
      setError(true);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button
            style={{ backgroundColor: 'var(--accent-9)', color: 'white' }}
            size="1">
            Delete
            {isDeleting && <Spinner />}
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Title>Confirm Deletion</AlertDialog.Title>
          <AlertDialog.Description>
            Are you sure you want to delete this comment? This action cannot be
            undone.
          </AlertDialog.Description>
          <Flex gap="3" mt="4">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button
                style={{ backgroundColor: 'red', color: 'white' }}
                onClick={deleteComment}>
                Delete Comment
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>

      <AlertDialog.Root open={error}>
        <AlertDialog.Content>
          <AlertDialog.Title>Error</AlertDialog.Title>
          <AlertDialog.Description>
            The comment could not be deleted. Please try again.
          </AlertDialog.Description>
          <Flex justify="end" mt="3">
            <Button color="gray" onClick={() => setError(false)}>
              OK
            </Button>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
};

export default DeleteCommentButton;
