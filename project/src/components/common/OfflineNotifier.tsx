import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OfflineNotifier: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      setShowRestored(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowRestored(true);
      const timer = setTimeout(() => setShowRestored(false), 4000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-6 z-50 flex items-center space-x-3 bg-amber-600 text-white px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md border border-amber-500/30 text-sm font-medium"
        >
          <WifiOff className="w-5 h-5 animate-pulse text-amber-200" />
          <div>
            <p className="font-semibold">Offline Mode Active</p>
            <p className="text-xs text-amber-100">Showing cached Goa destinations & offline guide</p>
          </div>
        </motion.div>
      )}

      {!isOffline && showRestored && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-6 z-50 flex items-center space-x-3 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md border border-emerald-500/30 text-sm font-medium"
        >
          <Wifi className="w-5 h-5 text-emerald-200" />
          <div>
            <p className="font-semibold">Connection Restored</p>
            <p className="text-xs text-emerald-100">Live booking & guide chat available</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineNotifier;
