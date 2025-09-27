# TechTitans512 - Technical Architecture Documentation 🏗️

A comprehensive guide to understanding the technical architecture, backend logic, authentication flow, animations system, and API integrations of the Career Guidance Platform.

## 📋 Table of Contents

1. [Tech Stack Overview](#tech-stack-overview)
2. [Authentication System](#authentication-system)
3. [Backend Architecture](#backend-architecture)
4. [Database Design](#database-design)
5. [API Routes & Requests](#api-routes--requests)
6. [Animation System](#animation-system)
7. [D3.js Visualization System](#d3js-visualization-system)
8. [AI Integration](#ai-integration)
9. [Data Flow Diagrams](#data-flow-diagrams)
10. [Performance Optimization](#performance-optimization)

---

## 🛠️ Tech Stack Overview

### Frontend Technologies
```mermaid
graph TD
    A[Next.js 15] --> B[React 18]
    A --> C[TypeScript]
    A --> D[Tailwind CSS 4]
    B --> E[Framer Motion]
    B --> F[D3.js v7]
    C --> G[Type Safety]
    D --> H[Responsive Design]
```

| Technology | Version | Purpose | Key Features |
|------------|---------|---------|--------------|
| **Next.js** | 15.5.3 | React Framework | App Router, SSR, API Routes |
| **TypeScript** | 5.x | Type Safety | Static typing, IntelliSense |
| **Tailwind CSS** | 4.x | Styling | Utility-first, responsive |
| **Framer Motion** | 11.x | Animations | Smooth transitions, gestures |
| **D3.js** | 7.x | Data Visualization | Interactive charts, networks |

### Backend & Infrastructure
```mermaid
graph LR
    A[Supabase] --> B[PostgreSQL]
    A --> C[Authentication]
    A --> D[Real-time]
    A --> E[Storage]
    F[AI APIs] --> G[OpenAI]
    F --> H[Mistral AI]
    F --> I[Hugging Face]
```

| Service | Purpose | Integration |
|---------|---------|-------------|
| **Supabase** | Backend-as-a-Service | Database, Auth, Real-time |
| **PostgreSQL** | Primary Database | Relational data storage |
| **OpenAI** | AI Chat | GPT models for conversations |
| **Mistral AI** | AI Alternative | European AI provider |
| **Vercel** | Deployment | Serverless hosting |

---

## 🔐 Authentication System

### Authentication Flow Diagram

```mermaid
sequenceDiagram
    participant C as Client
    participant A as AuthContext
    participant S as Supabase
    participant DB as Database

    C->>A: Login Request
    A->>S: auth.signInWithPassword()
    S->>DB: Verify Credentials
    DB-->>S: User Data
    S-->>A: Session Token
    A->>A: Store Session
    A-->>C: User Object
    
    Note over C,DB: Session Persisted in localStorage
    
    C->>A: API Request
    A->>A: Get Session Token
    A->>S: Include Authorization Header
    S->>DB: Authenticated Query
    DB-->>S: Data Response
    S-->>A: Response
    A-->>C: Data
```

### Authentication Implementation

#### 1. **AuthContext Setup**
```typescript
// src/contexts/AuthContext.tsx
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {}
});

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

#### 2. **Session Management**
```typescript
// Authentication state listener
useEffect(() => {
  const getInitialSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    setLoading(false);
  };

  // Listen for auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    }
  );

  return () => subscription.unsubscribe();
}, []);
```

#### 3. **Protected Routes**
```typescript
// Middleware for protected pages
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
};
```

### Row Level Security (RLS)

```sql
-- Enable RLS on user_profiles table
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can only access their own profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);
```

---

## 🏗️ Backend Architecture

### System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Side"
        A[Next.js App] --> B[React Components]
        B --> C[AuthContext]
        B --> D[API Calls]
    end
    
    subgraph "API Layer"
        E[/api/user-profile] --> F[Authentication Check]
        G[/api/chat] --> H[AI Processing]
        I[/api/quiz-results] --> J[Data Validation]
    end
    
    subgraph "Supabase Backend"
        K[Authentication] --> L[PostgreSQL]
        M[Real-time] --> L
        N[Row Level Security] --> L
    end
    
    subgraph "External APIs"
        O[OpenAI API]
        P[Mistral API]
        Q[Hugging Face API]
    end
    
    D --> E
    D --> G
    D --> I
    F --> K
    H --> O
    H --> P
    H --> Q
    E --> L
    G --> L
    I --> L
```

### Data Fetching Patterns

#### 1. **Server-Side Data Fetching**
```typescript
// For static data and SEO-critical pages
export async function generateStaticParams() {
  const { data: colleges } = await supabase
    .from('colleges')
    .select('id');
    
  return colleges?.map(college => ({ id: college.id })) || [];
}
```

#### 2. **Client-Side Data Fetching**
```typescript
// For dynamic, user-specific data
const [profiles, setProfiles] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchUserProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      setProfiles(data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (user) fetchUserProfiles();
}, [user]);
```

#### 3. **Real-time Data Subscriptions**
```typescript
// For live updates
useEffect(() => {
  const subscription = supabase
    .channel('user-profile-changes')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'user_profiles',
        filter: `id=eq.${user.id}`
      }, 
      (payload) => {
        console.log('Profile updated:', payload);
        setProfile(payload.new);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, [user.id]);
```

---

## 🗄️ Database Design

### Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ USER_PROFILES : has
    USERS ||--o{ QUIZ_RESULTS : takes
    USERS ||--o{ CHAT_SESSIONS : creates
    USERS ||--o{ AI_RECOMMENDATIONS : receives
    
    USER_PROFILES ||--o{ USER_SETTINGS : configures
    
    QUIZ_RESULTS }o--|| QUIZ_QUESTIONS : answers
    
    CHAT_SESSIONS ||--o{ CHAT_MESSAGES : contains
    
    COLLEGES ||--o{ COURSES : offers
    COURSES ||--o{ CAREER_PATHS : leads_to
    
    CAREER_NODES ||--o{ CAREER_LINKS : connects
    
    USERS {
        uuid id PK
        string email
        timestamp created_at
    }
    
    USER_PROFILES {
        uuid id PK
        uuid user_id FK
        string full_name
        string class_level
        jsonb interests
        text career_goals
    }
    
    QUIZ_RESULTS {
        uuid id PK
        uuid user_id FK
        string quiz_type
        jsonb answers
        jsonb results
        timestamp completed_at
    }
    
    CHAT_SESSIONS {
        uuid id PK
        uuid user_id FK
        string title
        timestamp created_at
    }
    
    CHAT_MESSAGES {
        uuid id PK
        uuid session_id FK
        string role
        text content
        timestamp sent_at
    }
```

### Table Schemas

#### 1. **User Profiles Table**
```sql
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  class_level TEXT CHECK (class_level IN ('10th', '12th', 'Graduate', 'Other')),
  interests TEXT[],
  career_goals TEXT,
  subjects_of_interest TEXT[],
  dream_college TEXT,
  preferred_stream TEXT CHECK (preferred_stream IN ('Science', 'Commerce', 'Arts', 'Vocational')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);
```

#### 2. **Quiz Results Table**
```sql
CREATE TABLE quiz_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_type TEXT NOT NULL,
  class_level TEXT,
  answers JSONB NOT NULL,
  results JSONB,
  score INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. **Career Visualization Tables**
```sql
CREATE TABLE career_nodes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('exam', 'degree', 'specialization', 'career')),
  level INTEGER NOT NULL,
  description TEXT,
  requirements TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE career_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id UUID REFERENCES career_nodes(id),
  target_id UUID REFERENCES career_nodes(id),
  relationship_type TEXT,
  strength DECIMAL(3,2) DEFAULT 1.0
);
```

---

## 🔌 API Routes & Requests

### API Architecture

```mermaid
graph TD
    A[Client Request] --> B{Route Type}
    B -->|/api/user-profile| C[Profile Management]
    B -->|/api/chat| D[AI Chat]
    B -->|/api/quiz| E[Quiz System]
    B -->|/api/recommendations| F[AI Recommendations]
    
    C --> G[Auth Check]
    D --> H[AI Provider Selection]
    E --> I[Answer Validation]
    F --> J[Personalization Logic]
    
    G --> K[Database Operation]
    H --> L[External AI API]
    I --> K
    J --> L
    
    K --> M[Response]
    L --> M
```

### 1. **User Profile API** (`/api/user-profile`)

#### Request Flow:
```typescript
// POST /api/user-profile
export async function POST(request: NextRequest) {
  // 1. Extract authorization token
  const authorization = request.headers.get('authorization');
  const token = authorization?.replace('Bearer ', '');
  
  // 2. Verify authentication
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  // 3. Parse and validate request body
  const body = await request.json();
  const profileData = { id: user.id, ...body };
  
  // 4. Database operation with RLS
  const result = await supabase
    .from('user_profiles')
    .upsert(profileData)
    .select()
    .single();
    
  // 5. Return response
  return NextResponse.json({ success: true, profile: result.data });
}
```

#### Client-Side Usage:
```typescript
const createProfile = async (profileData: ProfileData) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  const response = await fetch('/api/user-profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(profileData),
  });
  
  return await response.json();
};
```

### 2. **AI Chat API** (`/api/chat`)

#### Multi-Provider AI Integration:
```typescript
export async function POST(request: NextRequest) {
  const { message, provider = 'openai' } = await request.json();
  
  let response;
  
  switch (provider) {
    case 'openai':
      response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: message }],
        stream: true,
      });
      break;
      
    case 'mistral':
      response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral-medium',
          messages: [{ role: 'user', content: message }],
        }),
      });
      break;
  }
  
  // Return streaming response
  return new Response(response.body, {
    headers: { 'Content-Type': 'text/event-stream' }
  });
}
```

### 3. **Quiz System API** (`/api/quiz`)

#### Request Processing:
```typescript
export async function POST(request: NextRequest) {
  const { answers, quizType, classLevel } = await request.json();
  
  // 1. Validate answers against question schema
  const validAnswers = validateQuizAnswers(answers, quizType);
  
  // 2. Calculate scores and recommendations
  const results = await calculateQuizResults(validAnswers, classLevel);
  
  // 3. Store results in database
  const { data } = await supabase
    .from('quiz_results')
    .insert({
      user_id: userId,
      quiz_type: quizType,
      answers: validAnswers,
      results: results,
      score: results.totalScore,
    })
    .select()
    .single();
    
  // 4. Generate personalized recommendations
  const recommendations = await generateCareerRecommendations(results);
  
  return NextResponse.json({
    success: true,
    results: results,
    recommendations: recommendations,
  });
}
```

---

## 🎬 Animation System

### Framer Motion Architecture

```mermaid
graph TD
    A[Component Mount] --> B[Initial Animation]
    B --> C[User Interaction]
    C --> D[Gesture Recognition]
    D --> E[Animation Trigger]
    E --> F{Animation Type}
    
    F -->|Layout| G[Layout Animation]
    F -->|Gesture| H[Hover/Tap Animation]
    F -->|Transition| I[Page Transition]
    F -->|Loading| J[Loading Animation]
    
    G --> K[DOM Update]
    H --> K
    I --> K
    J --> K
    
    K --> L[Smooth Rendering]
```

### 1. **Page Transitions**

#### Layout Animations:
```typescript
// src/components/ClientLayout.tsx
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </motion.div>
  );
}
```

### 2. **Component Animations**

#### Card Hover Effects:
```typescript
const cardVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    y: 50 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: index * 0.1 // Stagger animation
    }
  },
  hover: {
    scale: 1.05,
    boxShadow: "0 20px 30px rgba(0,0,0,0.1)",
    transition: { duration: 0.3 }
  }
};

<motion.div
  variants={cardVariants}
  initial="hidden"
  animate="visible"
  whileHover="hover"
  className="career-card"
>
  {content}
</motion.div>
```

### 3. **Loading Animations**

#### Skeleton Loading:
```typescript
const SkeletonLoader = () => (
  <motion.div
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ 
      duration: 1.5, 
      repeat: Infinity,
      ease: "easeInOut" 
    }}
    className="bg-gray-200 rounded-lg h-20"
  />
);
```

### 4. **Quiz Animations**

#### Question Transitions:
```typescript
const questionVariants = {
  enter: {
    x: 300,
    opacity: 0,
  },
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: {
    x: -300,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

<AnimatePresence mode="wait">
  <motion.div
    key={currentQuestion}
    variants={questionVariants}
    initial="enter"
    animate="center"
    exit="exit"
  >
    <QuestionComponent />
  </motion.div>
</AnimatePresence>
```

---

## 📊 D3.js Visualization System

### Career Path Network Visualization

```mermaid
graph TD
    A[Data Fetch] --> B[Data Processing]
    B --> C[SVG Setup]
    C --> D[Force Simulation]
    D --> E[Node Creation]
    D --> F[Link Creation]
    E --> G[Drag Behavior]
    F --> H[Hover Effects]
    G --> I[Update Positions]
    H --> I
    I --> J[Smooth Animation]
```

### 1. **Data Structure**
```typescript
interface CareerNode {
  id: string;
  name: string;
  type: 'exam' | 'degree' | 'specialization' | 'career';
  level: number;
  x?: number;
  y?: number;
}

interface CareerLink {
  source: string;
  target: string;
  value: number;
}
```

### 2. **Force Simulation Setup**
```typescript
// src/components/CareerFlowDiagram.tsx
const simulation = d3.forceSimulation<CareerNode>(nodes)
  .force('link', d3.forceLink<CareerNode, CareerLink>(links)
    .id(d => d.id)
    .distance(100)
    .strength(0.5)
  )
  .force('charge', d3.forceManyBody().strength(-300))
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('collision', d3.forceCollide().radius(30));
```

### 3. **Interactive Features**
```typescript
// Drag behavior
const drag = d3.drag<SVGCircleElement, CareerNode>()
  .on('start', (event, d) => {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  })
  .on('drag', (event, d) => {
    d.fx = event.x;
    d.fy = event.y;
  })
  .on('end', (event, d) => {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  });

// Apply drag behavior to nodes
nodeSelection.call(drag);
```

### 4. **Real-time Updates**
```typescript
// Update visualization when data changes
useEffect(() => {
  if (!data) return;
  
  // Update nodes
  const nodeUpdate = svg.selectAll<SVGCircleElement, CareerNode>('.node')
    .data(data.nodes, d => d.id);
    
  // Enter selection
  const nodeEnter = nodeUpdate.enter()
    .append('circle')
    .attr('class', 'node')
    .attr('r', 20)
    .style('fill', d => colorScale(d.type));
    
  // Update + Enter
  nodeEnter.merge(nodeUpdate)
    .transition()
    .duration(750)
    .attr('r', d => radiusScale(d.importance));
    
  // Exit selection
  nodeUpdate.exit()
    .transition()
    .duration(300)
    .attr('r', 0)
    .remove();
    
}, [data]);
```

---

## 🤖 AI Integration

### Multi-Provider AI Architecture

```mermaid
graph TD
    A[User Message] --> B[AI Provider Selection]
    B --> C{Provider Type}
    
    C -->|OpenAI| D[GPT-4 API]
    C -->|Mistral| E[Mistral API]
    C -->|Hugging Face| F[HF Inference]
    
    D --> G[Stream Processing]
    E --> G
    F --> G
    
    G --> H[Response Chunking]
    H --> I[Real-time Display]
    
    subgraph "Context Management"
        J[Chat History]
        K[User Profile]
        L[Career Context]
    end
    
    A --> J
    J --> D
    J --> E
    J --> F
    K --> D
    K --> E
    K --> F
    L --> D
    L --> E
    L --> F
```

### 1. **OpenAI Integration**
```typescript
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function streamChatCompletion(messages: Message[]) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are a career guidance counselor helping students choose their career paths. 
                 Provide personalized advice based on their interests, skills, and academic background.`
      },
      ...messages
    ],
    stream: true,
    temperature: 0.7,
  });

  return stream;
}
```

### 2. **Streaming Response Handler**
```typescript
// Client-side streaming handler
const handleStreamingResponse = async (message: string) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, provider: 'openai' }),
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader!.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices[0]?.delta?.content;
          if (content) {
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1].content += content;
              return updated;
            });
          }
        } catch (e) {
          console.error('Parse error:', e);
        }
      }
    }
  }
};
```

### 3. **Context-Aware Responses**
```typescript
const buildContextualPrompt = (userProfile: UserProfile, chatHistory: Message[]) => {
  const context = `
    User Profile:
    - Class Level: ${userProfile.class_level}
    - Interests: ${userProfile.interests.join(', ')}
    - Career Goals: ${userProfile.career_goals}
    - Preferred Stream: ${userProfile.preferred_stream}
    
    Chat History:
    ${chatHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
  `;

  return context;
};
```

---

## 🔄 Data Flow Diagrams

### 1. **User Onboarding Flow**

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant A as Auth
    participant API as API Route
    participant DB as Database

    U->>C: Fill Profile Form
    C->>A: Check Authentication
    A-->>C: Session Valid
    C->>API: POST /api/user-profile
    API->>A: Verify Token
    A-->>API: User Verified
    API->>DB: Insert Profile Data
    DB-->>API: Success Response
    API-->>C: Profile Created
    C->>C: Redirect to Quiz
```

