export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'quick-reply' | 'tour-suggestion' | 'beach-suggestion';
  data?: any;
}

export interface QuickReply {
  id: string;
  text: string;
  action: string;
}

export interface ChatbotState {
  isOpen: boolean;
  messages: ChatMessage[];
  isTyping: boolean;
  context: string;
  userPreferences: {
    budget?: string;
    interests?: string[];
    groupSize?: number;
    duration?: string;
  };
}