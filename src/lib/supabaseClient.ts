import { createClient } from '@supabase/supabase-js';

// --- Supabase Client Initialization ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Data Interfaces ---
export interface CareerNode {
  id: string;
  name: string;
  type: 'degree' | 'exam' | 'career' | 'specialization';
  description: string;
  requirements?: string[];
  salary?: string;
  duration?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  icon?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CareerLink {
  id: string;
  source_id: string;
  target_id: string;
  type: 'requires' | 'leads_to' | 'optional';
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CareerPathData {
  nodes: CareerNode[];
  links: CareerLink[];
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
  facilities: string[];
  medium_of_instruction: string[];
  website: string;
  fees: {
    tuition: string;
    hostel: string;
  };
  rating?: number;
  established?: number;
  placement?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Scholarship {
  id: string;
  title: string;
  description: string;
  provider: string;
  amount: string;
  deadline: string;
  eligibility: string[];
  category: 'Merit' | 'Need-based' | 'Minority' | 'Sports' | 'Arts' | 'Research';
  level: 'School' | 'Undergraduate' | 'Postgraduate' | 'All';
  requirements: string[];
  application_process: string[];
  status: 'Open' | 'Closed' | 'Upcoming';
  website: string;
  tags: string[];
  created_at?: string;
  updated_at?: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  type: 'eBook' | 'Video' | 'PDF' | 'Quiz' | 'Notes';
  subject: string;
  class: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: string;
  size?: string;
  author: string;
  rating: number;
  downloads: number;
  tags: string[];
  price: string;
  thumbnail: string;
  created_at?: string;
  updated_at?: string;
}

export interface SkillProgram {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  price: string;
  skills: string[];
  outcomes: string[];
  provider: string;
  rating: number;
  enrollments: number;
  image_url: string;
  created_at?: string;
  updated_at?: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  category: 'admission' | 'scholarship' | 'entrance' | 'career';
  date: string;
  deadline: string;
  description: string;
  status: 'upcoming' | 'ongoing' | 'closed';
  days_left: number;
  priority: 'high' | 'medium' | 'low';
  link?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DegreeOverview {
  id: string;
  degree: string;
  description: string;
  jobs: string[];
  higher_studies: string[];
  created_at?: string;
  updated_at?: string;
}

export interface CareerPath {
  title: string;
  subtitle: string;
  steps: Array<{
    node: CareerNode;
    timeline: string;
    details: string[];
    color: string;
  }>;
}

export interface UserProfile {
  id: string;
  firebase_uid: string;
  full_name: string;
  email: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  phone?: string;
  location: string;
  current_education: string;
  current_class: string;
  current_subjects: string[];
  career_interests: string[];
  strengths: string[];
  academic_goals?: string;
  preferred_study_mode?: 'online' | 'offline' | 'hybrid';
  family_income_range?: string;
  profile_completed: boolean;
  wants_ai_recommendations: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileQuestion {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'single_choice' | 'text' | 'rating';
  options?: string[];
  category: string;
  order_index: number;
  is_required: boolean;
  created_at?: string;
}

export interface ProfileResponse {
  id: string;
  user_profile_id: string;
  question_id: string;
  response_text?: string;
  response_options?: string[];
  response_rating?: number;
  created_at?: string;
}

export interface AIRecommendation {
  id: string;
  user_profile_id: string;
  recommendation_type: 'career_path' | 'degree_program' | 'entrance_exam' | 'scholarship';
  recommendation_title: string;
  recommendation_description: string;
  confidence_score: number;
  reasons: string[];
  recommended_actions: string[];
  priority_level: 'high' | 'medium' | 'low';
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// --- Service Classes ---

/**
 * Handles all data fetching related to career paths, nodes, and links.
 */
export class CareerPathService {
  static async getAllCareerNodes(): Promise<CareerNode[]> {
    const { data, error } = await supabase.from('career_nodes').select('*').order('name');
    if (error) {
      console.error('Error fetching career nodes:', error);
      throw error;
    }
    return data || [];
  }

  // NEW METHOD ADDED HERE
  static async getAllDegrees(): Promise<string[]> {
    const { data, error } = await supabase
      .from('career_nodes')
      .select('name')
      .eq('type', 'degree')
      .order('name');

    if (error) {
      console.error('Error fetching all degrees:', error);
      throw error;
    }

    return data ? data.map(item => item.name) : [];
  }

  static async getAllCareerLinks(): Promise<CareerLink[]> {
    const { data, error } = await supabase.from('career_links').select('*');
    if (error) {
      console.error('Error fetching career links:', error);
      throw error;
    }
    return data || [];
  }

  static async getCareerPathData(): Promise<CareerPathData> {
    const [nodes, links] = await Promise.all([
      this.getAllCareerNodes(),
      this.getAllCareerLinks()
    ]);
    return { nodes, links };
  }

  static async getNodesByType(type: CareerNode['type']): Promise<CareerNode[]> {
    const { data, error } = await supabase.from('career_nodes').select('*').eq('type', type).order('name');
    if (error) {
      console.error('Error fetching nodes by type:', error);
      throw error;
    }
    return data || [];
  }

  static async getConnectedNodes(nodeId: string): Promise<CareerNode[]> {
    const { data, error } = await supabase
      .from('career_links')
      .select('career_nodes_source:career_nodes!source_id(*), career_nodes_target:career_nodes!target_id(*)')
      .or(`source_id.eq.${nodeId},target_id.eq.${nodeId}`);

    if (error) {
      console.error('Error fetching connected nodes:', error);
      throw error;
    }

    if (!data) return [];

    const nodeMap = new Map<string, CareerNode>();
    data.forEach((link: any) => {
      if (link.career_nodes_source?.id !== nodeId) nodeMap.set(link.career_nodes_source.id, link.career_nodes_source);
      if (link.career_nodes_target?.id !== nodeId) nodeMap.set(link.career_nodes_target.id, link.career_nodes_target);
    });

    return Array.from(nodeMap.values());
  }
  
  static async getCareerPathForDegree(degreeName: string): Promise<CareerPathData> {
    const { data, error } = await supabase.rpc('get_career_path_for_degree', {
      degree_name: degreeName,
    });

    if (error) {
      console.error(`Error fetching career path for ${degreeName}:`, error);
      throw error;
    }
    
    return data || { nodes: [], links: [] };
  }

  static async filterDataByDegrees(recommendedDegrees: string[]): Promise<CareerPathData> {
    if (recommendedDegrees.length === 0) {
      return { nodes: [], links: [] };
    }

    const pathPromises = recommendedDegrees.map(degree => this.getCareerPathForDegree(degree));
    const allPaths = await Promise.all(pathPromises);

    const mergedNodes = new Map<string, CareerNode>();
    const mergedLinks = new Map<string, CareerLink>();

    for (const path of allPaths) {
      if (path.nodes) {
        for (const node of path.nodes) {
          mergedNodes.set(node.id, node);
        }
      }
      if (path.links) {
        for (const link of path.links) {
          const linkKey = `${link.source_id}->${link.target_id}`;
          mergedLinks.set(linkKey, link);
        }
      }
    }

    return {
      nodes: Array.from(mergedNodes.values()),
      links: Array.from(mergedLinks.values()),
    };
  }

  static async isDataMigrated(): Promise<boolean> {
    const { count, error } = await supabase.from('career_nodes').select('*', { count: 'exact', head: true });
    if (error) {
      console.error('Error checking migration status:', error);
      return false;
    }
    return (count || 0) > 0;
  }

  static async searchNodes(query: string): Promise<CareerNode[]> {
    const { data, error } = await supabase
      .from('career_nodes')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('name')
      .limit(20);

    if (error) {
      console.error('Error searching nodes:', error);
      throw error;
    }
    return data || [];
  }
}

/**
 * Handles all data fetching related to colleges.
 */
export class CollegeService {
  static async getAllColleges(): Promise<College[]> {
    const { data, error } = await supabase.from('colleges').select('*').order('name');
    if (error) { throw error; }
    return data || [];
  }

  static async searchColleges(filters: {
    searchTerm?: string;
    state?: string;
    type?: string;
    course?: string;
  }): Promise<College[]> {
    let query = supabase.from('colleges').select('*');
    if (filters.searchTerm) { query = query.or(`name.ilike.%${filters.searchTerm}%,location.ilike.%${filters.searchTerm}%`); }
    if (filters.state) { query = query.eq('state', filters.state); }
    if (filters.type) { query = query.eq('type', filters.type); }
    if (filters.course) { query = query.contains('courses', [filters.course]); }
    const { data, error } = await query.order('name');
    if (error) { throw error; }
    return data || [];
  }

  static async getCollegeById(id: string): Promise<College | null> {
    const { data, error } = await supabase.from('colleges').select('*').eq('id', id).single();
    if (error) { console.error('Error fetching college:', error); return null; }
    return data;
  }
}

/**
 * Handles all data fetching related to scholarships.
 */
export class ScholarshipService {
  static async getAllScholarships(): Promise<Scholarship[]> {
    const { data, error } = await supabase.from('scholarships').select('*').order('deadline');
    if (error) { throw error; }
    return data || [];
  }

  static async searchScholarships(filters: {
    searchTerm?: string;
    category?: string;
    level?: string;
    status?: string;
  }): Promise<Scholarship[]> {
    let query = supabase.from('scholarships').select('*');
    if (filters.searchTerm) { query = query.or(`title.ilike.%${filters.searchTerm}%,provider.ilike.%${filters.searchTerm}%`); }
    if (filters.category && filters.category !== 'All') { query = query.eq('category', filters.category); }
    if (filters.level && filters.level !== 'All') { query = query.or(`level.eq.${filters.level},level.eq.All`); }
    if (filters.status && filters.status !== 'All') { query = query.eq('status', filters.status); }
    const { data, error } = await query.order('deadline');
    if (error) { throw error; }
    return data || [];
  }
}

/**
 * Handles all data fetching related to study materials.
 */
export class StudyMaterialService {
  static async getAllStudyMaterials(): Promise<StudyMaterial[]> {
    const { data, error } = await supabase.from('study_materials').select('*').order('title');
    if (error) { throw error; }
    return data || [];
  }

  static async searchStudyMaterials(filters: {
    searchTerm?: string;
    subject?: string;
    class?: string;
    type?: string;
  }): Promise<StudyMaterial[]> {
    let query = supabase.from('study_materials').select('*');
    if (filters.searchTerm) { query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`); }
    if (filters.subject && filters.subject !== 'All') { query = query.eq('subject', filters.subject); }
    if (filters.class && filters.class !== 'All') { query = query.eq('class', filters.class); }
    if (filters.type && filters.type !== 'All') { query = query.eq('type', filters.type); }
    const { data, error } = await query.order('title');
    if (error) { throw error; }
    return data || [];
  }
}

/**
 * Handles all data fetching related to skill-building programs.
 */
export class SkillProgramService {
  static async getAllSkillPrograms(): Promise<SkillProgram[]> {
    const { data, error } = await supabase.from('skill_programs').select('*').order('title');
    if (error) { throw error; }
    return data || [];
  }

  static async searchSkillPrograms(filters: {
    category?: string;
    level?: string;
  }): Promise<SkillProgram[]> {
    let query = supabase.from('skill_programs').select('*');
    if (filters.category && filters.category !== 'All') { query = query.eq('category', filters.category); }
    if (filters.level && filters.level !== 'All') { query = query.eq('level', filters.level); }
    const { data, error } = await query.order('title');
    if (error) { throw error; }
    return data || [];
  }
}

/**
 * Handles all data fetching related to timeline events.
 */
export class TimelineService {
  static async getAllTimelineEvents(): Promise<TimelineEvent[]> {
    const { data, error } = await supabase.from('timeline_events').select('*').order('deadline');
    if (error) { throw error; }
    return data || [];
  }

  static async getFilteredTimelineEvents(filters: {
    category?: string;
    priority?: string;
    status?: string;
  }): Promise<TimelineEvent[]> {
    let query = supabase.from('timeline_events').select('*');
    if (filters.category && filters.category !== 'all') { query = query.eq('category', filters.category); }
    if (filters.priority && filters.priority !== 'all') { query = query.eq('priority', filters.priority); }
    if (filters.status && filters.status !== 'all') { query = query.eq('status', filters.status); }
    const { data, error } = await query.order('deadline');
    if (error) { throw error; }
    return data || [];
  }

  static async getUpcomingEvents(daysAhead: number = 30): Promise<TimelineEvent[]> {
    const { data, error } = await supabase
      .from('timeline_events')
      .select('*')
      .gte('deadline', new Date().toISOString().split('T')[0])
      .lte('days_left', daysAhead)
      .order('deadline');
    if (error) { throw error; }
    return data || [];
  }
}

/**
 * Additional service for degree overviews and career path variations.
 */
export class CareerService {
  static async getDegreeOverviews(): Promise<DegreeOverview[]> {
    // For now, return mock data since we don't have this table yet
    return [
      {
        id: '1',
        degree: 'B.Tech Computer Science',
        description: 'Bachelor of Technology in Computer Science & Engineering',
        jobs: ['Software Developer', 'Data Scientist', 'AI Engineer', 'Cybersecurity Analyst'],
        higher_studies: ['M.Tech CS', 'MS Computer Science', 'MBA', 'Data Science Masters']
      },
      {
        id: '2',
        degree: 'B.Tech Electronics',
        description: 'Bachelor of Technology in Electronics & Communication',
        jobs: ['Hardware Engineer', 'Embedded Systems Engineer', 'Network Engineer', 'VLSI Designer'],
        higher_studies: ['M.Tech Electronics', 'MS EE', 'MBA', 'PhD Electronics']
      },
      {
        id: '3',
        degree: 'B.Sc Data Science',
        description: 'Bachelor of Science in Data Science',
        jobs: ['Data Analyst', 'Machine Learning Engineer', 'Business Analyst', 'Research Scientist'],
        higher_studies: ['M.Sc Data Science', 'MBA Analytics', 'PhD Statistics', 'MS AI/ML']
      }
    ];
  }

  static async getAllDegreesForGraph(): Promise<string[]> {
    return CareerPathService.getAllDegrees();
  }

  static async getGraphDataForDegree(degreeName: string): Promise<CareerPathData> {
    return CareerPathService.getCareerPathForDegree(degreeName);
  }

  static async getLinearCareerPath(pathType: "engineering" | "medical" | "business"): Promise<CareerPath> {
    // Mock data for different career paths
    const paths = {
      engineering: {
        title: "Engineering Career Path",
        subtitle: "Your journey from Class 12 to becoming an Engineer",
        steps: [
          {
            node: { id: 'step1', name: 'Class 12 PCM', type: 'degree' as const, description: 'Complete Class 12 with Physics, Chemistry, Mathematics', icon: '🎓' },
            timeline: 'Class 12',
            details: ['Score 75%+ in PCM subjects', 'Focus on JEE preparation', 'Complete NCERT thoroughly'],
            color: '#3B82F6'
          },
          {
            node: { id: 'step2', name: 'JEE Preparation', type: 'exam' as const, description: 'Prepare for Joint Entrance Examination', icon: '📝' },
            timeline: 'Class 11-12',
            details: ['Join coaching or self-study', 'Practice previous year papers', 'Take mock tests regularly'],
            color: '#EF4444'
          },
          {
            node: { id: 'step3', name: 'B.Tech Degree', type: 'degree' as const, description: 'Complete Bachelor of Technology', icon: '🎯' },
            timeline: '4 Years',
            details: ['Choose specialization wisely', 'Maintain good CGPA', 'Participate in internships'],
            color: '#8B5CF6'
          },
          {
            node: { id: 'step4', name: 'Engineering Career', type: 'career' as const, description: 'Start your engineering career', icon: '👨‍💻' },
            timeline: 'Lifetime',
            details: ['Apply for jobs in final year', 'Consider higher studies', 'Build professional network'],
            color: '#10B981'
          }
        ]
      },
      medical: {
        title: "Medical Career Path",
        subtitle: "Your journey from Class 12 to becoming a Doctor",
        steps: [
          {
            node: { id: 'step1', name: 'Class 12 PCB', type: 'degree' as const, description: 'Complete Class 12 with Physics, Chemistry, Biology', icon: '🧬' },
            timeline: 'Class 12',
            details: ['Score 90%+ in PCB subjects', 'Focus on NEET preparation', 'Strong foundation in Biology'],
            color: '#DC2626'
          },
          {
            node: { id: 'step2', name: 'NEET Preparation', type: 'exam' as const, description: 'Prepare for National Eligibility cum Entrance Test', icon: '⚕️' },
            timeline: 'Class 11-12',
            details: ['NCERT is most important', 'Practice MCQs extensively', 'Focus on accuracy over speed'],
            color: '#7C2D12'
          },
          {
            node: { id: 'step3', name: 'MBBS Degree', type: 'degree' as const, description: 'Complete Bachelor of Medicine and Surgery', icon: '🏥' },
            timeline: '5.5 Years',
            details: ['Complete all rotations', 'Pass all professional exams', 'Gain clinical experience'],
            color: '#059669'
          },
          {
            node: { id: 'step4', name: 'Medical Practice', type: 'career' as const, description: 'Start medical practice or specialization', icon: '🩺' },
            timeline: 'Lifetime',
            details: ['Choose specialization', 'Complete residency', 'Continuous learning'],
            color: '#0891B2'
          }
        ]
      },
      business: {
        title: "Business Career Path",
        subtitle: "Your journey from Class 12 to Business Leadership",
        steps: [
          {
            node: { id: 'step1', name: 'Class 12', type: 'degree' as const, description: 'Complete Class 12 in any stream', icon: '💼' },
            timeline: 'Class 12',
            details: ['Good academic performance', 'Develop communication skills', 'Understand business basics'],
            color: '#7C3AED'
          },
          {
            node: { id: 'step2', name: 'Graduation', type: 'degree' as const, description: 'Complete Bachelor degree in any field', icon: '🎓' },
            timeline: '3-4 Years',
            details: ['Maintain good grades', 'Gain work experience', 'Develop leadership skills'],
            color: '#2563EB'
          },
          {
            node: { id: 'step3', name: 'MBA Preparation', type: 'exam' as const, description: 'Prepare for CAT/XAT and other MBA entrance exams', icon: '📊' },
            timeline: '1 Year',
            details: ['CAT preparation', 'Work experience helps', 'Strong quantitative skills'],
            color: '#DC2626'
          },
          {
            node: { id: 'step4', name: 'Business Career', type: 'career' as const, description: 'Leadership roles in business', icon: '🚀' },
            timeline: 'Lifetime',
            details: ['Management roles', 'Entrepreneurship', 'Strategic thinking'],
            color: '#059669'
          }
        ]
      }
    };
    
    return paths[pathType];
  }
}

/**
 * Handles user profiles, profile questions, and AI recommendations.
 */
export class ProfileService {
  static async getUserProfile(firebaseUid: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('firebase_uid', firebaseUid)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No profile found
      }
      throw error;
    }
    return data;
  }

  static async createUserProfile(profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(profile)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateUserProfile(firebaseUid: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('firebase_uid', firebaseUid)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async shouldShowProfileCompletion(firebaseUid: string): Promise<boolean> {
    const profile = await this.getUserProfile(firebaseUid);
    return !profile || !profile.profile_completed;
  }

  static async getProfileQuestions(): Promise<ProfileQuestion[]> {
    const { data, error } = await supabase
      .from('profile_questions')
      .select('*')
      .order('order_index');
    
    if (error) throw error;
    return data || [];
  }

  static async saveProfileResponses(
    userProfileId: string, 
    responses: Omit<ProfileResponse, 'id' | 'user_profile_id' | 'created_at'>[]
  ): Promise<void> {
    const responsesWithProfileId = responses.map(response => ({
      ...response,
      user_profile_id: userProfileId
    }));

    const { error } = await supabase
      .from('user_profile_responses')
      .upsert(responsesWithProfileId, { onConflict: 'user_profile_id,question_id' });
    
    if (error) throw error;
  }

  static async generateAIRecommendations(userProfileId: string): Promise<AIRecommendation[]> {
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userProfileId)
      .single();

    if (profileError) throw profileError;

    // Clear existing recommendations
    await supabase
      .from('ai_recommendations')
      .delete()
      .eq('user_profile_id', userProfileId);

    const recommendations: Omit<AIRecommendation, 'id' | 'created_at' | 'updated_at'>[] = [];
    const interests = profile.career_interests;
    const subjects = profile.current_subjects;

    // Generate career path recommendations based on interests
    if (interests.includes('Engineering & Technology')) {
      recommendations.push({
        user_profile_id: userProfileId,
        recommendation_type: 'career_path',
        recommendation_title: 'Engineering Career Path',
        recommendation_description: 'Based on your interest in technology and engineering, consider pursuing B.Tech in Computer Science, Electronics, or Mechanical Engineering.',
        confidence_score: 0.85,
        reasons: ['Strong interest in Engineering & Technology', 'Good problem-solving potential'],
        recommended_actions: [
          'Research different engineering branches',
          'Prepare for JEE Main/Advanced',
          'Explore top engineering colleges'
        ],
        priority_level: 'high',
        is_active: true
      });
    }

    if (interests.includes('Medical & Healthcare')) {
      recommendations.push({
        user_profile_id: userProfileId,
        recommendation_type: 'career_path',
        recommendation_title: 'Medical Career Path',
        recommendation_description: 'Your interest in healthcare suggests MBBS, BDS, or other medical programs could be ideal for you.',
        confidence_score: 0.80,
        reasons: ['Interest in Medical & Healthcare', 'Desire to help others'],
        recommended_actions: [
          'Prepare for NEET exam',
          'Research medical colleges',
          'Consider various medical specializations'
        ],
        priority_level: 'high',
        is_active: true
      });
    }

    if (interests.includes('Business & Finance')) {
      recommendations.push({
        user_profile_id: userProfileId,
        recommendation_type: 'career_path',
        recommendation_title: 'Business & Finance Career',
        recommendation_description: 'Consider pursuing BBA, B.Com, or Economics followed by MBA for a successful career in business.',
        confidence_score: 0.75,
        reasons: ['Interest in Business & Finance', 'Leadership potential'],
        recommended_actions: [
          'Prepare for CAT/XAT exams',
          'Gain business knowledge',
          'Look into top business schools'
        ],
        priority_level: 'medium',
        is_active: true
      });
    }

    // Generate degree recommendations based on current subjects
    if (profile.current_class.includes('12') || profile.current_class.includes('11')) {
      if (subjects.includes('Mathematics') && subjects.includes('Physics')) {
        recommendations.push({
          user_profile_id: userProfileId,
          recommendation_type: 'degree_program',
          recommendation_title: 'B.Tech Computer Science',
          recommendation_description: 'With your strong foundation in Math and Physics, B.Tech CS offers excellent career prospects.',
          confidence_score: 0.90,
          reasons: ['Strong Math and Physics background', 'High demand in job market'],
          recommended_actions: [
            'Focus on JEE preparation',
            'Learn basic programming',
            'Research top engineering colleges'
          ],
          priority_level: 'high',
          is_active: true
        });
      }

      if (subjects.includes('Biology') && subjects.includes('Chemistry')) {
        recommendations.push({
          user_profile_id: userProfileId,
          recommendation_type: 'degree_program',
          recommendation_title: 'MBBS',
          recommendation_description: 'Your PCB background makes you eligible for medical entrance exams and MBBS program.',
          confidence_score: 0.85,
          reasons: ['PCB subject combination', 'Interest in healthcare'],
          recommended_actions: [
            'Prepare for NEET thoroughly',
            'Understand medical field requirements',
            'Research medical colleges'
          ],
          priority_level: 'high',
          is_active: true
        });
      }
    }

    // Insert recommendations
    if (recommendations.length > 0) {
      const { data, error } = await supabase
        .from('ai_recommendations')
        .insert(recommendations)
        .select();

      if (error) throw error;

      // Update profile to mark that recommendations have been generated
      await supabase
        .from('user_profiles')
        .update({ wants_ai_recommendations: true })
        .eq('id', userProfileId);

      return data;
    }

    return [];
  }

  static async getUserRecommendations(userProfileId: string): Promise<AIRecommendation[]> {
    const { data, error } = await supabase
      .from('ai_recommendations')
      .select('*')
      .eq('user_profile_id', userProfileId)
      .eq('is_active', true)
      .order('confidence_score', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async generateProfilePrompt(userProfileId: string): Promise<string> {
    const profile = await this.getUserProfile(userProfileId);
    if (!profile) throw new Error('Profile not found');

    return `User Profile for AI Career Guidance:
    - Name: ${profile.full_name}
    - Education: ${profile.current_education}, ${profile.current_class}
    - Location: ${profile.location}
    - Career Interests: ${profile.career_interests.join(', ')}
    - Current Subjects: ${profile.current_subjects.join(', ')}
    - Strengths: ${profile.strengths.join(', ')}
    - Academic Goals: ${profile.academic_goals || 'Not specified'}
    - Study Mode Preference: ${profile.preferred_study_mode || 'Not specified'}
    
    Please provide personalized career guidance based on this profile information.`;
  }
}
