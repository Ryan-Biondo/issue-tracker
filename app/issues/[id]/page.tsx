import { Comment, Issue, User } from '@prisma/client';
import { Box, Flex, Grid } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { notFound } from 'next/navigation';
import AssigneeSelect from './AssigneeSelect';
import CommentSection from './CommentSection';
import DeleteIssueButton from './DeleteIssueButton';
import EditIssueButton from './EditIssueButton';
import IssueDetails from './IssueDetails';
import StatusSelect from './StatusSelect';
import prisma from '@/prisma/client';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/auth/authOptions';
import AddComment from './AddComment';

interface Props {
  params: { id: string };
}

const IssueDetailPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);

  const issueId = parseInt(params.id);

  // Fetch issue details
  const issue = await prisma.issue.findUnique({ where: { id: issueId } });

  if (!issue) notFound();

  // Fetch comments and users
  const comments = await prisma.comment.findMany({ where: { issueId } });
  const users = await prisma.user.findMany();

  return (
    <Flex direction="column" gap="5">
      <Grid columns={{ initial: '1', sm: '5' }} gap="5">
        <Box className="md:col-span-4">
          <IssueDetails issue={issue} />

          {/* Comment Input Box */}
          {session && (
            <Box className="md:col-span-4" my="4">
              <AddComment issueId={issue.id} />
            </Box>
          )}
          <CommentSection comments={comments || []} users={users || []} />
        </Box>
        {session && (
          <Box>
            <Flex direction="column" gap="4">
              <AssigneeSelect issue={issue} />
              <StatusSelect issue={issue} />
              <EditIssueButton issueId={issue.id} />
              <DeleteIssueButton issueId={issue.id} />
            </Flex>
          </Box>
        )}
      </Grid>
    </Flex>
  );
};

export default IssueDetailPage;
