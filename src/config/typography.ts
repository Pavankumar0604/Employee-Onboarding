// src/config/typography.ts
/**
 * Typography System Configuration
 * 
 * Defines a consistent, hierarchical typography scale for the entire application.
 * This system ensures visual distinction between page types while maintaining
 * brand consistency and readability.
 */

export const typography = {
    // Hero & Dashboard Headings
    headingXL: {
        fontSize: '2.25rem',      // 36px
        fontWeight: '700',
        lineHeight: '1.2',
        letterSpacing: '-0.02em', // Tighter for large text
    },

    // Page Titles & Main Sections
    headingL: {
        fontSize: '1.875rem',     // 30px
        fontWeight: '600',
        lineHeight: '1.3',
        letterSpacing: '-0.01em',
    },

    // Section Headers & Card Titles
    headingM: {
        fontSize: '1.5rem',       // 24px
        fontWeight: '600',
        lineHeight: '1.4',
        letterSpacing: '0',
    },

    // Subsections & Table Headers
    headingS: {
        fontSize: '1.25rem',      // 20px
        fontWeight: '500',
        lineHeight: '1.4',
        letterSpacing: '0',
    },

    // Prominent Body Text
    bodyLarge: {
        fontSize: '1.125rem',     // 18px
        fontWeight: '400',
        lineHeight: '1.6',
        letterSpacing: '0',
    },

    // Standard Body Text
    body: {
        fontSize: '1rem',         // 16px
        fontWeight: '400',
        lineHeight: '1.6',
        letterSpacing: '0',
    },

    // Secondary Text & Table Content
    bodySmall: {
        fontSize: '0.875rem',     // 14px
        fontWeight: '400',
        lineHeight: '1.5',
        letterSpacing: '0',
    },

    // Labels & Helper Text
    label: {
        fontSize: '0.75rem',      // 12px
        fontWeight: '500',
        lineHeight: '1.4',
        letterSpacing: '0.025em', // Slightly wider for readability
        textTransform: 'uppercase' as const,
    },
} as const;

/**
 * Typography Utility Classes
 * Use these class name generators for applying typography styles
 */
export const typographyClasses = {
    headingXL: 'text-4xl font-bold leading-tight -tracking-wider',
    headingL: 'text-3xl font-semibold leading-snug -tracking-wide',
    headingM: 'text-2xl font-semibold leading-normal',
    headingS: 'text-xl font-medium leading-normal',
    bodyLarge: 'text-lg font-normal leading-relaxed',
    body: 'text-base font-normal leading-relaxed',
    bodySmall: 'text-sm font-normal leading-normal',
    label: 'text-xs font-medium leading-tight tracking-wide uppercase',
} as const;

/**
 * Generate inline styles from typography config
 */
export const getTypographyStyle = (variant: keyof typeof typography) => {
    const style = typography[variant];
    return {
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
        letterSpacing: style.letterSpacing,
        ...(variant === 'label' && { textTransform: 'uppercase' }),
    };
};

/**
 * Responsive typography breakpoints
 * Automatically scale down typography on smaller screens
 */
export const responsiveTypography = {
    headingXL: {
        base: '1.75rem',    // 28px on mobile
        md: '2rem',         // 32px on tablet
        lg: '2.25rem',      // 36px on desktop
    },
    headingL: {
        base: '1.5rem',     // 24px on mobile
        md: '1.625rem',     // 26px on tablet
        lg: '1.875rem',     // 30px on desktop
    },
    headingM: {
        base: '1.25rem',    // 20px on mobile
        md: '1.375rem',     // 22px on tablet
        lg: '1.5rem',       // 24px on desktop
    },
} as const;
