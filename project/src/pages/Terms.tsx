import React from 'react';
import { motion } from 'framer-motion';

const Terms: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto bg-white shadow sm:rounded-lg overflow-hidden"
            >
                <div className="px-4 py-5 sm:px-6 bg-blue-600">
                    <h1 className="text-3xl font-bold text-white">Terms and Conditions</h1>
                    <p className="mt-1 max-w-2xl text-sm text-blue-100">Last updated: December 2024</p>
                </div>
                <div className="px-4 py-5 sm:p-6 space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Agreement to Terms</h2>
                        <p>
                            By accessing or using our website, looking at content, or booking a tour, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not access the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Booking and Payments</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>All bookings are subject to availability and confirmation by सुशेगादGoa.</li>
                            <li>Prices are subject to change without notice until a booking is confirmed.</li>
                            <li>Payment must be made in full at the time of booking unless otherwise stated.</li>
                            <li>We reserve the right to cancel any booking if payment is not received on time.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Cancellations and Refunds</h2>
                        <p>
                            Cancellations made more than 48 hours before the tour date are eligible for a full refund. Cancellations made within 24-48 hours may be subject to a 50% cancellation fee. No refunds will be issued for cancellations made less than 24 hours before the tour or for no-shows.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">4. User Responsibilities</h2>
                        <p>
                            You agree to provide accurate and complete information when creating an account or making a booking. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Limitation of Liability</h2>
                        <p>
                            सुशेगादGoa shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Contact Us</h2>
                        <p>
                            If you have any questions about these Terms, please contact us at info@goaexplorer.com.
                        </p>
                    </section>
                </div>
            </motion.div>
        </div>
    );
};

export default Terms;
