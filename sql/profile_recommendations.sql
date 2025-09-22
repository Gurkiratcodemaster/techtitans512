-- Create user profile tables in Supabase

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    firebase_uid TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    phone TEXT,
    location TEXT NOT NULL,
    current_education TEXT NOT NULL,
    current_class TEXT NOT NULL,
    current_subjects TEXT[] NOT NULL,
    career_interests TEXT[] NOT NULL,
    strengths TEXT[] NOT NULL,
    academic_goals TEXT,
    preferred_study_mode TEXT CHECK (preferred_study_mode IN ('online', 'offline', 'hybrid')),
    family_income_range TEXT CHECK (family_income_range IN ('below_2_lakh', '2_5_lakh', '5_10_lakh', '10_20_lakh', 'above_20_lakh')),
    profile_completed BOOLEAN DEFAULT FALSE,
    wants_ai_recommendations BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create profile completion questions table
CREATE TABLE IF NOT EXISTS profile_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'single_choice', 'text', 'rating')),
    options TEXT[], -- For multiple choice questions
    category TEXT NOT NULL, -- 'interests', 'strengths', 'goals', etc.
    order_index INTEGER NOT NULL,
    is_required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create user profile responses table
CREATE TABLE IF NOT EXISTS user_profile_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES profile_questions(id) ON DELETE CASCADE,
    response_text TEXT,
    response_options TEXT[], -- For multiple choice responses
    response_rating INTEGER CHECK (response_rating >= 1 AND response_rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_profile_id, question_id)
);

