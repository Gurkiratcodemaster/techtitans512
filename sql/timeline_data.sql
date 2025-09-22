-- Create timeline_events table in Supabase
CREATE TABLE IF NOT EXISTS timeline_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('admission', 'scholarship', 'entrance', 'career')),
    date TEXT NOT NULL,
    deadline DATE NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'closed')),
    days_left INTEGER GENERATED ALWAYS AS (
        CASE 
            WHEN deadline < CURRENT_DATE THEN -1
            ELSE (deadline - CURRENT_DATE)
        END
    ) STORED,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies for timeline_events
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY "Allow read access to timeline events" 
ON timeline_events FOR SELECT 
USING (true);

-- Allow insert/update/delete for authenticated users (you can modify this based on your needs)
CREATE POLICY "Allow insert for authenticated users" 
ON timeline_events FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow update for authenticated users" 
ON timeline_events FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Insert sample timeline data
INSERT INTO timeline_events (title, category, date, deadline, description, priority, link) VALUES
('JEE Main 2025 Registration', 'entrance', 'Dec 30, 2024', '2024-12-30', 'Registration for Joint Entrance Examination (Main) for admission to NITs, IIITs, and other centrally funded technical institutions.', 'high', 'https://jeemain.nta.nic.in/'),
('NEET UG 2025 Application', 'entrance', 'Jan 15, 2025', '2025-01-15', 'Application process opens for National Eligibility cum Entrance Test for medical and dental colleges.', 'high', NULL),
('Merit-based Scholarships', 'scholarship', 'Feb 28, 2025', '2025-02-28', 'Various government and private merit-based scholarship applications deadline.', 'medium', NULL),
('DU UG Admission', 'admission', 'May 15, 2025', '2025-05-15', 'Delhi University undergraduate admission process begins for various courses.', 'medium', NULL),
('CBSE Class 12 Results', 'admission', 'May 20, 2025', '2025-05-20', 'Central Board of Secondary Education announces Class 12 board examination results.', 'high', NULL),
('Post Matric Scholarship', 'scholarship', 'Mar 31, 2025', '2025-03-31', 'Post Matric Scholarship Scheme for SC/ST/OBC students application deadline.', 'medium', NULL),
('Career Fair 2025', 'career', 'Jan 30, 2025', '2025-01-30', 'National Career Fair featuring top companies and educational institutions.', 'low', NULL),
('Engineering Entrance Coaching', 'career', 'Feb 10, 2025', '2025-02-10', 'Free coaching program registration for engineering entrance exams.', 'medium', NULL);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_timeline_events_updated_at 
    BEFORE UPDATE ON timeline_events 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_timeline_events_category ON timeline_events(category);
CREATE INDEX idx_timeline_events_priority ON timeline_events(priority);
CREATE INDEX idx_timeline_events_status ON timeline_events(status);
CREATE INDEX idx_timeline_events_deadline ON timeline_events(deadline);