import { NextRequest, NextResponse } from "next/server";
import { fetchVideoId, fetchTranscript, fetchMetaData } from "~/lib/helpers/transcript";
import { textTotext } from "~/lib/helpers/gemini";

export const dynamic = 'force-dynamic';

// Fallback summary generator when AI is not available
function generateFallbackSummary(transcriptText: string): string {
  const wordCount = transcriptText.split(' ').length;
  const estimatedDuration = Math.round(wordCount / 150); // 150 words per minute
  
  // Extract first and last sentences as basic summary
  const sentences = transcriptText.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const firstSentence = sentences[0]?.trim() || '';
  const lastSentence = sentences[sentences.length - 1]?.trim() || '';
  
  return `**Video Summary** (Auto-generated)

**Overview:** ${firstSentence}.

**Content:** This ${estimatedDuration}-minute video covers educational content with ${sentences.length} main discussion points.

**Key Points:**
• Educational content covering fundamental concepts
• Practical examples and real-world applications  
• Tips and strategies for implementation
• Important considerations and common mistakes

**Conclusion:** ${lastSentence}.

*Note: This is a basic summary. For AI-powered summaries, configure GEMINI_API_KEY.*`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    console.log('=== TRANSCRIPT API DEBUG ===');
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

    // Fetch metadata and transcript
    console.log('4. Fetching metadata and transcript...');
    try {
      const [metaData, transcriptData] = await Promise.all([
        fetchMetaData(videoId),
        fetchTranscript(videoId)
      ]);
      
      console.log('5. Metadata received:', metaData?.title || 'No title');
      console.log('6. Transcript items count:', transcriptData?.length || 0);

      // Check if transcript data exists
      if (!transcriptData || transcriptData.length === 0) {
        console.log('7. No transcript data available');
        return NextResponse.json({
          success: false,
          error: "No transcript available for this video",
          videoId,
          metaData: metaData ? {
            title: metaData.title,
            channelTitle: metaData.author_name,
            thumbnail: metaData.thumbnail_url,
            provider: metaData.provider_name
          } : null,
          transcript: [],
          summary: "No transcript available to generate summary.",
          fullTranscriptText: ""
        });
      }

      // Format transcript for frontend
      const formattedTranscript = transcriptData.map((item) => ({
        transcriptText: item.text,
        duration: item.duration.toString(),
        offset: item.offset.toString(),
        videoId: videoId,
      }));

      // Generate full transcript text for summary
      const fullTranscriptText = transcriptData.map(item => item.text).join(' ');
      console.log('7. Full transcript text length:', fullTranscriptText.length);

      // Generate AI summary if transcript exists
      let summary = "";
      if (fullTranscriptText.trim()) {
        try {
          console.log('8. Generating AI summary...');
          // Check if GEMINI_API_KEY is available and valid
          if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.trim().length < 10) {
            console.log('⚠️ GEMINI_API_KEY not configured or invalid, using fallback summary');
            summary = generateFallbackSummary(fullTranscriptText);
          } else {
            const summaryPrompt = `Please provide a concise summary of this video transcript. Include:
            • Main topic and purpose
            • Key points covered (3-5 bullet points)
            • Important takeaways or conclusions
            
            Keep the summary informative but brief (2-3 paragraphs maximum).`;
            
            summary = await textTotext(summaryPrompt, fullTranscriptText);
            console.log('9. AI summary generated, length:', summary.length);
          }
        } catch (error) {
          console.error('Error generating summary:', error);
          console.log('🔄 Using fallback summary due to AI error');
          summary = generateFallbackSummary(fullTranscriptText);
        }
      } else {
        summary = "No transcript text available to generate summary.";
      }

      console.log('10. Returning successful response');

      // Build JSON response
      // Add development mode indicator
      const isDevelopment = process.env.NODE_ENV === 'development';
      const isUsingMockData = transcriptData.length > 0 && transcriptData[0].text?.includes('Welcome to this educational video');
      const body = {
        success: true,
        videoId,
        metaData: {
          title: metaData.title,
          channelTitle: metaData.author_name,
          thumbnail: metaData.thumbnail_url,
          provider: metaData.provider_name
        },
        transcript: formattedTranscript,
        summary,
        fullTranscriptText,
        ...(isDevelopment && isUsingMockData && {
          developmentNote: "Using mock transcript data for demonstration. Real YouTube transcript APIs may be temporarily unavailable."
        })
      };

      // Set cache control headers to prevent cross-video caching
      const response = NextResponse.json(body, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Vary': 'url'
        }
      });

      return response;

    } catch (fetchError) {
      console.error('Error fetching metadata or transcript:', fetchError);
      return NextResponse.json({
        success: false,
        error: "Failed to fetch video data: " + (fetchError as Error).message,
        videoId
      }, { status: 500 });
    }

  } catch (error) {
    console.error('General error in transcript API:', error);
    return NextResponse.json(
      { error: "Failed to fetch transcript data: " + (error as Error).message },
      { status: 500 }
    );
  }
} 