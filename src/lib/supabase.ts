import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for Supabase data
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

// Service class for career path data
// Additional content types for comprehensive data migration
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

export class CareerPathService {
  static async getAllCareerNodes(): Promise<CareerNode[]> {
    const { data, error } = await supabase
      .from('career_nodes')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching career nodes:', error);
      throw error;
    }

    return data || [];
  }

  static async getAllCareerLinks(): Promise<CareerLink[]> {
    const { data, error } = await supabase
      .from('career_links')
      .select('*');

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
    const { data, error } = await supabase
      .from('career_nodes')
      .select('*')
      .eq('type', type)
      .order('name');

    if (error) {
      console.error('Error fetching nodes by type:', error);
      throw error;
    }

    return data || [];
  }

  static async getConnectedNodes(
    nodeId: string, 
    direction: 'in' | 'out' | 'both' = 'both'
  ): Promise<CareerNode[]> {
    let query = supabase.from('career_links').select(`
      source_id,
      target_id,
      career_nodes_source:career_nodes!career_links_source_id_fkey(*),
      career_nodes_target:career_nodes!career_links_target_id_fkey(*)
    `);

    if (direction === 'out') {
      query = query.eq('source_id', nodeId);
    } else if (direction === 'in') {
      query = query.eq('target_id', nodeId);
    } else {
      query = query.or(`source_id.eq.${nodeId},target_id.eq.${nodeId}`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching connected nodes:', error);
      throw error;
    }

    if (!data) return [];

    const connections: CareerNode[] = [];
    
    data.forEach((link: any) => {
      if (direction === 'out' || direction === 'both') {
        if (link.source_id === nodeId && link.career_nodes_target) {
          connections.push(link.career_nodes_target);
        }
      }
      if (direction === 'in' || direction === 'both') {
        if (link.target_id === nodeId && link.career_nodes_source) {
          connections.push(link.career_nodes_source);
        }
      }
    });

    return connections;
  }

  static async filterDataByDegrees(recommendedDegrees: string[]): Promise<CareerPathData> {
    // Map degree names to IDs (you might want to store this mapping in Supabase too)
    const degreeNameToId: Record<string, string> = {
      "B.Tech Computer Science": "btech-cs",
      "B.Tech Electronics": "btech-ece", 
      "B.Sc Data Science": "bsc-data-science",
      "BCA": "bca",
      "B.Tech Mechanical": "btech-mech",
      "B.Tech Civil": "btech-civil"
    };

    const relevantDegreeIds = recommendedDegrees
      .map(degree => degreeNameToId[degree])
      .filter(Boolean);

    if (relevantDegreeIds.length === 0) {
      return { nodes: [], links: [] };
    }

    // Get all data first
    const allData = await this.getCareerPathData();
    
    // Filter logic (same as before but with Supabase data)
    const relevantNodeIds = new Set<string>();
    const relevantLinks: CareerLink[] = [];

    // Add recommended degrees
    relevantDegreeIds.forEach(id => relevantNodeIds.add(id));

    // Add connected nodes and links
    allData.links.forEach(link => {
      const sourceRelevant = relevantDegreeIds.includes(link.source_id) || relevantNodeIds.has(link.source_id);
      const targetRelevant = relevantDegreeIds.includes(link.target_id) || relevantNodeIds.has(link.target_id);
      
      if (sourceRelevant || targetRelevant) {
        relevantNodeIds.add(link.source_id);
        relevantNodeIds.add(link.target_id);
        relevantLinks.push(link);
      }
    });

    const relevantNodes = allData.nodes.filter(node => relevantNodeIds.has(node.id));

    return {
      nodes: relevantNodes,
      links: relevantLinks
    };
  }

  // Migration helper - check if data exists
  static async isDataMigrated(): Promise<boolean> {
    const { count, error } = await supabase
      .from('career_nodes')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error checking migration status:', error);
      return false;
    }

    return (count || 0) > 0;
  }

  // Search functionality
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

