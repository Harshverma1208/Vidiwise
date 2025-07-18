import { NextRequest, NextResponse } from "next/server";
import { fetchTranscriptImproved, testImprovedTranscript } from "~/lib/helpers/transcript-improved";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'auto';
    const videoId = searchParams.get('videoId');
    
    console.log('=== IMPROVED TRANSCRIPT TEST ===');
    console.log('Mode:', mode);
    console.log('Video ID:', videoId);
    
    if (mode === 'single' && videoId) {
      console.log('Testing single video:', videoId);
      const transcript = await fetchTranscriptImproved(videoId);
      
      return NextResponse.json({
        success: transcript.length > 0,
        mode: 'single',
        videoId,
        transcriptLength: transcript.length,
        sampleData: transcript.slice(0, 3),
        message: transcript.length > 0 ? 'Real transcript found!' : 'No transcript available'
      });
    }
    
    // Auto mode - test with multiple videos
    console.log('Testing multiple videos automatically...');
    const result = await testImprovedTranscript();
    
    return NextResponse.json({
      success: result.success,
      mode: 'auto',
      ...result,
      message: result.success ? 
        `Found working transcript! Video: ${result.name}` : 
        'No working transcripts found with any method'
    });
    
  } catch (error) {
    console.error('Improved transcript test failed:', error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
      message: "Improved transcript test failed"
    }, { status: 500 });
  }
} 