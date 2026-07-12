import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${theme === 'dark'
                    ? 'bg-gray-800 text-yellow-500 hover:bg-gray-700'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
            aria-label="Toggle Dark Mode"
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
            >
                {theme === 'dark' ? (
                    <Moon className="h-5 w-5" />
                ) : (
                    <Sun className="h-5 w-5" />
                )}
            </motion.div>
        </button>
    );
};

export default ThemeToggle;
