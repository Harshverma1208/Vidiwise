import { NextRequest, NextResponse } from "next/server";
import { fetchVideoId, fetchMetaData } from "~/lib/helpers/transcript";
import { textTotext } from "~/lib/helpers/gemini";

// Demo transcript data for testing
const createDemoTranscript = (videoId: string) => {
  return [
    {
      text: "Welcome everyone to today's presentation. In this video, we'll be exploring the fascinating world of artificial intelligence and its impact on modern technology.",
      duration: 4.5,
      offset: 0
    },
    {
      text: "Artificial intelligence has revolutionized the way we interact with technology, from voice assistants to recommendation systems.",
      duration: 5.2,
      offset: 4.5
    },
    {
      text: "Let's start by understanding what AI really means. At its core, AI is about creating systems that can perform tasks that typically require human intelligence.",
      duration: 6.1,
      offset: 9.7
    },
    {
      text: "These tasks include learning, reasoning, problem-solving, perception, and language understanding.",
      duration: 4.8,
      offset: 15.8
    },
    {
      text: "One of the most exciting developments in AI is machine learning, which allows computers to learn and improve from experience without being explicitly programmed.",
      duration: 7.2,
      offset: 20.6
    },
    {
      text: "Machine learning algorithms can analyze vast amounts of data to identify patterns and make predictions or decisions.",
      duration: 5.5,
      offset: 27.8
    },
    {
      text: "There are several types of machine learning: supervised learning, unsupervised learning, and reinforcement learning.",
      duration: 5.9,
      offset: 33.3
    },
    {
      text: "Supervised learning uses labeled data to train models, while unsupervised learning finds patterns in data without labels.",
      duration: 6.4,
      offset: 39.2
    },
    {
      text: "Reinforcement learning, on the other hand, learns through interaction with an environment, receiving rewards or penalties for actions.",
      duration: 6.8,
      offset: 45.6
    },
    {
      text: "Deep learning, a subset of machine learning, uses neural networks with multiple layers to process complex data like images, text, and audio.",
      duration: 7.1,
      offset: 52.4
    },
    {
      text: "This technology powers many of the AI applications we use daily, including image recognition, natural language processing, and speech synthesis.",
      duration: 6.9,
      offset: 59.5
    },
    {
      text: "The applications of AI are virtually limitless. In healthcare, AI helps with medical diagnosis, drug discovery, and personalized treatment plans.",
      duration: 7.3,
      offset: 66.4
    },
    {
      text: "In transportation, AI enables autonomous vehicles, traffic optimization, and predictive maintenance for aircraft and trains.",
      duration: 6.7,
      offset: 73.7
    },
    {
      text: "Financial services use AI for fraud detection, algorithmic trading, and credit risk assessment.",
      duration: 5.4,
      offset: 80.4
    },
    {
      text: "However, with great power comes great responsibility. As AI becomes more prevalent, we must address ethical concerns and potential risks.",
      duration: 7.8,
      offset: 85.8
    },
    {
      text: "Issues like bias in AI algorithms, privacy concerns, and the impact on employment need careful consideration.",
      duration: 6.2,
      offset: 93.6
    },
    {
      text: "The future of AI is incredibly promising, but it requires thoughtful development and responsible implementation.",
      duration: 5.9,
      offset: 99.8
    },
    {
      text: "Thank you for watching this introduction to artificial intelligence. I hope you found it informative and inspiring.",
      duration: 5.1,
      offset: 105.7
    }
  ];
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    console.log('=== DEMO TRANSCRIPT API ===');
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
      console.log('5. Metadata fetch failed, using demo data');
      metaData = {
        title: "Introduction to Artificial Intelligence - Complete Guide",
        author_name: "Tech Education Channel",
        provider_name: "YouTube",
        thumbnail_url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      };
    }

    // Generate demo transcript
    console.log('6. Creating demo transcript...');
    const transcriptData = createDemoTranscript(videoId);
    console.log('7. Demo transcript created with', transcriptData.length, 'segments');

    // Format transcript for frontend
    const formattedTranscript = transcriptData.map((item) => ({
      transcriptText: item.text,
      duration: item.duration.toString(),
      offset: item.offset.toString(),
      videoId: videoId,
    }));

    // Generate full transcript text for summary
    const fullTranscriptText = transcriptData.map(item => item.text).join(' ');
    console.log('8. Full transcript text length:', fullTranscriptText.length);

    // Generate AI summary
    let summary = "";
    try {
      console.log('9. Generating AI summary...');
      summary = await textTotext("Summarize the key points from this video in bullet points", fullTranscriptText);
      console.log('10. Summary generated, length:', summary.length);
    } catch (error) {
      console.error('Error generating summary:', error);
      summary = `
• Introduction to Artificial Intelligence and its impact on modern technology
• AI involves creating systems that can perform tasks requiring human intelligence
• Machine Learning allows computers to learn from experience without explicit programming
• Types of ML: Supervised Learning, Unsupervised Learning, and Reinforcement Learning
• Deep Learning uses neural networks to process complex data like images and text
• AI applications span healthcare, transportation, finance, and many other industries
• Ethical considerations include algorithm bias, privacy concerns, and employment impact
• The future of AI is promising but requires responsible development and implementation
      `.trim();
    }

    console.log('11. Returning successful demo response');
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
      fullTranscriptText,
      demo: true // Flag to indicate this is demo data
    });

  } catch (error) {
    console.error('General error in demo transcript API:', error);
    return NextResponse.json(
      { error: "Failed to fetch demo transcript data: " + (error as Error).message },
      { status: 500 }
    );
  }
} 