import React from 'react';
import { Settings } from 'lucide-react';

interface PlaceholderViewProps {
  title: string;
}

const PlaceholderView: React.FC<PlaceholderViewProps> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-card rounded-xl shadow-card min-h-[400px] text-center">
      <Settings className="h-12 w-12 text-muted mb-4" />
      <h2 className="text-xl font-semibold text-primary-text mb-2">{title} Configuration</h2>
      <p className="text-muted">This configuration section is under development. Please check back later.</p>
    </div>
  );
};

export default PlaceholderView;