### 2. **Quiz Completion Flow**

```mermaid
graph TD
    A[User Starts Quiz] --> B[Load Questions]
    B --> C[Display Question]
    C --> D[User Selects Answer]
    D --> E{More Questions?}
    E -->|Yes| C
    E -->|No| F[Calculate Results]
    F --> G[Generate Recommendations]
    G --> H[Save to Database]
    H --> I[Display Results]
    I --> J[Show Career Paths]
```

### 3. **AI Chat Flow**

```mermaid
flowchart TD
    A[User Sends Message] --> B[Add to Chat History]
    B --> C[Build Context Prompt]
    C --> D[Select AI Provider]
    D --> E{Provider Available?}
    E -->|Yes| F[Send to AI API]
    E -->|No| G[Fallback Provider]
    G --> F
    F --> H[Stream Response]
    H --> I[Parse Chunks]
    I --> J[Update UI Real-time]
    J --> K[Save Complete Message]
```

---

## ⚡ Performance Optimization

### 1. **Code Splitting & Lazy Loading**
```typescript
// Dynamic imports for heavy components
const CareerVisualization = dynamic(
  () => import('@/components/CareerVisualization'),
  { 
    loading: () => <SkeletonLoader />,
    ssr: false 
  }
);

const D3Diagram = dynamic(
  () => import('@/components/D3Diagram'),
  { ssr: false }
);
```

