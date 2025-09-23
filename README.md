# Career Choice App - TechTitans512 🚀

A modern, full-stack career guidance platform built with Next.js, TypeScript, Tailwind CSS, and Supabase. This app helps students make informed decisions about their career paths through AI-powered recommendations and interactive visualizations.

## ✨ Features

- **Interactive Career Path Visualization** - D3.js-powered network graphs showing relationships between degrees, exams, specializations, and careers
- **AI-Powered Chatbot** - Multi-provider AI support (OpenAI, Mistral, Hugging Face) for career guidance
- **Comprehensive User Profiles** - Detailed onboarding and profile management
- **Aptitude Testing** - Skills and career assessment quizzes
- **Personalized Recommendations** - AI-generated career, course, and college suggestions
- **Progressive Web App** - Offline support and mobile-friendly design
- **Real-time Data** - Supabase integration for scalable data management

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **D3.js** - Data visualization

### Backend & Database
- **Supabase** - PostgreSQL database, authentication, and real-time features

### AI & APIs
- **OpenAI** - GPT models for chat
- **Mistral AI** - Alternative chat provider
- **Hugging Face** - Open-source models

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account (or PostgreSQL database)
- AI API keys (optional, for chatbot)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd techtitans512
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
DATABASE_URL="your-database-url"

# AI APIs (optional)
OPENAI_API_KEY="your-openai-key"
MISTRAL_API_KEY="your-mistral-key"
HF_TOKEN="your-huggingface-token"
```

4. **Set up the database**
```bash
# Initialize with sample data
npm run db:init
```

5. **Migrate career data to Supabase**
```bash
npm run migrate:supabase
```

6. **Start the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/                   # Next.js App Router pages
│   ├── api/              # API routes
│   │   └── chat/         # Chat API endpoint
│   ├── about/            # About page
│   ├── career-paths/     # Career exploration
│   ├── chatbot/          # AI chat interface
│   ├── colleges/         # College information
│   ├── login/            # Authentication
│   ├── onboarding/       # User onboarding flow
│   ├── profile/          # User profile
│   ├── quiz/             # Aptitude tests
│   ├── recommendations/  # AI recommendations
│   └── settings/         # User settings
├── components/           # Reusable React components
│   ├── CareerPathVisualization.tsx
│   ├── ClientLayout.tsx
│   ├── navbar.tsx
│   └── ...
├── contexts/            # React contexts
│   └── AuthContext.tsx
├── lib/                 # Utility libraries
│   └── supabaseClient.ts  # Supabase client & services
└── scripts/             # Migration scripts
    └── migrate-to-supabase.ts
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:

- **UserProfile** - User information and preferences
- **UserSettings** - App preferences and notifications
- **QuizResult** - Aptitude test results
- **AIRecommendation** - Personalized suggestions
- **ChatSession/ChatMessage** - AI chat history
- **College/Course/Career** - Reference data
- **CareerNode/CareerLink** - Career path visualization data

## 🔑 Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run db:init          # Initialize with sample data

# Migration
npm run migrate:supabase # Migrate career data to Supabase
```

## 🌐 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on commits

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Run the SQL commands from `src/scripts/migrate-to-supabase.ts` in your Supabase SQL editor
3. Execute the migration script to populate data
4. Configure Row Level Security (RLS) policies as needed

### AI Configuration

The app supports multiple AI providers:

- **OpenAI**: Best quality, requires API key
- **Mistral AI**: Good alternative, requires API key  
- **Hugging Face**: Free tier available, requires token

AI functionality is optional - the app works without API keys but chatbot will be disabled.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](./issues) section
2. Ensure all environment variables are set correctly
3. Verify database connection and migrations
4. Check browser console for frontend errors

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for the backend infrastructure
- D3.js community for visualization tools
- All contributors and testers
