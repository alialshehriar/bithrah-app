'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Calendar, MapPin, Users, Filter, Search } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  attendees: number;
  image: string;
  category: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === 'all' || event.category === filter;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = [
    { value: 'all', label: 'الكل', icon: Filter },
    { value: 'networking', label: 'التواصل', icon: Users },
    { value: 'workshop', label: 'ورش العمل', icon: Calendar },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="w-12 h-12 text-teal-500" />
            <h1 className="text-4xl font-bold gradient-text">الفعاليات</h1>
          </div>
          <p className="text-gray-600 text-lg">
            شارك في فعاليات رواد الأعمال والمستثمرين
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card-luxury mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن فعالية..."
                className="input-luxury pr-10"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.value}
                  onClick={() => setFilter(cat.value)}
                  className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                    filter === cat.value
                      ? 'bg-gradient-to-r from-teal-500 to-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4 inline ml-1" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">جاري التحميل...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="card-luxury text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">لا توجد فعاليات</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="card-luxury hover-lift cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-teal-100 to-purple-100 rounded-xl mb-4 flex items-center justify-center">
                  <Calendar className="w-16 h-16 text-teal-500" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal-500" />
                    <span>{new Date(event.date).toLocaleDateString('ar-SA')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-teal-500" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-500" />
                    <span>{event.attendees} مشارك</span>
                  </div>
                </div>

                <button className="btn-primary w-full mt-4">
                  التسجيل في الفعالية
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
