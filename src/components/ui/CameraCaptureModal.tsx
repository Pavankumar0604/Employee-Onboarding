import React, { useRef, useState, useCallback, useEffect } from 'react';
import Modal from './Modal'; // Assuming a generic Modal component exists in the same directory
import { Camera, X, Sun } from 'lucide-react';
interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string, mimeType: string) => void;
  captureGuidance?: 'profile' | 'document' | 'other';
}

const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({ isOpen, onClose, onCapture, captureGuidance }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [flashEnabled, setFlashEnabled] = useState(false);

  const toggleFlash = useCallback(() => {
    setFlashEnabled(prev => !prev);
    // TODO: Implement actual camera flash control logic here if supported by browser API
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Failed to access camera. Please ensure it's connected and permissions are granted.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const handleCapture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg'); // You can change the format
        onCapture(imageData.split(',')[1], 'image/jpeg'); // Pass base64 string and mime type
        // Delay closing the modal slightly to prevent immediate UI tear-down flicker
        setTimeout(() => {
          stopCamera();
          onClose();
        }, 200);
      }
    }
  }, [onCapture, onClose, stopCamera]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  const getGuidanceText = () => {
    switch (captureGuidance) {
      case 'profile':
        return 'Ensure your face is clearly visible within the frame.';
      case 'document':
        return 'Place the document flat and ensure all text is readable.';
      default:
        return 'Position the item clearly in front of the camera.';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => { stopCamera(); onClose(); }}
      title="Capture Photo"
    >
      <div className="flex flex-col items-center">
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className="relative w-full max-w-md aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          {!stream && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 text-white">
              Loading camera...
            </div>
          )}

          {/* Top Right Close Button (X) - Matches image */}
          <button
            onClick={() => { stopCamera(); onClose(); }}
            className="absolute top-2 right-2 p-1 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 z-20"
            aria-label="Close camera"
          >
            <X size={20} />
          </button>

          {/* Bottom Controls Area */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center z-10">
            {/* Flash Control (Sun Icon) - Bottom Left */}
            <button
              onClick={toggleFlash}
              className={`p-2 rounded-full transition-colors duration-200 ${flashEnabled ? 'text-yellow-400 bg-white bg-opacity-20' : 'text-white bg-black bg-opacity-50 hover:bg-opacity-75'}`}
              aria-label="Toggle Flash"
            >
              <Sun size={24} />
            </button>

            {/* Capture Button - Center Bottom */}
            <button
              onClick={handleCapture}
              disabled={!stream}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-150
                ${!stream
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-sky-400 hover:bg-sky-500 active:scale-95 shadow-lg'
                }
              `}
              aria-label="Capture Photo"
            >
              <Camera size={32} className="text-white" />
            </button>

            {/* Placeholder for other potential controls (e.g., flip camera) */}
            <div className="w-16 h-16"></div>
          </div>
        </div>
        {captureGuidance && <p className="text-sm text-gray-600 mt-2">{getGuidanceText()}</p>}
      </div>
    </Modal>
  );
};

export default CameraCaptureModal;