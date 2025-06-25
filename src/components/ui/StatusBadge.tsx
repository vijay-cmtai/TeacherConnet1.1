import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string | null | undefined;
  children: React.ReactNode;
}

const getStatusVariant = (status: string | null | undefined): 'default' | 'destructive' | 'outline' | 'secondary' => {
  if (!status) {
    return 'default'; // Provide a default variant if status is null or undefined
  }
  switch (status.toLowerCase()) {
    case 'active':
      return 'secondary';
    case 'pending':
      return 'outline';
    case 'suspended':
      return 'destructive';
    default:
      return 'default';
  }
};

const StatusBadge = ({ status, children }: StatusBadgeProps) => {
  return (
    <Badge variant={getStatusVariant(status)}>
      {children}
    </Badge>
  );
};

export default StatusBadge;