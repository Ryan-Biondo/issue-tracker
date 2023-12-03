import { IssueStatusBadge } from '@/app/components';
import { Status } from '@prisma/client';
import { ArrowDownIcon, ArrowUpIcon } from '@radix-ui/react-icons';
import { Avatar, Table } from '@radix-ui/themes';
import { default as Link, default as NextLink } from 'next/link';
import { Issue as PrismaIssue, User } from '@prisma/client';

interface ExtendedIssue extends PrismaIssue {
  assignedToUser?: User | null;
}

export interface IssueQuery {
  status: Status;
  orderBy: keyof ExtendedIssue;
  page: string;
  sortOrder?: 'asc' | 'desc';
  pageSize?: string;
}

interface Props {
  searchParams: IssueQuery;
  issues: ExtendedIssue[];
}

const IssueTable = ({ searchParams, issues }: Props) => {
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          {columns.map((column) => (
            <Table.ColumnHeaderCell
              key={column.value}
              className={column.className}>
              <NextLink
                href={{
                  query: {
                    ...searchParams,
                    orderBy: column.value,
                    sortOrder:
                      column.value === searchParams.orderBy &&
                      searchParams.sortOrder !== 'desc'
                        ? 'desc'
                        : 'asc',
                  },
                }}>
                {column.label}
              </NextLink>
              {column.value === searchParams.orderBy &&
                (searchParams.sortOrder === 'desc' ? (
                  <ArrowDownIcon className="inline" />
                ) : (
                  <ArrowUpIcon className="inline" />
                ))}
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {issues.map((issue) => (
          <Table.Row key={issue.id}>
            <Table.Cell>
              <Link href={`/issues/${issue.id}`}>{issue.title}</Link>

              <div className="block md:hidden">
                <IssueStatusBadge status={issue.status} />
              </div>
            </Table.Cell>
            <Table.Cell className="hidden md:table-cell">
              <IssueStatusBadge status={issue.status} />
            </Table.Cell>
            <Table.Cell className="hidden md:table-cell">
              {issue.createdAt.toDateString()}
            </Table.Cell>
            <Table.Cell>
              {issue.assignedToUser ? (
                <Avatar
                  src={issue.assignedToUser.image || undefined}
                  fallback="?"
                  size="2"
                  radius="full"
                />
              ) : (
                '-'
              )}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

const columns: {
  label: string;
  value: keyof ExtendedIssue;
  className?: string;
}[] = [
  {
    label: 'Issue',
    value: 'title',
  },
  {
    label: 'Status',
    value: 'status',
    className: 'hidden md:table-cell',
  },
  {
    label: 'Created',
    value: 'createdAt',
    className: 'hidden md:table-cell',
  },
  {
    label: 'Assigned To',
    value: 'assignedToUserId',
    className: 'hidden md:table-cell',
  },
];

export const columnNames = columns.map((column) => column.value);

export default IssueTable;
