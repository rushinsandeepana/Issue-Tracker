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
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiSave,
  FiX
} from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/issues/StatusBadge';
import PriorityBadge from '../components/issues/PriorityBadge';
import ConfirmationModal from '../components/common/ConfirmationModal';
import Button from '../components/common/Button';
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
      const result = await dispatch(updateIssue({
        id: parseInt(id),
        data: formData
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
        data: { status: newStatus as any }
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Issue not found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary inline-flex items-center gap-2"
          >
            <FiArrowLeft /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

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
            
            <div className="flex gap-3">
              {!isEditing ? (
                <>
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    <FiEdit2 className="w-5 h-5" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
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
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
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
        <div className="card p-8 animate-fade-in">
          {!isEditing ? (
            <>
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedIssue.title}</h1>
                <div className="flex flex-wrap gap-3">
                  <StatusBadge status={selectedIssue.status} />
                  <PriorityBadge priority={selectedIssue.priority} />
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    <FiFlag className="w-3 h-3" />
                    {selectedIssue.severity.charAt(0).toUpperCase() + selectedIssue.severity.slice(1)} Severity
                  </span>
                </div>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
                <div className="flex flex-wrap gap-2">
                  {['open', 'in_progress', 'resolved', 'closed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedIssue.status === status
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      {status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedIssue.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FiUser className="w-5 h-5 text-gray-400" />
                  <span>Created by: <span className="font-medium text-gray-900">{user?.name || 'User'}</span></span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FiCalendar className="w-5 h-5 text-gray-400" />
                  <span>Created: <span className="font-medium text-gray-900">{formatDate(selectedIssue.created_at)}</span></span>
                </div>
                {selectedIssue.updated_at !== selectedIssue.created_at && (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FiClock className="w-5 h-5 text-gray-400" />
                    <span>Last updated: <span className="font-medium text-gray-900">{formatDate(selectedIssue.updated_at)}</span></span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                  placeholder="Enter issue title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  className="input-field resize-none"
                  placeholder="Describe the issue in detail..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="input-field"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="input-field"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Severity
                  </label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    className="input-field"
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