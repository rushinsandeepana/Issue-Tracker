import React from 'react';
import { FiFlag, FiAlertCircle, FiZap, FiAlertTriangle } from 'react-icons/fi';
import type { IssuePriority } from '../../types';

interface PriorityBadgeProps {
  priority: IssuePriority;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const priorityConfig: Record<IssuePriority, { label: string; bgColor: string; textColor: string; icon: React.ElementType }> = {
    low: {
      label: 'Low',
      icon: FiFlag,
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
    },
    medium: {
      label: 'Medium',
      icon: FiAlertCircle,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
    },
    high: {
      label: 'High',
      icon: FiZap,
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
    },
    critical: {
      label: 'Critical',
      icon: FiAlertTriangle,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
    },
  };

  const config = priorityConfig[priority];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

export default PriorityBadge;