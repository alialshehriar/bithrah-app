'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Calendar, MapPin, Users, Clock, ArrowLeft, Share2,
  Heart, Check, X, Loader2, Globe, DollarSign,
  Award, Target, TrendingUp, Sparkles, Star
} from 'lucide-react';

interface Event {
  id: number;
  title: string;
  description: string;
  eventType: string;
  startDate: string;
  endDate: string;
  location: string;
  maxAttendees: number | null;
  currentAttendees: number;
  registrationFee: number | null;
  coverImage: string | null;
  status: string;
  createdAt: string;
  organizer: {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
  };
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchEventData();
  }, [eventId]);

  const fetchEventData = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      const data = await response.json();
      
      if (data.success) {
        setEvent(data.event);
        setIsRegistered(data.isRegistered || false);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setRegistering(true);
    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        setIsRegistered(true);
        if (event) {
          setEvent({
            ...event,
            currentAttendees: event.currentAttendees + 1
          });
        }
      }
    } catch (error) {
      console.error('Error registering:', error);
    } finally {
      setRegistering(false);
    }
  };

  const handleUnregister = async () => {
    setRegistering(true);
    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        setIsRegistered(false);
        if (event) {
          setEvent({
            ...event,
            currentAttendees: event.currentAttendees - 1
          });
        }
      }
    } catch (error) {
      console.error('Error unregistering:', error);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">الفعالية غير موجودة</h2>
          <Link href="/events" className="text-teal-600 hover:text-teal-700">
            العودة إلى الفعاليات
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isFull = event.maxAttendees && event.currentAttendees >= event.maxAttendees;
  const spotsLeft = event.maxAttendees ? event.maxAttendees - event.currentAttendees : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-teal-600 to-teal-800 overflow-hidden">
        {event.coverImage && (
          <img
            src={event.coverImage}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-between py-8">
          <div>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              العودة إلى الفعاليات
            </Link>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                  {event.eventType}
                </span>
                {event.status === 'active' && (
                  <span className="px-4 py-1.5 bg-green-500/20 backdrop-blur-sm rounded-full text-white text-sm font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    نشط
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {event.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDate(event.startDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{event.currentAttendees} مشارك</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">عن الفعالية</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </motion.div>

            {/* Event Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">تفاصيل الفعالية</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">تاريخ البداية</h3>
                    <p className="text-gray-600">{formatDate(event.startDate)}</p>
                    <p className="text-sm text-gray-500">{formatTime(event.startDate)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">تاريخ النهاية</h3>
                    <p className="text-gray-600">{formatDate(event.endDate)}</p>
                    <p className="text-sm text-gray-500">{formatTime(event.endDate)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">الموقع</h3>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">عدد المشاركين</h3>
                    <p className="text-gray-600">
                      {event.currentAttendees} 
                      {event.maxAttendees && ` من ${event.maxAttendees}`}
                    </p>
                  </div>
                </div>

                {event.registrationFee && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">رسوم التسجيل</h3>
                      <p className="text-gray-600">{event.registrationFee} ر.س</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-6 sticky top-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">التسجيل في الفعالية</h3>

              {spotsLeft !== null && spotsLeft > 0 && spotsLeft <= 10 && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800 font-medium">
                    ⚠️ تبقى {spotsLeft} مقاعد فقط!
                  </p>
                </div>
              )}

              {isFull ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                  <X className="w-12 h-12 text-red-600 mx-auto mb-2" />
                  <p className="text-red-800 font-semibold">الفعالية مكتملة</p>
                  <p className="text-sm text-red-600 mt-1">لا توجد مقاعد متاحة</p>
                </div>
              ) : isRegistered ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <Check className="w-12 h-12 text-green-600 mx-auto mb-2" />
                    <p className="text-green-800 font-semibold">أنت مسجل في هذه الفعالية</p>
                  </div>
                  <button
                    onClick={handleUnregister}
                    disabled={registering}
                    className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {registering ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <X className="w-5 h-5" />
                        إلغاء التسجيل
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  {registering ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      سجل الآن
                    </>
                  )}
                </button>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <Share2 className="w-5 h-5" />
                  مشاركة الفعالية
                </button>
              </div>
            </motion.div>

            {/* Organizer Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">المنظم</h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {event.organizer.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{event.organizer.name}</h4>
                  <p className="text-sm text-gray-600">@{event.organizer.username}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

