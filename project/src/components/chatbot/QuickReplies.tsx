import React from 'react';
import { motion } from 'framer-motion';
import { QuickReply } from '../../types/chatbot';

interface QuickRepliesProps {
  replies: QuickReply[];
  onReplyClick: (reply: QuickReply) => void;
}

const QuickReplies: React.FC<QuickRepliesProps> = ({ replies, onReplyClick }) => {
  if (replies.length === 0) return null;

  return (
    <div className="p-3 border-t bg-gray-50">
      <div className="text-xs text-gray-500 mb-2">Quick replies:</div>
      <div className="flex flex-wrap gap-2">
        {replies.map((reply, index) => (
          <motion.button
            key={reply.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onReplyClick(reply)}
            className="bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-700 px-3 py-1 rounded-full text-xs transition-all duration-200 hover:shadow-sm"
          >
            {reply.text}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickReplies;