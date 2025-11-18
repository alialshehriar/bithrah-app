'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Search, Plus, MoreVertical, Phone, Video,
  Send, Paperclip, Smile, Image as ImageIcon, File, X,
  Check, CheckCheck, Clock, Pin, Archive, Trash2, Bell,
  BellOff, User, Users, Settings, Filter, Star, Edit3
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

interface Message {
  id: number;
  content: string;
  senderId: number;
  createdAt: Date;
  read: boolean;
  type: string;
}

interface Conversation {
  id: number;
  type: string;
  name: string | null;
  lastMessage: Message | null;
  unreadCount: number;
  updatedAt: Date;
}

export default function MessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/conversations');
      const data = await response.json();

      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: number) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`);
      const data = await response.json();

      if (data.success) {
        setMessages(data.messages);
        setParticipants(data.participants);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    try {
      const response = await fetch(`/api/conversations/${selectedConversation}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: messageInput,
          type: 'text',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages([...messages, data.message]);
        setMessageInput('');
        fetchConversations(); // Refresh conversations list
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    const name = conv.name || 'محادثة مباشرة';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffMs = now.getTime() - messageDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `${diffMins} د`;
    if (diffHours < 24) return `${diffHours} س`;
    if (diffDays < 7) return `${diffDays} يوم`;
    return messageDate.toLocaleDateString('ar-SA');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="flex h-full">
            {/* Sidebar - Conversations List */}
            <div className="w-full md:w-1/3 border-l border-gray-200 flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <MessageSquare className="w-7 h-7 text-teal-600" />
                    المحادثات
                  </h1>
                  <button
                    onClick={() => setShowNewChatModal(true)}
                    className="p-2 bg-gradient-to-r from-teal-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="بحث في المحادثات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">لا توجد محادثات</p>
                    <p className="text-gray-400 text-sm mt-2">ابدأ محادثة جديدة الآن</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredConversations.map((conversation) => (
                      <motion.div
                        key={conversation.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => setSelectedConversation(conversation.id)}
                        className={`p-4 cursor-pointer transition-all hover:bg-gray-50 ${
                          selectedConversation === conversation.id ? 'bg-teal-50 border-r-4 border-teal-600' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                              {conversation.type === 'group' ? (
                                <Users className="w-6 h-6" />
                              ) : (
                                <User className="w-6 h-6" />
                              )}
                            </div>
                            {conversation.unreadCount > 0 && (
                              <div className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {conversation.unreadCount}
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-bold text-gray-900 truncate">
                                {conversation.name || 'محادثة مباشرة'}
                              </h3>
                              <span className="text-xs text-gray-500 flex-shrink-0">
                                {formatTime(conversation.updatedAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {conversation.lastMessage?.content || 'لا توجد رسائل'}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="hidden md:flex flex-1 flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="font-bold text-gray-900">
                          {conversations.find(c => c.id === selectedConversation)?.name || 'محادثة مباشرة'}
                        </h2>
                        <p className="text-sm text-gray-500">{participants.length} مشارك</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <Phone className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <Video className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message, index) => {
                      const isOwn = message.senderId === parseInt(message.sender?.id || '0');
                      return (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex ${isOwn ? 'justify-start' : 'justify-end'}`}
                        >
                          <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                            <div
                              className={`rounded-2xl px-4 py-3 ${
                                isOwn
                                  ? 'bg-gradient-to-r from-teal-600 to-purple-600 text-white rounded-tr-none'
                                  : 'bg-gray-100 text-gray-900 rounded-tl-none'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                            </div>
                            <div className={`flex items-center gap-1 mt-1 ${isOwn ? '' : 'justify-end'}`}>
                              <span className="text-xs text-gray-500">{formatTime(message.createdAt)}</span>
                              {isOwn && (
                                message.read ? (
                                  <CheckCheck className="w-4 h-4 text-teal-600" />
                                ) : (
                                  <Check className="w-4 h-4 text-gray-400" />
                                )
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Message Input */}
                  <div className="p-6 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <Paperclip className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <ImageIcon className="w-5 h-5 text-gray-600" />
                      </button>
                      <input
                        type="text"
                        placeholder="اكتب رسالتك..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                      />
                      <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <Smile className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={sendMessage}
                        disabled={!messageInput.trim()}
                        className="p-3 bg-gradient-to-r from-teal-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <MessageSquare className="w-24 h-24 text-gray-300 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">اختر محادثة</h2>
                  <p className="text-gray-500">اختر محادثة من القائمة لبدء المراسلة</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

