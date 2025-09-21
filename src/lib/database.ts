import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Database service functions to replace localStorage usage

export class DatabaseService {
  
  // User Profile Operations
  static async createUserProfile(data: {
    userId: string;
    fullName: string;
    age: number;
    gender: string;
    location: string;
    currentEducation: string;
    currentClass: string;
    previousAcademicPerformance?: string;
    currentSubjects: string[];
    careerInterests: string[];
    preferredStudyMode: string;
    academicGoals: string;
    strengths: string[];
    challenges: string[];
    parentOccupation?: string;
    familyIncome?: string;
  }) {
    return await prisma.userProfile.create({
      data: {
        ...data,
        onboardingCompleted: true,
      },
    });
  }

  static async getUserProfile(userId: string) {
    return await prisma.userProfile.findUnique({
      where: { userId },
      include: {
        userSettings: true,
        quizResults: {
          orderBy: { completedAt: 'desc' },
          take: 10, // Get last 10 quiz results
        },
        recommendations: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  static async updateUserProfile(userId: string, data: Partial<{
    fullName: string;
    age: number;
    gender: string;
    location: string;
    currentEducation: string;
    currentClass: string;
    previousAcademicPerformance: string;
    currentSubjects: string[];
    careerInterests: string[];
    preferredStudyMode: string;
    academicGoals: string;
    strengths: string[];
    challenges: string[];
    parentOccupation: string;
    familyIncome: string;
  }>) {
    return await prisma.userProfile.update({
      where: { userId },
      data,
    });
  }

  static async deleteUserProfile(userId: string) {
    return await prisma.userProfile.delete({
      where: { userId },
    });
  }

  // User Settings Operations
  static async createOrUpdateUserSettings(userId: string, data: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    careerUpdates?: boolean;
    examAlerts?: boolean;
    newsletter?: boolean;
    profileVisibility?: string;
    showEmail?: boolean;
    showProgress?: boolean;
    theme?: string;
    language?: string;
    timezone?: string;
    careerField?: string;
    educationLevel?: string;
  }) {
    return await prisma.userSettings.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });
  }

  static async getUserSettings(userId: string) {
    return await prisma.userSettings.findUnique({
      where: { userId },
    });
  }

  // Quiz Results Operations
  static async saveQuizResult(data: {
    userId: string;
    quizType: string;
    totalScore: number;
    maxPossibleScore: number;
    overallPercentage: number;
    logicalScore?: number;
    logicalMax?: number;
    mathematicalScore?: number;
    mathematicalMax?: number;
    verbalScore?: number;
    verbalMax?: number;
    spatialScore?: number;
    spatialMax?: number;
    technicalScore?: number;
    technicalMax?: number;
    timeSpentMinutes?: number;
  }) {
    return await prisma.quizResult.create({
      data,
    });
  }

  static async getUserQuizResults(userId: string) {
    return await prisma.quizResult.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
    });
  }

  static async getLatestQuizResult(userId: string, quizType?: string) {
    return await prisma.quizResult.findFirst({
      where: { 
        userId,
        ...(quizType && { quizType: quizType as any }),
      },
      orderBy: { completedAt: 'desc' },
    });
  }

  // AI Recommendations Operations
  static async saveAIRecommendations(userId: string, recommendations: Array<{
    category: string;
    title: string;
    description: string;
    reason: string;
    priority: string;
    actionUrl?: string;
    details: string[];
  }>) {
    // First, deactivate old recommendations
    await prisma.aIRecommendation.updateMany({
      where: { userId },
      data: { isActive: false },
    });

    // Create new recommendations
    return await prisma.aIRecommendation.createMany({
      data: recommendations.map(rec => ({
        userId,
        category: rec.category as any,
        title: rec.title,
        description: rec.description,
        reason: rec.reason,
        priority: rec.priority as any,
        actionUrl: rec.actionUrl,
        details: rec.details,
        isActive: true,
      })),
    });
  }

  static async getUserRecommendations(userId: string, category?: string) {
    return await prisma.aIRecommendation.findMany({
      where: { 
        userId,
        isActive: true,
        ...(category && { category: category as any }),
      },
      orderBy: [
        { priority: 'asc' }, // HIGH priority first
        { createdAt: 'desc' },
      ],
    });
  }

  // Chat Session Operations
  static async createChatSession(userId: string, title?: string) {
    return await prisma.chatSession.create({
      data: {
        userId,
        title: title || 'Chat Session',
      },
    });
  }

  static async getChatSession(sessionId: string) {
    return await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });
  }

  static async getUserChatSessions(userId: string) {
    return await prisma.chatSession.findMany({
      where: { userId, isActive: true },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          take: 1,
          orderBy: { timestamp: 'desc' },
        },
      },
    });
  }

  static async addChatMessage(sessionId: string, data: {
    role: 'USER' | 'ASSISTANT' | 'SYSTEM';
    content: string;
    hasContext?: boolean;
  }) {
    // Update session updatedAt
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    return await prisma.chatMessage.create({
      data: {
        sessionId,
        role: data.role,
        content: data.content,
        hasContext: data.hasContext || false,
      },
    });
  }

  static async deleteChatSession(sessionId: string) {
    return await prisma.chatSession.update({
      where: { id: sessionId },
      data: { isActive: false },
    });
  }

  // College and Course Data Operations
  static async getCollegesByLocation(state: string, careerFields?: string[]) {
    return await prisma.college.findMany({
      where: {
        state: {
          contains: state,
          mode: 'insensitive',
        },
        ...(careerFields && {
          courses: {
            hasSome: careerFields,
          },
        }),
      },
      orderBy: { rating: 'desc' },
      take: 20,
    });
  }

  static async getAllColleges() {
    return await prisma.college.findMany({
      orderBy: { rating: 'desc' },
    });
  }

  static async getCoursesByField(careerField: string) {
    return await prisma.course.findMany({
      where: { category: careerField as any },
      orderBy: { name: 'asc' },
    });
  }

  static async getCareersByField(careerField: string) {
    return await prisma.career.findMany({
      where: { field: careerField as any },
      orderBy: { title: 'asc' },
    });
  }

  // Analytics and Reporting
  static async getUserProfileStats() {
    const totalUsers = await prisma.userProfile.count();
    const completedOnboarding = await prisma.userProfile.count({
      where: { onboardingCompleted: true },
    });
    const quizTakers = await prisma.quizResult.groupBy({
      by: ['userId'],
      _count: { userId: true },
    });
    
    return {
      totalUsers,
      completedOnboarding,
      quizTakers: quizTakers.length,
    };
  }

  static async getPopularCareerFields() {
    const profiles = await prisma.userProfile.findMany({
      select: { careerInterests: true },
    });

    const fieldCounts: { [key: string]: number } = {};
    profiles.forEach((profile: { careerInterests: string[] }) => {
      profile.careerInterests.forEach((field: string) => {
        fieldCounts[field] = (fieldCounts[field] || 0) + 1;
      });
    });

    return Object.entries(fieldCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([field, count]) => ({ field, count }));
  }

  // Data Migration Helpers (to move from localStorage)
  static async migrateUserDataFromLocalStorage(userId: string, localData: {
    userProfile?: any;
    userSettings?: any;
    quizResults?: any;
  }) {
    try {
      // Migrate user profile
      if (localData.userProfile && localData.userProfile.userId === userId) {
        const existingProfile = await this.getUserProfile(userId);
        if (!existingProfile) {
          await this.createUserProfile({
            userId: localData.userProfile.userId,
            fullName: localData.userProfile.fullName,
            age: parseInt(localData.userProfile.age),
            gender: localData.userProfile.gender.toUpperCase(),
            location: localData.userProfile.location,
            currentEducation: localData.userProfile.currentEducation.toUpperCase(),
            currentClass: localData.userProfile.currentClass,
            previousAcademicPerformance: localData.userProfile.previousAcademicPerformance?.toUpperCase(),
            currentSubjects: localData.userProfile.currentSubjects || [],
            careerInterests: localData.userProfile.careerInterests?.map((field: string) => 
              field.toUpperCase().replace(/[\s&]/g, '_')
            ) || [],
            preferredStudyMode: localData.userProfile.preferredStudyMode?.toUpperCase().replace('-', '_') || 'SELF_STUDY',
            academicGoals: localData.userProfile.academicGoals || '',
            strengths: localData.userProfile.strengths || [],
            challenges: localData.userProfile.challenges || [],
            parentOccupation: localData.userProfile.parentOccupation,
            familyIncome: localData.userProfile.familyIncome?.toUpperCase().replace('-', '_'),
          });
        }
      }

      // Migrate user settings
      if (localData.userSettings) {
        await this.createOrUpdateUserSettings(userId, {
          emailNotifications: localData.userSettings.notifications?.email ?? true,
          pushNotifications: localData.userSettings.notifications?.push ?? false,
          careerUpdates: localData.userSettings.notifications?.career ?? true,
          examAlerts: localData.userSettings.notifications?.exam ?? true,
          newsletter: localData.userSettings.notifications?.newsletter ?? false,
          profileVisibility: localData.userSettings.privacy?.profileVisibility?.toUpperCase() || 'PUBLIC',
          showEmail: localData.userSettings.privacy?.showEmail ?? false,
          showProgress: localData.userSettings.privacy?.showProgress ?? true,
          theme: localData.userSettings.preferences?.theme?.toUpperCase() || 'LIGHT',
          language: localData.userSettings.preferences?.language?.toUpperCase() || 'ENGLISH',
          timezone: localData.userSettings.preferences?.timezone || 'Asia/Kolkata',
          careerField: localData.userSettings.preferences?.careerField?.toUpperCase().replace(/[\s&]/g, '_') || 'ENGINEERING_TECHNOLOGY',
          educationLevel: localData.userSettings.preferences?.educationLevel?.toUpperCase().replace('-', '_') || 'HIGH_SCHOOL',
        });
      }

      // Migrate quiz results
      if (localData.quizResults?.aptitudeTest) {
        const quizData = localData.quizResults;
        await this.saveQuizResult({
          userId,
          quizType: 'APTITUDE_TEST',
          totalScore: quizData.totalScore || 0,
          maxPossibleScore: quizData.maxPossibleScore || 0,
          overallPercentage: (quizData.totalScore / quizData.maxPossibleScore) * 100,
          timeSpentMinutes: Math.floor((new Date().getTime() - new Date(quizData.completedAt || Date.now()).getTime()) / 1000 / 60),
        });
      }

      return { success: true, message: 'Data migration completed successfully' };
    } catch (error) {
      console.error('Migration error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}