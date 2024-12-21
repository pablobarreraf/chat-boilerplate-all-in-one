'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  isCurrentUser?: boolean;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/auth/validate', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCurrentUserId(data.user.userId);
      } else {
        window.location.href = '/';
      }
    } catch (error) {
      window.location.href = '/';
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [currentUserId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/';
        return;
      }

      const response = await fetch('http://localhost:5001/messages', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/';
          return;
        }
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        return;
      }

      const processedMessages = data.map((msg: any) => ({
        ...msg,
        isCurrentUser: String(msg.sender_id) === String(currentUserId)
      }));
      
      setMessages(processedMessages);
      scrollToBottom();
    } catch (err) {
      setError('Failed to load messages');
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      const response = await fetch('http://localhost:5001/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newMessage }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/');
          return;
        }
        throw new Error('Failed to send message');
      }

      setNewMessage('');
      await fetchMessages();
    } catch (err) {
      setError('Failed to send message');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString.replace(' ', 'T'));
      return date.toLocaleTimeString();
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="p-3 text-center bg-gray-200 border-b border-gray-300">
        User ID: {currentUserId ?? 'Not logged in'}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.isCurrentUser ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                msg.isCurrentUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              <p>{msg.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {formatDate(msg.created_at)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="p-2 text-center text-red-500 bg-red-100">{error}</div>
      )}

      <form onSubmit={sendMessage} className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
