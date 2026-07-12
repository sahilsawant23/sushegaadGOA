import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:5000/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setIsSubmitted(true);
            } else {
                setError(data.message || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            setError('Failed to connect to the server. Please check your internet connection.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="sm:mx-auto sm:w-full sm:max-w-md"
            >
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Reset your password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
            >
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {isSubmitted ? (
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">Check your email</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                We have sent a password reset link to <strong>{email}</strong>.
                            </p>
                            <div className="mt-6">
                                <Link
                                    to="/login"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100"
                                >
                                    Return to login
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                                    <div className="flex">
                                        <div className="ml-3">
                                            <p className="text-sm text-red-700">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or</span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 flex items-center justify-center gap-2">
                                <ArrowLeft className="h-4 w-4" /> Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
