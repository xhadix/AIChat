// app/page.tsx

'use client';

import { useState } from 'react';
import { Message, useChat } from 'ai/react';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';

export default function Home() {
  const [toolInProgress, setToolInProgress] = useState(false);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, data } = useChat({
    onResponse: (response) => {
      setToolInProgress(false);
    },
    onFinish: () => {
      setToolInProgress(false);
    },
    onToolCall: () => {
      setToolInProgress(true);
    }
  });

  const sendMessage = (message: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
    };
    
    handleSubmit({ preventDefault: () => {} } as any, { 
      options: { 
        body: { 
          messages: [...messages, newMessage], 
          data: {}, 
        }
      } 
    });
  };

  return (
    <main className="flex flex-col h-screen">
      <div className="bg-blue-700 text-white p-4">
        <h1 className="text-xl font-bold">Supplier Risk Compliance Assistant</h1>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatWindow 
          messages={messages} 
          isLoading={isLoading} 
          toolInProgress={toolInProgress}
        />
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </main>
  );
}