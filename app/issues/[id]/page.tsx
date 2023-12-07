import authOptions from '@/app/auth/authOptions';
import prisma from '@/prisma/client';
import { Box, Flex, Grid } from '@radix-ui/themes';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import AddComment from './AddComment';
import AssigneeSelect from './AssigneeSelect';
import CommentSection from './CommentSection';
import DeleteIssueButton from './DeleteIssueButton';
import EditIssueButton from './EditIssueButton';
import IssueDetails from './IssueDetails';
import StatusSelect from './StatusSelect';

interface Props {
  params: { id: string };
}

async function fetchIssue(issueId: number) {
  return await prisma.issue.findUnique({
    where: { id: issueId },
    include: {
      assignedToUser: true,
    },
  });
}

const IssueDetailPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);
  const issueId = parseInt(params.id);
  const issue = await fetchIssue(issueId);
  if (!issue) notFound();

  const comments = await prisma.comment.findMany({ where: { issueId } });
  const users = await prisma.user.findMany();

  return (
    <Flex direction="column" gap="5">
      <Grid columns={{ initial: '1', sm: '5' }} gap="5">
        <Box className="md:col-span-4">
          <IssueDetails issue={issue} />

          {session && (
            <Box className="my-6">
              <AddComment issueId={issue.id} />
            </Box>
          )}

          <Box className="my-6">
            <CommentSection
              comments={comments || []}
              users={users || []}
              issueId={issueId}
            />
          </Box>
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

// Correctly implement the generateMetadata function
export async function generateMetadata({ params }: Props) {
  const issue = await fetchIssue(parseInt(params.id));
  return {
    title: issue?.title || 'Issue Details',
    description: 'Details of issue ' + (issue?.id || ''),
  };
}

export default IssueDetailPage;
