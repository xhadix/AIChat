// components/ChatWindow.tsx

import { useEffect, useRef } from 'react';
import { Message } from 'ai';
import { ChatMessage } from './ChatMessage';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  toolInProgress: boolean;
}

export function ChatWindow({
  messages,
  isLoading,
  toolInProgress,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className='flex-1 overflow-y-auto p-4 space-y-4'>
      {messages.length === 0 ? (
        <div className='flex flex-col items-center justify-center h-full text-gray-500'>
          <div className='text-2xl font-semibold mb-2'>
            Compliance Assistant
          </div>
          <p className='text-center max-w-sm'>
            Ask me about supplier risks. I can help you search for high-risk
            suppliers, suppliers in specific industries, or with specific risk
            categories.
          </p>
          <div className='mt-4 text-sm'>
            Example queries:
            <ul className='list-disc mt-2 pl-5'>
              <li>
                What are the top 3 suppliers with the highest risk scores?
              </li>
              <li>Show me all suppliers in the healthcare industry</li>
              <li>Which suppliers have financial compliance risks?</li>
            </ul>
          </div>
        </div>
      ) : (
        messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))
      )}

      {isLoading && (
        <div className='flex items-center text-gray-500'>
          <div className='dot-flashing mr-2'></div>
          {toolInProgress ? 'Searching supplier database...' : 'Thinking...'}
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
