import React from 'react';
import { Avatar, Button, Card, Flex, Text } from '@radix-ui/themes';
import { Comment, User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import DeleteCommentButton from './DeleteCommentButton';

interface CommentsProps {
  comment: Comment;
  user: User | null;
  issueId: number;
}

const Comments = ({ comment, user, issueId }: CommentsProps) => {
  const formattedTimestamp = new Date(comment.createdAt).toLocaleString();

  if (!user) {
    return null;
  }

  return (
    <Flex gap="4" align="center">
      <Avatar src={user.image || ''} fallback="?" size="2" radius="full" />
      <Card variant="surface" className="flex-grow">
        <Flex justify="between">
          <h3>
            <Text size="3">{user.name}</Text> {/* Use user's name */}
          </h3>
          <time>
            <Text size="2">{formattedTimestamp}</Text>
          </time>
        </Flex>
        <Text size="3" as="p">
          {comment.content}
        </Text>

        <div className="flex justify-end">
          <DeleteCommentButton commentId={comment.id} issueId={issueId} />
        </div>
      </Card>
    </Flex>
  );
};

export default Comments;
