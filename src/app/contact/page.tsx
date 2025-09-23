"use client";
import { HeroSection } from "@/components/HeroSection";
import { useState, useEffect } from "react";

export default function Contact() {
  const [loaded, setLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
    
    // Reset success message after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      
      <HeroSection 
        title="Contact Us"
        subtitle="Have questions about your career journey? We're here to help you navigate your path to success."
        loaded={loaded}
      />

      <div className="pt-8 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg transform transition-all duration-500 ease-out ${
              loaded ? 'translate-x-0 opacity-100 scale-100' : '-translate-x-20 opacity-0 scale-95'
            }`} style={{ transitionDelay: '150ms' }}>
              <h2 className={`text-3xl font-bold text-gray-800 mb-6 transform transition-all duration-400 ${
                loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`} style={{ transitionDelay: '200ms' }}>Get in Touch</h2>
              
              {isSubmitted && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}
              
              <form onSubmit={handleSubmit} className={`space-y-6 transform transition-all duration-400 ${
                loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`} style={{ transitionDelay: '250ms' }}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className={`space-y-8 transition-all duration-500 ${loaded ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
              {/* Contact Details */}
              <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg transition-all duration-400 ${loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`} style={{ transitionDelay: '250ms' }}>
                <h2 className={`text-3xl font-bold text-gray-800 mb-6 transition-all duration-400 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`} style={{ transitionDelay: '300ms' }}>Contact Information</h2>
                
                <div className="space-y-6">
                  <div className={`flex items-start space-x-4 transition-all duration-400 ${loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`} style={{ transitionDelay: '350ms' }}>
                    <div className={`w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-400 ${loaded ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`} style={{ transitionDelay: '400ms' }}>
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className={`transition-all duration-400 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`} style={{ transitionDelay: '450ms' }}>
                      <h3 className="font-semibold text-gray-800">Email</h3>
                      <p className="text-gray-600">support@careerchoice.com</p>
                      <p className="text-gray-600">careers@careerchoice.com</p>
                    </div>
                  </div>

                  <div className={`flex items-start space-x-4 transition-all duration-400 ${loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`} style={{ transitionDelay: '500ms' }}>
                    <div className={`w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-400 ${loaded ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`} style={{ transitionDelay: '550ms' }}>
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className={`transition-all duration-400 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
                      <h3 className="font-semibold text-gray-800">Phone</h3>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                      <p className="text-gray-600">Mon - Fri, 9 AM - 6 PM EST</p>
                    </div>
                  </div>

                  <div className={`flex items-start space-x-4 transition-all duration-400 ${loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`} style={{ transitionDelay: '650ms' }}>
                    <div className={`w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-400 ${loaded ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`} style={{ transitionDelay: '700ms' }}>
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className={`transition-all duration-400 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`} style={{ transitionDelay: '750ms' }}>
                      <h3 className="font-semibold text-gray-800">Office</h3>
                      <p className="text-gray-600">123 Career Street</p>
                      <p className="text-gray-600">Business District, NY 10001</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg transition-all duration-400 ${loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`} style={{ transitionDelay: '800ms' }}>
                <h2 className={`text-3xl font-bold text-gray-800 mb-6 transition-all duration-400 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`} style={{ transitionDelay: '850ms' }}>Frequently Asked Questions</h2>
                
                <div className="space-y-4">
                  <div className={`transition-all duration-400 ${loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`} style={{ transitionDelay: '900ms' }}>
                    <h3 className="font-semibold text-gray-800 mb-2">How does Career Choice work?</h3>
                    <p className="text-gray-600 text-sm">Our AI-powered platform analyzes your skills, interests, and goals to provide personalized career recommendations and guidance.</p>
                  </div>
                  
                  <div className={`transition-all duration-400 ${loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`} style={{ transitionDelay: '950ms' }}>
                    <h3 className="font-semibold text-gray-800 mb-2">Is the service free?</h3>
                    <p className="text-gray-600 text-sm">We offer both free and premium tiers. Basic career guidance is free, while advanced features require a subscription.</p>
                  </div>
                  
                  <div className={`transition-all duration-400 ${loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`} style={{ transitionDelay: '1000ms' }}>
                    <h3 className="font-semibold text-gray-800 mb-2">How quickly can I expect a response?</h3>
                    <p className="text-gray-600 text-sm">We typically respond to inquiries within 24-48 hours during business days.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}