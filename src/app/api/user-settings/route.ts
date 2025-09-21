import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.userId || !data.settings) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, settings' },
        { status: 400 }
      );
    }

    const userSettings = await DatabaseService.createOrUpdateUserSettings(data.userId, data.settings);
    
    return NextResponse.json({ 
      success: true, 
      userSettings 
    });
  } catch (error) {
    console.error('Error saving user settings:', error);
    return NextResponse.json(
      { error: 'Failed to save user settings' },
      { status: 500 }
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

    const userSettings = await DatabaseService.getUserSettings(userId);
    
    return NextResponse.json({ 
      success: true, 
      userSettings 
    });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user settings' },
      { status: 500 }
    );
  }
}