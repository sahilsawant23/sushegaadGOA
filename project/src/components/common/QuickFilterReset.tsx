import React from 'react';
import { RotateCcw, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickFilterResetProps {
  activeCount: number;
  onReset: () => void;
  label?: string;
}

const QuickFilterReset: React.FC<QuickFilterResetProps> = ({
  activeCount,
  onReset,
  label = 'filters applied',
}) => {
  if (activeCount <= 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 text-blue-700 dark:text-blue-300 px-3.5 py-1.5 rounded-full text-xs font-medium shadow-sm transition-all"
      >
        <Filter className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
        <span>
          <strong className="font-semibold">{activeCount}</strong> {label}
        </span>
        <button
          onClick={onReset}
          className="flex items-center space-x-1 ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full shadow-xs hover:shadow transition-all border border-blue-200 dark:border-blue-700"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuickFilterReset;
