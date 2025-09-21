"use client";

import { useEffect, useState } from 'react';

/**
 * Development component to prevent browser caching
 * Only active in development mode
 */
export default function DevCacheBuster() {
  const [timestamp, setTimestamp] = useState<number | null>(null);

  useEffect(() => {
    // Set timestamp only on client side to avoid hydration mismatch
    setTimestamp(Date.now());
  }, []);

  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return;
    
    // Only proceed if we have a timestamp (client-side)
    if (!timestamp) return;

    // Update page URL with cache buster (without affecting history)
    const url = new URL(window.location.href);
    url.searchParams.set('_t', timestamp.toString());
    
    // Add meta tags to prevent caching
    const addMetaTag = (name: string, content: string) => {
      const existing = document.querySelector(`meta[${name.includes('http-equiv') ? 'http-equiv' : 'name'}="${name.replace('http-equiv=', '')}"]`);
      if (existing) {
        existing.setAttribute('content', content);
      } else {
        const meta = document.createElement('meta');
        if (name.includes('http-equiv')) {
          meta.setAttribute('http-equiv', name.replace('http-equiv=', ''));
        } else {
          meta.setAttribute('name', name);
        }
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    // Add no-cache meta tags
    addMetaTag('http-equiv=Cache-Control', 'no-cache, no-store, must-revalidate');
    addMetaTag('http-equiv=Pragma', 'no-cache');
    addMetaTag('http-equiv=Expires', '0');
    
    console.log('🔄 DevCacheBuster: Cache headers added for development');
    
  }, [timestamp]);

  // Show cache buster info in development
  if (process.env.NODE_ENV === 'development') {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '4px 8px',
        fontSize: '10px',
        zIndex: 9999,
        borderRadius: '0 0 0 4px',
        fontFamily: 'monospace'
      }}>
        DEV: {timestamp || 'Loading...'}
      </div>
    );
  }

  return null;
}