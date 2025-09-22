-- Create career path tables in Supabase

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

-- Create degree_overviews table for simplified career path page
CREATE TABLE IF NOT EXISTS degree_overviews (
    id TEXT PRIMARY KEY,
    degree TEXT NOT NULL,
    description TEXT NOT NULL,
    jobs TEXT[] NOT NULL,
    higher_studies TEXT[] NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE career_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE degree_overviews ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow read access to career nodes" 
ON career_nodes FOR SELECT 
USING (true);

CREATE POLICY "Allow read access to career links" 
ON career_links FOR SELECT 
USING (true);

CREATE POLICY "Allow read access to degree overviews" 
ON degree_overviews FOR SELECT 
USING (true);

-- Insert sample career nodes data
INSERT INTO career_nodes (id, name, type, description, duration, difficulty, icon) VALUES
-- Degrees
('btech-cs', 'B.Tech Computer Science', 'degree', 'Bachelor of Technology in Computer Science & Engineering', '4 years', 'Medium', 'CS'),
('btech-ece', 'B.Tech Electronics', 'degree', 'Bachelor of Technology in Electronics & Communication', '4 years', 'Medium', 'EC'),
('bsc-data-science', 'B.Sc Data Science', 'degree', 'Bachelor of Science in Data Science', '3 years', 'Medium', 'DS'),
('bca', 'BCA', 'degree', 'Bachelor of Computer Applications', '3 years', 'Easy', 'CA'),
('btech-mech', 'B.Tech Mechanical', 'degree', 'Bachelor of Technology in Mechanical Engineering', '4 years', 'Hard', 'ME'),
('btech-civil', 'B.Tech Civil', 'degree', 'Bachelor of Technology in Civil Engineering', '4 years', 'Medium', 'CE'),

-- Entrance Exams
('jee-main', 'JEE Main', 'exam', 'Joint Entrance Examination for Engineering', NULL, 'Hard', 'JE'),
('jee-advanced', 'JEE Advanced', 'exam', 'Advanced level exam for IIT admission', NULL, 'Hard', 'JA'),
('bitsat', 'BITSAT', 'exam', 'Birla Institute of Technology and Science Admission Test', NULL, 'Medium', 'BT'),
('cucet', 'CUCET', 'exam', 'Central Universities Common Entrance Test', NULL, 'Medium', 'CU'),

-- Specializations
('ai-ml', 'AI & Machine Learning', 'specialization', 'Artificial Intelligence and Machine Learning', NULL, NULL, 'AI'),
('cyber-security', 'Cyber Security', 'specialization', 'Information Security and Ethical Hacking', NULL, NULL, 'CY'),
('web-dev', 'Web Development', 'specialization', 'Full Stack Web Development', NULL, NULL, 'WD'),
('mobile-dev', 'Mobile Development', 'specialization', 'iOS and Android App Development', NULL, NULL, 'MD'),
('embedded-systems', 'Embedded Systems', 'specialization', 'IoT and Embedded System Design', NULL, NULL, 'ES'),
('vlsi-design', 'VLSI Design', 'specialization', 'Very Large Scale Integration', NULL, NULL, 'VL'),

-- Career Paths
('software-engineer', 'Software Engineer', 'career', 'Design and develop software applications', NULL, NULL, 'SE'),
('data-scientist', 'Data Scientist', 'career', 'Analyze complex data to help companies make decisions', NULL, NULL, 'DS'),
('ai-engineer', 'AI Engineer', 'career', 'Develop AI and ML solutions', NULL, NULL, 'AE'),
('cybersecurity-analyst', 'Cybersecurity Analyst', 'career', 'Protect organizations from cyber threats', NULL, NULL, 'CA'),
('mobile-developer', 'Mobile App Developer', 'career', 'Create mobile applications for iOS and Android', NULL, NULL, 'MD'),
('hardware-engineer', 'Hardware Engineer', 'career', 'Design and develop computer hardware', NULL, NULL, 'HE'),
('civil-engineer', 'Civil Engineer', 'career', 'Design and supervise construction projects', NULL, NULL, 'CE'),
('mechanical-engineer', 'Mechanical Engineer', 'career', 'Design and develop mechanical systems', NULL, NULL, 'ME');

-- Insert career links data
INSERT INTO career_links (id, source_id, target_id, type) VALUES
-- Exam to Degree connections
('link_1', 'jee-main', 'btech-cs', 'leads_to'),
('link_2', 'jee-main', 'btech-ece', 'leads_to'),
('link_3', 'jee-main', 'btech-mech', 'leads_to'),
('link_4', 'jee-main', 'btech-civil', 'leads_to'),
('link_5', 'jee-advanced', 'btech-cs', 'leads_to'),
('link_6', 'bitsat', 'btech-cs', 'leads_to'),
('link_7', 'bitsat', 'btech-ece', 'leads_to'),
('link_8', 'cucet', 'bca', 'leads_to'),
('link_9', 'cucet', 'bsc-data-science', 'leads_to'),

-- Degree to Specialization connections
('link_10', 'btech-cs', 'ai-ml', 'leads_to'),
('link_11', 'btech-cs', 'cyber-security', 'leads_to'),
('link_12', 'btech-cs', 'web-dev', 'leads_to'),
('link_13', 'btech-cs', 'mobile-dev', 'leads_to'),
('link_14', 'btech-ece', 'embedded-systems', 'leads_to'),
('link_15', 'btech-ece', 'vlsi-design', 'leads_to'),
('link_16', 'bca', 'web-dev', 'leads_to'),
('link_17', 'bca', 'mobile-dev', 'leads_to'),
('link_18', 'bsc-data-science', 'ai-ml', 'leads_to'),

-- Specialization to Career connections
('link_19', 'ai-ml', 'ai-engineer', 'leads_to'),
('link_20', 'ai-ml', 'data-scientist', 'leads_to'),
('link_21', 'cyber-security', 'cybersecurity-analyst', 'leads_to'),
('link_22', 'web-dev', 'software-engineer', 'leads_to'),
('link_23', 'mobile-dev', 'mobile-developer', 'leads_to'),
('link_24', 'embedded-systems', 'hardware-engineer', 'leads_to'),
('link_25', 'vlsi-design', 'hardware-engineer', 'leads_to'),

-- Direct Degree to Career connections
('link_26', 'btech-cs', 'software-engineer', 'leads_to'),
('link_27', 'btech-ece', 'hardware-engineer', 'leads_to'),
('link_28', 'btech-civil', 'civil-engineer', 'leads_to'),
('link_29', 'btech-mech', 'mechanical-engineer', 'leads_to'),
('link_30', 'bca', 'software-engineer', 'leads_to'),
('link_31', 'bsc-data-science', 'data-scientist', 'leads_to');

-- Insert degree overviews data
INSERT INTO degree_overviews (id, degree, description, jobs, higher_studies) VALUES
('1', 'B.Tech Computer Science', 'Bachelor of Technology in Computer Science & Engineering', 
 ARRAY['Software Developer', 'Data Scientist', 'AI Engineer', 'Cybersecurity Analyst', 'Mobile App Developer', 'Web Developer'], 
 ARRAY['M.Tech Computer Science', 'MS Computer Science', 'MBA', 'Data Science Masters', 'PhD Computer Science']),
 
('2', 'B.Tech Electronics', 'Bachelor of Technology in Electronics & Communication', 
 ARRAY['Hardware Engineer', 'Embedded Systems Engineer', 'Network Engineer', 'VLSI Designer', 'Signal Processing Engineer'], 
 ARRAY['M.Tech Electronics', 'MS Electrical Engineering', 'MBA', 'PhD Electronics', 'MS VLSI Design']),
 
('3', 'B.Sc Data Science', 'Bachelor of Science in Data Science', 
 ARRAY['Data Analyst', 'Machine Learning Engineer', 'Business Analyst', 'Research Scientist', 'Data Engineer'], 
 ARRAY['M.Sc Data Science', 'MBA Analytics', 'PhD Statistics', 'MS AI/ML', 'MS Business Analytics']),
 
('4', 'BCA', 'Bachelor of Computer Applications', 
 ARRAY['Software Developer', 'Web Developer', 'Database Administrator', 'System Analyst', 'Technical Support'], 
 ARRAY['MCA', 'M.Tech Computer Science', 'MBA IT', 'MS Computer Applications', 'Certification Courses']),
 
('5', 'B.Tech Mechanical', 'Bachelor of Technology in Mechanical Engineering', 
 ARRAY['Mechanical Engineer', 'Design Engineer', 'Production Engineer', 'Quality Engineer', 'Project Manager'], 
 ARRAY['M.Tech Mechanical', 'MS Mechanical Engineering', 'MBA', 'PhD Mechanical Engineering', 'MS Design Engineering']),
 
('6', 'B.Tech Civil', 'Bachelor of Technology in Civil Engineering', 
 ARRAY['Civil Engineer', 'Structural Engineer', 'Construction Manager', 'Urban Planner', 'Environmental Engineer'], 
 ARRAY['M.Tech Civil', 'MS Civil Engineering', 'MBA Construction Management', 'PhD Civil Engineering', 'MS Structural Engineering']);

-- Create function to get career path for a specific degree
CREATE OR REPLACE FUNCTION get_career_path_for_degree(degree_name TEXT)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    WITH RECURSIVE career_path AS (
        -- Start with the degree node
        SELECT cn.id, cn.name, cn.type, cn.description, cn.requirements, cn.salary, cn.duration, cn.difficulty, cn.icon
        FROM career_nodes cn
        WHERE cn.name = degree_name AND cn.type = 'degree'
        
        UNION ALL
        
        -- Follow the links to connected nodes
        SELECT cn.id, cn.name, cn.type, cn.description, cn.requirements, cn.salary, cn.duration, cn.difficulty, cn.icon
        FROM career_nodes cn
        JOIN career_links cl ON (cn.id = cl.target_id OR cn.id = cl.source_id)
        JOIN career_path cp ON (cl.source_id = cp.id OR cl.target_id = cp.id)
        WHERE cn.id != cp.id
    ),
    nodes_data AS (
        SELECT json_agg(
            json_build_object(
                'id', id,
                'name', name,
                'type', type,
                'description', description,
                'requirements', requirements,
                'salary', salary,
                'duration', duration,
                'difficulty', difficulty,
                'icon', icon
            )
        ) AS nodes
        FROM (SELECT DISTINCT * FROM career_path) AS unique_nodes
    ),
    links_data AS (
        SELECT json_agg(
            json_build_object(
                'id', cl.id,
                'source_id', cl.source_id,
                'target_id', cl.target_id,
                'type', cl.type,
                'description', cl.description
            )
        ) AS links
        FROM career_links cl
        WHERE EXISTS (
            SELECT 1 FROM career_path cp1 WHERE cp1.id = cl.source_id
        ) AND EXISTS (
            SELECT 1 FROM career_path cp2 WHERE cp2.id = cl.target_id
        )
    )
    SELECT json_build_object(
        'nodes', COALESCE(nd.nodes, '[]'::json),
        'links', COALESCE(ld.links, '[]'::json)
    ) INTO result
    FROM nodes_data nd, links_data ld;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_career_nodes_type ON career_nodes(type);
CREATE INDEX IF NOT EXISTS idx_career_nodes_name ON career_nodes(name);
CREATE INDEX IF NOT EXISTS idx_career_links_source ON career_links(source_id);
CREATE INDEX IF NOT EXISTS idx_career_links_target ON career_links(target_id);
CREATE INDEX IF NOT EXISTS idx_degree_overviews_degree ON degree_overviews(degree);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_career_nodes_updated_at 
    BEFORE UPDATE ON career_nodes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_career_links_updated_at 
    BEFORE UPDATE ON career_links 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_degree_overviews_updated_at 
    BEFORE UPDATE ON degree_overviews 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();