import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Clock, Sparkles } from 'lucide-react';
import Button from '../../components/ui/Button';

// Matching ReviewSubmit's SectionHeader component
const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex justify-between items-center mt-6 mb-2">
        <h3 className="text-heading-s font-medium text-gray-800 dark:text-gray-100 border-b-2 border-cyan-500 inline-block pr-2">
            {title}
        </h3>
    </div>
);

// Matching ReviewSubmit's DetailItem component
const DetailItem: React.FC<{ label: string; value?: string | number }> = ({ label, value }) => {
    return (
        <div className="my-1 flex justify-between border-b pb-1">
            <span className="font-semibold text-gray-700 dark:text-gray-300">{label}</span>
            <span className="text-gray-900 dark:text-gray-100 max-w-[60%] text-right truncate">
                {value || '-'}
            </span>
        </div>
    );
};

const SubmissionSuccessPage: React.FC = () => {
    const navigate = useNavigate();
    const [showConfetti, setShowConfetti] = useState(true);
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-8 px-4">
            {/* Confetti Animation */}
            {showConfetti && (
                <div className="confetti-container pointer-events-none">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="confetti"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                backgroundColor: ['#0ea5e9', '#06b6d4', '#8b5cf6'][i % 3],
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Main Card Container */}
            <div className="w-full max-w-4xl bg-card p-8 rounded-2xl shadow-lg">
                {/* Attractive Gradient Banner */}
                <div className="mb-8 -mt-2 -mx-2">
                    <div className="bg-gradient-to-r from-sky-500 via-cyan-500 to-sky-500 p-6 rounded-xl text-white relative overflow-hidden">
                        {/* Decorative background pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
                        </div>

                        <div className="relative flex items-center gap-4">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                                <CheckCircle className="h-10 w-10 text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Sparkles className="h-5 w-5 text-yellow-300" />
                                    <h1 className="text-2xl font-bold">Application Submitted Successfully!</h1>
                                </div>
                                <p className="text-sky-100 text-body-small">
                                    Your onboarding journey is now under review
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-6">
                    {/* Matching ReviewSubmit's max-w-3xl centered layout */}
                    <div className="max-w-3xl mx-auto pb-8">

                        {/* Submission Details */}
                        <section>
                            <SectionHeader title="Submission Details" />
                            <DetailItem label="Submitted On" value={currentDate} />
                            <DetailItem label="Status" value="Pending Review" />
                            <DetailItem label="Review Timeline" value="24-48 hours" />
                        </section>

                        {/* Next Steps */}
                        <section>
                            <SectionHeader title="Next Steps" />
                            <div className="mt-3 space-y-3">
                                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                                    <div className="flex gap-3">
                                        <span className="text-cyan-600 dark:text-cyan-400 font-bold">1.</span>
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-gray-100 text-body-small">Document Review</p>
                                            <p className="text-body-small text-gray-600 dark:text-gray-400">HR will review your documents</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                                    <div className="flex gap-3">
                                        <span className="text-cyan-600 dark:text-cyan-400 font-bold">2.</span>
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Verification</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Background check & authentication</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                                    <div className="flex gap-3">
                                        <span className="text-cyan-600 dark:text-cyan-400 font-bold">3.</span>
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Confirmation</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">You'll receive an email notification</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Important Note */}
                        <div className="mt-6 border-t pt-4">
                            <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded p-3">
                                <div className="flex gap-2">
                                    <Clock className="h-4 w-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-cyan-800 dark:text-cyan-300">
                                        <strong>Note:</strong> Check your email for updates. Verification typically takes 24-48 hours.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="mt-8">
                            <Button
                                onClick={() => navigate('/dashboard')}
                                className="w-full"
                            >
                                <Home className="h-4 w-4 mr-2" />
                                Go to Dashboard
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confetti CSS */}
            <style>{`
                .confetti-container {
                    position: fixed;
                    top: -10px;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    z-index: 1;
                }

                .confetti {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    opacity: 0;
                    animation: confetti-fall 3s linear forwards;
                }

                @keyframes confetti-fall {
                    0% {
                        opacity: 1;
                        transform: translateY(0) rotate(0deg);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(100vh) rotate(720deg);
                    }
                }
            `}</style>
        </div>
    );
};

export default SubmissionSuccessPage;
