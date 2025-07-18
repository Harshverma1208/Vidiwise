import { NextRequest, NextResponse } from "next/server";
import getVideoId from 'get-video-id';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url') || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    
    console.log('=== TESTING VIDEO ID EXTRACTION ===');
    console.log('Testing with URL:', url);
    
    const result = getVideoId(url);
    
    console.log('Video ID result:', result);
    
    return NextResponse.json({
      success: true,
      message: "Video ID extraction working",
      inputUrl: url,
      result: result
    });
    
  } catch (error) {
    console.error('Video ID test failed:', error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
      message: "Video ID extraction test failed"
    }, { status: 500 });
  }
} 