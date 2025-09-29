"use client";
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { HeroSection } from '@/components/HeroSection';
import Footer from '@/components/footer';
import { TimelineService, TimelineEvent } from '@/lib/database';


export default function TimelinePage() {
  const [loaded, setLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchTimelineEvents() {
      try {
        setLoading(true);
        const events = await TimelineService.getAllTimelineEvents();
        setTimelineEvents(events);
        setError(null);
      } catch (err) {
        console.error('Error fetching timeline events:', err);
        setError('Failed to load timeline events. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchTimelineEvents();
  }, []);

  const filteredEvents = timelineEvents.filter(event => {
    const categoryMatch = selectedCategory === 'all' || event.category === selectedCategory;
    const priorityMatch = selectedPriority === 'all' || event.priority === selectedPriority;
    return categoryMatch && priorityMatch;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'admission': return 'bg-blue-500';
      case 'scholarship': return 'bg-blue-500';
      case 'entrance': return 'bg-blue-600';
      case 'career': return 'bg-blue-700';
      default: return 'bg-gray-500';
    }
  };

  // Checkbox color utility (force blue for checked)
  const checkboxClass = (checked: boolean) =>
    `form-checkbox h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-blue-300 ${checked ? 'bg-blue-600 checked:bg-blue-600 checked:border-blue-600' : ''}`;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-blue-500 bg-blue-50 border-blue-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const formatDaysLeft = (days: number) => {
    if (days < 0) return 'Closed';
    if (days === 0) return 'Today';
    if (days === 1) return '1 day left';
    return `${days} days left`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading timeline events...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <Navbar />
      
      <HeroSection 
        title="Academic Timeline Tracker"
        subtitle="Never miss important deadlines! Track admission dates, scholarship applications, entrance exams, and career opportunities all in one place"
        loaded={loaded}
        stats={[
          { value: timelineEvents.filter(e => e.days_left !== undefined && e.days_left <= 7).length, label: 'This Week' },
          { value: timelineEvents.filter(e => e.days_left !== undefined && e.days_left <= 30).length, label: 'This Month' },
          { value: timelineEvents.filter(e => e.category === 'scholarship').length, label: 'Scholarships' }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">

          {/* Filters */}
          <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Filter Events</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="admission">Admissions</option>
                  <option value="scholarship">Scholarships</option>
                  <option value="entrance">Entrance Exams</option>
                  <option value="career">Career Events</option>
                </select>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
            </div>
          </div>

          {/* Timeline Events */}
          <div className="space-y-6">
            {filteredEvents.map((event, index) => (
              <div 
                key={event.id}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg transition-all duration-500 hover:shadow-xl hover:scale-[1.02] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-4 h-4 ${getCategoryColor(event.category)} rounded-full mt-1 flex-shrink-0`}></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
                          {event.priority && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(event.priority)}`}>
                              {event.priority.charAt(0).toUpperCase() + event.priority.slice(1)} Priority
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{event.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            {/* Example checkbox, replace with actual checkbox logic if present */}
                            {/* <input type="checkbox" checked={someCheckedState} className={checkboxClass(someCheckedState)} readOnly /> */}
                            <span>Deadline: {event.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <span className="capitalize">{event.category.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3 min-w-[120px]">
                    <div className={`px-3 py-2 rounded-full text-sm font-medium ${
                      event.days_left !== undefined && event.days_left <= 7 
                        ? 'bg-blue-100 text-blue-800 border-2 border-blue-200' 
                        : event.days_left !== undefined && event.days_left <= 30 
                        ? 'bg-blue-50 text-blue-700 border-2 border-blue-150'
                        : 'bg-gray-100 text-gray-700 border-2 border-gray-200'
                    }`}>
                      {event.days_left !== undefined ? formatDaysLeft(event.days_left) : 'N/A'}
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        Set Reminder
                      </button>
                      {event.link && (
                        <a 
                          href={event.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Apply Now
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline placeholder */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Interactive Timeline</h3>
            <div className="text-gray-600 text-center py-12">
              <div className="text-4xl mb-4">📅</div>
              <p>Interactive timeline features are being updated.</p>
              <p className="text-sm mt-2">Enhanced timeline visualization will be available soon.</p>
            </div>
          </div>

          {/* Education timeline placeholder */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Education Timeline</h3>
            <div className="text-gray-600 text-center py-12">
              <div className="text-4xl mb-4">🎓</div>
              <p>Educational timeline features are being updated.</p>
              <p className="text-sm mt-2">Progress tracking and milestone visualization will be available soon.</p>
            </div>
          </div>

          {/* Notification Setup */}
          <div className={`bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 mt-12 text-center transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM12 17H7l5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Never Miss Another Deadline!</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Set up personalized notifications to get reminders via email, SMS, and push notifications for all your important academic dates.
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105">
              Setup Notifications
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}