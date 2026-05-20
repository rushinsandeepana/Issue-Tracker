import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchIssues, deleteIssue, setFilters, setPage } from '../store/slices/issueSlice';
import { logout } from '../store/slices/authSlice';
import { 
  FiPlus, 
  FiLogOut, 
  FiBarChart2, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiClock, 
  FiXCircle,
  FiDownload,
  FiFileText,
  FiFile,
  FiCopy,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import IssueCard from '../components/issues/IssueCard';
import IssueFilters from '../components/issues/IssueFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ConfirmationModal from '../components/common/ConfirmationModal';
import Modal from '../components/common/Modal';
import IssueForm from '../components/issues/IssueForm';
import Button from '../components/common/Button';
import { exportToCSV, exportToJSON, copyToClipboard } from '../utils/exportUtils';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { 
    issues, 
    pagination, 
    loading, 
    statusCounts,
    filters,
    submitting
  } = useAppSelector((state) => state.issues);
  
  const { user } = useAppSelector((state) => state.auth);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState<number | null>(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<any>(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [showStats, setShowStats] = useState(true);

  useEffect(() => {
    dispatch(fetchIssues());
  }, [dispatch, filters, pagination.page]);

  const handleViewIssue = (issue: any) => {
    navigate(`/issues/${issue.id}`);
  };

  const handleEditIssue = (issue: any) => {
    setEditingIssue(issue);
    setFormModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setIssueToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (issueToDelete) {
      await dispatch(deleteIssue(issueToDelete));
      setDeleteModalOpen(false);
      setIssueToDelete(null);
    }
  };

  const handleFormSubmit = async (formData: any) => {
    setFormModalOpen(false);
    setEditingIssue(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleExport = async (format: 'csv' | 'json' | 'clipboard') => {
    try {
      if (format === 'csv') {
        exportToCSV(issues);
        toast.success('Exported to CSV successfully');
      } else if (format === 'json') {
        exportToJSON(issues);
        toast.success('Exported to JSON successfully');
      } else if (format === 'clipboard') {
        const success = await copyToClipboard(issues);
        if (success) {
          toast.success('Copied to clipboard');
        } else {
          toast.error('Failed to copy');
        }
      }
      setExportMenuOpen(false);
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      dispatch(setPage(pagination.page + 1));
    }
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      dispatch(setPage(pagination.page - 1));
    }
  };

  const statusIcons = {
    open: <FiAlertCircle className="w-5 h-5" />,
    in_progress: <FiClock className="w-5 h-5" />,
    resolved: <FiCheckCircle className="w-5 h-5" />,
    closed: <FiXCircle className="w-5 h-5" />
  };

  const statusColors = {
    open: 'bg-orange-100 text-orange-700 border-orange-200',
    in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
    resolved: 'bg-green-100 text-green-700 border-green-200',
    closed: 'bg-gray-100 text-gray-700 border-gray-200'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">IT</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  Issue Tracker
                </h1>
                <p className="text-xs text-gray-500">Track and manage issues efficiently</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <FiLogOut className="w-5 h-5" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-600 mt-1">Welcome back, {user?.name}! Here's your issue overview.</p>
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <button
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                <FiDownload className="w-5 h-5" />
                Export
              </button>
              
              {exportMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 animate-fade-in">
                  <button
                    onClick={() => handleExport('csv')}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FiFileText className="w-4 h-4" />
                    Export as CSV
                  </button>
                  <button
                    onClick={() => handleExport('json')}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FiFile className="w-4 h-4" />
                    Export as JSON
                  </button>
                  <button
                    onClick={() => handleExport('clipboard')}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FiCopy className="w-4 h-4" />
                    Copy to Clipboard
                  </button>
                </div>
              )}
            </div>
            
            <button
              onClick={() => {
                setEditingIssue(null);
                setFormModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <FiPlus className="w-5 h-5" />
              New Issue
            </button>
          </div>
        </div>

        {showStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="card p-4 cursor-pointer hover:scale-105 transition-transform duration-200" onClick={() => dispatch(setFilters({ status: 'open' }))}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Open Issues</p>
                  <p className="text-3xl font-bold text-gray-900">{statusCounts.open}</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                  {statusIcons.open}
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 rounded-full h-2 transition-all duration-500"
                    style={{ width: `${(statusCounts.open / Math.max(1, statusCounts.open + statusCounts.in_progress + statusCounts.resolved + statusCounts.closed)) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="card p-4 cursor-pointer hover:scale-105 transition-transform duration-200" onClick={() => dispatch(setFilters({ status: 'in_progress' }))}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">In Progress</p>
                  <p className="text-3xl font-bold text-gray-900">{statusCounts.in_progress}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  {statusIcons.in_progress}
                </div>
              </div>
            </div>

            <div className="card p-4 cursor-pointer hover:scale-105 transition-transform duration-200" onClick={() => dispatch(setFilters({ status: 'resolved' }))}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Resolved</p>
                  <p className="text-3xl font-bold text-gray-900">{statusCounts.resolved}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  {statusIcons.resolved}
                </div>
              </div>
            </div>

            <div className="card p-4 cursor-pointer hover:scale-105 transition-transform duration-200" onClick={() => dispatch(setFilters({ status: 'closed' }))}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Closed</p>
                  <p className="text-3xl font-bold text-gray-900">{statusCounts.closed}</p>
                </div>
                <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                  {statusIcons.closed}
                </div>
              </div>
            </div>
          </div>
        )}

        <IssueFilters />

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : issues.length === 0 ? (
          <EmptyState
            title="No issues found"
            description="Get started by creating your first issue. Track and manage all your project issues in one place."
            actionText="Create New Issue"
            onAction={() => {
              setEditingIssue(null);
              setFormModalOpen(true);
            }}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {issues.map((issue, index) => (
                <div key={issue.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <IssueCard
                    issue={issue}
                    onView={handleViewIssue}
                    onEdit={handleEditIssue}
                    onDelete={handleDeleteClick}
                  />
                </div>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={handlePrevPage}
                  disabled={pagination.page === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200"
                >
                  <FiChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum = pagination.page;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => dispatch(setPage(pageNum))}
                        className={`w-10 h-10 rounded-lg transition-all duration-200 ${
                          pagination.page === pageNum
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={handleNextPage}
                  disabled={pagination.page === pagination.totalPages}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200"
                >
                  Next
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <div className="text-center text-sm text-gray-500 mt-4">
              Showing {issues.length} of {pagination.total} issues
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingIssue(null);
        }}
        title={editingIssue ? 'Edit Issue' : 'Create New Issue'}
      >
        <IssueForm
          initialData={editingIssue}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setFormModalOpen(false);
            setEditingIssue(null);
          }}
          isLoading={submitting}
        />
      </Modal>

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setIssueToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Issue"
        message="Are you sure you want to delete this issue? This action cannot be undone."
        type="danger"
      />
    </div>
  );
};

export default Dashboard;