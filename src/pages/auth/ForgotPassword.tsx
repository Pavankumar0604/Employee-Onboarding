import { useState } from 'react';
// Fix: Use inline type import for SubmitHandler
import { useForm, type SubmitHandler, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Mail, MailCheck } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const validationSchema = yup.object({
    email: yup.string().email('Must be a valid email').required('Email is required'),
}).defined();

interface ForgotPasswordForm {
    email: string;
}

const getFriendlyAuthError = (errorCode: string): string => {
    if (errorCode.includes('auth/user-not-found')) {
        return 'No account found with this email address.';
    }
    console.error("Unhandled auth error:", errorCode);
    return 'An unexpected error occurred. Please contact Sudhan for access.';
};

interface ForgotPasswordProps {
    onNavigate: (page: 'login' | 'signup' | 'forgot') => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigate }) => {
    const { sendPasswordReset } = useAuthStore();
    const [error, setError] = useState('');
    const [errorCode, setErrorCode] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordForm>({
        resolver: yupResolver(validationSchema) as Resolver<ForgotPasswordForm>,
    });

    const onSubmit: SubmitHandler<ForgotPasswordForm> = async (data) => {
        setError('');
        setErrorCode(null);
        const { error: resetError } = await sendPasswordReset(data.email);
        if (resetError) {
            if (resetError.message.includes('auth/unauthorized-continue-uri')) {
                setErrorCode('SD01');
            } else {
                setError(getFriendlyAuthError(resetError.message));
            }
        } else {
            setIsSubmitted(true);
        }
    };

    if (isSubmitted) {
        return (
            <div className="text-center">
                <MailCheck className="mx-auto h-12 w-12 text-blue-400" />
                <h3 className="mt-4 text-lg font-semibold text-white">Check your email</h3>
                <p className="mt-2 text-sm text-gray-300">
                    We've sent password reset instructions to the email you provided.
                </p>
                <button
                    type="button"
                    onClick={() => onNavigate('login')}
                    className="text-sm font-medium text-white/80 hover:text-white mt-4"
                >
                    &larr; Back to Login
                </button>
            </div>
        );
    }

    return (
        <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white">Forgot Password?</h3>
            <p className="text-sm text-gray-300 mt-1">No worries, we'll send you reset instructions.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
                <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="Email Address"
                        registration={register('email')}
                        error={errors.email?.message}
                        className="pl-11 !bg-white/10 !text-white !border-white/20 placeholder:!text-gray-300"
                    />
                </div>

                {errorCode && (
                    <div className="text-sm text-red-300 text-center bg-red-900/50 p-4 rounded-lg space-y-2 border border-red-500/50">
                        <p>We’re sorry, something went wrong while processing your request.</p>
                        <p className="mt-2">Please contact our software support team and share the following code for faster assistance:</p>
                        <p className="font-bold text-base text-white mt-2">Error Code: {errorCode}</p>
                        <p className="mt-4">Thank you for your patience.<br/>– Paradigm FMS Support Team</p>
                    </div>
                )}
                {error && !errorCode && <p className="text-sm text-red-400 text-center">{error}</p>}

                <div>
                    <Button type="submit" className="w-full mt-2 bg-blue-400" loading={isSubmitting} size="lg">
                        Send Reset Link
                    </Button>
                </div>

                <div className="text-center mt-4">
                    <button
                        type="button"
                        onClick={() => onNavigate('login')}
                        className="text-sm font-medium text-white/80 hover:text-white"
                    >
                        &larr; Back to Login
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;