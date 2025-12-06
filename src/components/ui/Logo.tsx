import React from 'react';
import logo from '../../assests/logo.png';


interface LogoProps {
  className?: string;
  imgClassName?: string;
  imgStyle?: React.CSSProperties;
}

const Logo: React.FC<LogoProps> = ({ className, imgClassName, imgStyle }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <img src={logo} alt="App Logo" className={`${imgClassName || ''}`} style={imgStyle} />
    </div>
  );
};

export default Logo;