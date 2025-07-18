import { NextRequest, NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

export async function GET() {
  try {
    console.log('=== TESTING YOUTUBE TRANSCRIPT ===');
    
    // Test with a known video that has transcript (Rick Roll - should always have transcript)
    const testVideoId = "dQw4w9WgXcQ";
    
    console.log('Testing with video ID:', testVideoId);
    
    const transcriptData = await YoutubeTranscript.fetchTranscript(testVideoId);
    
    console.log('Transcript fetched successfully. Items count:', transcriptData.length);
    console.log('First few items:', transcriptData.slice(0, 3));
    
    return NextResponse.json({
      success: true,
      message: "Transcript library is working",
      videoId: testVideoId,
      transcriptLength: transcriptData.length,
      sampleData: transcriptData.slice(0, 3)
    });
    
  } catch (error) {
    console.error('Transcript test failed:', error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
      message: "Transcript library test failed"
    }, { status: 500 });
  }
} 