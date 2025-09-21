import { createClient } from '@supabase/supabase-js';
import { careerPathData, CareerNode, CareerLink } from '../data/careerPathData';

// Import hardcoded data from pages (we'll define this inline since it's extracted)
const collegesData = [
  {
    id: "1",
    name: "University of Jammu",
    location: "Jammu",
    state: "Jammu and Kashmir",
    type: "Government",
    courses: ["B.A.", "B.Sc.", "B.Com.", "BBA", "BCA", "M.A.", "M.Sc.", "MBA"],
    cutoff: { general: 85, obc: 80, sc: 75, st: 70 },
    facilities: ["Hostel", "Library", "Laboratory", "Internet", "Sports Complex", "Canteen"],
    medium_of_instruction: ["English", "Hindi"],
    website: "https://jammuuniversity.ac.in",
    fees: { tuition: "₹15,000/year", hostel: "₹25,000/year" }
  },
  {
    id: "2", 
    name: "Government College for Women, Jammu",
    location: "Jammu",
    state: "Jammu and Kashmir",
    type: "Government",
    courses: ["B.A.", "B.Sc.", "B.Com.", "M.A.", "M.Sc."],
    cutoff: { general: 80, obc: 75, sc: 70, st: 65 },
    facilities: ["Library", "Laboratory", "Internet", "Computer Lab", "Canteen"],
    medium_of_instruction: ["English"],
    website: "https://gcwjammu.ac.in",
    fees: { tuition: "₹12,000/year", hostel: "Not Available" }
  },
  {
    id: "3",
    name: "Government Medical College, Jammu",
    location: "Jammu",
    state: "Jammu and Kashmir",
    type: "Government",
    courses: ["MBBS", "MD", "MS"],
    cutoff: { general: 600, obc: 580, sc: 550, st: 530 },
    facilities: ["Hostel", "Library", "Laboratory", "Hospital", "Internet", "Medical Equipment"],
    medium_of_instruction: ["English"],
    website: "https://gmcjammu.nic.in",
    fees: { tuition: "₹50,000/year", hostel: "₹30,000/year" }
  },
  {
    id: "4",
    name: "Shri Mata Vaishno Devi University",
    location: "Katra",
    state: "Jammu and Kashmir",
    type: "Government",
    courses: ["B.Tech", "MBA", "M.Tech", "BCA", "MCA", "B.Sc.", "M.Sc."],
    cutoff: { general: 75, obc: 70, sc: 65, st: 60 },
    facilities: ["Hostel", "Library", "Laboratory", "Internet", "Sports Complex", "Cafeteria"],
    medium_of_instruction: ["English"],
    website: "https://smvdu.ac.in",
    fees: { tuition: "₹80,000/year", hostel: "₹40,000/year" }
  },
  {
    id: "5",
    name: "Central University of Kashmir",
    location: "Ganderbal",
    state: "Jammu and Kashmir",
    type: "Government",
    courses: ["B.A.", "B.Sc.", "B.Tech", "MBA", "M.A.", "M.Sc.", "Ph.D."],
    cutoff: { general: 82, obc: 77, sc: 72, st: 67 },
    facilities: ["Hostel", "Library", "Laboratory", "Internet", "Sports", "Medical Center"],
    medium_of_instruction: ["English", "Urdu"],
    website: "https://cukashmir.ac.in",
    fees: { tuition: "₹20,000/year", hostel: "₹35,000/year" }
  },
  {
    id: "6",
    name: "Delhi University",
    location: "Delhi",
    state: "Delhi",
    type: "Government",
    courses: ["B.A.", "B.Sc.", "B.Com.", "BBA", "MBA", "M.A.", "M.Sc."],
    cutoff: { general: 95, obc: 90, sc: 85, st: 80 },
    facilities: ["Hostel", "Library", "Laboratory", "Internet", "Sports Complex", "Multiple Campuses"],
    medium_of_instruction: ["English", "Hindi"],
    website: "https://du.ac.in",
    fees: { tuition: "₹25,000/year", hostel: "₹45,000/year" }
  },
  {
    id: "7",
    name: "Jawaharlal Nehru University",
    location: "Delhi",
    state: "Delhi", 
    type: "Government",
    courses: ["B.A.", "M.A.", "M.Phil", "Ph.D.", "MBA"],
    cutoff: { general: 90, obc: 85, sc: 80, st: 75 },
    facilities: ["Hostel", "Library", "Laboratory", "Internet", "Cultural Center"],
    medium_of_instruction: ["English"],
    website: "https://jnu.ac.in",
    fees: { tuition: "₹20,000/year", hostel: "₹40,000/year" }
  },
  {
    id: "8",
    name: "Banaras Hindu University",
    location: "Varanasi",
    state: "Uttar Pradesh",
    type: "Government",
    courses: ["B.A.", "B.Sc.", "B.Tech", "MBBS", "MBA", "M.A.", "M.Sc."],
    cutoff: { general: 88, obc: 83, sc: 78, st: 73 },
    facilities: ["Hostel", "Library", "Laboratory", "Internet", "Hospital", "Sports"],
    medium_of_instruction: ["English", "Hindi"],
    website: "https://bhu.ac.in",
    fees: { tuition: "₹30,000/year", hostel: "₹35,000/year" }
  }
];

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface CareerPathTable {
  id: string;
  name: string;
  type: 'degree' | 'exam' | 'career' | 'specialization';
  description: string;
  requirements?: string[];
  salary?: string;
  duration?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  icon?: string;
}

