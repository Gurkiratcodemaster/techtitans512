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