import React from 'react';
import { FiCircle, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import type { IssueStatus } from '../../types';

interface StatusBadgeProps {
  status: IssueStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig: Record<IssueStatus, { label: string; bgColor: string; textColor: string; icon: React.ElementType }> = {
    open: {
      label: 'Open',
      icon: FiCircle,
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800',
    },
    in_progress: {
      label: 'In Progress',
      icon: FiClock,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
    },
    resolved: {
      label: 'Resolved',
      icon: FiCheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
    },
    closed: {
      label: 'Closed',
      icon: FiXCircle,
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

export default StatusBadge;