import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signUp } from '../../services/authService';
import { SignUpFormData, SignUpFormProps } from '../../types/auth';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

// Inline spinner for button loading state
const InlineLoadingSpinner: React.FC = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mx-auto"></div>
);

export default function SignupPage({ onNavigate }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>();

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      // Pass full name and job title in metadata
      const { error } = await signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          }
        }
      });

      if (error) {
        console.error("Sign up failed:", error.message);
        setIsLoading(false);
        return;
      }

      console.log("User signed up successfully!");
      onNavigate('login');
    } catch (error: any) {
      console.error("Error during sign up:", error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">

        {/* Full Name Input */}
        <div className="flex items-center bg-white rounded-lg px-4 h-12 shadow-md">
          <FaUser className="text-gray-500 mr-3" aria-hidden="true" />
          <input
            {...register('fullName', { required: 'Full Name is required' })}
            type="text"
            placeholder="Full Name"
            disabled={isLoading}
            className="flex-grow border-none outline-none text-gray-700 placeholder-gray-500 bg-white h-full"
          />
        </div>
        {errors.fullName && <p className="text-red-400 text-sm px-1">{errors.fullName.message}</p>}



        {/* Email Input */}
        <div className="flex items-center bg-white rounded-lg px-4 h-12 shadow-md">
          <FaEnvelope className="text-gray-500 mr-3" aria-hidden="true" />
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
            })}
            type="email"
            placeholder="Email"
            autoComplete="email"
            disabled={isLoading}
            className="flex-grow border-none outline-none text-gray-700 placeholder-gray-500 bg-white h-full"
          />
        </div>
        {errors.email && <p className="text-red-400 text-sm px-1">{errors.email.message}</p>}

        {/* Password Input */}
        <div className="flex items-center bg-white rounded-lg px-4 h-12 shadow-md">
          <FaLock className="text-gray-500 mr-3" aria-hidden="true" />
          <input
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            disabled={isLoading}
            className="flex-grow border-none outline-none text-gray-700 placeholder-gray-500 bg-white h-full"
          />
        </div>
        {errors.password && <p className="text-red-400 text-sm px-1">{errors.password.message}</p>}

        {/* Confirm Password Input */}
        <div className="flex items-center bg-white rounded-lg px-4 h-12 shadow-md">
          <FaLock className="text-gray-500 mr-3" aria-hidden="true" />
          <input
            {...register('confirmPassword', {
              required: 'Confirm Password is required',
              validate: (val, formValues) => val === formValues.password || 'Passwords do not match'
            })}
            type="password"
            placeholder="Confirm Password"
            autoComplete="new-password"
            disabled={isLoading}
            className="flex-grow border-none outline-none text-gray-700 placeholder-gray-500 bg-white h-full"
          />
        </div>
        {errors.confirmPassword && <p className="text-red-400 text-sm px-1">{errors.confirmPassword.message}</p>}

        {/* Sign Up Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-400 text-white font-semibold rounded-lg h-12 hover:bg-blue-500 disabled:opacity-50 shadow-lg transition duration-150 ease-in-out mt-2"
        >
          {isLoading ? <InlineLoadingSpinner /> : 'Sign Up'}
        </button>

        {/* Log In Link */}
        <div className="text-zinc-400 text-sm text-center mt-2">
          Already have an account? <button
            type="button"
            onClick={() => onNavigate('login')}
            className="text-blue-400 font-semibold hover:underline"
          >
            Log In
          </button>
        </div>
      </form>
    </div>
  );
}
