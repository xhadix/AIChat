// components/ChatInput.tsx

import { FormEvent, useState } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    onSend(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4 bg-gray-50">
      <div className="flex rounded-lg border border-gray-300 overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about supplier risks..."
          className="flex-1 p-3 focus:outline-none bg-white"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className={`px-4 py-2 text-white transition-colors ${
            isLoading || !input.trim()
              ? 'bg-blue-400'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </form>
  );
}