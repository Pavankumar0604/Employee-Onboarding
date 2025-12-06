// Employee-Onboarding/src/components/ui/AnimatedGeometricAvatars.tsx

import React from 'react';
import { motion } from 'framer-motion';

/**
 * @description Props for the AnimatedGeometricAvatars component.
 */
interface AnimatedGeometricAvatarsProps {
  /**
   * @description Optional CSS class names to apply to the container.
   */
  className?: string;
  /**
   * @description The primary accent color for the shapes (e.g., '#D81E27').
   */
  accentColor?: string;
  /**
   * @description The secondary accent color for the shapes (e.g., '#FED000').
   */
  secondaryColor?: string;
  /**
   * @description The tertiary accent color for the shapes (e.g., '#5B2EFF').
   */
  tertiaryColor?: string;
  /**
   * @description Duration for the continuous pulse animation in seconds.
   */
  pulseDuration?: number;
}

const shapeVariants = {
  initial: { scale: 0, opacity: 0, rotate: -10 },
  animate: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
      duration: 0.8,
    },
  },
} as const;

// Subtle animation for continuous movement (pulse/sway)
const pulseAnimation = (duration: number) => ({
  scale: [1, 1.02, 1],
  rotate: [0, 0.5, -0.5, 0],
  transition: {
    duration: duration,
    repeat: Infinity,
    ease: 'easeInOut',
  },
}) as const;

/**
 * @description A component that renders animated geometric shapes, acting as abstract avatars or background elements.
 * The colors, sizes, and animation durations are customizable via props.
 * @param {AnimatedGeometricAvatarsProps} props - The props for the component.
 * @returns {JSX.Element} The rendered animated geometric avatars.
 */
const AnimatedGeometricAvatars: React.FC<AnimatedGeometricAvatarsProps> = ({
  className = '',
  accentColor = '#D81E27',
  secondaryColor = '#FED000',
  tertiaryColor = '#5B2EFF',
  pulseDuration = 8,
}) => {
  const dynamicPulseAnimation = pulseAnimation(pulseDuration);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Semi-Circle (Top Left) */}
      <motion.svg
        className="absolute top-[-50px] left-[-50px] w-[150px] h-[150px]"
        viewBox="0 0 100 100"
        initial="initial"
        animate="animate"
        variants={shapeVariants as any}
        custom={0}
        whileInView={dynamicPulseAnimation as any}
      >
        <motion.path
          d="M 0 100 A 100 100 0 0 1 100 0 L 100 100 Z"
          fill={accentColor}
          fillOpacity="0.15"
        />
        {/* Minimalist Face: Eye 1 */}
        <motion.circle cx="30" cy="30" r="3" fill={accentColor} />
        {/* Minimalist Face: Eye 2 */}
        <motion.circle cx="50" cy="30" r="3" fill={accentColor} />
      </motion.svg>

      {/* Rounded Rectangle (Middle Right) */}
      <motion.div
        className="absolute top-[100px] right-[-30px] w-[80px] h-[40px] rounded-xl"
        style={{ backgroundColor: secondaryColor, opacity: 0.2 }}
        initial="initial"
        animate="animate"
        variants={shapeVariants as any}
        custom={1}
        whileInView={dynamicPulseAnimation as any}
      >
        {/* Minimalist Face: Mouth */}
        <motion.div className="absolute inset-0 flex items-center justify-center">
            <motion.div className="w-8 h-1 bg-white rounded-full" />
        </motion.div>
      </motion.div>

      {/* Small Circle (Bottom Left) */}
      <motion.div
        className="absolute bottom-[20px] left-[20px] w-[30px] h-[30px] rounded-full"
        style={{ backgroundColor: tertiaryColor, opacity: 0.3 }}
        initial="initial"
        animate="animate"
        variants={shapeVariants as any}
        custom={2}
        whileInView={dynamicPulseAnimation as any}
      />
    </div>
  );
};

export default AnimatedGeometricAvatars;