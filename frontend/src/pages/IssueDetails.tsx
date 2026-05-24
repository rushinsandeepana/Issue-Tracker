import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchIssueById, updateIssue, deleteIssue } from '../store/slices/issueSlice';
import { 
  FiArrowLeft, 
  FiEdit2, 
  FiTrash2, 
  FiCalendar, 
  FiClock,
  FiUser,
  FiFlag,
  FiSave,
  FiX
} from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/issues/StatusBadge';
import PriorityBadge from '../components/issues/PriorityBadge';
import ConfirmationModal from '../components/common/ConfirmationModal';
import toast from 'react-hot-toast';

const IssueDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { selectedIssue, loading, submitting } = useAppSelector((state) => state.issues);
  const { user } = useAppSelector((state) => state.auth);
  
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    priority: '',
    severity: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      dispatch(fetchIssueById(parseInt(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedIssue) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        title: selectedIssue.title,
        description: selectedIssue.description || '',
        status: selectedIssue.status,
        priority: selectedIssue.priority,
        severity: selectedIssue.severity
      });
    }
  }, [selectedIssue]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (selectedIssue) {
      setFormData({
        title: selectedIssue.title,
        description: selectedIssue.description || '',
        status: selectedIssue.status,
        priority: selectedIssue.priority,
        severity: selectedIssue.severity
      });
    }
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    if (selectedIssue && id) {
      const updateData: {
        title?: string;
        description?: string;
        status?: 'open' | 'in_progress' | 'resolved' | 'closed';
        priority?: 'low' | 'medium' | 'high' | 'critical';
        severity?: 'minor' | 'major' | 'critical' | 'blocker';
      } = {};
      
      if (formData.title) updateData.title = formData.title;
      if (formData.description !== undefined) updateData.description = formData.description;
      if (formData.status && formData.status !== '') {
        updateData.status = formData.status as 'open' | 'in_progress' | 'resolved' | 'closed';
      }
      if (formData.priority && formData.priority !== '') {
        updateData.priority = formData.priority as 'low' | 'medium' | 'high' | 'critical';
      }
      if (formData.severity && formData.severity !== '') {
        updateData.severity = formData.severity as 'minor' | 'major' | 'critical' | 'blocker';
      }
      
      const result = await dispatch(updateIssue({
        id: parseInt(id),
        data: updateData
      }));
      
      if (updateIssue.fulfilled.match(result)) {
        setIsEditing(false);
        toast.success('Issue updated successfully');
      }
    }
  };

  const handleDelete = async () => {
    if (id) {
      const result = await dispatch(deleteIssue(parseInt(id)));
      if (deleteIssue.fulfilled.match(result)) {
        navigate('/dashboard');
      }
      setDeleteModalOpen(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (selectedIssue && id) {
      await dispatch(updateIssue({
        id: parseInt(id),
        data: { status: newStatus as 'open' | 'in_progress' | 'resolved' | 'closed' }
      }));
      toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!selectedIssue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Issue not found</h2>
          <button
            onClick={() => navigate('/issues')}
            className="btn-primary inline-flex items-center gap-2"
          >
            <FiArrowLeft /> Back to All Issues page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/issues')}
              className="font-semibold flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-400 dark:hover:text-primary-400 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              Back to All Issues page
            </button>
            
            <div className="flex gap-3">
              {!isEditing ? (
                <>
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200"
                  >
                    <FiEdit2 className="w-5 h-5" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
                  >
                    <FiTrash2 className="w-5 h-5" />
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={submitting}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
                  >
                    <FiSave className="w-5 h-5" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
                  >
                    <FiX className="w-5 h-5" />
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="card p-8 animate-fade-in bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          {!isEditing ? (
            <>
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{selectedIssue.title}</h1>
                <div className="flex flex-wrap gap-3">
                  <StatusBadge status={selectedIssue.status} />
                  <PriorityBadge priority={selectedIssue.priority} />
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                    <FiFlag className="w-3 h-3" />
                    {selectedIssue.severity.charAt(0).toUpperCase() + selectedIssue.severity.slice(1)} Severity
                  </span>
                </div>
              </div>

              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Actions</h3>
                <div className="flex flex-wrap gap-2">
                  {['open', 'in_progress', 'resolved', 'closed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedIssue.status === status
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedIssue.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <FiUser className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <span>Created by: <span className="font-medium text-gray-900 dark:text-white">{user?.name || 'User'}</span></span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <FiCalendar className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <span>Created: <span className="font-medium text-gray-900 dark:text-white">{formatDate(selectedIssue.created_at)}</span></span>
                </div>
                {selectedIssue.updated_at !== selectedIssue.created_at && (
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <FiClock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <span>Last updated: <span className="font-medium text-gray-900 dark:text-white">{formatDate(selectedIssue.updated_at)}</span></span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`input-field bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.title ? 'border-red-500' : ''}`}
                  placeholder="Enter issue title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  className="input-field resize-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Describe the issue in detail..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="input-field bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="input-field bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Severity
                  </label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    className="input-field bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="minor">Minor</option>
                    <option value="major">Major</option>
                    <option value="critical">Critical</option>
                    <option value="blocker">Blocker</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Issue"
        message={`Are you sure you want to delete "${selectedIssue.title}"? This action cannot be undone.`}
        type="danger"
      />
    </div>
  );
};

export default IssueDetails;