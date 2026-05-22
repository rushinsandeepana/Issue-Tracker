import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchIssues, setFilters, setPage } from '../store/slices/issueSlice';
import IssueChart from '../components/dashboard/IssueChart';
import StatsCards from '../components/dashboard/StatsCards';
import TopBar from '../components/common/TopBar';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { 
    statusCounts,
    loading,
    filters
  } = useAppSelector((state) => state.issues);
  
  const { user } = useAppSelector((state) => state.auth);
  
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');

  useEffect(() => {
    dispatch(fetchIssues());
  }, [dispatch, filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <TopBar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}! Here's your issue overview.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <StatsCards statusCounts={statusCounts} />
            
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Analytics</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setChartType('bar')}
                    className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
                      chartType === 'bar' 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Bar Chart
                  </button>
                  <button
                    onClick={() => setChartType('pie')}
                    className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
                      chartType === 'pie' 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Pie Chart
                  </button>
                  <button
                    onClick={() => setChartType('line')}
                    className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
                      chartType === 'line' 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Line Chart
                  </button>
                </div>
              </div>
              <IssueChart statusCounts={statusCounts} chartType={chartType} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;