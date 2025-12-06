import React, { useState } from 'react';
import Button from './Button';
import { UploadedFile } from '../../types/onboarding';
import { Upload, Camera } from 'lucide-react';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onFileChange?: (file: UploadedFile | null) => Promise<void>;
  file?: UploadedFile | null;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md', className = '', onFileChange }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const uploadedFile: UploadedFile = {
          preview: base64String,
          name: selectedFile.name,
          type: selectedFile.type,
          size: selectedFile.size,
          file: selectedFile,
        };
        if (onFileChange) {
          await onFileChange(uploadedFile);
        }
        setIsLoading(false);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      if (onFileChange) {
        await onFileChange(null);
      }
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-24 w-24 text-base',
    xl: 'h-32 w-32 text-xl', // Added xl size
  };

  return (
    <div>
      <img
        className={`inline-block rounded-full ring-2 ring-white ${sizeClasses[size]} ${className}`}
        src={src || `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=random`}
        alt={alt}
        onError={(e) => {
          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=random`;
        }}
      />
      <div className="flex justify-center mt-2 space-x-2">
        {/* Upload Button (Styled as a label) */}
        <label 
          className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150 bg-sky-400 text-white hover:bg-sky-500 focus:ring-sky-300 cursor-pointer"
        >
          <Upload className="mr-1 h-4 w-4" /> Upload
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </label>
        {/* Capture Button (Using Button component) */}
        <Button size="sm" variant="secondary" className="text-gray-800 hover:bg-gray-200">
          <Camera className="mr-1 h-4 w-4" /> Capture
        </Button>
      </div>
      {isLoading && <p>Loading...</p>}
    </div>
  );
};


interface AvatarsProps {
  users: { id: string; avatarUrl?: string; name: string }[];
  maxVisible?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl'; // Added xl size
  className?: string;
  onFileChange?: (file: UploadedFile | null) => Promise<void>;
}

const Avatars: React.FC<AvatarsProps> = ({
  users,
  maxVisible = 3,
  size = 'md',
  className = '',
  onFileChange
}) => {
  const visibleUsers = users.slice(0, maxVisible);
  const remainingUsersCount = users.length - maxVisible;

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-24 w-24 text-base',
    xl: 'h-32 w-32 text-xl',
  };

  return (
    <div className={`flex -space-x-2 overflow-hidden ${className}`}>
      {visibleUsers.map((user) => (
        <Avatar key={user.id} src={user.avatarUrl} alt={user.name} size={size} onFileChange={onFileChange} />
      ))}
      {remainingUsersCount > 0 && (
       <span
          className={`flex items-center justify-center rounded-full bg-gray-200 text-gray-600 ring-2 ring-white ${sizeClasses[size]}`}
        >
          +{remainingUsersCount}
        </span>
      )}
    </div>
  );
};

export default Avatars;