// College Service
export class CollegeService {
  static async getAllColleges(): Promise<College[]> {
    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching colleges:', error);
      throw error;
    }

    return data || [];
  }

  static async searchColleges(filters: {
    searchTerm?: string;
    state?: string;
    type?: string;
    course?: string;
  }): Promise<College[]> {
    let query = supabase.from('colleges').select('*');

    if (filters.searchTerm) {
      query = query.or(`name.ilike.%${filters.searchTerm}%,location.ilike.%${filters.searchTerm}%,state.ilike.%${filters.searchTerm}%`);
    }

    if (filters.state) {
      query = query.eq('state', filters.state);
    }

    if (filters.type) {
      query = query.eq('type', filters.type);
    }

    if (filters.course) {
      query = query.contains('courses', [filters.course]);
    }

    const { data, error } = await query.order('name');

    if (error) {
      console.error('Error searching colleges:', error);
      throw error;
    }

    return data || [];
  }

  static async getCollegeById(id: string): Promise<College | null> {
    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching college:', error);
      return null;
    }

    return data;
  }
}

// Scholarship Service
export class ScholarshipService {
  static async getAllScholarships(): Promise<Scholarship[]> {
    const { data, error } = await supabase
      .from('scholarships')
      .select('*')
      .order('deadline');

    if (error) {
      console.error('Error fetching scholarships:', error);
      throw error;
    }

    return data || [];
  }

  static async searchScholarships(filters: {
    searchTerm?: string;
    category?: string;
    level?: string;
    status?: string;
  }): Promise<Scholarship[]> {
    let query = supabase.from('scholarships').select('*');

    if (filters.searchTerm) {
      query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%,provider.ilike.%${filters.searchTerm}%`);
    }

    if (filters.category && filters.category !== 'All') {
      query = query.eq('category', filters.category);
    }

    if (filters.level && filters.level !== 'All') {
      query = query.or(`level.eq.${filters.level},level.eq.All`);
    }

    if (filters.status && filters.status !== 'All') {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query.order('deadline');

    if (error) {
      console.error('Error searching scholarships:', error);
      throw error;
    }

    return data || [];
  }
}

// Study Materials Service
export class StudyMaterialService {
  static async getAllStudyMaterials(): Promise<StudyMaterial[]> {
    const { data, error } = await supabase
      .from('study_materials')
      .select('*')
      .order('title');

    if (error) {
      console.error('Error fetching study materials:', error);
      throw error;
    }

    return data || [];
  }

  static async searchStudyMaterials(filters: {
    searchTerm?: string;
    subject?: string;
    class?: string;
    type?: string;
  }): Promise<StudyMaterial[]> {
    let query = supabase.from('study_materials').select('*');

    if (filters.searchTerm) {
      query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
    }

    if (filters.subject && filters.subject !== 'All') {
      query = query.eq('subject', filters.subject);
    }

    if (filters.class && filters.class !== 'All') {
      query = query.eq('class', filters.class);
    }

    if (filters.type && filters.type !== 'All') {
      query = query.eq('type', filters.type);
    }

    const { data, error } = await query.order('title');

    if (error) {
      console.error('Error searching study materials:', error);
      throw error;
    }

    return data || [];
  }
}

// Skill Programs Service
export class SkillProgramService {
  static async getAllSkillPrograms(): Promise<SkillProgram[]> {
    const { data, error } = await supabase
      .from('skill_programs')
      .select('*')
      .order('title');

    if (error) {
      console.error('Error fetching skill programs:', error);
      throw error;
    }

    return data || [];
  }

  static async searchSkillPrograms(filters: {
    category?: string;
    level?: string;
  }): Promise<SkillProgram[]> {
    let query = supabase.from('skill_programs').select('*');

    if (filters.category && filters.category !== 'All') {
      query = query.eq('category', filters.category);
    }

    if (filters.level && filters.level !== 'All') {
      query = query.eq('level', filters.level);
    }

    const { data, error } = await query.order('title');

    if (error) {
      console.error('Error searching skill programs:', error);
      throw error;
    }

    return data || [];
  }
}
