// src/config/spacing.ts
/**
 * Spacing System Configuration
 * 
 * Defines consistent spacing values for layouts, containers, and component gaps.
 * Creates visual rhythm and breathing room throughout the application.
 */

/**
 * Container Padding Scale
 * Applied to page containers and major layout sections
 */
export const containerPadding = {
    xs: '1rem',      // 16px - Mobile baseline
    sm: '1.5rem',    // 24px - Small tablet
    md: '2rem',      // 32px - Medium screens
    lg: '3rem',      // 48px - Large desktop
    xl: '4rem',      // 64px - Extra large, ~5%
    '2xl': '6rem',   // 96px - Hero sections
} as const;

/**
 * Component Gap Scale
 * Used for spacing between elements within components
 */
export const componentGap = {
    tight: '0.5rem',     // 8px - Table rows, compact lists
    base: '1rem',        // 16px - Default spacing
    relaxed: '1.5rem',   // 24px - Card spacing
    loose: '2rem',       // 32px - Section spacing
    spacious: '3rem',    // 48px - Major sections
    generous: '4rem',    // 64px - Page sections
} as const;

/**
 * Section Vertical Rhythm
 * Consistent vertical spacing between major page sections
 */
export const sectionSpacing = {
    tight: '1.5rem',     // 24px
    base: '2rem',        // 32px
    relaxed: '3rem',     // 48px
    loose: '4rem',       // 64px
    spacious: '6rem',    // 96px
} as const;

/**
 * Responsive Container Padding
 * Automatically adapts based on viewport size
 */
export const responsiveContainerPadding = {
    mobile: containerPadding.md,      // 32px
    tablet: containerPadding.lg,      // 48px
    desktop: containerPadding.xl,     // 64px
    wide: containerPadding['2xl'],    // 96px
} as const;

/**
 * Spacing Utility Classes
 * Tailwind-compatible class names
 */
export const spacingClasses = {
    // Container padding
    containerXs: 'p-4',           // 16px
    containerSm: 'p-6',           // 24px
    containerMd: 'p-8',           // 32px
    containerLg: 'p-12',          // 48px
    containerXl: 'p-16',          // 64px
    container2xl: 'p-24',         // 96px

    // Vertical padding only
    containerYXs: 'py-4',         // 16px
    containerYSm: 'py-6',         // 24px
    containerYMd: 'py-8',         // 32px
    containerYLg: 'py-12',        // 48px
    containerYXl: 'py-16',        // 64px
    containerY2xl: 'py-24',       // 96px

    // Component gaps
    gapTight: 'gap-2',            // 8px
    gapBase: 'gap-4',             // 16px
    gapRelaxed: 'gap-6',          // 24px
    gapLoose: 'gap-8',            // 32px
    gapSpacious: 'gap-12',        // 48px
    gapGenerous: 'gap-16',        // 64px

    // Section spacing
    sectionTight: 'mb-6',         // 24px
    sectionBase: 'mb-8',          // 32px
    sectionRelaxed: 'mb-12',      // 48px
    sectionLoose: 'mb-16',        // 64px
    sectionSpacious: 'mb-24',     // 96px
} as const;

/**
 * Page Layout Presets
 * Pre-configured spacing combinations for different page types
 */
export const pageLayouts = {
    // Dashboard: Generous spacing, 3-column grid
    dashboard: {
        containerPadding: containerPadding.xl,
        sectionGap: componentGap.spacious,
        gridGap: componentGap.relaxed,
        cardPadding: componentGap.relaxed,
    },

    // List/Table: Compact for density
    list: {
        containerPadding: containerPadding.lg,
        sectionGap: componentGap.loose,
        rowPadding: componentGap.tight,
        headerPadding: componentGap.base,
    },

    // Detail: Balanced spacing, 2-column
    detail: {
        containerPadding: containerPadding.xl,
        sectionGap: componentGap.spacious,
        columnGap: componentGap.loose,
        cardPadding: componentGap.relaxed,
    },

    // Form: Centered, vertical rhythm
    form: {
        containerPadding: containerPadding['2xl'],
        fieldGap: componentGap.loose,
        sectionGap: componentGap.generous,
        maxWidth: '50rem', // 800px
    },
} as const;

/**
 * Get responsive padding classes
 */
export const getResponsivePadding = () => {
    return 'p-8 md:p-12 lg:p-16 xl:p-24';
};

/**
 * Get page layout spacing
 */
export const getPageLayoutSpacing = (layout: keyof typeof pageLayouts) => {
    return pageLayouts[layout];
};
