'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, MapPin, Users, Clock, DollarSign, Video,
  Plus, Filter, Search, Grid3x3, List, Star, Ticket,
  TrendingUp, Award, Sparkles, PartyPopper, Music,
  Briefcase, GraduationCap, Heart, Zap
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Event {
  id: number;
  title: string;
  description: string;
  type: string;
  startDate: Date;
  endDate: Date;
  location: string | null;
  isOnline: boolean;
  meetingLink: string | null;
  maxAttendees: number | null;
  price: number;
  coverImage: string | null;
  status: string;
  attendeeCount: number;
  spotsLeft: number | null;
}

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const eventTypes = [
    { id: 'all', name: 'الكل', icon: Grid3x3, color: 'gray' },
    { id: 'workshop', name: 'ورشة عمل', icon: Briefcase, color: 'blue' },
    { id: 'webinar', name: 'ندوة', icon: Video, color: 'purple' },
    { id: 'conference', name: 'مؤتمر', icon: Users, color: 'teal' },
    { id: 'meetup', name: 'لقاء', icon: Heart, color: 'pink' },
    { id: 'training', name: 'تدريب', icon: GraduationCap, color: 'green' },
    { id: 'networking', name: 'تواصل', icon: Sparkles, color: 'yellow' },
    { id: 'party', name: 'حفلة', icon: PartyPopper, color: 'red' },
  ];

  const statusFilters = [
    { id: 'all', name: 'الكل' },
    { id: 'upcoming', name: 'قادمة' },
    { id: 'ongoing', name: 'جارية' },
    { id: 'past', name: 'منتهية' },
  ];

  useEffect(() => {
    fetchEvents();
  }, [selectedType, selectedStatus]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/events?type=${selectedType}&status=${selectedStatus}`
      );
      const data = await response.json();

      if (data.success) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    const eventType = eventTypes.find(t => t.id === type);
    return eventType ? eventType.icon : Calendar;
  };

  const getTypeColor = (type: string) => {
    const eventType = eventTypes.find(t => t.id === type);
    return eventType?.color || 'gray';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
    });
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <PartyPopper className="w-12 h-12 text-pink-500" />
            <h1 className="text-5xl font-black bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
              الفعاليات والحفلات
            </h1>
            <Calendar className="w-12 h-12 text-teal-500" />
          </div>
          <p className="text-gray-600 text-lg mb-6">
            اكتشف الفعاليات القادمة وسجل حضورك الآن
          </p>
          <Link href="/events/create">
            <button className="px-8 py-4 bg-gradient-to-r from-teal-600 to-purple-600 text-white rounded-2xl font-bold hover:shadow-2xl transition-all flex items-center gap-2 mx-auto">
              <Plus className="w-5 h-5" />
              إنشاء فعالية جديدة
            </button>
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-teal-500 to-cyan-500 rounded-3xl p-6 text-white shadow-2xl"
          >
            <Calendar className="w-10 h-10 mb-3" />
            <p className="text-sm opacity-90 mb-1">إجمالي الفعاليات</p>
            <p className="text-3xl font-black">{events.length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-6 text-white shadow-2xl"
          >
            <Zap className="w-10 h-10 mb-3" />
            <p className="text-sm opacity-90 mb-1">فعاليات قادمة</p>
            <p className="text-3xl font-black">
              {events.filter(e => new Date(e.startDate) > new Date()).length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl p-6 text-white shadow-2xl"
          >
            <Users className="w-10 h-10 mb-3" />
            <p className="text-sm opacity-90 mb-1">إجمالي الحضور</p>
            <p className="text-3xl font-black">
              {events.reduce((sum, e) => sum + e.attendeeCount, 0)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl p-6 text-white shadow-2xl"
          >
            <Ticket className="w-10 h-10 mb-3" />
            <p className="text-sm opacity-90 mb-1">مقاعد متاحة</p>
            <p className="text-3xl font-black">
              {events.reduce((sum, e) => sum + (e.spotsLeft || 0), 0)}
            </p>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
            {/* Search */}
            <div className="relative flex-1 w-full md:w-auto">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث عن فعالية..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
              />
            </div>

            {/* View Mode */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-teal-600 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-teal-600 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Type Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {eventTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    selectedType === type.id
                      ? 'bg-gradient-to-r from-teal-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {type.name}
                </button>
              );
            })}
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((status) => (
              <button
                key={status.id}
                onClick={() => setSelectedStatus(status.id)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  selectedStatus === status.id
                    ? 'bg-gradient-to-r from-teal-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.name}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid/List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredEvents.map((event, index) => {
            const Icon = getTypeIcon(event.type);
            const color = getTypeColor(event.type);
            const isPast = new Date(event.endDate) < new Date();
            const isOngoing = new Date(event.startDate) <= new Date() && new Date(event.endDate) >= new Date();

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => router.push(`/events/${event.id}`)}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden ${
                  isPast ? 'opacity-60' : ''
                }`}
              >
                {/* Cover Image */}
                <div className={`h-48 bg-gradient-to-br from-${color}-400 to-${color}-600 relative`}>
                  {event.coverImage ? (
                    <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className="w-20 h-20 text-white opacity-50" />
                    </div>
                  )}
                  {isOngoing && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      جارية الآن
                    </div>
                  )}
                  {event.price === 0 && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-green-500 text-white rounded-full text-sm font-bold">
                      مجاني
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-xl text-gray-900 flex-1">{event.title}</h3>
                    <Icon className={`w-6 h-6 text-${color}-600 flex-shrink-0`} />
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(event.startDate)} - {formatTime(event.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {event.isOnline ? (
                        <>
                          <Video className="w-4 h-4" />
                          <span>عبر الإنترنت</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4" />
                          <span>{event.location || 'لم يحدد'}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-900 font-medium">{event.attendeeCount} مسجل</span>
                      {event.spotsLeft !== null && (
                        <span className="text-gray-500">({event.spotsLeft} متبقي)</span>
                      )}
                    </div>
                    {event.price > 0 && (
                      <div className="flex items-center gap-1 text-teal-600 font-bold">
                        <DollarSign className="w-4 h-4" />
                        <span>{event.price} ريال</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">لا توجد فعاليات</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

