import React, { useState, useEffect } from 'react';
import { FiSave, FiX } from 'react-icons/fi';
import type { Issue, CreateIssueData } from '../../types';
import Button from '../common/Button';

interface IssueFormProps {
  initialData?: Issue;
  onSubmit: (data: CreateIssueData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const IssueForm: React.FC<IssueFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateIssueData>({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
    severity: 'minor',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        status: initialData.status,
        priority: initialData.priority,
        severity: initialData.severity,
      });
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 255) {
      newErrors.title = 'Title must be less than 255 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await onSubmit(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter issue title"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          placeholder="Describe the issue in detail..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Severity
          </label>
          <select
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="minor">Minor</option>
            <option value="major">Major</option>
            <option value="critical">Critical</option>
            <option value="blocker">Blocker</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="primary" loading={isLoading}>
          <FiSave className="w-4 h-4 mr-2" />
          {initialData ? 'Update Issue' : 'Create Issue'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          <FiX className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default IssueForm;