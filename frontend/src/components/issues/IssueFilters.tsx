import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { setFilters, clearFilters } from '../../store/slices/issueSlice';
import type { IssueStatus, IssuePriority } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';

const IssueFilters: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.issues);
  const [localSearch, setLocalSearch] = useState(filters.search);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => {
    dispatch(setFilters({ search: debouncedSearch }));
  }, [debouncedSearch, dispatch]);

  const handleStatusChange = (status: IssueStatus | 'all') => {
    dispatch(setFilters({ status: status === filters.status ? 'all' : status }));
  };

  const handlePriorityChange = (priority: IssuePriority | 'all') => {
    dispatch(setFilters({ priority: priority === filters.priority ? 'all' : priority }));
  };

  const handleClearFilters = () => {
    setLocalSearch('');
    dispatch(clearFilters());
  };

  const hasActiveFilters = filters.status !== 'all' || filters.priority !== 'all' || filters.search;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or description..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
            showAdvanced || hasActiveFilters
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FiFilter />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 bg-white text-primary-600 rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {Object.values(filters).filter(v => v && v !== 'all').length}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="px-4 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="flex flex-wrap gap-2">
                {['all', 'open', 'in_progress', 'resolved', 'closed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status as IssueStatus | 'all')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filters.status === status
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'all' ? 'All' : status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <div className="flex flex-wrap gap-2">
                {['all', 'low', 'medium', 'high', 'critical'].map((priority) => (
                  <button
                    key={priority}
                    onClick={() => handlePriorityChange(priority as IssuePriority | 'all')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filters.priority === priority
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {priority === 'all' ? 'All' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueFilters;