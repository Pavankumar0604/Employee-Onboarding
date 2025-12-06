import React, { useEffect } from 'react';

/**
 * @description Props for the Modal component.
 */
interface ModalProps {
  /**
   * @description Whether the modal is open.
   */
  isOpen: boolean;
  /**
   * @description Callback function to close the modal.
   */
  onClose: () => void;
  /**
   * @description The title of the modal.
   */
  title: string;
  /**
   * @description The content of the modal.
   */
  children: React.ReactNode;
  /**
   * @description Optional duration for the fade-in-scale animation in milliseconds. Defaults to 300ms.
   */
  animationDuration?: number;
  /**
   * @description Optional starting scale for the fade-in-scale animation. Defaults to 0.95.
   */
  animationStartScale?: number;
}

/**
 * @description Custom hook for creating a customizable fade-in-scale animation.
 * @param {boolean} isOpen - Whether the component is open.
 * @param {number} duration - The duration of the animation in milliseconds.
 * @param {number} startScale - The starting scale of the animation.
 * @returns {React.CSSProperties} The animation styles.
 */
const useFadeInScale = (isOpen: boolean, duration: number = 300, startScale: number = 0.95): React.CSSProperties => {
  const [style, setStyle] = React.useState({
    opacity: 0,
    transform: `scale(${startScale})`,
    transition: `opacity ${duration}ms, transform ${duration}ms`,
  });

  useEffect(() => {
    if (isOpen) {
      setStyle({
        opacity: 1,
        transform: 'scale(1)',
        transition: `opacity ${duration}ms, transform ${duration}ms`,
      });
    } else {
      setStyle({
        opacity: 0,
        transform: `scale(${startScale})`,
        transition: `opacity ${duration}ms, transform ${duration}ms`,
      });
    }
  }, [isOpen, duration, startScale]);

  return style;
};

/**
 * @description A reusable modal component with a customizable fade-in-scale animation.
 * @param {ModalProps} props - The props for the Modal component.
 * @returns {JSX.Element | null} The rendered Modal component or null if closed.
 */
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, animationDuration, animationStartScale }: ModalProps) => {
  const animationDurationValue = animationDuration !== undefined ? animationDuration : 300;
  const animationStartScaleValue = animationStartScale !== undefined ? animationStartScale : 0.95;
  
  const modalStyle = useFadeInScale(isOpen, animationDurationValue, animationStartScaleValue);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 transition-opacity duration-300 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full transform transition-transform duration-300 flex flex-col max-h-[80vh]" style={modalStyle}>
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <div className="overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;