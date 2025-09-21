import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.userId || !data.quizType || !data.score || !data.answers) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, quizType, score, answers' },
        { status: 400 }
      );
    }

    const quizResult = await DatabaseService.saveQuizResult(data);
    
    return NextResponse.json({ 
      success: true, 
      quizResult 
    });
  } catch (error) {
    console.error('Error saving quiz result:', error);
    return NextResponse.json(
      { error: 'Failed to save quiz result' },
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

    const quizResults = await DatabaseService.getUserQuizResults(userId);
    
    return NextResponse.json({ 
      success: true, 
      quizResults 
    });
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz results' },
      { status: 500 }
    );
  }
}