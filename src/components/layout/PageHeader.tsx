import React, { ReactNode } from 'react';

export interface PageHeaderProps {
  /** Main page title */
  title: string;
  /** Optional subtitle for additional context */
  subtitle?: string;
  /** Optional breadcrumb navigation */
  breadcrumb?: ReactNode;
  /** Optional metadata (e.g., count badges, status summary) */
  meta?: ReactNode;
  /** Primary action button (right-aligned) */
  primaryAction?: ReactNode;
  /** Secondary actions (right-aligned) */
  secondaryActions?: ReactNode;
  /** Optional tab navigation below header */
  tabs?: ReactNode;
  /** Title size variant */
  size?: 'default' | 'large';
  /** Optional CSS classes for customization */
  className?: string;
}

/**
 * Unified page header component that enforces consistent typography, spacing, and layout
 * across all sidenav pages. Uses design tokens from tailwind.config.js.
 */
const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumb,
  meta,
  primaryAction,
  secondaryActions,
  tabs,
  size = 'default',
  className = '',
}) => {
  const titleSizeClass = size === 'large' ? 'text-heading-xl' : 'text-heading-l';

  return (
    <div className={`animate-fade-in ${className}`}>
      {/* Main header container with consistent padding */}
      <div className="pt-6 pb-6">
        <div className="flex items-start justify-between gap-6">
          {/* Left section: Title, subtitle, breadcrumb */}
          <div className="flex-1 min-w-0">
            {breadcrumb && (
              <div className="mb-2 text-body-small text-primary-text/70">
                {breadcrumb}
              </div>
            )}
            
            <h1 className={`${titleSizeClass} text-primary-text dark:text-dark-primary-text`}>
              {title}
            </h1>
            
            {subtitle && (
              <p className="mt-2 text-body-small text-primary-text/70 dark:text-dark-primary-text/70">
                {subtitle}
              </p>
            )}
            
            {meta && (
              <div className="mt-3 text-body-small">
                {meta}
              </div>
            )}
          </div>

          {/* Right section: Actions */}
          {(primaryAction || secondaryActions) && (
            <div className="flex items-center gap-3 flex-shrink-0">
              {secondaryActions && (
                <div className="flex items-center gap-3">
                  {secondaryActions}
                </div>
              )}
              {primaryAction && (
                <div>
                  {primaryAction}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Optional tabs section */}
      {tabs && (
        <div className="border-t border-primary-border dark:border-dark-primary-border">
          {tabs}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
