import { NextRequest, NextResponse } from "next/server";
import { testTranscriptWithKnownVideos, fetchTranscript } from "~/lib/helpers/transcript";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testMode = searchParams.get('mode') || 'auto';
    const videoId = searchParams.get('videoId');
    
    console.log('=== ADVANCED TRANSCRIPT TEST ===');
    
    if (testMode === 'single' && videoId) {
      console.log('Testing single video ID:', videoId);
      const transcript = await fetchTranscript(videoId);
      
      return NextResponse.json({
        success: transcript.length > 0,
        mode: 'single',
        videoId,
        transcriptLength: transcript.length,
        hasTranscript: transcript.length > 0,
        sampleData: transcript.slice(0, 2),
        message: transcript.length > 0 ? 'Transcript found!' : 'No transcript available'
      });
    }
    
    // Test with multiple known videos
    console.log('Testing multiple known videos...');
    const result = await testTranscriptWithKnownVideos();
    
    return NextResponse.json({
      success: result.success,
      mode: 'auto',
      ...result,
      message: result.success ? 'Found working video with transcript!' : 'No transcripts found for any test videos'
    });
    
  } catch (error) {
    console.error('Advanced transcript test failed:', error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
      message: "Advanced transcript test failed"
    }, { status: 500 });
  }
} 