import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import LoginPage from './LoginPage.tsx';
import SignUpPage from './SignUpPage.tsx';
import ForgotPassword from './ForgotPassword.tsx';
// import AuthLayout from '../../components/auth/AuthLayout';
import logo from '../../assests/logo.png'; // Logo is now handled inside LoginPage

// Import all background images
import background1 from '../../assests/background1.jpg';
import background2 from '../../assests/background2.jpg';
import background3 from '../../assests/background3.jpg';
import background4 from '../../assests/background4.jpg';

const BACKGROUND_IMAGES = [background1, background2, background3, background4];

type AuthMode = 'login' | 'signup' | 'forgot';

/**
 * @component AuthenticationPage
 * @description Main container for the authentication flow. It manages the state
 * to switch between Login, Sign Up, and Forgot Password forms, ensuring seamless
 * navigation and a consistent layout.
 */
const AuthenticationPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Redirect authenticated users to the profile page
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/profile', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  /**
   * @function handleNavigation
   * @description Callback function passed to child components to switch the authentication mode.
   * @param newMode The target mode ('login', 'signup', or 'forgot').
   */
  const handleNavigation = useCallback((newMode: AuthMode) => {
    setMode(newMode);
  }, []);

  /**
   * @function handleBackgroundClick
   * @description Cycles to the next background image on click.
   */
  const handleBackgroundClick = useCallback(() => {
    setCurrentImageIndex(prevIndex => (prevIndex + 1) % BACKGROUND_IMAGES.length);
  }, []);

  const backgroundStyle = useMemo(() => ({
    backgroundImage: `url(${BACKGROUND_IMAGES[currentImageIndex]})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'background-image 0.5s ease-in-out',
  }), [currentImageIndex]);

  const renderForm = () => {
    switch (mode) {
      case 'login':
        return <LoginPage onNavigate={handleNavigation} />;
      case 'signup':
        return <SignUpPage onNavigate={handleNavigation} />;
      case 'forgot':
        // Use a generic AuthPage for other modes if they don't need the custom layout
        return (
          <div className="w-full max-w-xs p-4">
            <ForgotPassword onNavigate={handleNavigation} />
          </div>
        );
      default:
        return <LoginPage onNavigate={handleNavigation} />;
    }
  };

  if (loading || isAuthenticated) {
    // If loading or already authenticated (and redirect is pending in useEffect),
    // render nothing or a minimal loading state to prevent flicker/form display.
    return null;
  }

  return (
    <div
      className="relative flex items-center justify-center w-full h-screen overflow-hidden"
      style={backgroundStyle}
      onClick={handleBackgroundClick}
    >
      {/* Background Blur Overlay */}
      <div className="absolute inset-0 backdrop-blur-md bg-black/10 z-0" />

      {/* Main Auth Card Container - Mobile: Full screen stack, Desktop: Side-by-side card */}
      <div className="relative flex flex-col lg:flex-row w-full max-w-[900px] h-auto min-h-screen lg:h-auto lg:min-h-[550px] bg-zinc-900/95 lg:rounded-[20px] shadow-2xl overflow-hidden z-10 mx-4 lg:mx-0 lg:my-8">

        {/* Left Side (Welcome Panel) - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:flex lg:w-1/2 p-8 xl:p-10 flex-col justify-center items-center text-white">

          {/* Logo */}
          <div className="flex flex-col">
            <img src={logo} alt="MindMesh Logo" className="w-48 sm:w-64 h-auto" />
          </div>

          {/* Welcome Text and Tagline */}
          <div className="flex flex-col mt-auto">
            {/* Welcome Text (Ensuring white color and correct size/weight) */}
            <h1 className="text-2xl sm:text-4xl font-bold leading-tight mb-4 text-white">Welcome to the Future of Onboarding.</h1>

            {/* Tagline */}
            <p className="text-sm sm:text-base text-zinc-400">Streamlining the journey for every new member of the MindMesh family.</p>
          </div>

          {/* Copyright */}
          <div className="text-zinc-500 text-xs mt-10">© 2025 MindMesh Services. All rights reserved.</div>
        </div>

        {/* Right Side (Login Form Panel) - Full width on mobile, half on desktop */}
        <div className="w-full lg:w-1/2 py-8 px-6 sm:py-12 sm:px-10 flex flex-col items-center justify-center bg-zinc-800">
          {/* Mobile Logo - Only shown on mobile */}
          <div className="lg:hidden mb-8">
            <img src={logo} alt="MindMesh Logo" className="w-48 h-auto mx-auto" />
          </div>

          <div className="w-full max-w-sm">
            {renderForm()}
          </div>

          {/* Mobile Copyright */}
          <div className="lg:hidden text-zinc-500 text-xs mt-8 text-center">© 2025 MindMesh Services. All rights reserved.</div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPage;