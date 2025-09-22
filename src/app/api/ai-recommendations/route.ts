import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.userId || !data.recommendations || !Array.isArray(data.recommendations)) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, recommendations (must be an array)' },
        { status: 400 }
      );
    }

    const aiRecommendation = await DatabaseService.saveAIRecommendations(data.userId, data.recommendations);
    
    return NextResponse.json({ 
      success: true, 
      aiRecommendation 
    });
  } catch (error) {
    console.error('Error saving AI recommendation:', error);
    return NextResponse.json(
      { error: 'Failed to save AI recommendation' },
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

    const recommendations = await DatabaseService.getUserRecommendations(userId);
    
    return NextResponse.json({ 
      success: true, 
      recommendations 
    });
  } catch (error) {
    console.error('Error fetching AI recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI recommendations' },
      { status: 500 }
    );
  }
}