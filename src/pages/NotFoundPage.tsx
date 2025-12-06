import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full text-center">
                {/* Animated 404 */}
                <div className="mb-8">
                    <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                        404
                    </h1>
                </div>

                {/* Glass Card */}
                <div className="backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl p-12 border border-white/20">
                    <div className="mb-6">
                        <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
                            <svg
                                className="w-16 h-16 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Oops! The page you're looking for seems to have wandered off.
                        Let's get you back on track.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-200"
                        >
                            <Home className="w-5 h-5" />
                            Go Home
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl shadow-md border-2 border-gray-200 hover:bg-gray-50 hover:shadow-lg hover:scale-105 transform transition-all duration-200"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Go Back
                        </button>
                    </div>
                </div>

                {/* Footer Text */}
                <p className="mt-8 text-gray-500 text-sm">
                    Error Code: 404 • Page Not Found
                </p>
            </div>
        </div>
    );
};

export default NotFoundPage;
