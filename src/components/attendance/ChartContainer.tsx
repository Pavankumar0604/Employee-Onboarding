import React, { useState, useEffect } from 'react';
import { ChartData } from '../../types/attendance';
import ProgressChart from './ProgressChart';

// Assuming animation classes like transition-all duration-300 are available via Tailwind config


/**
 * @description Props for the ChartContainer component.
 */
interface ChartContainerProps {
  /**
   * @description The chart data to display.
   */
  chart: ChartData;
}

/**
 * @description A container component for displaying different types of charts.
 * @param {ChartContainerProps} props - The props for the ChartContainer component.
 * @returns {JSX.Element} The rendered ChartContainer component.
 */
const ChartContainer: React.FC<ChartContainerProps> = ({ chart }) => {
  const Icon = chart.icon;

  // Theme: softly elevated background (bg-card, shadow-card)
  const cardClasses = "bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg flex flex-col h-full";

  const renderChart = () => {
    const LegendItem: React.FC<{ color: string, label: string }> = ({ color, label }) => (
      <div className="flex items-center space-x-1">
        <span className={`w-3 h-3 rounded-full ${color}`}></span>
        <span className="text-xs text-gray-600">{label}</span>
      </div>
    );

    const BarChartMock = () => {
      const [barHeight, setBarHeight] = useState('0%');
      const yAxisLabels = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

      useEffect(() => {
        // Animate the bar height to 100% (representing 9 out of 9 total)
        const timer = setTimeout(() => {
          setBarHeight('100%');
        }, 100);
        return () => clearTimeout(timer);
      }, []);

      return (
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-grow">
            {/* Y-Axis */}
            <div className="flex flex-col justify-between text-xs text-gray-500 pr-2 h-[180px]">
              {yAxisLabels.map((label, index) => (
                <span key={label} className={`h-[10%] flex items-center justify-end ${index === 0 ? 'mt-[-10px]' : ''} ${index === yAxisLabels.length - 1 ? 'mb-[-10px]' : ''}`}>{label}</span>
              ))}
            </div>
            {/* Chart Area */}
            <div className="flex flex-grow border-b border-l border-gray-300 relative items-end justify-center">
              {/* Bar (Absent: 9) */}
              <div
                className="w-1/3 bg-red-500 rounded-t-sm transition-all duration-1000 ease-out"
                style={{ height: barHeight }}
              ></div>
            </div>
          </div>
          {/* X-Axis Label */}
          <div className="text-xs text-gray-600 text-center pt-2">Wed 12</div>
          {/* Legend */}
          <div className="flex justify-center space-x-4 pt-4">
            <LegendItem color="bg-sky-700" label="Present" />
            <LegendItem color="bg-red-500" label="Absent" />
          </div>
        </div>
      );
    };

    const LineChartMock = () => {
      const yAxisLabels = ['1.0', '0.8', '0.6', '0.4', '0.2', '0.0'];
      return (
        <div className="flex flex-col w-full h-full">
          <div className="flex flex-grow">
            {/* Y-Axis */}
            <div className="flex flex-col justify-between text-xs text-gray-500 pr-2 h-[180px]">
              {yAxisLabels.map((label, index) => (
                <span key={label} className={`h-[16.6%] flex items-center justify-end ${index === 0 ? 'mt-[-10px]' : ''} ${index === yAxisLabels.length - 1 ? 'mb-[-10px]' : ''}`}>{label}</span>
              ))}
            </div>
            {/* Chart Area */}
            <div className="flex flex-grow border-b border-l border-gray-300 relative items-end justify-center">
              {/* Placeholder for line chart content */}
            </div>
          </div>
          {/* X-Axis Label */}
          <div className="text-xs text-gray-600 text-center pt-2">Wed 12</div>
          {/* Legend */}
          <div className="flex justify-center pt-4">
            <LegendItem color="bg-sky-700" label="Average Hours Worked" />
          </div>
        </div>
      );
    };

    switch (chart.type) {
      case 'progress':
        return <ProgressChart data={chart.data} />;
      case 'bar':
        return <BarChartMock />;
      case 'line':
        return <LineChartMock />;
      default:
        return (
          <div className="text-center p-10 text-gray-500">
            {chart.title} Chart Placeholder (Type: {chart.type})
          </div>
        );
    }
  };

  return (
    <div className={cardClasses}>
      <div className="flex items-center mb-4">
        <Icon className="w-5 h-5 text-sky-700 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">{chart.title}</h3>
      </div>
      <div className="flex-grow flex items-center justify-center min-h-[150px]">
        {renderChart()}
      </div>
    </div>
  );
};

export default ChartContainer;