### 2. **Caching Strategy**
```typescript
// React Query for API caching
const { data: userProfile, isLoading } = useQuery({
  queryKey: ['user-profile', user?.id],
  queryFn: () => fetchUserProfile(user.id),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  enabled: !!user?.id,
});

// Supabase real-time with selective updates
const subscription = supabase
  .channel('profile-changes')
  .on('postgres_changes', 
    { 
      event: 'UPDATE', 
      schema: 'public', 
      table: 'user_profiles',
      filter: `id=eq.${user.id}`
    }, 
    (payload) => {
      queryClient.setQueryData(['user-profile', user.id], payload.new);
    }
  )
  .subscribe();
```

### 3. **Bundle Optimization**
```javascript
// next.config.js
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'd3',
      '@supabase/supabase-js'
    ],
  },
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        d3: {
          test: /[\\/]node_modules[\\/]d3/,
          name: 'd3-bundle',
          chunks: 'all',
        },
      },
    };
    return config;
  },
};
```

### 4. **Database Optimization**
```sql
-- Indexes for better query performance
CREATE INDEX CONCURRENTLY idx_user_profiles_class_level ON user_profiles(class_level);
CREATE INDEX CONCURRENTLY idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX CONCURRENTLY idx_chat_messages_session_id ON chat_messages(session_id);

-- Optimize RLS policies
CREATE POLICY "optimized_profile_select" ON user_profiles
  FOR SELECT USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

---

## 🔧 Development Workflow

### 1. **Environment Setup**
```bash
# Development setup
npm install
cp .env.example .env.local
npm run db:init
npm run dev
```

### 2. **Database Migrations**
```bash
# Run Supabase migrations
npm run migrate:supabase
npm run migrate:complete
```

### 3. **Testing Strategy**
```typescript
// Component testing with Jest
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider } from '@/contexts/AuthContext';
import LoginPage from '@/app/login/page';

test('login form submission', async () => {
  render(
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  );
  
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' }
  });
  
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
  
  expect(await screen.findByText(/welcome/i)).toBeInTheDocument();
});
```

---

## 🚀 Deployment Architecture

### Production Infrastructure

```mermaid
graph TD
    A[Vercel Edge Network] --> B[Next.js App]
    B --> C[Supabase Production]
    B --> D[External AI APIs]
    
    subgraph "CDN Layer"
        E[Static Assets]
        F[Images]
        G[Fonts]
    end
    
    subgraph "Database"
        H[PostgreSQL]
        I[Real-time Engine]
        J[Authentication]
    end
    
    A --> E
    A --> F
    A --> G
    C --> H
    C --> I
    C --> J
```

### Environment Variables
```bash
# Production environment variables
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres
OPENAI_API_KEY=sk-your-openai-key
MISTRAL_API_KEY=your-mistral-key
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.com
```

---

## 📈 Monitoring & Analytics

### Performance Monitoring
```typescript
// Web Vitals tracking
export function reportWebVitals(metric: NextWebVitalsMetric) {
  switch (metric.name) {
    case 'FCP':
      // First Contentful Paint
      analytics.track('Performance', {
        metric: 'FCP',
        value: metric.value,
      });
      break;
    case 'LCP':
      // Largest Contentful Paint
      analytics.track('Performance', {
        metric: 'LCP',
        value: metric.value,
      });
      break;
    case 'CLS':
      // Cumulative Layout Shift
      analytics.track('Performance', {
        metric: 'CLS',
        value: metric.value,
      });
      break;
  }
}
```

### Error Tracking
```typescript
// Global error boundary
export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Global error:', error);
    // analytics.track('Error', { message: error.message });
  }, [error]);

  return (
    <div className="error-boundary">
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

This comprehensive technical documentation covers all aspects of the TechTitans512 Career Guidance Platform, from authentication flows to D3.js visualizations, providing a complete understanding of how the system works internally.

For specific implementation details or troubleshooting, refer to the individual component files in the codebase.