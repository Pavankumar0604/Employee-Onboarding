import React from 'react';
import StatusChip from './StatusChip';

interface PortalSyncStatusChipProps {
  isSynced: boolean;
  lastSyncTime?: string; // Optional, for displaying when it was last synced
  className?: string;
}

const PortalSyncStatusChip: React.FC<PortalSyncStatusChipProps> = ({
  isSynced,
  lastSyncTime,
  className = '',
}) => {
  const status = isSynced ? 'Synced' : 'Not Synced';
  const variant = isSynced ? 'synced' : 'notSynced';

  return (
    <div className={`flex items-center ${className}`}>
      <StatusChip status={status} variant={variant} />
      {isSynced && lastSyncTime && (
        <span className="ml-2 text-xs text-ui-gray-muted">
          Last synced: {lastSyncTime}
        </span>
      )}
    </div>
  );
};

export default PortalSyncStatusChip;