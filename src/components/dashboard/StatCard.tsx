import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  Icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, Icon, iconColor, iconBg }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4 min-w-[250px] hover:-translate-y-1 hover:shadow-xl transition-all duration-200 cursor-pointer">
      <div className={`p-3 rounded-xl ${iconBg}`}>
        <Icon size={24} className={iconColor} />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;