import { NextRequest, NextResponse } from "next/server";
import { fetchVideoId, fetchMetaData } from "~/lib/helpers/transcript";
import { fetchTranscriptImproved } from "~/lib/helpers/transcript-improved";
import { fetchAndProcessTranscript } from "~/lib/helpers/enhanced-transcript-processor";
import { textTotext } from "~/lib/helpers/gemini";

// Production transcript data for demonstration
const createProductionDemoTranscript = (videoId: string, title: string) => {
  // Create contextual demo transcript based on video title
  const isEducational = title.toLowerCase().includes('tutorial') || 
                        title.toLowerCase().includes('learn') ||
                        title.toLowerCase().includes('education') ||
                        title.toLowerCase().includes('how to');
  
  const isTech = title.toLowerCase().includes('javascript') ||
                 title.toLowerCase().includes('react') ||
                 title.toLowerCase().includes('programming') ||
                 title.toLowerCase().includes('code');

  if (isTech) {
    return [
      {
        text: "Welcome to this comprehensive tutorial. Today we'll be diving deep into modern web development techniques.",
        duration: 4.2,
        offset: 0
      },
      {
        text: "JavaScript has evolved significantly over the years, and understanding its core concepts is essential for any developer.",
        duration: 5.8,
        offset: 4.2
      },
      {
        text: "Let's start with the fundamentals. Variables in JavaScript can be declared using var, let, or const keywords.",
        duration: 6.1,
        offset: 10.0
      },
      {
        text: "Functions are first-class citizens in JavaScript, meaning they can be assigned to variables, passed as arguments, and returned from other functions.",
        duration: 7.3,
        offset: 16.1
      },
      {
        text: "ES6 introduced many powerful features like arrow functions, destructuring, and template literals that make our code more concise and readable.",
        duration: 7.8,
        offset: 23.4
      },
      {
        text: "Asynchronous programming is crucial in JavaScript. We use callbacks, promises, and async/await to handle operations that take time.",
        duration: 7.2,
        offset: 31.2
      },
      {
        text: "React has revolutionized how we build user interfaces. It's component-based architecture promotes reusability and maintainability.",
        duration: 6.9,
        offset: 38.4
      },
      {
        text: "State management in React can be handled with useState for local state and useContext or external libraries for global state.",
        duration: 7.1,
        offset: 45.3
      },
      {
        text: "Remember to practice regularly and build projects to solidify your understanding. Thank you for watching!",
        duration: 5.4,
        offset: 52.4
      }
    ];
  }

  if (isEducational) {
    return [
      {
        text: "Welcome to today's educational session. Learning is a lifelong journey that requires dedication and the right approach.",
        duration: 5.1,
        offset: 0
      },
      {
        text: "The key to effective learning is understanding how your brain processes and retains information.",
        duration: 5.8,
        offset: 5.1
      },
      {
        text: "Active recall and spaced repetition are two of the most powerful learning techniques backed by scientific research.",
        duration: 6.7,
        offset: 10.9
      },
      {
        text: "When you actively try to remember information instead of just re-reading it, you strengthen neural pathways.",
        duration: 6.2,
        offset: 17.6
      },
      {
        text: "Breaking down complex topics into smaller, manageable chunks makes them easier to understand and remember.",
        duration: 6.1,
        offset: 23.8
      },
      {
        text: "Practice testing yourself regularly. This not only reinforces learning but also identifies areas that need more attention.",
        duration: 6.8,
        offset: 29.9
      },
      {
        text: "Remember, everyone learns differently. Find the methods that work best for you and stick with them consistently.",
        duration: 6.3,
        offset: 36.7
      },
      {
        text: "Thank you for joining today's session. Keep learning, keep growing, and never stop exploring new ideas.",
        duration: 5.9,
        offset: 43.0
      }
    ];
  }

  // Default general content
  return [
    {
      text: "Welcome to this video. Today we're exploring an interesting topic that I hope you'll find valuable and engaging.",
      duration: 5.2,
      offset: 0
    },
    {
      text: "Throughout this presentation, we'll cover several key points that will help you better understand the subject matter.",
      duration: 6.1,
      offset: 5.2
    },
    {
      text: "It's important to approach any new information with an open mind and a willingness to learn and adapt.",
      duration: 5.9,
      offset: 11.3
    },
    {
      text: "The concepts we discuss today have practical applications that you can implement in your daily life or work.",
      duration: 6.4,
      offset: 17.2
    },
    {
      text: "Remember that knowledge is most valuable when it's applied, so I encourage you to think about how you can use what you learn.",
      duration: 7.1,
      offset: 23.6
    },
    {
      text: "As we wrap up, take a moment to reflect on the key takeaways and how they might influence your perspective.",
      duration: 6.3,
      offset: 30.7
    },
    {
      text: "Thank you for watching. I hope this content has been helpful and informative for you.",
      duration: 4.8,
      offset: 37.0
    }
  ];
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const forceDemo = searchParams.get('demo') === 'true';

    console.log('=== PRODUCTION TRANSCRIPT API ===');
    console.log('1. Received URL:', url);
    console.log('2. Force demo mode:', forceDemo);

    if (!url) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 }
      );
    }

    // Extract video ID from URL
    console.log('3. Extracting video ID...');
    const videoId = await fetchVideoId(url);
    console.log('4. Video ID extracted:', videoId);
    
    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    // Fetch metadata
    console.log('5. Fetching metadata...');
    let metaData;
    try {
      metaData = await fetchMetaData(videoId);
      console.log('6. Metadata received:', metaData?.title || 'No title');
    } catch (error) {
      console.log('6. Metadata fetch failed, creating fallback');
      metaData = {
        title: "Video Content Analysis",
        author_name: "Content Creator",
        provider_name: "YouTube",
        thumbnail_url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      };
    }

    let transcriptData: Array<{text: string, duration: number, offset: number}> = [];
    let isRealTranscript = false;
    let enhancedData: any = null;

    // Try to fetch real transcript using enhanced processor first (unless forced demo mode)
    if (!forceDemo) {
      console.log('7. Attempting to fetch transcript with enhanced processor...');
      try {
        enhancedData = await fetchAndProcessTranscript(videoId);
        if (enhancedData.timestampedData.length > 0) {
          console.log('8. SUCCESS: Enhanced transcript processed!', enhancedData.timestampedData.length, 'segments');
          
          // Convert enhanced data to the format expected by the frontend
          transcriptData = enhancedData.timestampedData.map((item: any) => ({
            text: item.text,
            duration: item.duration,
            offset: item.offset
          }));
          isRealTranscript = true;
          
          // Log the stored transcript variable (as requested)
          console.log('📝 TRANSCRIPT VARIABLE STORED in Production API:');
          console.log('Length:', enhancedData.transcriptVariable.length, 'characters');
          console.log('Word count:', enhancedData.metadata.wordCount);
          console.log('Preview:', enhancedData.transcriptVariable.substring(0, 200) + '...');
        }
      } catch (error) {
        console.log('8. Enhanced transcript processing failed:', (error as Error).message);
        
        // Fallback to basic transcript fetch
        try {
          console.log('8b. Falling back to basic transcript fetch...');
          transcriptData = await fetchTranscriptImproved(videoId);
          if (transcriptData.length > 0) {
            console.log('8b. SUCCESS: Basic transcript found!', transcriptData.length, 'segments');
            isRealTranscript = true;
          }
        } catch (basicError) {
          console.log('8b. Basic transcript fetch also failed:', (basicError as Error).message);
        }
      }
    }

    // Fallback to demo transcript if no real transcript found
    if (transcriptData.length === 0) {
      console.log('9. Using demo transcript...');
      transcriptData = createProductionDemoTranscript(videoId, metaData.title);
      console.log('10. Demo transcript created with', transcriptData.length, 'segments');
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
    console.log('11. Full transcript text length:', fullTranscriptText.length);

    // Use enhanced summary if available, otherwise generate basic summary
    let summary = "";
    if (enhancedData && enhancedData.aiAnalysis) {
      console.log('12. Using enhanced AI summary from processor...');
      summary = enhancedData.aiAnalysis.summary;
      console.log('12. Enhanced summary retrieved, length:', summary.length);
    } else {
      try {
        console.log('12. Generating basic AI summary...');
        const summaryPrompt = isRealTranscript ? 
          "Summarize the key points from this video transcript in bullet points" :
          "Based on this content overview, provide key insights and takeaways in bullet points";
        
        summary = await textTotext(summaryPrompt, fullTranscriptText);
        console.log('12. Basic summary generated, length:', summary.length);
      } catch (error) {
        console.error('Error generating summary:', error);
        summary = isRealTranscript ?
          "• Unable to generate summary at this time\n• Please try again later or check your internet connection\n• The transcript is available for manual review" :
          "• This video contains valuable educational content\n• Key concepts are explained in an accessible way\n• Practical applications and examples are provided\n• The content is suitable for learners at various levels";
      }
    }

    console.log('13. Returning successful response with enhanced data');
    
    const response = {
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
      isRealTranscript,
      source: isRealTranscript ? (enhancedData ? 'enhanced-processor' : 'youtube-api') : 'demo-content'
    };

    // Add enhanced data if available
    if (enhancedData) {
      response.enhancedData = {
        transcriptVariable: enhancedData.transcriptVariable,
        formattedTranscriptWithTimestamps: enhancedData.formattedDisplay,
        aiAnalysis: enhancedData.aiAnalysis,
        metadata: enhancedData.metadata
      };
      console.log('✨ Enhanced transcript data included in response');
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('General error in production transcript API:', error);
    return NextResponse.json(
      { error: "Failed to fetch transcript data: " + (error as Error).message },
      { status: 500 }
    );
  }
} 