'use client';
import { Spinner } from '@/app/components';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { Button, TextField } from '@radix-ui/themes';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast'; // Import toast and Toaster

interface CommentFormData {
  content: string;
}

interface AddCommentProps {
  issueId: number;
}

const AddComment = ({ issueId }: AddCommentProps) => {
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);

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
      reset();
      router.refresh();
      toast.success('Comment added successfully.'); // Display success toast
    } catch (error) {
      toast.error('Failed to submit comment. Please try again.'); // Display error toast
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="w-full">
      <form className="space-y-2" onSubmit={onSubmit}>
        <TextField.Root>
          <TextField.Input
            placeholder="Write a comment..."
            {...register('content')}
          />
        </TextField.Root>
        {errors.content && <span>{errors.content.message}</span>}{' '}
        {/* Display form errors */}
        <Button className="w-full md:w-auto" disabled={isSubmitting}>
          <Pencil1Icon />
          {isSubmitting ? <Spinner /> : 'Add Comment'}
        </Button>
      </form>
      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  );
};

export default AddComment;
