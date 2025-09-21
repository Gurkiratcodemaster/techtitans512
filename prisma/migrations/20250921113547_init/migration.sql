-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "public"."EducationLevel" AS ENUM ('HIGH_SCHOOL', 'SENIOR_SECONDARY', 'UNDERGRADUATE', 'POSTGRADUATE', 'DIPLOMA', 'PROFESSIONAL');

-- CreateEnum
CREATE TYPE "public"."AcademicPerformance" AS ENUM ('EXCELLENT', 'GOOD', 'AVERAGE', 'BELOW_AVERAGE', 'STRUGGLING');

-- CreateEnum
CREATE TYPE "public"."CareerField" AS ENUM ('ENGINEERING_TECHNOLOGY', 'MEDICAL_HEALTHCARE', 'BUSINESS_MANAGEMENT', 'SCIENCE_RESEARCH', 'ARTS_HUMANITIES', 'LAW_LEGAL', 'EDUCATION_TEACHING', 'CREATIVE_DESIGN', 'MEDIA_JOURNALISM', 'SPORTS_FITNESS', 'AGRICULTURE', 'DEFENSE_MILITARY', 'AVIATION', 'FASHION_BEAUTY', 'HOSPITALITY_TOURISM', 'BANKING_FINANCE', 'GOVERNMENT_SERVICES', 'SOCIAL_WORK');

-- CreateEnum
CREATE TYPE "public"."StudyMode" AS ENUM ('SELF_STUDY', 'CLASSROOM', 'ONLINE', 'HYBRID', 'TUTORING');

-- CreateEnum
CREATE TYPE "public"."ProfileVisibility" AS ENUM ('PUBLIC', 'PRIVATE', 'FRIENDS');

-- CreateEnum
CREATE TYPE "public"."AppTheme" AS ENUM ('LIGHT', 'DARK', 'AUTO');

-- CreateEnum
CREATE TYPE "public"."Language" AS ENUM ('ENGLISH', 'HINDI', 'BENGALI', 'TAMIL', 'TELUGU');

-- CreateEnum
CREATE TYPE "public"."IncomeRange" AS ENUM ('BELOW_3', 'RANGE_3_6', 'RANGE_6_12', 'RANGE_12_25', 'ABOVE_25');

-- CreateEnum
CREATE TYPE "public"."QuizType" AS ENUM ('APTITUDE_TEST', 'CAREER_ASSESSMENT', 'PERSONALITY_TEST', 'SKILL_ASSESSMENT');

-- CreateEnum
CREATE TYPE "public"."RecommendationCategory" AS ENUM ('COURSE', 'COLLEGE', 'CAREER', 'STUDY_MATERIAL', 'EXAM_PREPARATION');

-- CreateEnum
CREATE TYPE "public"."Priority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "public"."MessageRole" AS ENUM ('USER', 'ASSISTANT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "public"."CollegeType" AS ENUM ('ENGINEERING', 'MEDICAL', 'BUSINESS', 'ARTS', 'SCIENCE', 'LAW', 'MIXED', 'TECHNICAL');

-- CreateTable
CREATE TABLE "public"."user_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fullName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "location" TEXT NOT NULL,
    "currentEducation" "public"."EducationLevel" NOT NULL,
    "currentClass" TEXT NOT NULL,
    "previousAcademicPerformance" "public"."AcademicPerformance",
    "currentSubjects" TEXT[],
    "careerInterests" "public"."CareerField"[],
    "preferredStudyMode" "public"."StudyMode" NOT NULL,
    "academicGoals" TEXT NOT NULL,
    "strengths" TEXT[],
    "challenges" TEXT[],
    "parentOccupation" TEXT,
    "familyIncome" "public"."IncomeRange",
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "pushNotifications" BOOLEAN NOT NULL DEFAULT false,
    "careerUpdates" BOOLEAN NOT NULL DEFAULT true,
    "examAlerts" BOOLEAN NOT NULL DEFAULT true,
    "newsletter" BOOLEAN NOT NULL DEFAULT false,
    "profileVisibility" "public"."ProfileVisibility" NOT NULL DEFAULT 'PUBLIC',
    "showEmail" BOOLEAN NOT NULL DEFAULT false,
    "showProgress" BOOLEAN NOT NULL DEFAULT true,
    "theme" "public"."AppTheme" NOT NULL DEFAULT 'LIGHT',
    "language" "public"."Language" NOT NULL DEFAULT 'ENGLISH',
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "careerField" "public"."CareerField" NOT NULL DEFAULT 'ENGINEERING_TECHNOLOGY',
    "educationLevel" "public"."EducationLevel" NOT NULL DEFAULT 'HIGH_SCHOOL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quiz_results" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizType" "public"."QuizType" NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalScore" INTEGER NOT NULL,
    "maxPossibleScore" INTEGER NOT NULL,
    "overallPercentage" DOUBLE PRECISION NOT NULL,
    "logicalScore" INTEGER,
    "logicalMax" INTEGER,
    "mathematicalScore" INTEGER,
    "mathematicalMax" INTEGER,
    "verbalScore" INTEGER,
    "verbalMax" INTEGER,
    "spatialScore" INTEGER,
    "spatialMax" INTEGER,
    "technicalScore" INTEGER,
    "technicalMax" INTEGER,
    "timeSpentMinutes" INTEGER,

    CONSTRAINT "quiz_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ai_recommendations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" "public"."RecommendationCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "priority" "public"."Priority" NOT NULL,
    "actionUrl" TEXT,
    "details" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chat_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Chat Session',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chat_messages" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" "public"."MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isStreaming" BOOLEAN NOT NULL DEFAULT false,
    "hasContext" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."colleges" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "type" "public"."CollegeType" NOT NULL,
    "rating" DOUBLE PRECISION,
    "established" INTEGER,
    "courses" TEXT[],
    "fees" TEXT,
    "placement" TEXT,
    "website" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "colleges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."courses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "public"."CareerField" NOT NULL,
    "duration" TEXT NOT NULL,
    "level" "public"."EducationLevel" NOT NULL,
    "eligibility" TEXT[],
    "subjects" TEXT[],
    "careerPaths" TEXT[],
    "entranceExams" TEXT[],
    "avgFees" TEXT,
    "avgSalary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."careers" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "field" "public"."CareerField" NOT NULL,
    "description" TEXT NOT NULL,
    "requiredSkills" TEXT[],
    "educationRequired" TEXT[],
    "avgStartingSalary" TEXT,
    "avgMidSalary" TEXT,
    "avgSeniorSalary" TEXT,
    "growthRate" TEXT,
    "jobMarket" TEXT,
    "futureProspects" TEXT,
    "workMode" TEXT[],
    "industryDemand" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "careers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_userId_key" ON "public"."user_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_userId_key" ON "public"."user_settings"("userId");

-- AddForeignKey
ALTER TABLE "public"."user_settings" ADD CONSTRAINT "user_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user_profiles"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quiz_results" ADD CONSTRAINT "quiz_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user_profiles"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ai_recommendations" ADD CONSTRAINT "ai_recommendations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user_profiles"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chat_sessions" ADD CONSTRAINT "chat_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user_profiles"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chat_messages" ADD CONSTRAINT "chat_messages_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."chat_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
