import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { signIn, signInWithGoogle } from '../../services/authService';
import { useToast } from '../../hooks/useToast';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import googleLogo from '../../assests/google-logo.png';
import { useAuth } from '../../store/AuthContext'; // Import useAuth

// Inline spinner for button loading state
const InlineLoadingSpinner: React.FC = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mx-auto"></div>
);

// --- Types ---
interface LoginFormInputs {
  email: string;
  password: string;
}

// --- Validation Schema ---
const loginSchema = yup.object().shape({
  email: yup.string().email('Must be a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

// --- Component ---
interface LoginPageProps {
  onNavigate: (page: 'login' | 'signup' | 'forgot') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth(); // Use isAuthenticated from context

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);
    console.log('LoginPage: onSubmit - data:', data);
    try {
      const { error } = await signIn(data);
      console.log('LoginPage: onSubmit - signIn result:', { error });

      if (error) {
        // Handle specific Supabase errors if needed, otherwise show generic error
        showToast(error.message || 'An unexpected error occurred during login.', { type: 'error' });
      } else {
        // Success: AuthContext handles session update and AuthenticationPage handles redirection.
        showToast('Login Successful. Redirecting...', { type: 'success' });
      }
    } catch (e) {
      showToast('An unexpected error occurred.', { type: 'error' });
    } finally {
      // Only stop loading if authentication was not successful, 
      // otherwise the redirect will handle the state cleanup.
      if (!isAuthenticated) {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        showToast(error.message, { type: 'error' });
        setIsLoading(false);
      }
      // If no error, Supabase handles the redirect. Since this is a redirect flow, we return a successful empty response.
    } catch (e) {
      showToast('An unexpected error occurred during Google sign-in.', { type: 'error' });
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Login Form" className="flex flex-col gap-4 w-full">

        {/* Email Input */}
        <div className="flex items-center bg-white rounded-lg px-4 sm:px-5 min-h-[48px] shadow-md">
          <FaEnvelope className="text-gray-500 mr-3 flex-shrink-0" aria-hidden="true" />
          <input
            {...register('email')}
            type="email"
            placeholder="Email"
            autoComplete="email"
            aria-invalid={errors.email ? "true" : "false"}
            aria-label="Email Address"
            disabled={isLoading}
            className="flex-grow border-none outline-none text-sm sm:text-base text-gray-700 placeholder-gray-500 bg-white h-full py-3"
          />
        </div>
        {errors.email && <p className="text-red-400 text-xs sm:text-sm px-1">{errors.email.message}</p>}

        {/* Password Input */}
        <div className="flex items-center bg-white rounded-lg px-4 sm:px-5 min-h-[48px] shadow-md">
          <FaLock className="text-gray-500 mr-3 flex-shrink-0" aria-hidden="true" />
          <input
            {...register('password')}
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            aria-invalid={errors.password ? "true" : "false"}
            aria-label="Password"
            disabled={isLoading}
            className="flex-grow border-none outline-none text-sm sm:text-base text-gray-700 placeholder-gray-500 bg-white h-full py-3"
          />
        </div>
        {errors.password && <p className="text-red-400 text-xs sm:text-sm px-1">{errors.password.message}</p>}

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={isLoading}
          aria-live="polite"
          aria-label={isLoading ? "Logging in..." : "Sign In"}
          className="bg-blue-400 text-white font-semibold rounded-lg min-h-[48px] py-3 hover:bg-blue-500 disabled:opacity-50 shadow-lg transition duration-150 ease-in-out mt-2 text-sm sm:text-base"
        >
          {isLoading ? <InlineLoadingSpinner /> : 'Sign In'}
        </button>

        {/* Forgot Password Link (Below Sign In Button) */}
        <button
          type="button"
          onClick={() => onNavigate('forgot')}
          disabled={isLoading}
          aria-label="Forgot Password"
          className="text-zinc-400 text-xs sm:text-sm self-end hover:text-white transition duration-150 ease-in-out -mt-2 min-h-[44px] flex items-center"
        >
          Forgot Password?
        </button>

        {/* OR Separator */}
        <div className="flex items-center justify-center my-2">
          <div className="border-b border-zinc-600 w-full"></div>
          <span className="text-zinc-400 px-4 text-sm font-medium">OR</span>
          <div className="border-b border-zinc-600 w-full"></div>
        </div>

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          aria-label="Sign in with Google"
          className="flex items-center justify-center bg-white text-gray-700 font-semibold rounded-lg min-h-[48px] py-3 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 shadow-md transition duration-150 ease-in-out text-sm sm:text-base"
        >
          <img src={googleLogo} alt="Google logo" className="w-5 h-5 mr-3" />
          Sign in with Google
        </button>

        {/* Sign Up Link */}
        <div className="text-zinc-400 text-xs sm:text-sm text-center mt-2">
          Don't have an account? <button
            type="button"
            onClick={() => onNavigate('signup')}
            className="text-blue-400 font-semibold hover:underline min-h-[44px] inline-flex items-center"
            aria-label="Create a new account"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;