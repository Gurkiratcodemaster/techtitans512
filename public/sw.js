
const CACHE_NAME = 'career-choice-v1';
const STATIC_CACHE = 'career-choice-static-v1';
const DYNAMIC_CACHE = 'career-choice-dynamic-v1';

const ESSENTIAL_FILES = [
  '/',
  '/chatbot',
  '/manifest.json',
  '/images/student1.jpg',
];

const OFFLINE_RESPONSES = {
  'engineering': {
    keywords: ['engineering', 'btech', 'jee', 'engineer'],
    response: `🎓 **Engineering Career Guidance (Offline Mode)**

**Popular Engineering Branches:**
• Computer Science - ₹4-15 LPA starting salary
• Electronics & Communication - ₹3-12 LPA  
• Mechanical Engineering - ₹3-10 LPA
• Civil Engineering - ₹3-8 LPA

**Key Entrance Exams:**
• JEE Main (NITs, IIITs)
• JEE Advanced (IITs) 
• State CETs (MHT-CET, KCET)
• BITSAT (BITS Pilani)

**Career Paths:**
• Software Developer
• Data Scientist  
• Product Manager
• Research & Development

Note: You're currently offline. For detailed guidance, please connect to the internet.`
  },
  'medical': {
    keywords: ['medical', 'doctor', 'neet', 'mbbs'],
    response: `⚕️ **Medical Career Guidance (Offline Mode)**

**NEET Exam:** National Eligibility cum Entrance Test

**Medical Courses:**
• MBBS (5.5 years) - ₹8-25+ LPA after specialization
• BDS (Dental) - ₹4-15 LPA
• BAMS (Ayurveda) - ₹3-12 LPA

**Career Options:**
• Clinical Practice
• Hospital Administration  
• Medical Research
• Public Health

Note: You're currently offline. Connect to internet for personalized advice.`
  },
  'mba': {
    keywords: ['mba', 'business', 'cat', 'management'],
    response: `💼 **MBA Career Guidance (Offline Mode)**

**MBA Entrance Exams:**
• CAT (IIMs)
• XAT (XLRI)  
• MAT, CMAT, SNAP

**Specializations & Salaries:**
• Finance - ₹8-30+ LPA
• Marketing - ₹6-25 LPA
• Operations - ₹7-20 LPA
• HR - ₹6-18 LPA

**Top Institutes:** IIMs, ISB, XLRI, FMS

Note: You're offline. For latest placement data, please connect to internet.`
  },
  'government': {
    keywords: ['government', 'upsc', 'ssc', 'banking', 'civil'],
    response: `🏛️ **Government Jobs (Offline Mode)**

**Civil Services (UPSC):**
• IAS, IPS, IFS - ₹8-15 LPA + benefits
• Age: 21-32 years

**SSC Exams:**
• SSC CGL - ₹4-8 LPA
• SSC CHSL - ₹2-4 LPA

**Banking:**
• IBPS PO - ₹4-8 LPA
• SBI PO - ₹6-10 LPA

Note: You're offline. Check internet for latest notifications.`
  },
  'default': `👋 **Career Guidance (Offline Mode)**

I'm your career assistant! Even offline, I can help with:

🎓 **Engineering:** JEE preparation, branch selection
⚕️ **Medical:** NEET guidance, MBBS information  
💼 **MBA:** CAT preparation, B-school advice
🏛️ **Government:** UPSC, SSC, Banking jobs

Try asking: "Tell me about engineering" or "How to prepare for NEET"

⚠️ **Limited Offline Mode:** For personalized advice and latest information, please connect to the internet.`
};

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching essential files...');
        return cache.addAll(ESSENTIAL_FILES);
      })
      .catch((error) => {
        console.error('Cache installation failed:', error);
      })
  );
  
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
  
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  if (request.url.includes('/api/chat')) {
    event.respondWith(handleChatRequest(request));
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseClone);
                });
            }
            return networkResponse;
          })
          .catch(() => {
            if (request.destination === 'document') {
              return caches.match('/') || new Response('Offline - Please check your connection');
            }
          });
      })
  );
});

async function handleChatRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      return networkResponse;
    }
    throw new Error('Network request failed');
    
  } catch (error) {
    try {
      const requestData = await request.json();
      const lastMessage = requestData.messages[requestData.messages.length - 1];
      const query = lastMessage?.content?.toLowerCase() || '';
      
      let response = OFFLINE_RESPONSES.default;
      
      for (const [category, data] of Object.entries(OFFLINE_RESPONSES)) {
        if (category !== 'default' && data.keywords.some(keyword => query.includes(keyword))) {
          response = data.response;
          break;
        }
      }
      
      return new Response(JSON.stringify({ answer: response }), {
        headers: {
          'Content-Type': 'application/json',
          'X-Offline-Mode': 'true'
        }
      });
      
    } catch (parseError) {
      return new Response(JSON.stringify({ 
        answer: OFFLINE_RESPONSES.default 
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}

self.addEventListener('sync', (event) => {
  if (event.tag === 'career-guidance-sync') {
    event.waitUntil(syncPendingMessages());
  }
});

async function syncPendingMessages() {
  console.log('Syncing pending messages when online...');
}