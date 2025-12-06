import React, { CSSProperties } from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  dynamicStyle?: CSSProperties;
  onClick?: () => void;
  backgroundImage?: string;
}



const AuthLayout: React.FC<AuthLayoutProps> = ({ children, dynamicStyle, onClick, backgroundImage }) => {
  return (
    <div
      style={{
        ...dynamicStyle,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100%',
        cursor: 'pointer',
        position: 'relative',
        backgroundImage: `url(${backgroundImage || ''})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onClick={onClick}
    >
      {/* Background Overlay (Darkens the background image) */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60"></div>
      {/* Content (The form component will handle its own layout and container) */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;