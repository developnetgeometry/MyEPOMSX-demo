
import React from 'react';
import { Badge } from '@/components/ui/badge';

export type PurchasingStatus = 
  | 'draft'
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'converted'
  | 'partial'
  | 'completed'
  | 'pending';

interface StatusBadgeProps {
  status: PurchasingStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getVariant = () => {
    switch (status) {
      case 'draft': return 'default';
      case 'submitted': return 'info';
      case 'approved': return 'success';
      case 'rejected': return 'destructive';
      case 'cancelled': return 'destructive';
      case 'converted': return 'secondary';
      case 'partial': return 'warning';
      case 'completed': return 'success';
      case 'pending': return 'outline';
      default: return 'default';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'submitted': return 'Submitted';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'cancelled': return 'Cancelled';
      case 'converted': return 'Converted';
      case 'partial': return 'Partially Received';
      case 'completed': return 'Completed';
      case 'pending': return 'Pending';
      default: {
        // Handle the default case safely by ensuring status is a string before using string methods
        const statusStr = String(status); // Convert to string to ensure string methods work
        return statusStr ? statusStr.charAt(0).toUpperCase() + statusStr.slice(1) : 'Unknown';
      }
    }
  };

  return (
    <Badge 
      variant={getVariant()} 
      className={className}
    >
      {getLabel()}
    </Badge>
  );
};

export default StatusBadge;
