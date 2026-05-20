import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import type { Issue } from '../../types';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

interface IssueCardProps {
  issue: Issue;
  onView: (issue: Issue) => void;
  onEdit: (issue: Issue) => void;
  onDelete: (id: number) => void;
  compact?: boolean;
}

const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  onView,
  onEdit,
  onDelete,
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 group">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {issue.title}
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                <StatusBadge status={issue.status} />
                <PriorityBadge priority={issue.priority} />
              </div>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}
              </p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onView(issue)}
                className="p-1.5 text-gray-500 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                title="View Details"
              >
                <FiEye className="w-4 h-4" />
              </button>
              <button
                onClick={() => onEdit(issue)}
                className="p-1.5 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                title="Edit Issue"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(issue.id)}
                className="p-1.5 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                title="Delete Issue"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {issue.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={issue.status} />
              <PriorityBadge priority={issue.priority} />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onView(issue)}
              className="p-2 text-gray-500 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
              title="View Details"
            >
              <FiEye className="w-5 h-5" />
            </button>
            <button
              onClick={() => onEdit(issue)}
              className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              title="Edit Issue"
            >
              <FiEdit2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(issue.id)}
              className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              title="Delete Issue"
            >
              <FiTrash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {issue.description || 'No description provided'}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t">
          <span>Created {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}</span>
          {issue.updated_at !== issue.created_at && (
            <span>Updated {formatDistanceToNow(new Date(issue.updated_at), { addSuffix: true })}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueCard;