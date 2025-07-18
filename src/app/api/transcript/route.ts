import { NextRequest, NextResponse } from "next/server";
import { fetchVideoId, fetchTranscript, fetchMetaData } from "~/lib/helpers/transcript";
import { textTotext } from "~/lib/helpers/gemini";

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

    // Fetch metadata and transcript using improved system
    console.log('4. Fetching metadata and transcript with improved system...');
    try {
      const { fetchTranscriptImproved } = await import('~/lib/helpers/transcript-improved');
      const [metaData, transcriptData] = await Promise.all([
        fetchMetaData(videoId),
        fetchTranscriptImproved(videoId)
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
          summary = await textTotext("Summarize the video", fullTranscriptText);
          console.log('9. Summary generated, length:', summary.length);
        } catch (error) {
          console.error('Error generating summary:', error);
          summary = "Unable to generate summary at this time.";
        }
      }

      console.log('10. Returning successful response');
      return NextResponse.json({
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
        fullTranscriptText
      });

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