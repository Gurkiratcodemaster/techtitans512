import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import { validateAndConvertFormData } from '@/lib/enum-converters';

export async function POST(request: NextRequest) {
  try {
    const rawData = await request.json();
    
    console.log('Received user profile data:', JSON.stringify(rawData, null, 2));
    
    // Validate and convert form data to proper enum values
    const data = validateAndConvertFormData(rawData);
    console.log('Converted and validated data:', JSON.stringify(data, null, 2));
    
    // Validate required fields
    const requiredFields: (keyof typeof data)[] = ['userId', 'fullName', 'age', 'gender', 'location', 'currentEducation', 'currentClass'];
    for (const field of requiredFields) {
      if (!data[field]) {
        console.error(`Missing required field: ${field}`);
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    console.log('Creating user profile with validated data...');
    const userProfile = await DatabaseService.createUserProfile(data);
    console.log('User profile created successfully:', userProfile.id);
    
    return NextResponse.json({ 
      success: true, 
      userProfile 
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    
    // Provide more detailed error information
    let errorMessage = 'Failed to create user profile';
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      // Check for specific errors
      if (error.message.includes('Invalid form data')) {
        errorMessage = 'Invalid form data provided';
        statusCode = 400;
      } else if (error.message.includes('Unique constraint')) {
        errorMessage = 'User profile already exists';
        statusCode = 409;
      } else if (error.message.includes('Foreign key constraint')) {
        errorMessage = 'Invalid data relationship';
        statusCode = 400;
      } else if (error.message.includes('Invalid enum')) {
        errorMessage = 'Invalid enum value provided';
        statusCode = 400;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error instanceof Error ? error.message : 'Unknown error' },
      { status: statusCode }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      );
    }

    const userProfile = await DatabaseService.getUserProfile(userId);
    
    return NextResponse.json({ 
      success: true, 
      userProfile 
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}