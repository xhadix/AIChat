// components/ChatWindow.tsx

import { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';

// Define our message type
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  toolInProgress: boolean;
}

export function ChatWindow({ messages, isLoading, toolInProgress }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 py-16">
          <div className="text-2xl font-semibold mb-4 text-blue-700">Compliance Assistant</div>
          <p className="text-center max-w-md text-gray-600">
            Ask me about supplier risks. I can help you search for high-risk suppliers, 
            suppliers in specific industries, or with specific risk categories.
          </p>
          <div className="mt-8 text-sm bg-blue-50 p-6 rounded-lg w-full max-w-lg">
            <div className="font-medium text-blue-800 mb-2">Example queries:</div>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                What are the top 3 suppliers with the highest risk scores?
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Show me all suppliers in the healthcare industry
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Which suppliers have financial compliance risks?
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Are there any high-risk suppliers in Europe?
              </li>
            </ul>
          </div>
        </div>
      ) : (
        messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))
      )}
      
      {isLoading && (
        <div className="flex items-center bg-gray-50 p-4 rounded-lg text-gray-600 w-fit">
          <div className="dot-flashing mr-3"></div>
          <div className="text-sm font-medium">
            {toolInProgress ? 'Searching supplier database...' : 'Thinking...'}
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}