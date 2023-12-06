import React from 'react';
import { Avatar, Card, Flex, Text } from '@radix-ui/themes';
import { Comment, User } from '@prisma/client';

interface CommentsProps {
  comment: Comment;
  user: User | null;
}

const Comments = ({ comment, user }: CommentsProps) => {
  const formattedTimestamp = new Date(comment.createdAt).toLocaleString();

  if (!user) {
    return null;
  }

  // Logic to determine if the current user can edit the comment
  const canEdit = comment.authorEmail === user.email;

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
        {/* {canEdit && (
          <div className="flex justify-end">
            <button>Edit</button>
            <button>Delete</button>
          </div>
        )} */}
      </Card>
    </Flex>
  );
};

export default Comments;
