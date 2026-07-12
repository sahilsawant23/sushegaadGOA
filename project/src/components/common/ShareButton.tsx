import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareButtonProps {
    title: string;
    text?: string;
    url?: string;
    className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({
    title,
    text = 'Check out this amazing place in Goa!',
    url = window.location.href,
    className = ''
}) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text,
                    url
                });
            } catch (err) {
                // User cancelled or failed
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback to clipboard
            handleCopy();
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setShowTooltip(true);
            setTimeout(() => {
                setCopied(false);
                setShowTooltip(false);
            }, 2000);
        });
    };

    return (
        <div className="relative inline-block">
            <button
                onClick={handleShare}
                className={`flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur-sm hover:bg-white text-blue-600 rounded-full shadow-md transition-all duration-300 border border-blue-100 ${className}`}
                aria-label="Share"
            >
                <Share2 className="h-4 w-4" />
                <span className="font-medium text-sm">Share</span>
            </button>

            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg shadow-xl whitespace-nowrap z-50 flex items-center"
                    >
                        {copied ? <Check className="h-3 w-3 mr-1 text-green-400" /> : <Copy className="h-3 w-3 mr-1" />}
                        {copied ? 'Link Copied!' : 'Copy Link'}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ShareButton;
