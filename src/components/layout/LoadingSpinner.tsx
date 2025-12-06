// src/components/layout/LoadingSpinner.tsx
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-mindmesh-background">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-mindmesh-primary"></div>
      <p className="ml-4 text-mindmesh-primary">Loading Mindmesh...</p>
    </div>
  );
};

export default LoadingSpinner;