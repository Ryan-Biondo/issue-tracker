'use client';
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { Button, TextField } from '@radix-ui/themes';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface CommentFormData {
  content: string;
}

interface AddCommentProps {
  issueId: number;
}

const AddComment = ({ issueId }: AddCommentProps) => {
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Destructure the 'reset' function from useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentFormData>();

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      const payload = { ...data, issueId };
      await axios.post(`/api/issues/${issueId}/comments`, payload);
      setError('');
      reset();
      router.refresh();
    } catch (error) {
      setError('Failed to submit comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="w-full">
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <form className="space-y-2" onSubmit={onSubmit}>
        <TextField.Root>
          <TextField.Input
            placeholder="Write a comment..."
            {...register('content')}
          />
        </TextField.Root>
        <ErrorMessage>{errors.content?.message}</ErrorMessage>
        <Button className="w-full md:w-auto" disabled={isSubmitting}>
          <Pencil1Icon />
          {isSubmitting ? <Spinner /> : 'Add Comment'}
        </Button>
      </form>
    </div>
  );
};

export default AddComment;
