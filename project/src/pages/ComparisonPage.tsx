import React from 'react';
import { useCompare } from '../context/CompareContext';
import { Link } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';

const ComparisonPage: React.FC = () => {
    const { items, removeFromCompare } = useCompare();

    if (items.length === 0) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">No items to compare</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Browse tours and destinations to add them to your comparison list.
                    </p>
                    <Link
                        to="/tours"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                    >
                        Browse Tours
                    </Link>
                </div>
            </div>
        );
    }

    // Determine common attributes based on item types
    const allTours = items.every(i => i.category === 'tour');

    return (
        <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <Link to="/" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Home
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Comparison</h1>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700/50">
                                <th className="p-6 text-left w-48 text-gray-500 dark:text-gray-400 font-medium">Features</th>
                                {items.map((item) => (
                                    <th key={item.id} className="p-6 text-left min-w-[250px] relative">
                                        <button
                                            onClick={() => removeFromCompare(item.id)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Remove"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                        <div className="pr-8">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-40 object-cover rounded-lg mb-4 shadow-sm"
                                            />
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.name}</h3>
                                            <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold rounded-full uppercase tracking-wide">
                                                {item.category}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            <tr>
                                <td className="p-6 font-medium text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-700/30">Price</td>
                                {items.map((item) => (
                                    <td key={item.id} className="p-6 text-gray-700 dark:text-gray-300">
                                        {item.price ? `₹${item.price.toLocaleString()}` : <span className="text-gray-400 italic">Free / Varies</span>}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-6 font-medium text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-700/30">Rating</td>
                                {items.map((item) => (
                                    <td key={item.id} className="p-6 text-gray-700 dark:text-gray-300">
                                        <div className="flex items-center">
                                            <span className="font-bold text-yellow-500 mr-1">{item.rating || 'N/A'}</span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">/ 5</span>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-6 font-medium text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-700/30">Location</td>
                                {items.map((item) => (
                                    <td key={item.id} className="p-6 text-gray-700 dark:text-gray-300">
                                        {item.location || 'Goa'}
                                    </td>
                                ))}
                            </tr>
                            {allTours && (
                                <tr>
                                    <td className="p-6 font-medium text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-700/30">Duration</td>
                                    {items.map((item) => (
                                        <td key={item.id} className="p-6 text-gray-700 dark:text-gray-300">
                                            {item.duration || 'N/A'}
                                        </td>
                                    ))}
                                </tr>
                            )}
                            <tr>
                                <td className="p-6 font-medium text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-700/30">Summary</td>
                                {items.map((item) => (
                                    <td key={item.id} className="p-6 text-gray-700 dark:text-gray-300 text-sm">
                                        {/* Placeholder for summary description if available in item object */}
                                        Typically includes guided visits, transportation, and local experiences.
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-6 font-medium text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-700/30">Action</td>
                                {items.map((item) => (
                                    <td key={item.id} className="p-6">
                                        <Link
                                            to={item.category === 'tour' ? `/tours/${item.id}` : `/destinations/beach/${item.id}`} // Basic logic, improve for other types
                                            className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                                        >
                                            View Details
                                        </Link>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ComparisonPage;
