import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface IssueChartProps {
  statusCounts: {
    open: number;
    in_progress: number;
    resolved: number;
    closed: number;
  };
  chartType?: 'bar' | 'pie' | 'line';
}

const IssueChart: React.FC<IssueChartProps> = ({ statusCounts, chartType = 'bar' }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    
    const observer = new MutationObserver(() => {
      checkTheme();
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  const chartData = {
    labels: ['Open', 'In Progress', 'Resolved', 'Closed'],
    datasets: [
      {
        label: 'Issues by Status',
        data: [statusCounts.open, statusCounts.in_progress, statusCounts.resolved, statusCounts.closed],
        backgroundColor: [
          'rgba(249, 115, 22, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(107, 114, 128, 0.8)',
        ],
        borderColor: [
          'rgb(249, 115, 22)',
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(107, 114, 128)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDarkMode ? '#f3f4f6' : '#374151',
        },
      },
      title: {
        display: true,
        text: 'Issue Distribution',
        font: {
          size: 16,
        },
        color: isDarkMode ? '#f3f4f6' : '#1f2937',
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        titleColor: isDarkMode ? '#f3f4f6' : '#1f2937',
        bodyColor: isDarkMode ? '#d1d5db' : '#4b5563',
        borderColor: isDarkMode ? '#374151' : '#e5e7eb',
        borderWidth: 1,
      },
    },
    scales: chartType === 'bar' ? {
      x: {
        ticks: {
          color: isDarkMode ? '#f3f4f6' : '#374151',
        },
        grid: {
          color: isDarkMode ? '#374151' : '#e5e7eb',
        },
      },
      y: {
        ticks: {
          color: isDarkMode ? '#f3f4f6' : '#374151',
        },
        grid: {
          color: isDarkMode ? '#374151' : '#e5e7eb',
        },
        beginAtZero: true,
      },
    } : undefined,
  };

  const renderChart = () => {
    switch (chartType) {
      case 'pie':
        return <Pie data={chartData} options={options} />;
      case 'line':
        return <Line data={chartData} options={options} />;
      default:
        return <Bar data={chartData} options={options} />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="h-80">
        {renderChart()}
      </div>
    </div>
  );
};

export default IssueChart;