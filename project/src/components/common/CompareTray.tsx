import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { Link } from 'react-router-dom';

const CompareTray: React.FC = () => {
    const { items, removeFromCompare, clearCompare } = useCompare();

    if (items.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40 border-t border-gray-200 dark:border-gray-700 pb-safe"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 overflow-x-auto pb-2 sm:pb-0">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                Compare ({items.length}/3)
                            </span>
                            <div className="flex space-x-4">
                                {items.map((item) => (
                                    <div key={item.id} className="relative group shrink-0 w-16 h-16">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                                        />
                                        <button
                                            onClick={() => removeFromCompare(item.id)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                        <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[150px] bg-black text-white text-xs px-2 py-1 rounded truncate">
                                            {item.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 pl-4 border-l border-gray-200 dark:border-gray-700">
                            <button
                                onClick={clearCompare}
                                className="text-sm text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 whitespace-nowrap"
                            >
                                Clear All
                            </button>
                            <Link
                                to="/compare"
                                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-colors shadow-lg shadow-blue-600/20 whitespace-nowrap"
                            >
                                <span>Compare Now</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CompareTray;
