import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../types/chatbot';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';
  
  const formatMessage = (text: string) => {
    // Convert markdown-style formatting to HTML
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      <div className={`flex items-start space-x-2 max-w-xs ${isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isBot ? 'bg-blue-600' : 'bg-gray-600'
        }`}>
          {isBot ? (
            <Bot className="h-4 w-4 text-white" />
          ) : (
            <User className="h-4 w-4 text-white" />
          )}
        </div>
        
        {/* Message Bubble */}
        <div className={`p-3 rounded-lg shadow-sm ${
          isBot 
            ? 'bg-white border border-gray-200' 
            : 'bg-blue-600 text-white'
        }`}>
          <div 
            className={`text-sm leading-relaxed ${isBot ? 'text-gray-800' : 'text-white'}`}
            dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }}
          />
          
          {/* Timestamp */}
          <div className={`text-xs mt-1 ${
            isBot ? 'text-gray-500' : 'text-blue-100'
          }`}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;