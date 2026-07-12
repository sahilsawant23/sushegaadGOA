import React, { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Lock, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ResetPassword: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    // Use useParams for /reset-password/:token or useSearchParams for /reset-password?token=...
    // Usually token is in URL path, but let's support both just in case
    const { token: paramToken } = useParams();
    const [searchParams] = useSearchParams();
    const token = paramToken || searchParams.get('token');

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password }),
            });

            const data = await res.json();

            if (res.ok) {
                setIsSuccess(true);
                toast.success('Password reset successfully!');
            } else {
                setError(data.message || 'Invalid or expired token.');
            }
        } catch (err) {
            setError('Failed to connect to the server.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="bg-red-50 border-l-4 border-red-400 p-4 max-w-md mx-auto w-full">
                    <p className="text-red-700">Invalid reset link. Missing token.</p>
                    <Link to="/forgot-password" className="text-red-600 font-medium mt-2 inline-block">Request a new link</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="sm:mx-auto sm:w-full sm:max-w-md"
            >
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Set new password
                </h2>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
            >
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {isSuccess ? (
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">Password Reset Complete</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Your password has been successfully updated. You can now login with your new password.
                            </p>
                            <div className="mt-6">
                                <Link
                                    to="/login"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Go to Login
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    New Password
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                                        placeholder="New password"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {isLoading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </div>
                        </form>
                    )}

                    {!isSuccess && (
                        <div className="mt-6 text-center">
                            <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 flex items-center justify-center gap-2">
                                <ArrowLeft className="h-4 w-4" /> Back to Forgot Password
                            </Link>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
