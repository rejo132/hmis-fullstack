import React from 'react';

const DataVisualization = ({ type, data, title, subtitle, trend = 'up' }) => {
  // Generate sparkline path for SVG
  const generateSparkline = (values) => {
    if (!values || values.length === 0) return '';
    
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    
    const width = 100;
    const height = 30;
    
    const points = values.map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');
    
    return `M ${points.split(' ').join(' L ')}`;
  };

  // Generate bar chart data
  const generateBarChart = (values) => {
    if (!values || values.length === 0) return [];
    
    const max = Math.max(...values);
    
    return values.map((value, index) => ({
      height: (value / max) * 40,
      value,
      index
    }));
  };

  // Mock data based on type
  const getMockData = () => {
    switch (type) {
      case 'appointments':
        return [12, 19, 15, 22, 18, 25, 20, 28, 24, 30, 27, 32];
      case 'revenue':
        return [15000, 18000, 16000, 22000, 19000, 25000, 21000, 28000, 26000, 31000, 29000, 34000];
      case 'beds':
        return [85, 78, 82, 88, 91, 86, 89, 93, 87, 90, 85, 88];
      case 'patients':
        return [45, 52, 48, 58, 55, 62, 59, 65, 61, 68, 64, 70];
      default:
        return [10, 15, 12, 18, 16, 20, 17, 22, 19, 24, 21, 25];
    }
  };

  const chartData = data || getMockData();
  const sparklinePath = generateSparkline(chartData);
  const barData = generateBarChart(chartData.slice(-7)); // Last 7 days for bar chart

  const getTrendColor = () => {
    return trend === 'up' 
      ? 'text-success-600 dark:text-success-400' 
      : trend === 'down' 
      ? 'text-danger-600 dark:text-danger-400'
      : 'text-warning-600 dark:text-warning-400';
  };

  const getTrendIcon = () => {
    if (trend === 'up') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    } else if (trend === 'down') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  const formatValue = (value) => {
    if (type === 'revenue') {
      return `$${(value / 1000).toFixed(1)}K`;
    } else if (type === 'beds') {
      return `${value}%`;
    }
    return value.toString();
  };

  const currentValue = chartData[chartData.length - 1];
  const previousValue = chartData[chartData.length - 2];
  const changePercent = previousValue ? (((currentValue - previousValue) / previousValue) * 100).toFixed(1) : 0;

  return (
    <div className="metric-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
            {title}
          </h4>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="text-xs font-medium">
            {changePercent > 0 ? '+' : ''}{changePercent}%
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatValue(currentValue)}
        </div>
      </div>

      {/* Sparkline Chart */}
      {type === 'sparkline' && (
        <div className="flex items-center justify-center h-12">
          <svg width="120" height="40" className="overflow-visible">
            <path
              d={sparklinePath}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={getTrendColor()}
            />
            {/* Data points */}
            {chartData.map((value, index) => {
              const max = Math.max(...chartData);
              const min = Math.min(...chartData);
              const range = max - min || 1;
              const x = (index / (chartData.length - 1)) * 100;
              const y = 30 - ((value - min) / range) * 30;
              
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="2"
                  fill="currentColor"
                  className={getTrendColor()}
                />
              );
            })}
          </svg>
        </div>
      )}

      {/* Bar Chart */}
      {type !== 'sparkline' && (
        <div className="flex items-end space-x-1 h-12">
          {barData.map((bar, index) => (
            <div
              key={index}
              className="flex-1 bg-gradient-to-t from-primary-500 to-primary-400 rounded-sm opacity-70 hover:opacity-100 transition-opacity duration-200"
              style={{ height: `${bar.height}px` }}
              title={`Day ${index + 1}: ${formatValue(bar.value)}`}
            />
          ))}
        </div>
      )}

      {/* Mini Stats */}
      <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
        <span>7 days</span>
        <span>
          Avg: {formatValue(Math.round(chartData.slice(-7).reduce((a, b) => a + b, 0) / 7))}
        </span>
      </div>
    </div>
  );
};

export default DataVisualization;