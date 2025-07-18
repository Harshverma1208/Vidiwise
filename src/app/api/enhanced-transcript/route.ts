import { NextRequest, NextResponse } from "next/server";
import { fetchVideoId, fetchMetaData } from "~/lib/helpers/transcript";
import { fetchAndProcessTranscript } from "~/lib/helpers/enhanced-transcript-processor";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    console.log('=== ENHANCED TRANSCRIPT API ===');
    console.log('1. Received URL:', url);

    if (!url) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 }
      );
    }

    // Extract video ID from URL
    console.log('2. Extracting video ID...');
    const videoId = await fetchVideoId(url);
    console.log('3. Video ID extracted:', videoId);
    
    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    // Fetch metadata
    console.log('4. Fetching metadata...');
    let metaData;
    try {
      metaData = await fetchMetaData(videoId);
      console.log('5. Metadata received:', metaData?.title || 'No title');
    } catch (error) {
      console.log('5. Metadata fetch failed, creating fallback');
      metaData = {
        title: "Video Content Analysis",
        author_name: "Content Creator",
        provider_name: "YouTube",
        thumbnail_url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      };
    }

    // Process transcript using enhanced processor
    console.log('6. Processing transcript with enhanced processor...');
    const enhancedTranscriptData = await fetchAndProcessTranscript(videoId);
    console.log('7. Enhanced processing completed');

    // Log the stored transcript variable (as requested)
    console.log('📝 TRANSCRIPT VARIABLE STORED:');
    console.log('Length:', enhancedTranscriptData.transcriptVariable.length, 'characters');
    console.log('Word count:', enhancedTranscriptData.metadata.wordCount);
    console.log('Segment count:', enhancedTranscriptData.metadata.segmentCount);
    console.log('Duration:', Math.round(enhancedTranscriptData.metadata.duration), 'seconds');
    
    // Preview of the stored variable (first 200 characters)
    console.log('Preview:', enhancedTranscriptData.transcriptVariable.substring(0, 200) + '...');

    // Format transcript for frontend display
    const formattedTranscript = enhancedTranscriptData.timestampedData.map((item) => ({
      transcriptText: item.text,
      duration: item.duration.toString(),
      offset: item.offset.toString(),
      videoId: videoId,
    }));

    console.log('8. Returning enhanced response with stored transcript variable');
    return NextResponse.json({
      success: true,
      videoId,
      metaData: {
        title: metaData.title,
        channelTitle: metaData.author_name,
        thumbnail: metaData.thumbnail_url,
        provider: metaData.provider_name
      },
      
      // The main transcript variable (as requested)
      transcriptVariable: enhancedTranscriptData.transcriptVariable,
      
      // Formatted transcript with timestamps for display
      formattedTranscriptWithTimestamps: enhancedTranscriptData.formattedDisplay,
      
      // Standard format for existing UI
      transcript: formattedTranscript,
      
      // Enhanced AI analysis using Gemini API
      aiAnalysis: {
        summary: enhancedTranscriptData.aiAnalysis.summary,
        keyTopics: enhancedTranscriptData.aiAnalysis.keyTopics,
        insights: enhancedTranscriptData.aiAnalysis.insights
      },
      
      // Metadata
      metadata: enhancedTranscriptData.metadata,
      
      // For backward compatibility
      summary: enhancedTranscriptData.aiAnalysis.summary,
      fullTranscriptText: enhancedTranscriptData.transcriptVariable,
      isRealTranscript: true,
      source: 'enhanced-processor'
    });

  } catch (error) {
    console.error('Enhanced transcript API error:', error);
    
    // Detailed error response
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json({
      error: "Failed to process transcript: " + errorMessage,
      details: {
        stage: errorMessage.includes('No transcript available') ? 'transcript_fetch' : 'processing',
        videoId: new URL(request.url).searchParams.get('url'),
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
} 