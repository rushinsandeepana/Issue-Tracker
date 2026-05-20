import React from 'react';
import { FiInbox } from 'react-icons/fi';
import Button from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ElementType;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon: Icon = FiInbox
}) => {
  return (
    <div className="text-center py-12 animate-fade-in">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
        <Icon className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction}>{actionText}</Button>
      )}
    </div>
  );
};

export default EmptyState;