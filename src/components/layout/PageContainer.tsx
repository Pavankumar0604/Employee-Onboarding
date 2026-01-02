import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type PageVariant = 'default' | 'fluid' | 'narrow' | 'dashboard' | 'list' | 'detail' | 'form';
type SpacingSize = 'tight' | 'base' | 'relaxed' | 'loose' | 'spacious';

interface PageContainerProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    variant?: PageVariant;
    spacing?: SpacingSize;
    actions?: React.ReactNode;
    breadcrumbs?: { label: string; to?: string }[];
    className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({
    children,
    title,
    subtitle,
    variant = 'default',
    spacing = 'base',
    actions,
    breadcrumbs,
    className = '',
}) => {
    // Determine max-width based on variant
    const getMaxWidth = () => {
        switch (variant) {
            case 'fluid':
                return 'max-w-full';
            case 'narrow':
                return 'max-w-3xl';
            case 'form':
                return 'max-w-form'; // 800px from tailwind config
            case 'dashboard':
                return 'max-w-7xl';
            case 'list':
                return 'max-w-[1600px]';
            case 'detail':
                return 'max-w-6xl';
            default:
                return 'max-w-7xl'; // Standard width
        }
    };

    // Get responsive padding based on spacing size
    const getContainerPadding = () => {
        const paddingMap = {
            tight: 'p-6 md:p-8 lg:p-10',
            base: 'p-8 md:p-10 lg:p-12',
            relaxed: 'p-10 md:p-12 lg:p-16',
            loose: 'p-12 md:p-16 lg:p-20',
            spacious: 'p-16 md:p-20 lg:p-24',
        };
        return paddingMap[spacing];
    };

    // Get title typography based on variant
    const getTitleClasses = () => {
        switch (variant) {
            case 'dashboard':
                return 'text-heading-xl md:text-[2.5rem] font-bold text-gray-900 dark:text-white tracking-tight';
            case 'list':
                return 'text-heading-l font-semibold text-gray-900 dark:text-white tracking-tight';
            case 'detail':
            case 'form':
                return 'text-heading-l font-semibold text-gray-900 dark:text-white tracking-tight';
            default:
                return 'text-heading-m sm:text-heading-l font-semibold text-gray-900 dark:text-white tracking-tight';
        }
    };

    // Get section gap based on spacing
    const getSectionGap = () => {
        const gapMap = {
            tight: 'mb-6',
            base: 'mb-8',
            relaxed: 'mb-10',
            loose: 'mb-12',
            spacious: 'mb-16',
        };
        return gapMap[spacing];
    };

    return (
        <div className={`min-h-full w-full ${getContainerPadding()} ${className}`}>
            {/* Header Section with enhanced spacing */}
            {(title || breadcrumbs || actions) && (
                <div className={`${getSectionGap()} space-y-4 animate-slide-up`}>
                    {/* Breadcrumbs */}
                    {breadcrumbs && breadcrumbs.length > 0 && (
                        <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                            {breadcrumbs.map((crumb, index) => (
                                <React.Fragment key={index}>
                                    {index > 0 && <ChevronRight className="h-4 w-4 mx-2 opacity-50" />}
                                    {crumb.to ? (
                                        <Link
                                            to={crumb.to}
                                            className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors font-medium"
                                        >
                                            {crumb.label}
                                        </Link>
                                    ) : (
                                        <span className="font-semibold text-gray-700 dark:text-gray-200">
                                            {crumb.label}
                                        </span>
                                    )}
                                </React.Fragment>
                            ))}
                        </nav>
                    )}

                    {/* Title & Actions Row with better spacing */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                        <div className="flex-1 min-w-0">
                            {title && (
                                <h1 className={getTitleClasses()}>
                                    {title}
                                </h1>
                            )}
                            {subtitle && (
                                <p className="mt-2 text-body-large text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
                                    {subtitle}
                                </p>
                            )}
                        </div>

                        {/* Action Buttons with improved alignment */}
                        {actions && (
                            <div className="flex items-center gap-3 shrink-0 pt-1">
                                {actions}
                            </div>
                        )}
                    </div>

                    {/* Decorative separator for dashboard variant */}
                    {variant === 'dashboard' && (
                        <div className="h-1 w-20 bg-gradient-to-r from-sky-400 to-sky-600 rounded-full mt-4" />
                    )}
                </div>
            )}

            {/* Main Content with responsive max-width */}
            <div className={`mx-auto ${getMaxWidth()} transition-all duration-300 ease-in-out`}>
                {children}
            </div>
        </div>
    );
};

export default PageContainer;

