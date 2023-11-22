'use client';
import { Select } from '@radix-ui/themes';
import React from 'react';

const AssigneeSelect = () => {
  return (
    <Select.Root>
      <Select.Trigger placeholder="Assign..." />
      <Select.Content>
        <Select.Group>
          <Select.Label>Suggestions</Select.Label>
          <Select.Item value="1">Ryan Biondo</Select.Item>
          <Select.Item value="2">Option 2</Select.Item>
          <Select.Item value="3">Option 3</Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default AssigneeSelect;
