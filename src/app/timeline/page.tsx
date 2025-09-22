"use client";
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { HeroSection } from '@/components/HeroSection';
import Footer from '@/components/footer';

interface TimelineEvent {
  id: string;
  title: string;
  category: 'admission' | 'scholarship' | 'entrance' | 'career';
  date: string;
  deadline: string;
  description: string;
  status: 'upcoming' | 'ongoing' | 'closed';
  daysLeft: number;
  priority: 'high' | 'medium' | 'low';
  link?: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    id: '1',
    title: 'JEE Main 2025 Registration',
    category: 'entrance',
    date: 'Dec 30, 2024',
    deadline: '2024-12-30',
    description: 'Registration for Joint Entrance Examination (Main) for admission to NITs, IIITs, and other centrally funded technical institutions.',
    status: 'upcoming',
    daysLeft: 5,
    priority: 'high',
    link: 'https://jeemain.nta.nic.in/'
  },
  {
    id: '2',
    title: 'NEET UG 2025 Application',
    category: 'entrance',
    date: 'Jan 15, 2025',
    deadline: '2025-01-15',
    description: 'Application process opens for National Eligibility cum Entrance Test for medical and dental colleges.',
    status: 'upcoming',
    daysLeft: 21,
    priority: 'high'
  },
  {
    id: '3',
    title: 'Merit-based Scholarships',
    category: 'scholarship',
    date: 'Feb 28, 2025',
    deadline: '2025-02-28',
    description: 'Various government and private merit-based scholarship applications deadline.',
    status: 'upcoming',
    daysLeft: 65,
    priority: 'medium'
  },
  {
    id: '4',
    title: 'DU UG Admission',
    category: 'admission',
    date: 'May 15, 2025',
    deadline: '2025-05-15',
    description: 'Delhi University undergraduate admission process begins for various courses.',
    status: 'upcoming',
    daysLeft: 141,
    priority: 'medium'
  },
  {
    id: '5',
    title: 'CBSE Class 12 Results',
    category: 'admission',
    date: 'May 20, 2025',
    deadline: '2025-05-20',
    description: 'Central Board of Secondary Education announces Class 12 board examination results.',
    status: 'upcoming',
    daysLeft: 146,
    priority: 'high'
  },
  {
    id: '6',
    title: 'Post Matric Scholarship',
    category: 'scholarship',
    date: 'Mar 31, 2025',
    deadline: '2025-03-31',
    description: 'Post Matric Scholarship Scheme for SC/ST/OBC students application deadline.',
    status: 'upcoming',
    daysLeft: 96,
    priority: 'medium'
  },
  {
    id: '7',
    title: 'Career Fair 2025',
    category: 'career',
    date: 'Jan 30, 2025',
    deadline: '2025-01-30',
    description: 'National Career Fair featuring top companies and educational institutions.',
    status: 'upcoming',
    daysLeft: 36,
    priority: 'low'
  },
  {
    id: '8',
    title: 'Engineering Entrance Coaching',
    category: 'career',
    date: 'Feb 10, 2025',
    deadline: '2025-02-10',
    description: 'Free coaching program registration for engineering entrance exams.',
    status: 'upcoming',
    daysLeft: 47,
    priority: 'medium'
  }
];

export default function TimelinePage() {
  const [loaded, setLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-500 bg-orange-50 border-orange-200';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <Navbar />
      
      <HeroSection 
        title="Academic Timeline Tracker"
        subtitle="Never miss important deadlines! Track admission dates, scholarship applications, entrance exams, and career opportunities all in one place"
        loaded={loaded}
        stats={[
          { value: timelineEvents.filter(e => e.daysLeft <= 7).length, label: 'This Week' },
          { value: timelineEvents.filter(e => e.daysLeft <= 30).length, label: 'This Month' },
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
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(event.priority)}`}>
                            {event.priority.toUpperCase()} PRIORITY
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{event.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
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
                      event.daysLeft <= 7 
                        ? 'bg-red-100 text-red-700 border-2 border-red-200' 
                        : event.daysLeft <= 30 
                        ? 'bg-orange-100 text-orange-700 border-2 border-orange-200'
                        : 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                    }`}>
                      {formatDaysLeft(event.daysLeft)}
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        ⏰ Remind Me
                      </button>
                      {event.link && (
                        <a 
                          href={event.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          🔗 Apply
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Notification Setup */}
          <div className={`bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 mt-12 text-center transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM12 17H7l5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Never Miss Another Deadline!</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Set up personalized notifications to get reminders via email, SMS, and push notifications for all your important academic dates.
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105">
              🔔 Setup Notifications
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}