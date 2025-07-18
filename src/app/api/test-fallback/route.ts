import { NextRequest, NextResponse } from "next/server";
import { fetchTranscriptFallback } from "~/lib/helpers/transcript-fallback";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId') || 'dQw4w9WgXcQ';
    const enableMock = searchParams.get('mock') === 'true';
    
    console.log('=== TESTING FALLBACK TRANSCRIPT METHODS ===');
    console.log('Video ID:', videoId);
    console.log('Mock enabled:', enableMock);
    
    const transcript = await fetchTranscriptFallback(videoId, enableMock);
    
    return NextResponse.json({
      success: transcript.length > 0,
      videoId,
      transcriptLength: transcript.length,
      hasTranscript: transcript.length > 0,
      sampleData: transcript.slice(0, 3),
      mockEnabled: enableMock,
      message: transcript.length > 0 ? 'Transcript fetched successfully!' : 'No transcript available'
    });
    
  } catch (error) {
    console.error('Fallback test failed:', error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
      message: "Fallback test failed"
    }, { status: 500 });
  }
} 