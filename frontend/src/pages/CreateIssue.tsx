import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { createIssue } from '../store/slices/issueSlice';
import { FiArrowLeft, FiSave, FiX } from 'react-icons/fi';
import Button from '../components/common/Button';
// import toast from 'react-hot-toast';
import type {
  // IssueStatus,
  // IssuePriority,
  // IssueSeverity,
  CreateIssueData
} from '../types/index';

const CreateIssue: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { submitting } = useAppSelector((state) => state.issues);
  
  const [formData, setFormData] = useState<CreateIssueData>({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
    severity: 'minor'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
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
    
    setTouched({
      title: true,
      description: true,
      status: true,
      priority: true,
      severity: true
    });
    
    if (!validateForm()) return;
    
    const result = await dispatch(createIssue(formData));
    
    if (createIssue.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const getFieldError = (field: string): string | undefined => {
    return touched[field] ? errors[field] : undefined;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="card p-8 animate-fade-in">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Issue</h1>
            <p className="text-gray-600">Fill in the details below to create a new issue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                onBlur={() => handleBlur('title')}
                className={`input-field ${getFieldError('title') ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter a descriptive title for the issue"
                autoFocus
              />
              {getFieldError('title') && (
                <p className="mt-1 text-sm text-red-600 animate-fade-in">{errors.title}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Be specific and descriptive. Good titles help identify issues quickly.
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                value={formData.description}
                onChange={handleChange}
                className="input-field resize-none"
                placeholder="Describe the issue in detail...
                Include information like:
                - What is the problem?
                - Steps to reproduce
                - Expected behavior
                - Actual behavior
                - Screenshots (if any)"
              />
              <p className="mt-1 text-xs text-gray-500">
                Provide as much detail as possible to help others understand the issue.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="open">Open - New issue, not yet addressed</option>
                  <option value="in_progress">In Progress - Currently being worked on</option>
                  <option value="resolved">Resolved - Issue has been fixed</option>
                  <option value="closed">Closed - Issue is complete and verified</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="low">Low - Minor inconvenience</option>
                  <option value="medium">Medium - Affects some functionality</option>
                  <option value="high">High - Major feature affected</option>
                  <option value="critical">Critical - System is down or blocked</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  How important is this issue to resolve?
                </p>
              </div>

              <div>
                <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-2">
                  Severity
                </label>
                <select
                  id="severity"
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="minor">Minor - Cosmetic or small bug</option>
                  <option value="major">Major - Significant functionality broken</option>
                  <option value="critical">Critical - Core functionality broken</option>
                  <option value="blocker">Blocker - Cannot proceed without fix</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  How severe is the impact of this issue?
                </p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Tips for creating great issues:</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Use a clear and descriptive title</li>
                <li>• Include steps to reproduce the problem</li>
                <li>• Mention expected vs actual behavior</li>
                <li>• Add relevant screenshots or logs if possible</li>
                <li>• Set appropriate priority and severity levels</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                loading={submitting}
                className="flex items-center gap-2"
              >
                <FiSave className="w-4 h-4" />
                Create Issue
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <FiX className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateIssue;