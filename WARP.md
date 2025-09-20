# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Career Choice** is a Next.js 15 application built for Indian students to discover their ideal career paths through AI-powered guidance, personalized assessments, and expert recommendations. The platform focuses on engineering, medical, and business career guidance tailored to the Indian education system.

## Development Commands

### Essential Commands
```powershell
# Install dependencies
npm install

# Start development server with Turbopack
npm run dev

# Build for production with Turbopack
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

### Development Server
- Development server runs at: `http://localhost:3000`
- Uses Turbopack for fast hot reloading
- Main chatbot accessible at: `http://localhost:3000/chatbot`

### Testing AI Chatbot
To test the chatbot functionality:
1. Ensure environment variables are set in `.env.local`
2. Start development server: `npm run dev`
3. Navigate to `http://localhost:3000/chatbot`
4. Try career guidance questions like:
   - "What careers are good after B.Tech?"
   - "How to prepare for NEET 2026?"
   - "MBA vs M.Tech for software engineers?"

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **AI Integration**: Vercel AI SDK with OpenAI GPT-3.5-turbo (primary) and Hugging Face Mistral (fallback)
- **Data Visualization**: D3.js for career path visualization
- **Authentication**: Firebase Auth (configured but not fully implemented)

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── chat/          # AI chatbot API endpoint
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Homepage with career guidance features
├── components/            # Reusable React components
│   ├── ClientLayout.tsx   # Client-side navigation wrapper
│   ├── chatbot.tsx        # AI chatbot interface with streaming
│   ├── navbar.tsx         # Navigation component
│   └── footer.tsx         # Footer component
├── data/                  # Static data and configurations
│   └── careerPathData.ts  # Career paths, degrees, and connections data
└── lib/                   # Utilities and configurations
    └── firebase.ts        # Firebase authentication setup
```

### Key Architectural Patterns

#### Client-Side Navigation
The `ClientLayout` component handles conditional rendering of navigation elements based on the current route, allowing for pages like `/login` to have a clean layout without navbar/footer.

#### AI Chat Integration
- Uses Vercel AI SDK for streaming responses
- Implements fallback strategy: OpenAI → Hugging Face → Error
- Streaming interface provides real-time typing indicators
- Chat API at `/api/chat` handles dual AI provider setup

#### Career Path Data Model
The career guidance system uses a graph-based data structure:
- **Nodes**: Degrees, exams, specializations, and career paths
- **Links**: Relationships between educational paths and career outcomes
- **Filtering**: Dynamic data filtering based on quiz results

#### Environment Configuration
AI services require environment variables:
- `OPENAI_API_KEY`: Primary AI provider (GPT-3.5-turbo)
- `HF_TOKEN`: Fallback AI provider (Hugging Face Mistral)

## Development Guidelines

### AI Chatbot Development
- The chatbot is optimized for Indian career guidance context
- System prompt includes JEE, NEET, CAT, UPSC, and other India-specific exams
- Streaming responses must handle both OpenAI and Hugging Face formats
- Always test fallback mechanisms when adding AI features

### Component Development
- Use `"use client"` directive for components requiring browser APIs
- Implement loading states and error boundaries for AI interactions
- Follow the existing animation patterns using Tailwind's transition classes
- Maintain responsive design patterns (mobile-first approach)

### API Route Development
- API routes should implement proper error handling with detailed error messages
- Use environment variable checks for AI service availability
- Implement streaming responses for better user experience
- Log API interactions for debugging (without logging sensitive data)

### Data Structure Conventions
- Career path data follows a strict TypeScript interface
- Use consistent naming: `btech-cs`, `ai-ml`, `software-engineer`
- Maintain the graph structure when adding new career paths
- Include salary ranges in Indian Rupees (₹X-Y LPA format)

### Styling Guidelines
- Use Tailwind CSS utility classes exclusively
- Extended transition durations are available: 250ms, 400ms, 600ms, 800ms, 900ms
- Extended transition delays are available: 50ms through 550ms
- Maintain the glass morphism effect pattern: `bg-white/70 backdrop-blur-sm`

### Performance Considerations
- Turbopack is enabled for both development and production builds
- Images should use Next.js Image component with proper sizing
- Implement proper loading states for AI responses
- Use React.memo for expensive components when necessary

## Environment Setup

Create a `.env.local` file with:
```env
OPENAI_API_KEY="your-openai-api-key"
HF_TOKEN="your-hugging-face-token"
```

For Firebase authentication (if implementing user features):
- Update `src/lib/firebase.ts` with actual Firebase config
- Configure Firebase project in the Firebase console

## Known Issues & Limitations

- Firebase authentication is configured but not fully integrated
- Learning Resources section is marked as "Coming Soon"
- Quiz functionality routes (`/quiz/class10`, `/quiz/class12`) are referenced but not implemented
- Career path visualization component exists but may need integration with the main flow

## AI Provider Configuration

### OpenAI Integration (Recommended)
- Model: GPT-3.5-turbo
- Streaming: Enabled for real-time responses
- Temperature: 0.7 for balanced creativity
- Max tokens: 500 for concise responses

### Hugging Face Fallback
- Model: mistralai/Mistral-7B-Instruct-v0.2
- Used when OpenAI is unavailable or not configured
- Non-streaming responses for simplicity

### System Prompt Context
The AI is configured with India-specific career guidance context including:
- Engineering entrance exams (JEE Main/Advanced, state CETs)
- Medical entrance exams (NEET, AIIMS, JIPMER)
- Business entrance exams (CAT, XAT, MAT)
- Government job preparation (UPSC, SSC, Banking)
- Indian salary expectations and career growth patterns