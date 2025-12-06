import { useState, useRef } from 'react';
import ProfilePlaceholder from './ProfilePlaceholder';
import Button from './Button';
import { UploadedFile } from '../../types/onboarding';
import { Loader2, Camera, Upload, Trash2 } from 'lucide-react';

interface AvatarUploadProps {
  avatarUrl?: string;
  name: string; // Added name prop
  onFileChange: (file: UploadedFile | null) => Promise<void>;
  size?: 'sm' | 'md' | 'lg' | 'xl'; // Add size prop
  onCaptureClick?: () => void; // New prop for capture button click
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ avatarUrl, name, onFileChange, size = 'md', onCaptureClick }) => {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result;
        event.target.value = ''; // Clear input value immediately after reading

        if (typeof result === 'string') {
          const uploadedFile: UploadedFile = {
            preview: result,
            name: selectedFile.name,
            type: selectedFile.type,
            size: selectedFile.size,
            file: selectedFile,
          };
          await onFileChange(uploadedFile);
        } else {
          // Handle case where file reading failed (result is null or ArrayBuffer)
          console.error("File reading failed or returned unexpected type:", result);
          await onFileChange(null);
        }
        setIsLoading(false);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      event.target.value = ''; // Clear input value
      await onFileChange(null);
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your profile photo?')) {
      setIsLoading(true);
      await onFileChange(null);
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-24 w-24 text-base',
    xl: 'h-32 w-32 text-xl',
  };

  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-8 w-8',
    xl: 'h-10 w-10',
  };

  const avatarSizeClass = sizeClasses[size] || sizeClasses.md;
  const iconClasses = iconSizeClasses[size] || iconSizeClasses.md;

  return (
    <>
      <div className={`relative group cursor-pointer inline-block ${avatarSizeClass}`} onClick={handleAvatarClick}>
        {avatarUrl ? (
          <img
            className={`inline-block rounded-full ring-2 ring-white ${avatarSizeClass}`}
            src={avatarUrl}
            alt={name}
          />
        ) : (
          <ProfilePlaceholder photoUrl={undefined} size={size} />
        )}

        {/* Trash Icon Overlay (Visible only if avatarUrl exists and not loading) */}
        {avatarUrl && !isLoading && (
          <div
            className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-white rounded-full p-1 shadow-md hover:bg-red-100 transition duration-150"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering file input click
              handleDelete();
            }}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </div>
        )}

        {/* Overlay for visual feedback and loading state */}
        <div className={`absolute inset-0 flex items-center justify-center rounded-full ${isLoading ? 'opacity-100 bg-black bg-opacity-50' : 'opacity-0'}`}>
          {isLoading ? (
            <Loader2 className={`${iconClasses} animate-spin text-white`} />
          ) : (
            <Camera className={`${iconClasses} text-white`} />
          )}
        </div>
        {/* The actual file input is hidden */}
        <input
          ref={fileInputRef}
          id="avatar-upload-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isLoading}
        />
      </div>

      {/* Buttons for Upload/Change and Capture */}
      <div className="flex justify-start mt-4 space-x-2">
        {/* Upload/Change Button (Styled as a label) */}
        <label
          htmlFor="avatar-upload-input"
          className={`inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150 bg-sky-400 text-white hover:bg-sky-500 focus:ring-sky-300 cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} cursor-pointer block`}
        >
          <Upload className="mr-1 h-4 w-4" /> {avatarUrl ? 'Change' : 'Upload'}
        </label>

        {/* Capture Button (Placeholder for camera functionality) */}
        <Button size="sm" variant="secondary" className="text-gray-800 hover:bg-gray-200" disabled={isLoading} onClick={onCaptureClick}>
          <Camera className="mr-1 h-4 w-4" /> Capture
        </Button>
      </div>
    </>
  );
};

export default AvatarUpload;