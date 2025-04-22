// components/ChatMessage.tsx

import ReactMarkdown from 'react-markdown';

// Define our message type
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] p-4 rounded-lg shadow-sm ${
          message.role === 'user'
            ? 'bg-blue-600 text-white'
            : 'bg-white border border-gray-200 text-gray-800'
        }`}
      >
        <div className={`text-xs font-semibold mb-1 ${
          message.role === 'user' ? 'text-blue-100' : 'text-blue-600'
        }`}>
          {message.role === 'user' ? 'You' : 'Assistant'}
        </div>
        <div className={`prose prose-sm ${
          message.role === 'user' ? 'prose-invert max-w-none' : 'max-w-none'
        }`}>
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}