-- Create AI recommendations table
CREATE TABLE IF NOT EXISTS ai_recommendations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('career_path', 'degree_program', 'entrance_exam', 'scholarship')),
    recommendation_title TEXT NOT NULL,
    recommendation_description TEXT NOT NULL,
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
    reasons TEXT[],
    recommended_actions TEXT[],
    priority_level TEXT DEFAULT 'medium' CHECK (priority_level IN ('high', 'medium', 'low')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profile_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_questions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view own profile" 
ON user_profiles FOR SELECT 
USING (firebase_uid = current_setting('app.current_user_uid', true));

CREATE POLICY "Users can update own profile" 
ON user_profiles FOR UPDATE 
USING (firebase_uid = current_setting('app.current_user_uid', true));

CREATE POLICY "Users can insert own profile" 
ON user_profiles FOR INSERT 
WITH CHECK (firebase_uid = current_setting('app.current_user_uid', true));

-- Create policies for user_profile_responses
CREATE POLICY "Users can view own responses" 
ON user_profile_responses FOR SELECT 
USING (user_profile_id IN (SELECT id FROM user_profiles WHERE firebase_uid = current_setting('app.current_user_uid', true)));

CREATE POLICY "Users can insert own responses" 
ON user_profile_responses FOR INSERT 
WITH CHECK (user_profile_id IN (SELECT id FROM user_profiles WHERE firebase_uid = current_setting('app.current_user_uid', true)));

CREATE POLICY "Users can update own responses" 
ON user_profile_responses FOR UPDATE 
USING (user_profile_id IN (SELECT id FROM user_profiles WHERE firebase_uid = current_setting('app.current_user_uid', true)));

-- Create policies for ai_recommendations
CREATE POLICY "Users can view own recommendations" 
ON ai_recommendations FOR SELECT 
USING (user_profile_id IN (SELECT id FROM user_profiles WHERE firebase_uid = current_setting('app.current_user_uid', true)));

CREATE POLICY "Allow read access to profile questions" 
ON profile_questions FOR SELECT 
USING (true);

-- Insert sample profile questions
INSERT INTO profile_questions (question_text, question_type, options, category, order_index) VALUES
-- Career Interests
('What subjects do you enjoy the most?', 'multiple_choice', 
 ARRAY['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Economics', 'History', 'Literature', 'Art', 'Music'], 
 'interests', 1),
 
('Which career fields interest you?', 'multiple_choice',
 ARRAY['Engineering & Technology', 'Medical & Healthcare', 'Business & Finance', 'Arts & Design', 'Law & Government', 'Education & Research', 'Media & Entertainment', 'Sports & Fitness'],
 'interests', 2),

('What type of work environment do you prefer?', 'single_choice',
 ARRAY['Office environment', 'Laboratory/Research setting', 'Outdoor fieldwork', 'Hospital/Clinical setting', 'Creative studio', 'Remote/Work from home', 'Mixed environments'],
 'interests', 3),

-- Strengths & Skills
('Rate your confidence in Mathematics (1-5)', 'rating', NULL, 'strengths', 4),
('Rate your confidence in Science subjects (1-5)', 'rating', NULL, 'strengths', 5),
('Rate your communication skills (1-5)', 'rating', NULL, 'strengths', 6),
('Rate your problem-solving abilities (1-5)', 'rating', NULL, 'strengths', 7),
('Rate your creativity and artistic skills (1-5)', 'rating', NULL, 'strengths', 8),

('What are your key strengths?', 'multiple_choice',
 ARRAY['Analytical thinking', 'Creative thinking', 'Leadership', 'Teamwork', 'Public speaking', 'Writing skills', 'Technical skills', 'Research abilities', 'Time management'],
 'strengths', 9),

-- Goals & Aspirations
('What is your primary career goal?', 'single_choice',
 ARRAY['High salary potential', 'Job security', 'Creative fulfillment', 'Making a social impact', 'Work-life balance', 'Entrepreneurship', 'Research and innovation', 'Leadership roles'],
 'goals', 10),

('Where do you see yourself working?', 'single_choice',
 ARRAY['In India - major cities', 'In India - smaller towns', 'Abroad - developed countries', 'Abroad - anywhere', 'Remote work globally', 'Not sure yet'],
 'goals', 11),

('What type of higher education interests you most?', 'single_choice',
 ARRAY['Engineering (B.Tech)', 'Medical (MBBS)', 'Business (BBA/MBA)', 'Science (B.Sc)', 'Arts (B.A)', 'Commerce (B.Com)', 'Specialized courses', 'Not sure yet'],
 'goals', 12),

-- Study Preferences
('How do you prefer to study?', 'single_choice',
 ARRAY['Self-study with books', 'Online courses and videos', 'Classroom teaching', 'Group study', 'One-on-one tutoring', 'Practical/hands-on learning'],
 'preferences', 13),

('What motivates you most in learning?', 'single_choice',
 ARRAY['Achieving high grades', 'Understanding concepts deeply', 'Practical applications', 'Competition with peers', 'Personal interest', 'Future career prospects'],
 'preferences', 14),

-- Background & Context
('What is your family''s expectation for your career?', 'single_choice',
 ARRAY['Engineering', 'Medical', 'Government job', 'Business/Entrepreneurship', 'Any stable career', 'They support my choice', 'Not sure'],
 'background', 15),

('How would you describe your academic performance?', 'single_choice',
 ARRAY['Consistently excellent (90%+)', 'Good (75-90%)', 'Average (60-75%)', 'Below average (<60%)', 'Improving steadily', 'Varies by subject'],
 'background', 16);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_firebase_uid ON user_profiles(firebase_uid);
CREATE INDEX idx_user_profiles_profile_completed ON user_profiles(profile_completed);
CREATE INDEX idx_user_profile_responses_user_id ON user_profile_responses(user_profile_id);
CREATE INDEX idx_ai_recommendations_user_id ON ai_recommendations(user_profile_id);
CREATE INDEX idx_ai_recommendations_type ON ai_recommendations(recommendation_type);
CREATE INDEX idx_profile_questions_category ON profile_questions(category);
CREATE INDEX idx_profile_questions_order ON profile_questions(order_index);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_recommendations_updated_at 
    BEFORE UPDATE ON ai_recommendations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();