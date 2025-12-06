import React from 'react';

interface StatusChipProps {
  status: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default' | 'synced' | 'notSynced' | 'generated' | 'notGenerated';
  className?: string;
}

const StatusChip: React.FC<StatusChipProps> = ({
  status,
  variant = 'default',
  className = '',
}) => {
  // Note: We are using CSS Modules for styling now, defined in Dashboard.module.css
  const baseStyles = "dashboard-statusChip";

  const variantStyles = {
    success: "dashboard-statusVerified",
    warning: "dashboard-statusPending",
    danger: "dashboard-statusRejected",
    info: "dashboard-statusPending",
    default: "dashboard-statusPending",
    synced: "dashboard-statusSynced",
    notSynced: "dashboard-statusNotSynced",
    generated: "dashboard-statusSynced", // Using synced for generated as it's blue
    notGenerated: "dashboard-statusNotGeneratedInvoice", // New style for not generated
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {status}
    </span>
  );
};

export default StatusChip;