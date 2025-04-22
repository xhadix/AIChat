// app/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';

// Define our message type
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toolInProgress, setToolInProgress] = useState(false);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Create new message object
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
    };

    // Update messages state
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);
    
    try {
      // Call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, newUserMessage],
        }),
      });

      console.log("🚀 ~ sendMessage ~ response:", response)
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Check if it's a normal response or a stream
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('text/plain')) {
        // Handle streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = '';

        if (reader) {
          setIsLoading(true);
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            assistantMessage += chunk;
            
            // Check if chunk contains tool info
            if (chunk.includes('Search result:')) {
              setToolInProgress(true);
            }
            
            // Update the assistant message as chunks come in
            setMessages((prev) => {
              const newMessages = [...prev];
              const assistantIdx = newMessages.findIndex(
                (msg) => msg.role === 'assistant' && msg.id === 'streaming'
              );
              
              if (assistantIdx !== -1) {
                // Update existing message
                newMessages[assistantIdx] = {
                  ...newMessages[assistantIdx],
                  content: assistantMessage,
                };
              } else {
                // Add new message
                newMessages.push({
                  id: 'streaming',
                  role: 'assistant',
                  content: assistantMessage,
                });
              }
              
              return newMessages;
            });
          }
          
          // Finalize the assistant message with a permanent ID
          setMessages((prev) => {
            const newMessages = [...prev];
            const assistantIdx = newMessages.findIndex(
              (msg) => msg.role === 'assistant' && msg.id === 'streaming'
            );
            
            if (assistantIdx !== -1) {
              newMessages[assistantIdx] = {
                ...newMessages[assistantIdx],
                id: `assistant-${Date.now()}`,
              };
            }
            
            return newMessages;
          });
        }
      } else {
        // Handle regular JSON response
        const data = await response.json();
        
        // Add assistant response to messages
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: data.message || 'Sorry, I encountered an error.',
          },
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, an error occurred while processing your request.',
        },
      ]);
    } finally {
      setIsLoading(false);
      setToolInProgress(false);
    }
  };

  return (
    <main className="flex flex-col h-screen bg-gray-100">
      <div className="bg-blue-700 text-white p-4 shadow-md">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold">Supplier Risk Compliance Assistant</h1>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full bg-white shadow-lg my-4 rounded-lg overflow-hidden">
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