import React from 'react';
import { Badge } from '@radix-ui/themes';
import { Status } from '@prisma/client';
import { statusMap } from './statusUtils'; // Adjust the path as needed

const IssueStatusBadge = ({ status }: { status: Status }) => {
  return (
    <Badge color={statusMap[status].color}>{statusMap[status].label}</Badge>
  );
};

export default IssueStatusBadge;
