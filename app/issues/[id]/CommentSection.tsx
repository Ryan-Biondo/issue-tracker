import { Comment, User } from '@prisma/client';
import { Flex } from '@radix-ui/themes';
import Comments from './Comments';

interface CommentSectionProps {
  comments: Comment[];
  users: User[];
}

const CommentSection = ({ comments, users }: CommentSectionProps) => {
  return (
    <Flex direction="column" gap="3">
      {comments.map((comment) => {
        const user =
          users.find((userToken) => userToken.email === comment.authorEmail) ||
          null;
        return <Comments key={comment.id} comment={comment} user={user} />;
      })}
    </Flex>
  );
};

export default CommentSection;
