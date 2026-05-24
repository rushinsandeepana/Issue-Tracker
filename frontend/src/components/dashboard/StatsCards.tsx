import React from 'react';
import { useDispatch } from 'react-redux';
import { setFilters } from '../../store/slices/issueSlice';
import { 
  FiAlertCircle, 
  FiCheckCircle, 
  FiClock, 
  FiXCircle 
} from 'react-icons/fi';

interface StatsCardsProps {
  statusCounts: {
    open: number;
    in_progress: number;
    resolved: number;
    closed: number;
  };
}

const StatsCards: React.FC<StatsCardsProps> = ({ statusCounts }) => {
  const dispatch = useDispatch();

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

  const progressBarColors = {
    open: 'bg-orange-500',
    in_progress: 'bg-blue-500',
    resolved: 'bg-green-500',
    closed: 'bg-gray-500'
  };

  const stats = [
    { key: 'open', label: 'Open Issues', color: 'orange' },
    { key: 'in_progress', label: 'In Progress', color: 'blue' },
    { key: 'resolved', label: 'Resolved', color: 'green' },
    { key: 'closed', label: 'Closed', color: 'gray' }
  ];

  const total = statusCounts.open + statusCounts.in_progress + statusCounts.resolved + statusCounts.closed;

  const getPercentage = (count: number): number => {
    return total === 0 ? 0 : (count / total) * 100;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div 
          key={stat.key}
          className="card p-4 cursor-pointer hover:scale-105 transition-transform duration-200 bg-gray-300 rounded-lg border" 
          onClick={() => dispatch(setFilters({ status: stat.key as never }))}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">
                {statusCounts[stat.key as keyof typeof statusCounts]}
              </p>
            </div>
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${statusColors[stat.key as keyof typeof statusColors]}`}>
              {statusIcons[stat.key as keyof typeof statusIcons]}
            </div>
          </div>
          
          {/* Progress bar for all boxes */}
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{getPercentage(statusCounts[stat.key as keyof typeof statusCounts]).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`${progressBarColors[stat.key as keyof typeof progressBarColors]} rounded-full h-2 transition-all duration-500`}
                style={{ width: `${getPercentage(statusCounts[stat.key as keyof typeof statusCounts])}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;