import React, { useState, useRef, useEffect, useCallback } from 'react';

interface SlideToConfirmProps {
  onConfirm: () => void;
  text?: string;
  confirmText?: string;
  resetAfterConfirm?: boolean;
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'success' | 'danger' | 'checkout';
}

const SlideToConfirm: React.FC<SlideToConfirmProps> = ({
  onConfirm,
  text = 'Slide to confirm',
  confirmText = 'Confirmed!',
  resetAfterConfirm = true,
  disabled = false,
  className = '',
  variant = 'primary',
}) => {
  const baseColors = {
    primary: { bg: 'bg-sky-400', fill: 'bg-sky-400', handle: 'text-sky-400', confirmedFill: 'bg-gradient-to-r from-green-400 to-blue-500' },
    success: { bg: 'bg-green-700/70', fill: 'bg-green-500', handle: 'text-green-500', confirmedFill: 'bg-gradient-to-r from-green-400 to-blue-500' },
    danger: { bg: 'bg-red-700/70', fill: 'bg-red-500', handle: 'text-red-500', confirmedFill: 'bg-gradient-to-r from-green-400 to-blue-500' },
    checkout: { bg: 'bg-red-700/70', fill: 'bg-red-500', handle: 'text-red-500', confirmedFill: 'bg-gradient-to-r from-red-600 to-red-800' },
  };

  const colors = baseColors[variant];

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [slideWidth, setSlideWidth] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  // Define handlers using useCallback to ensure they have stable references and access to latest props/state
  const handleMouseUp = useCallback(() => {
    setIsSliding(false);
    // Handlers will be managed by useEffect
    if (!isConfirmed) {
      setSlideWidth(0); // Snap back if not fully confirmed
    }
  }, [isConfirmed]);

  const handleTouchEnd = useCallback(() => {
    setIsSliding(false);
    // Handlers will be managed by useEffect
    if (!isConfirmed) {
      setSlideWidth(0);
    }
  }, [isConfirmed]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isSliding || !sliderRef.current || !handleRef.current) return;

    const sliderRect = sliderRef.current.getBoundingClientRect();
    const newSlideWidth = event.clientX - sliderRect.left;

    if (newSlideWidth >= sliderRect.width - handleRef.current.offsetWidth / 2) {
      setSlideWidth(sliderRect.width);
      setIsConfirmed(true);
      onConfirm();
      if (resetAfterConfirm) {
        setTimeout(() => {
          setSlideWidth(0);
          setIsConfirmed(false);
        }, 1000); // Reset after 1 second
      }
      handleMouseUp();
    } else if (newSlideWidth <= 0) {
      setSlideWidth(0);
    } else {
      setSlideWidth(newSlideWidth);
    }
  }, [isSliding, onConfirm, resetAfterConfirm, handleMouseUp]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    event.preventDefault();
    if (!isSliding || !sliderRef.current || !handleRef.current) return;

    const sliderRect = sliderRef.current.getBoundingClientRect();
    const newSlideWidth = event.touches[0].clientX - sliderRect.left;

    if (newSlideWidth >= sliderRect.width - handleRef.current.offsetWidth / 2) {
      setSlideWidth(sliderRect.width);
      setIsConfirmed(true);
      onConfirm();
      if (resetAfterConfirm) {
        setTimeout(() => {
          setSlideWidth(0);
          setIsConfirmed(false);
        }, 1000);
      }
      handleTouchEnd();
    } else if (newSlideWidth <= 0) {
      setSlideWidth(0);
    } else {
      setSlideWidth(newSlideWidth);
    }
  }, [isSliding, onConfirm, resetAfterConfirm, handleTouchEnd]);

  const handleMouseDown = () => {
    if (disabled || isConfirmed) return;
    setIsSliding(true);
    // Handlers will be managed by useEffect
  };

  const handleTouchStart = (_event: React.TouchEvent<HTMLDivElement>) => {
    if (disabled || isConfirmed) return;
    setIsSliding(true);
    // Handlers will be managed by useEffect
  };

  useEffect(() => {
    if (isSliding) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      // Register touchmove as non-passive to allow preventDefault()
      document.addEventListener('touchmove', handleTouchMove as EventListener, { passive: false });
      document.addEventListener('touchend', handleTouchEnd as EventListener);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove as EventListener);
      document.removeEventListener('mouseup', handleMouseUp as EventListener);
      document.removeEventListener('touchmove', handleTouchMove as EventListener);
      document.removeEventListener('touchend', handleTouchEnd as EventListener);
    };
  }, [isSliding, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div
      ref={sliderRef}
      className={`relative w-full h-12 ${colors.bg} rounded-full flex items-center overflow-hidden ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
    >
      <div
        className={`absolute h-full rounded-full transition-all duration-300 ease-out ${isConfirmed ? colors.confirmedFill : colors.fill
          }`}
        style={{ width: slideWidth }}
      ></div>
      <div
        ref={handleRef}
        className={`absolute h-10 w-10 rounded-full bg-white flex items-center justify-center ${colors.handle} cursor-grab active:cursor-grabbing transition-transform duration-150 z-10 ${isConfirmed ? 'text-white shadow-lg shadow-green-500/50' : 'shadow-xl'
          }`}
        style={{ transform: `translateX(${Math.max(0, slideWidth - 40)}px)` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {isConfirmed ? (
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        ) : (
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            ></path>
          </svg>
        )}
      </div>
      <span
        className={`absolute w-full text-center text-sm font-medium transition-opacity duration-300 pointer-events-none ${isConfirmed ? 'text-white opacity-0' : 'text-white opacity-100'
          }`}
      >
        {text}
      </span>
      <span
        className={`absolute w-full text-center text-sm font-medium transition-opacity duration-300 pointer-events-none ${isConfirmed ? 'text-white opacity-100' : 'text-white opacity-0'
          }`}
      >
        {confirmText}
      </span>
    </div>
  );
};

export default SlideToConfirm;