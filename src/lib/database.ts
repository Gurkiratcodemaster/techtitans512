
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class CacheManager {
  private cache = new Map<string, CacheItem<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl
    };
    this.cache.set(key, item);
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  size(): number {
    // Clean expired items first
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
    return this.cache.size;
  }

  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = this.DEFAULT_TTL
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetcher();
    this.set(key, data, ttl);
    return data;
  }
}

// Global cache instance
export const cacheManager = new CacheManager();

// --- Data Interfaces ---
export interface CareerNode {
  id: string;
  name?: string;
  title?: string;
  type: 'degree' | 'exam' | 'career' | 'specialization' | 'skill' | 'job';
  category?: string;
  description: string;
  requirements?: string[];
  salary?: string;
  salary_range?: number;
  duration?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  icon?: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface CareerLink {
  id: string;
  source_id: string;
  target_id: string;
  source: CareerNode | string | number;
  target: CareerNode | string | number;
  type: 'requires' | 'leads_to' | 'optional';
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CareerPathData {
  nodes: CareerNode[];
  links: CareerLink[];
}

export interface CareerPath {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  steps: CareerStep[];
  pathType: "engineering" | "medical" | "business";
}

export interface CareerStep {
  id: string;
  title: string;
  description: string;
  duration?: string;
  requirements?: string;
  outcomes?: string;
  order: number;
  node?: CareerNode;
  color?: string;
  timeline?: string;
  details?: string[];
}

export interface College {
  id: string;
  name: string;
  location: string;
  state: string;
  type: 'Government' | 'Private' | 'Deemed';
  courses: string[];
  cutoff: {
    general: number;
    obc: number;
    sc: number;
    st: number;
  };
  fees: {
    tuition: number;
    hostel?: number;
    total: number;
  };
  ranking?: number;
  website?: string;
  established?: number;
  affiliation?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  id?: string;
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
  onboardingCompleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface QuizResult {
  id?: string;
  userId: string;
  quizType: 'aptitude' | 'class10' | 'class12';
  responses: Record<string, any>;
  scores: Record<string, number>;
  recommendations: string[];
  completedAt: string;
  created_at?: string;
  updated_at?: string;
}

// Additional interfaces for comprehensive support
export interface QuizQuestion {
  id: string;
  question: string;
  question_text: string;
  options: string[];
  correctAnswer: string;
  correct_answer: number;
  category: string;
  subject?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  classLevel?: number;
}

export interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  category: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  category: 'exam' | 'application' | 'result' | 'admission' | 'scholarship';
  importance: 'high' | 'medium' | 'low';
  priority?: 'high' | 'medium' | 'low';
  days_left?: number;
  link?: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Scholarship {
  id: string;
  name: string;
  description: string;
  eligibility: string;
  amount: string;
  deadline: string;
  applicationLink: string;
  category: string;
  created_at?: string;
  updated_at?: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  subject: string;
  classLevel: number;
  type: 'video' | 'pdf' | 'interactive' | 'quiz';
  url: string;
  thumbnail?: string;
  duration?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DegreeOverview {
  id: string;
  name: string;
  description: string;
  duration: string;
  eligibility: string[];
  careerProspects: string[];
  averageSalary: string;
  topColleges: string[];
  subjects: string[];
  degree: string;
  difficulty?: string;
  jobs?: any[];
  higher_studies?: any[];
  created_at?: string;
  updated_at?: string;
}

// --- Client Database Service ---
export class ClientDatabaseService {
  
  // User Profile Operations
  static async createUserProfile(data: UserProfile) {
    // Get Supabase session token
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const response = await fetch('/api/user-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data),
    });

    console.log('ClientDatabaseService: API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('ClientDatabaseService: API error response:', errorData);
      throw new Error(errorData.error || `HTTP ${response.status}: Failed to create user profile`);
    }

    const result = await response.json();
    console.log('ClientDatabaseService: User profile created successfully');
    // Cache the result
    cacheManager.set(`user_profile_${data.userId}`, result.userProfile);
    return result.userProfile;
  }

  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    // Check cache first
    const cached = cacheManager.get<UserProfile>(`user_profile_${userId}`);
    if (cached) {
      return cached;
    }

    const response = await fetch(`/api/user-profile?userId=${encodeURIComponent(userId)}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Cache the result
    cacheManager.set(`user_profile_${userId}`, result.userProfile);
    
    return result.userProfile;
  }

  static async updateUserProfile(userId: string, data: Partial<UserProfile>) {
    const response = await fetch('/api/user-profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, ...data }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update user profile');
    }

    const result = await response.json();
    
    // Update cache
    cacheManager.set(`user_profile_${userId}`, result.userProfile);
    
    return result.userProfile;
  }

  // Quiz Results Operations
  static async saveQuizResults(data: QuizResult) {
    const response = await fetch('/api/quiz-results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save quiz results');
    }

    const result = await response.json();
    
    // Cache the result
    cacheManager.set(`quiz_results_${data.userId}_${data.quizType}`, result.quizResult);
    
    return result.quizResult;
  }

  // AI Recommendations Operations
  static async getAIRecommendations(userId: string) {
    const cacheKey = `ai_recommendations_${userId}`;
    const cached = cacheManager.get(cacheKey);
    if (cached) return cached;

    const response = await fetch(`/api/ai-recommendations?userId=${userId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get AI recommendations');
    }

    const result = await response.json();
    
    // Cache the result
    cacheManager.set(cacheKey, result.recommendations || []);
    
    return result.recommendations || [];
  }

  static async saveAIRecommendations(userId: string, recommendations: any[]) {
    const response = await fetch('/api/ai-recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, recommendations }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save AI recommendations');
    }

    const result = await response.json();
    
    // Clear cache for this user
    cacheManager.delete(`ai_recommendations_${userId}`);
    
    return result.recommendations;
  }

  // Migration Operations
  static async migrateLocalStorageToDatabase(userId: string) {
    const results = {
      migrated: 0,
      errors: 0,
      details: [] as string[]
    };

    try {
      // Check for localStorage data and migrate
      if (typeof window !== 'undefined' && window.localStorage) {
        const localData = localStorage.getItem('userProfile');
        if (localData) {
          const profile = JSON.parse(localData);
          await this.createUserProfile({ ...profile, userId });
          results.migrated++;
          results.details.push('User profile migrated');
          localStorage.removeItem('userProfile');
        }
      }

      return results;
    } catch (error) {
      results.errors++;
      results.details.push(`Migration error: ${error}`);
      return results;
    }
  }

  static async getQuizResults(userId: string, quizType?: string): Promise<QuizResult[]> {
    const cacheKey = `quiz_results_${userId}${quizType ? `_${quizType}` : ''}`;
    
    // Check cache first
    const cached = cacheManager.get<QuizResult[]>(cacheKey);
    if (cached) {
      return cached;
    }

    let url = `/api/quiz-results?userId=${encodeURIComponent(userId)}`;
    if (quizType) {
      url += `&quizType=${encodeURIComponent(quizType)}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch quiz results: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Cache the result
    cacheManager.set(cacheKey, result.quizResults);
    
    return result.quizResults;
  }

  // College Operations
  static async getColleges(filters?: {
    state?: string;
    type?: string;
    course?: string;
    maxFees?: number;
  }): Promise<College[]> {
    const cacheKey = `colleges_${JSON.stringify(filters || {})}`;
    
    // Check cache first
    const cached = cacheManager.get<College[]>(cacheKey);
    if (cached) {
      return cached;
    }

    let url = '/api/colleges';
    if (filters) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch colleges: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Cache the result for 10 minutes
    cacheManager.set(cacheKey, result.colleges, 10 * 60 * 1000);
    
    return result.colleges;
  }
}

// --- Career Path Service ---
export class CareerPathService {
  static async getAllDegrees(): Promise<string[]> {
    return cacheManager.getOrSet('all_degrees', async () => {
      const { data, error } = await supabase
        .from('career_nodes')
        .select('name')
        .eq('type', 'degree');

      if (error) throw error;
      return data.map(d => d.name).filter(Boolean);
    }, 15 * 60 * 1000); // Cache for 15 minutes
  }

  static async getCareerPathForDegree(degree: string): Promise<CareerPathData> {
    return cacheManager.getOrSet(`career_path_${degree}`, async () => {
      // Get all nodes related to this degree
      const { data: nodes, error: nodesError } = await supabase
        .from('career_nodes')
        .select('*')
        .or(`name.eq.${degree},type.eq.skill,type.eq.job`);

      if (nodesError) throw nodesError;

      // Get all links between these nodes
      const nodeIds = nodes.map(n => n.id);
      const { data: links, error: linksError } = await supabase
        .from('career_links')
        .select('*')
        .in('source_id', nodeIds)
        .in('target_id', nodeIds);

      if (linksError) throw linksError;

      return { nodes, links };
    }, 10 * 60 * 1000); // Cache for 10 minutes
  }
}

// --- Career Service ---
export class CareerService {
  static async getLinearCareerPath(pathType: "engineering" | "medical" | "business"): Promise<CareerPath> {
    return cacheManager.getOrSet(`linear_career_path_${pathType}`, async () => {
      const { data, error } = await supabase
        .from('career_paths')
        .select(`
          *,
          career_steps (*)
        `)
        .eq('pathType', pathType)
        .single();

      if (error) throw error;

      return {
        ...data,
        steps: data.career_steps?.sort((a: any, b: any) => a.order - b.order) || []
      };
    }, 10 * 60 * 1000); // Cache for 10 minutes
  }

  static async getDegreeOverviews(): Promise<DegreeOverview[]> {
    return cacheManager.getOrSet('degree_overviews', async () => {
      const { data, error } = await supabase
        .from('degree_overviews')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    }, 10 * 60 * 1000); // Cache for 10 minutes
  }
}

// --- Timeline Service ---
export class TimelineService {
  static async getAllTimelineEvents(): Promise<TimelineEvent[]> {
    return cacheManager.getOrSet('timeline_events', async () => {
      const { data, error } = await supabase
        .from('timeline_events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      return data || [];
    });
  }

  static async getUpcomingEvents(): Promise<TimelineEvent[]> {
    const today = new Date().toISOString().split('T')[0];
    return cacheManager.getOrSet('upcoming_events', async () => {
      const { data, error } = await supabase
        .from('timeline_events')
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(10);

      if (error) throw error;
      return data || [];
    });
  }
}

// --- Quiz Service ---
export class QuizService {
  static async fetchQuizQuestions(classLevel: number): Promise<QuizQuestion[]> {
    return cacheManager.getOrSet(`quiz_questions_${classLevel}`, async () => {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('classLevel', classLevel)
        .order('id');

      if (error) throw error;
      return data || [];
    });
  }

  static async saveQuizResult(result: {
    userId: string;
    quizType: string;
    score: number;
    totalQuestions: number;
    answers: any[];
  }): Promise<void> {
    const { error } = await supabase
      .from('quiz_results')
      .insert({
        user_id: result.userId,
        quiz_type: result.quizType,
        score: result.score,
        total_questions: result.totalQuestions,
        answers: result.answers,
        completed_at: new Date().toISOString()
      });

    if (error) throw error;
  }
}

// --- Scholarship Service ---
export class ScholarshipService {
  static async getAllScholarships(): Promise<Scholarship[]> {
    return cacheManager.getOrSet('scholarships', async () => {
      const { data, error } = await supabase
        .from('scholarships')
        .select('*')
        .order('deadline', { ascending: true });

      if (error) throw error;
      return data || [];
    });
  }

  static async getActiveScholarships(): Promise<Scholarship[]> {
    const today = new Date().toISOString();
    return cacheManager.getOrSet('active_scholarships', async () => {
      const { data, error } = await supabase
        .from('scholarships')
        .select('*')
        .gte('deadline', today)
        .order('deadline', { ascending: true });

      if (error) throw error;
      return data || [];
    });
  }
}

// --- Study Material Service ---
export class StudyMaterialService {
  static async getMaterialsByClass(classLevel: number): Promise<StudyMaterial[]> {
    return cacheManager.getOrSet(`study_materials_${classLevel}`, async () => {
      const { data, error } = await supabase
        .from('study_materials')
        .select('*')
        .eq('classLevel', classLevel)
        .order('title');

      if (error) throw error;
      return data || [];
    });
  }

  static async getMaterialsBySubject(subject: string): Promise<StudyMaterial[]> {
    return cacheManager.getOrSet(`study_materials_${subject}`, async () => {
      const { data, error } = await supabase
        .from('study_materials')
        .select('*')
        .eq('subject', subject)
        .order('title');

      if (error) throw error;
      return data || [];
    });
  }
}

// --- College Service ---
export class CollegeService {
  static async getAllColleges(): Promise<College[]> {
    return cacheManager.getOrSet('all_colleges', async () => {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    });
  }

  static async getCollegesByState(state: string): Promise<College[]> {
    return cacheManager.getOrSet(`colleges_${state}`, async () => {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .eq('state', state)
        .order('name');

      if (error) throw error;
      return data || [];
    });
  }
}

// --- Database Utils ---
export const DatabaseUtils = {
  // Clear all caches
  clearCache: () => {
    cacheManager.clear();
  },

  // Get cache statistics
  getCacheStats: () => ({
    size: cacheManager.size(),
    keys: Array.from((cacheManager as any).cache.keys())
  }),

  // Test database connection
  testConnection: async () => {
    try {
      const { data, error } = await supabase.from('career_nodes').select('count').limit(1);
      if (error) throw error;
      return { success: true, message: 'Database connection successful' };
    } catch (error) {
      return { success: false, message: `Database connection failed: ${error}` };
    }
  },

  // Batch operations
  batchInsert: async <T>(table: string, records: T[]) => {
    const batchSize = 100;
    const results: T[] = [];

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      const { data, error } = await supabase
        .from(table)
        .insert(batch);

      if (error) throw error;
      if (data) results.push(...(data as T[]));
    }

    return results;
  }
};

// --- Export everything ---
export * from '@supabase/supabase-js';
export { supabase as default };

// Legacy compatibility exports
export const cache = cacheManager;
export const clientDatabase = ClientDatabaseService;

// Legacy function exports for backward compatibility
export const fetchQuizQuestions = QuizService.fetchQuizQuestions;
export const saveQuizResult = QuizService.saveQuizResult;

// --- User Utilities ---
import type { User } from '@supabase/supabase-js';

export const UserUtils = {
  getId: (user: User | null): string => user?.id || '',
  getDisplayName: (user: User | null): string => {
    if (!user) return '';
    return user.user_metadata?.full_name || 
           user.user_metadata?.name || 
           user.email?.split('@')[0] || 
           'User';
  },
  getPhotoURL: (user: User | null): string | null => {
    if (!user) return null;
    return user.user_metadata?.avatar_url || 
           user.user_metadata?.picture || 
           null;
  },
  getEmail: (user: User | null): string => user?.email || '',
  isEmailAuth: (user: User | null): boolean => {
    if (!user) return false;
    return user.app_metadata?.provider === 'email';
  }
};