interface CareerPathLinkTable {
  id: string;
  source_id: string;
  target_id: string;
  type: 'requires' | 'leads_to' | 'optional';
  description?: string;
}

async function migrateCareerPathData() {
  console.log('🚀 Starting career path data migration to Supabase...');

  try {
    // 1. Create tables if they don't exist
    console.log('📋 Creating tables...');
    
    // Create career_nodes table
    const { error: nodeTableError } = await supabase.rpc('create_career_nodes_table');
    if (nodeTableError && !nodeTableError.message.includes('already exists')) {
      console.error('Error creating career_nodes table:', nodeTableError);
      return;
    }

    // Create career_links table  
    const { error: linkTableError } = await supabase.rpc('create_career_links_table');
    if (linkTableError && !linkTableError.message.includes('already exists')) {
      console.error('Error creating career_links table:', linkTableError);
      return;
    }

    // 2. Clear existing data
    console.log('🧹 Clearing existing data...');
    await supabase.from('career_links').delete().neq('id', '');
    await supabase.from('career_nodes').delete().neq('id', '');

    // 3. Insert career nodes
    console.log('📊 Inserting career nodes...');
    const nodeData: CareerPathTable[] = careerPathData.nodes.map(node => ({
      id: node.id,
      name: node.name,
      type: node.type,
      description: node.description,
      requirements: node.requirements || [],
      salary: node.salary,
      duration: node.duration,
      difficulty: node.difficulty,
      icon: node.icon
    }));

    const { error: nodesError } = await supabase
      .from('career_nodes')
      .insert(nodeData);

    if (nodesError) {
      console.error('Error inserting career nodes:', nodesError);
      return;
    }
    console.log(`✅ Inserted ${nodeData.length} career nodes`);

    // 4. Insert career links
    console.log('🔗 Inserting career links...');
    const linkData: CareerPathLinkTable[] = careerPathData.links.map((link, index) => ({
      id: `link_${index + 1}`,
      source_id: typeof link.source === 'string' ? link.source : link.source.id,
      target_id: typeof link.target === 'string' ? link.target : link.target.id,
      type: link.type,
      description: link.description
    }));

    const { error: linksError } = await supabase
      .from('career_links')
      .insert(linkData);

    if (linksError) {
      console.error('Error inserting career links:', linksError);
      return;
    }
    console.log(`✅ Inserted ${linkData.length} career links`);

    // 5. Verify data migration
    const { count: nodeCount } = await supabase
      .from('career_nodes')
      .select('*', { count: 'exact', head: true });

    const { count: linkCount } = await supabase
      .from('career_links')
      .select('*', { count: 'exact', head: true });

    console.log(`📈 Migration Summary:`);
    console.log(`   - Career Nodes: ${nodeCount} rows`);
    console.log(`   - Career Links: ${linkCount} rows`);
    console.log('🎉 Career path data migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

async function createSupabaseTables() {
  console.log('🏗️ Creating Supabase tables...');

  const createTablesSQL = `
    -- Create career_nodes table
    CREATE TABLE IF NOT EXISTS career_nodes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('degree', 'exam', 'career', 'specialization')),
      description TEXT NOT NULL,
      requirements TEXT[],
      salary TEXT,
      duration TEXT,
      difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
      icon TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Create career_links table
    CREATE TABLE IF NOT EXISTS career_links (
      id TEXT PRIMARY KEY,
      source_id TEXT NOT NULL REFERENCES career_nodes(id),
      target_id TEXT NOT NULL REFERENCES career_nodes(id),
      type TEXT NOT NULL CHECK (type IN ('requires', 'leads_to', 'optional')),
      description TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_career_nodes_type ON career_nodes(type);
    CREATE INDEX IF NOT EXISTS idx_career_links_source ON career_links(source_id);
    CREATE INDEX IF NOT EXISTS idx_career_links_target ON career_links(target_id);
  `;

  // Note: This would need to be executed in Supabase SQL editor
  console.log('📋 SQL to execute in Supabase SQL editor:');
  console.log(createTablesSQL);
}

async function migrateAllLocalData() {
  console.log('🔄 Starting complete data migration to Supabase...');

  try {
    // 1. Migrate career path data
    await migrateCareerPathData();

    // 2. Here you would add migration for other local data like:
    // - Sample user profiles
    // - Sample quiz results  
    // - Sample colleges data
    // - Sample courses data
    // - Sample careers data

    console.log('✅ All data migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Helper function to delete local data files after successful migration
async function cleanupLocalDataFiles() {
  console.log('🧹 Cleaning up local data files...');
  
  // List of local data files to remove after migration
  const localDataFiles = [
    '../data/careerPathData.ts', // Will be replaced with Supabase queries
  ];

  console.log('📝 Local data files that can be removed:');
  localDataFiles.forEach(file => console.log(`   - ${file}`));
  
  // Note: Actual file deletion would be done manually or with additional logic
  console.log('⚠️  Please manually delete these files after confirming migration success');
}

// Run migration if called directly
if (require.main === module) {
  migrateAllLocalData()
    .then(() => {
      console.log('🎯 Migration process completed!');
      cleanupLocalDataFiles();
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration process failed:', error);
      process.exit(1);
    });
}

export {
  migrateCareerPathData,
  migrateAllLocalData,
  createSupabaseTables
};