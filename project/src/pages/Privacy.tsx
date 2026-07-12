import React from 'react';
import { motion } from 'framer-motion';

const Privacy: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto bg-white shadow sm:rounded-lg overflow-hidden"
            >
                <div className="px-4 py-5 sm:px-6 bg-green-600">
                    <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
                    <p className="mt-1 max-w-2xl text-sm text-green-100">Last updated: December 2024</p>
                </div>
                <div className="px-4 py-5 sm:p-6 space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Information We Collect</h2>
                        <p>
                            We collect information you provide directly to us, such as when you create an account, book a tour, or communicate with us. This may include:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Name and contact information (email, phone number)</li>
                            <li>Billing and payment information</li>
                            <li>Travel preferences and booking history</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">2. How We Use Your Information</h2>
                        <p>
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Process your bookings and payments.</li>
                            <li>Communicate with you about your account and bookings.</li>
                            <li>Send you updates, newsletters, and promotional materials (you can opt-out at any time).</li>
                            <li>Improve our website and services.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Information Sharing</h2>
                        <p>
                            We do not sell your personal information. We may share your information with third-party service providers who help us operate our business, such as payment processors and tour operators, but only to the extent necessary to provide the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Data Security</h2>
                        <p>
                            We implement reasonable security measures to protect the security of your personal information. However, no method of transmission over the Internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Your Rights</h2>
                        <p>
                            You have the right to access, correct, or delete your personal information. You can manage your account settings directly through the website or contact us for assistance.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at privacy@goaexplorer.com.
                        </p>
                    </section>
                </div>
            </motion.div>
        </div>
    );
};

export default Privacy;
