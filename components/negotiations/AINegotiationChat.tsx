'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Clock, CheckCircle2 } from 'lucide-react';

interface Message {
  id: number;
  senderId: number;
  message: string;
  isAiGenerated: boolean;
  createdAt: string;
}

interface SuggestedTerms {
  investmentAmount?: number;
  equity?: number;
  expectedReturn?: number;
  timeline?: string;
}

interface AINegotiationChatProps {
  negotiationId: number;
  currentUserId: number;
  projectTitle: string;
  expiresAt: string;
}

export default function AINegotiationChat({
  negotiationId,
  currentUserId,
  projectTitle,
  expiresAt
}: AINegotiationChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreementReached, setAgreementReached] = useState(false);
  const [suggestedTerms, setSuggestedTerms] = useState<SuggestedTerms | null>(null);
  const [timeRemaining, setTimeRemaining] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages
  useEffect(() => {
    loadMessages();
  }, [negotiationId]);

  // Calculate time remaining
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeRemaining('انتهت المدة');
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`${days} يوم ${hours} ساعة ${minutes} دقيقة`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await fetch(`/api/negotiations/${negotiationId}/message`);
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/negotiations/${negotiationId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          userId: currentUserId
        })
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      // Reload messages to get both user and AI messages
      await loadMessages();

      if (data.agreementReached) {
        setAgreementReached(true);
        setSuggestedTerms(data.suggestedTerms);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      alert('حدث خطأ أثناء إرسال الرسالة');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">التفاوض على: {projectTitle}</h3>
            <p className="text-sm opacity-90 flex items-center gap-2 mt-1">
              <Bot className="w-4 h-4" />
              محادثة مع صاحب المشروع (AI)
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              <span>{timeRemaining}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Agreement Banner */}
      {agreementReached && (
        <div className="p-4 bg-green-50 border-b border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <div>
              <h4 className="font-bold text-green-900">تم الوصول لاتفاق مبدئي! 🎉</h4>
              {suggestedTerms && (
                <div className="mt-2 text-sm text-green-800">
                  {suggestedTerms.investmentAmount && (
                    <p>• مبلغ الاستثمار: {suggestedTerms.investmentAmount.toLocaleString()} ريال</p>
                  )}
                  {suggestedTerms.equity && (
                    <p>• نسبة الملكية: {suggestedTerms.equity}%</p>
                  )}
                  {suggestedTerms.expectedReturn && (
                    <p>• العائد المتوقع: {suggestedTerms.expectedReturn}x</p>
                  )}
                  {suggestedTerms.timeline && (
                    <p>• الإطار الزمني: {suggestedTerms.timeline}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.senderId === currentUserId ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.isAiGenerated
                ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                : 'bg-gradient-to-br from-blue-500 to-cyan-500'
            }`}>
              {msg.isAiGenerated ? (
                <Bot className="w-5 h-5 text-white" />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>

            {/* Message Bubble */}
            <div className={`max-w-[70%] ${
              msg.senderId === currentUserId ? 'text-right' : 'text-left'
            }`}>
              <div className={`rounded-2xl px-4 py-3 ${
                msg.senderId === currentUserId
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="whitespace-pre-wrap">{msg.message}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1 px-2">
                {new Date(msg.createdAt).toLocaleTimeString('ar-SA', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="اكتب رسالتك..."
            disabled={isLoading || agreementReached}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading || agreementReached}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          💡 هذه محادثة تجريبية مع AI يتقمص دور صاحب المشروع
        </p>
      </div>
    </div>
  );
}
