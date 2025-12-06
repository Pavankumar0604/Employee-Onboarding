import React, { useState, useEffect, useCallback } from 'react';
import { api, AssetRow } from '../../services/api';
import LoadingSpinner from '../../components/layout/LoadingSpinner';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const AssetListPage: React.FC = () => {
  const [assets, setAssets] = useState<AssetRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('type'); // Default sort
  const [sortOrder, setSortOrder] = useState('asc'); // Default order
  const [filterText, setFilterText] = useState('');

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedAssets = await api.getAssets();
      setAssets(fetchedAssets);
    } catch (err) {
      console.error("Error fetching assets:", err);
      setError("Failed to load assets.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4 bg-red-50 border border-red-300 rounded-lg">{error}</div>;
  }

  const sortedAssets = React.useMemo(() => {
    if (!assets) return [];

    let sorted = [...assets];

    // Implement sorting logic here based on sortBy and sortOrder
    sorted.sort((a, b) => {
      const aValue = (a as any)[sortBy] || '';
      const bValue = (b as any)[sortBy] || '';

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // Implement filtering logic here based on filterText
    if (filterText) {
      sorted = sorted.filter(asset => {
        return (
          asset.type.toLowerCase().includes(filterText.toLowerCase()) ||
          asset.name.toLowerCase().includes(filterText.toLowerCase()) ||
          asset.serialNumber.toLowerCase().includes(filterText.toLowerCase())
        );
      });
    }

    return sorted;
  }, [assets, sortBy, sortOrder, filterText]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-primary-text mb-4">Asset Management - List</h1>

      <div className="flex items-center justify-between mb-4">
        <Input 
          type="text" 
          placeholder="Filter assets..." 
          value={filterText} 
          onChange={handleFilterChange} 
          className="w-1/3" 
        />
        <Button onClick={() => {}} className="bg-cta hover:bg-hover-focus text-white">Add New Asset</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-primary-border">
          <thead className="bg-secondary-accent/50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-primary-text uppercase tracking-wider cursor-pointer" onClick={() => handleSort('type')}>
                Type {sortBy === 'type' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-primary-text uppercase tracking-wider cursor-pointer" onClick={() => handleSort('model')}>
                Model {sortBy === 'model' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-primary-text uppercase tracking-wider cursor-pointer" onClick={() => handleSort('serial_number')}>
                Serial Number {sortBy === 'serial_number' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-primary-text uppercase tracking-wider">Assigned To</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-primary-text uppercase tracking-wider">Purchase Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-primary-text uppercase tracking-wider">Condition</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedAssets.map((asset) => (
              <tr key={asset.id}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-primary-text">{asset.type}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-primary-text">{asset.name}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-primary-text">{asset.serialNumber}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-primary-text">{asset.assignedToUserId || 'Unassigned'}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-primary-text">{asset.purchaseDate}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-primary-text">{asset.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetListPage;