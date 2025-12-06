import React from 'react';
import { useParams } from 'react-router-dom';

const AssetDetailsPage: React.FC = () => {
  const { assetId } = useParams();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Asset Management - Details</h1>
      <p>Details for asset ID: {assetId}</p>
    </div>
  );
};

export default AssetDetailsPage;