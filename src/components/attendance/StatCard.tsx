import React, { useEffect, useRef, useState } from 'react';
import { StatData } from '../../types/attendance';

// Simple CountUp Hook (Step 3)
const useCountUp = (endValue: number, duration: number = 1500) => {
  const [count, setCount] = useState(0);
  const ref = useRef(endValue);

  useEffect(() => {
    ref.current = endValue;
  }, [endValue]);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * (ref.current - 0) + 0));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    const animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [endValue, duration]);

  return count;
};


const StatCard: React.FC<{ stat: StatData; }> = ({ stat }) => {
  const animatedValue = useCountUp(stat.value);
  const Icon = stat.icon;
  
  // Define colors based on title to match the image aesthetics (consistent green theme)
  const colorMap = {
    "Total Employees": { iconColor: 'text-sky-700', bgColor: 'bg-sky-50' },
    "Present Today": { iconColor: 'text-sky-700', bgColor: 'bg-sky-50' },
    "Absent Today": { iconColor: 'text-sky-700', bgColor: 'bg-sky-50' },
    "On Leave Today": { iconColor: 'text-sky-700', bgColor: 'bg-sky-50' },
  };

  const { iconColor, bgColor } = colorMap[stat.title as keyof typeof colorMap] || { iconColor: 'text-sky-700', bgColor: 'bg-sky-50' };

  const cardClasses = "bg-white p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg flex flex-col items-start";

  return (
    <div className={cardClasses}>
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-full ${bgColor} ${iconColor}`}>
          <Icon className="w-8 h-8" />
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium text-gray-500">{stat.title}</p>
          <p className="text-3xl font-bold text-gray-900">{animatedValue}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;