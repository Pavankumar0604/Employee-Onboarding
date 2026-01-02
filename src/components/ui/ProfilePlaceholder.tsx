import React from 'react';


interface ProfilePlaceholderProps {
  photoUrl?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const ProfilePlaceholder: React.FC<ProfilePlaceholderProps> = ({
  photoUrl,
  size = 'md',
  className = '',
}) => {
  const [imageError, setImageError] = React.useState(false);

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-32 w-32 text-xl',
  };

  // Reset error state when photoUrl changes
  React.useEffect(() => {
    setImageError(false);
  }, [photoUrl]);

  const showPlaceholder = !photoUrl || imageError;

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full border border-gray-200 bg-beige-100 text-gray-700 font-medium ${sizeClasses[size]} ${className}`}
    >
      {!showPlaceholder ? (
        <img
          src={photoUrl}
          alt="Profile"
          className="rounded-full h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Head (Beige-100 background is already on the div) */}
          {/* Body (White) */}
          <path d="M50 100 C 70 100, 70 70, 50 70 C 30 70, 30 100, 50 100 Z" fill="#FFFFFF" />
          {/* Neck/Face (Tan/Beige) */}
          <circle cx="50" cy="45" r="15" fill="#E0C9A6" />
          {/* Mask (Dark Gray) */}
          <rect x="35" y="35" width="30" height="10" rx="5" fill="#343A40" />
        </svg>
      )}
    </div>
  );
};

export default ProfilePlaceholder;