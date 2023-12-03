import Pagination from './Pagination';
import prisma from '@/prisma/client';
import { Status } from '@prisma/client';
import IssueActions from './IssueActions';
import IssueTable, { IssueQuery, columnNames } from './IssueTable';
import { Flex } from '@radix-ui/themes';
import { Metadata } from 'next';
import { pageSizes } from './paginationConfig';
import PageSizeSelector from './PageSizeSelector';

interface Props {
  searchParams: IssueQuery;
}

const IssuesPage = async ({ searchParams }: Props) => {
  const statuses = Object.values(Status);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;
  const where = { status };

  const sortOrder = searchParams.sortOrder === 'desc' ? 'desc' : 'asc';

  const orderBy = columnNames.includes(searchParams.orderBy)
    ? { [searchParams.orderBy]: sortOrder }
    : undefined;

  const page = parseInt(searchParams.page) || 1;
  const pageSize =
    searchParams.pageSize &&
    pageSizes.includes(parseInt(searchParams.pageSize, 10))
      ? parseInt(searchParams.pageSize, 10)
      : 10;

  const issues = await prisma.issue.findMany({
    where,
    orderBy,
    include: {
      assignedToUser: true,
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const issueCount = await prisma.issue.count({ where });

  return (
    <Flex direction="column" gap="3">
      <IssueActions />
      <IssueTable searchParams={searchParams} issues={issues} />
      <Flex gap="3">
        <Pagination
          pageSize={pageSize}
          currentPage={page}
          itemCount={issueCount}
        />
        <PageSizeSelector pageSize={pageSize} />
      </Flex>
    </Flex>
  );
};

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Issue Tracker - Issue List',
  description: 'View all project issues',
};

export default IssuesPage;
