import React from 'react';
import { ChartData } from '../../types/attendance';

/**
 * @description Props for the ProgressChart component.
 */
interface ProgressChartProps {
  /**
   * @description The chart data, expected to be an array of { site: string; rate: number }.
   */
  data: ChartData['data'];
}

/**
 * @description Renders a progress bar chart showing attendance rates by site.
 * @param {ProgressChartProps} props - The props for the ProgressChart component.
 * @returns {JSX.Element | null} The rendered ProgressChart component or null if data is invalid.
 */
const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  if (!Array.isArray(data)) return null;

  return (
    <div className="w-full space-y-4">
      {data.map((item: { site: string; rate: number }) => (
        <div key={item.site}>
          <div className="flex justify-between text-sm mb-1 text-gray-700">
            <span className="font-medium">{item.site}</span>
            <span>{item.rate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-indigo-500 transition-all duration-300 ease-out"
              style={{ width: `${item.rate}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressChart;