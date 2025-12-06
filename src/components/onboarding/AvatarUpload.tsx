import { useState, useCallback, useRef } from 'react';
import type { UploadedFile, AvatarUploadProps } from '../../types/onboarding';
import { Trash2, Loader2, Camera, Upload } from 'lucide-react';
import ProfilePlaceholder from '../ui/ProfilePlaceholder';
import { useAuthStore } from '../../store/authStore'; // Use authStore for upload/remove logic
import Button from '../ui/Button';
import CameraCaptureModal from '../ui/CameraCaptureModal';
import { useAuth } from '../../store/AuthContext';
import { useToast } from '../../hooks/useToast'; // Import useToast

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ file, onFileChange }) => {
  const { profile, user } = useAuth();
  const { uploadProfilePhoto, removeProfilePhoto } = useAuthStore(); // Use store actions
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false); // Use isUploading state

  const [uploadError, setUploadError] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    if (!user?.id) {
      setUploadError('User not authenticated.');
      return;
    }

    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setIsUploading(true);
      setUploadError('');

      const fileData: UploadedFile = {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        preview: URL.createObjectURL(selectedFile),
        file: selectedFile,
      };

      // 1. Optimistic update for preview (ProfilePage handles this via onFileChange)
      onFileChange(fileData);

      try {
        // 2. Use authStore action for upload and profile update
        const { success, message } = await uploadProfilePhoto(selectedFile);

        if (!success) {
          throw new Error(message);
        }

        showToast(message, { type: 'success' });

      } catch (error: any) {
        setUploadError(error.message || 'Upload failed.');
        showToast(error.message || 'Upload failed.', { type: 'error' });
        onFileChange(null); // Revert optimistic update on failure
      } finally {
        setIsUploading(false);
      }
    }
  }, [onFileChange, user?.id, uploadProfilePhoto, showToast]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Avatar file selected.");
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      await handleFileSelect(selectedFile); // Await the upload process
    }
    // Crucial for ensuring onChange fires even if the same file is selected again
    e.target.value = '';
  };

  const handleCapture = useCallback(async (base64Image: string, mimeType: string) => {
    const blob = await (await fetch(`data:${mimeType};base64,${base64Image}`)).blob();
    const capturedFile = new File([blob], `capture-${Date.now()}.jpg`, { type: mimeType });
    handleFileSelect(capturedFile);
  }, [handleFileSelect]);

  const handleRemove = async () => {
    if (file && user?.id) {
      URL.revokeObjectURL(file.preview);
      setUploadError('');
      setIsUploading(true);

      try {
        const { success, message } = await removeProfilePhoto();
        if (!success) {
          throw new Error(message);
        }
        showToast(message, { type: 'success' });
        onFileChange(null); // Update parent state to reflect removal
      } catch (error: any) {
        setUploadError(error.message || 'Failed to remove photo.');
        showToast(error.message || 'Failed to remove photo.', { type: 'error' });
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <>
      {isCameraOpen && <CameraCaptureModal isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} onCapture={handleCapture} captureGuidance="profile" />}
      <div className="relative">
        {isUploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full z-10">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        ) : null}
        {file?.preview ? (
          <img src={file.preview} alt="Avatar Preview" className="rounded-full h-24 w-24 object-cover" />
        ) : (
          <ProfilePlaceholder photoUrl={profile?.photo_url} className="h-24 w-24" />
        )}
        {file && !isUploading && (
          <button
            onClick={handleRemove}
            className="absolute top-0 right-0 bg-white dark:bg-gray-700 p-1 rounded-full shadow-md hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200 border border-gray-200 dark:border-gray-600"
            aria-label="Remove profile photo"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        )}
      </div>
      <input

        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: '0',
        }}
      />
      <div className="flex flex-wrap gap-2 mt-4">
        <Button
          onClick={() => {
            fileInputRef.current?.click();
          }}
          disabled={isUploading}
          className="!px-3 !py-1.5 text-sm"
          icon={<Upload className="h-4 w-4" />}
        >
          {file ? 'Change' : 'Upload'}
        </Button>
        <Button onClick={() => setIsCameraOpen(true)} disabled={isUploading} className="!px-3 !py-1.5 text-sm" icon={<Camera className="h-4 w-4" />}>
          Capture
        </Button>
      </div>
      {uploadError && <div className="text-red-600 mt-2">{uploadError}</div>}
    </>
  );
};