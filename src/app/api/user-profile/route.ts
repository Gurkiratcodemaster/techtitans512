import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// POST - Create or update user profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      email,
      full_name,
      class_level,
      interests,
      career_goals,
      subjects_of_interest,
      dream_college,
      preferred_stream
    } = body;

    console.log('Received profile data:', body);

    // Get authorization header
    const authorization = request.headers.get('authorization');
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const token = authorization.replace('Bearer ', '');

    // Create Supabase client with the user's token
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    });

    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth verification failed:', authError);
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    console.log('Authenticated user:', user.id);

    // Prepare profile data using the authenticated user's ID
    const profileData = {
      id: user.id,
      email: user.email || email,
      full_name: full_name || null,
      class_level: class_level || null,
      interests: Array.isArray(interests) ? interests : [],
      career_goals: career_goals || null,
      subjects_of_interest: Array.isArray(subjects_of_interest) ? subjects_of_interest : [],
      dream_college: dream_college || null,
      preferred_stream: preferred_stream || null,
      updated_at: new Date().toISOString()
    };

    console.log('Attempting to save profile for user:', user.id);

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    let result;
    
    if (existingProfile) {
      // Update existing profile
      result = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single();
    } else {
      // Create new profile
      result = await supabase
        .from('user_profiles')
        .insert(profileData)
        .select()
        .single();
    }

    if (result.error) {
      console.error('Supabase error:', result.error);
      return NextResponse.json(
        { 
          error: 'Database operation failed', 
          details: result.error.message,
          code: result.error.code
        },
        { status: 500 }
      );
    }

    console.log('Profile saved successfully:', result.data);

    return NextResponse.json({
      success: true,
      message: existingProfile ? 'Profile updated successfully' : 'Profile created successfully',
      profile: result.data
    });

  } catch (error) {
    console.error('POST /api/user-profile error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET - Retrieve user profile
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get the current user from the session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      profile: profile || null 
    });

  } catch (error) {
    console.error('GET /api/user-profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}