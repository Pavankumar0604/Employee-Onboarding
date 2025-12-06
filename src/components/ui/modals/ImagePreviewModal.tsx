import React from 'react';
import Modal from '../Modal';
import { X } from 'lucide-react';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Image Preview" size="lg">
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <img 
          src={imageUrl} 
          alt="Document Preview" 
          className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-xl"
        />
      </div>
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
        aria-label="Close"
      >
        <X className="h-6 w-6" />
      </button>
    </Modal>
  );
};

export default ImagePreviewModal;