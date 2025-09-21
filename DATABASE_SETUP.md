# Career Choice - Database Migration Guide

This guide will help you migrate from localStorage to a cloud database using Prisma and PostgreSQL.

## 🗄️ Database Setup

### Prerequisites

1. **PostgreSQL Database**: You'll need a PostgreSQL database. You can use:
   - **Local PostgreSQL**: Install PostgreSQL locally
   - **Cloud Providers**: 
     - [Neon](https://neon.tech/) (Recommended - Free tier available)
     - [Supabase](https://supabase.com/) (Free tier available)
     - [PlanetScale](https://planetscale.com/) (MySQL alternative)
     - [Vercel Postgres](https://vercel.com/postgres)

### Step-by-Step Database Setup

#### 1. Get Your Database URL

**For Neon (Recommended):**
1. Go to [neon.tech](https://neon.tech/) and sign up
2. Create a new project
3. Copy the connection string (looks like: `postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require`)

**For Supabase:**
1. Go to [supabase.com](https://supabase.com/) and sign up
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string

#### 2. Configure Environment Variables

Update your `.env.local` file:

```bash
# Replace with your actual database URL
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# Existing variables...
NEXTAUTH_SECRET="development-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

#### 3. Install Dependencies and Setup Database

```bash
# Install new dependencies
npm install

# Generate Prisma client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Initialize database (optional - runs connection test)
npm run db:init
```

#### 4. Run Database Migration (Optional)

If you have existing localStorage data, you can migrate it:

```bash
# Start the development server
npm run dev

# Visit the migration page
# Open http://localhost:3000/migrate
```

### 🔧 Database Commands

```bash
# Generate Prisma client (run after schema changes)
npm run db:generate

# Push schema changes to database
npm run db:push

# Run database migrations (for production)
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio

# Test database connection
npm run db:init
```

## 🗄️ Database Schema

The application uses the following data models:

### UserProfile
- Personal information (name, age, gender, location)
- Educational background (current education, class, subjects)
- Career interests and academic goals
- Strengths and challenges
- Family information

### UserSettings
- Notification preferences
- Privacy settings
- App preferences (theme, language)
- Career and education preferences

### QuizResult
- Quiz type and scores
- Category-wise performance
- Completion time and date

### AIRecommendation
- Personalized recommendations
- Categories: COURSE, COLLEGE, CAREER, STUDY_MATERIAL
- Priority levels: HIGH, MEDIUM, LOW

### ChatSession & ChatMessage
- AI chatbot conversations
- Message history and context

### College, Course, Career
- Reference data for recommendations
- Location-based college suggestions
- Career field mappings

## 🔄 Migration Process

### Automatic Migration

1. **Visit Migration Page**: Go to `/migrate` when logged in
2. **Check Local Data**: Click "Check Local Data" to scan browser storage
3. **Migrate Data**: Click "Migrate to Cloud Database" to transfer data
4. **Verification**: Data is automatically validated and localStorage is cleared

### Manual Migration

If automatic migration fails, you can manually export/import data:

1. **Export localStorage** (run in browser console):
```javascript
const data = {
  userProfile: JSON.parse(localStorage.getItem('userProfile') || 'null'),
  userSettings: JSON.parse(localStorage.getItem('userSettings') || 'null'),
  quizResults: JSON.parse(localStorage.getItem('quizResults') || 'null')
};
console.log('Your data:', JSON.stringify(data, null, 2));
```

2. **Contact support** with the exported data for manual migration

## 🛠️ Troubleshooting

### Common Issues

**1. Connection Error**
```
Error: P1001: Can't reach database server
```
- Check your DATABASE_URL is correct
- Ensure your database is running
- Check firewall/network settings

**2. Migration Error**
```
Error: relation "UserProfile" does not exist
```
- Run `npm run db:push` to create tables
- Check your database permissions

**3. Prisma Client Error**
```
PrismaClientInitializationError
```
- Run `npm run db:generate` to regenerate client
- Restart your development server

### Database Connection Test

Create a simple test file to verify your connection:

```javascript
// test-db.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    const count = await prisma.userProfile.count();
    console.log(`📊 User profiles in database: ${count}`);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
```

## 🚀 Production Deployment

When deploying to production:

1. **Set Production DATABASE_URL** in your hosting platform
2. **Run Database Migrations**: `npm run db:migrate`
3. **Generate Prisma Client**: Happens automatically with `postinstall` script
4. **Verify Connection**: Test with your production database

## 📞 Support

If you encounter issues during migration:

1. Check the troubleshooting section above
2. Verify your environment variables
3. Test database connection independently
4. Check Prisma documentation: [prisma.io/docs](https://prisma.io/docs)

## 🔐 Security Notes

- Never commit your `.env.local` file to version control
- Use strong database passwords
- Enable SSL/TLS for production databases
- Regularly backup your database
- Monitor database access logs

---

**Happy coding! 🎉**

Your data is now secure, scalable, and accessible from anywhere!