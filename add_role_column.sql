-- Add role field to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('student', 'teacher', 'admin')) DEFAULT 'student';

-- Update existing profiles to have student role by default  
UPDATE user_profiles 
SET role = 'student' 
WHERE role IS NULL;