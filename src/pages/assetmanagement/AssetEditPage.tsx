import React from 'react';
import { useParams } from 'react-router-dom';

const AssetEditPage: React.FC = () => {
  const { assetId } = useParams();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Asset Management - Edit</h1>
      <p>Form to edit existing asset ID: {assetId}</p>
    </div>
  );
};

export default AssetEditPage;