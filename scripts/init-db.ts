// Database initialization script
// Run this script to set up your database with Prisma

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting database initialization...');

  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');

    // Test basic query
    const userCount = await prisma.userProfile.count();
    console.log(`📊 Current user profiles: ${userCount}`);

    // You can add seed data here if needed
    console.log('🌱 Database is ready for use!');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });