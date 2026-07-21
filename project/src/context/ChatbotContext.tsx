import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatbotState, QuickReply } from '../types/chatbot';
import { generateBotResponse, welcomeMessage } from '../data/chatbotData';

interface ChatbotAction {
  type: 'TOGGLE_CHAT' | 'SEND_MESSAGE' | 'RECEIVE_MESSAGE' | 'SET_TYPING' | 'CLEAR_CHAT' | 'SET_CONTEXT';
  payload?: any;
}

const ChatbotContext = createContext<{
  state: ChatbotState;
  toggleChat: () => void;
  sendMessage: (message: string) => void;
  handleQuickReply: (reply: QuickReply) => void;
  clearChat: () => void;
} | null>(null);

const chatbotReducer = (state: ChatbotState, action: ChatbotAction): ChatbotState => {
  switch (action.type) {
    case 'TOGGLE_CHAT':
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    
    case 'SEND_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: uuidv4(),
            text: action.payload,
            sender: 'user',
            timestamp: new Date(),
            type: 'text',
          },
        ],
      };
    
    case 'RECEIVE_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: uuidv4(),
            text: action.payload.text,
            sender: 'bot',
            timestamp: new Date(),
            type: action.payload.type || 'text',
            data: action.payload.data,
          },
        ],
        isTyping: false,
      };
    
    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.payload,
      };
    
    case 'CLEAR_CHAT':
      return {
        ...state,
        messages: [
          {
            id: uuidv4(),
            text: welcomeMessage,
            sender: 'bot',
            timestamp: new Date(),
            type: 'text',
          },
        ],
      };
    
    case 'SET_CONTEXT':
      return {
        ...state,
        context: action.payload,
      };
    
    default:
      return state;
  }
};

export const ChatbotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatbotReducer, {
    isOpen: false,
    messages: [
      {
        id: uuidv4(),
        text: welcomeMessage,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text',
      },
    ],
    isTyping: false,
    context: '',
    userPreferences: {},
  });

  const toggleChat = () => {
    dispatch({ type: 'TOGGLE_CHAT' });
  };

  const sendMessage = async (message: string) => {
    // Add user message
    dispatch({ type: 'SEND_MESSAGE', payload: message });
    
    // Set typing indicator
    dispatch({ type: 'SET_TYPING', payload: true });
    
    try {
      const response = await fetch('/api/chatbot/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context: state.context })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.reply) {
          dispatch({ 
            type: 'RECEIVE_MESSAGE', 
            payload: { text: data.reply, type: 'text' } 
          });
          return;
        }
      }
    } catch (err) {
      console.log('Realtime chatbot API fallback:', err);
    }

    // Fallback to local response generator if API isn't reachable
    setTimeout(() => {
      const botResponse = generateBotResponse(message, state.context);
      dispatch({ 
        type: 'RECEIVE_MESSAGE', 
        payload: { text: botResponse, type: 'text' } 
      });
    }, 1000);
  };

  const handleQuickReply = async (reply: QuickReply) => {
    // Add user message
    dispatch({ type: 'SEND_MESSAGE', payload: reply.text });
    
    // Set typing indicator
    dispatch({ type: 'SET_TYPING', payload: true });
    
    try {
      const response = await fetch('/api/chatbot/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: reply.text, context: state.context })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.reply) {
          dispatch({ 
            type: 'RECEIVE_MESSAGE', 
            payload: { text: data.reply, type: 'text' } 
          });
          return;
        }
      }
    } catch (err) {
      console.log('Realtime chatbot quick reply fallback:', err);
    }

    // Handle specific actions fallback
    setTimeout(() => {
      let botResponse = '';
      
      switch (reply.action) {
        case 'show_tours':
          botResponse = "Here are our popular tour categories. Which type of experience interests you most?";
          break;
        case 'show_beaches':
          botResponse = "Goa has 40+ stunning beaches! Which region would you like to explore?";
          break;
        case 'show_nightlife':
          botResponse = "**Goa Nightlife Guide**\n\n**North Goa Hotspots:**\n• Tito's & Mambo's (Baga)\n• Club LPK (Calangute)\n• Curlies Beach Shack (Anjuna)\n\n**South Goa Experiences:**\n• Silent Noise Club (Unique silent disco)\n• Beach shacks in Palolem\n• Casino cruises\n\nWhat type of nightlife experience are you looking for?";
          break;
        case 'show_help':
          botResponse = "**How can I help you?**\n\n• Booking information\n• Payment methods\n• Cancellation policy\n• Contact support\n\nWhat would you like to know more about?";
          break;
        default:
          botResponse = generateBotResponse(reply.text, state.context);
      }
      
      dispatch({ 
        type: 'RECEIVE_MESSAGE', 
        payload: { text: botResponse, type: 'text' } 
      });
    }, 800);
  };

  const clearChat = () => {
    dispatch({ type: 'CLEAR_CHAT' });
  };

  return (
    <ChatbotContext.Provider value={{ state, toggleChat, sendMessage, handleQuickReply, clearChat }}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};