/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use server'


import { and, eq } from "drizzle-orm";
import { YoutubeTranscript } from "youtube-transcript";
import { YoutubeTranscriptTS } from "youtube-transcript-ts";
import { db } from "~/server/db";
import { transcriptRows, transcriptions, users } from "~/server/db/schema";
import getVideoId from 'get-video-id';
import { redirect } from "next/navigation";

export const fetchVideoId = async(url: string) => {
  try {
    console.log('🔍 Extracting video ID from URL:', url);
    
    // First try the library approach
    const result = getVideoId(url);
    if (result?.id) {
      console.log('✅ Video ID extracted using library:', result.id);
      return result.id;
    }
    
    // Fallback to manual regex extraction for better compatibility
    const regex = /(?:v=|youtu\.be\/|\/embed\/|\/v\/|\/watch\?v=|&v=|youtu\.be\/|\/shorts\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    
    if (match && match[1]) {
      console.log('✅ Video ID extracted using regex fallback:', match[1]);
      return match[1];
    }
    
    console.log('❌ Could not extract video ID from URL:', url);
    return null;
  } catch (error) {
    console.error('❌ Error extracting video ID:', error);
    return null;
  }
}

export const fetchTranscript = async (id: string): Promise<Array<{text: string, duration: number, offset: number}>> => {
  try {
    console.log('🎬 Attempting to fetch transcript for video ID:', id);
    
    // Method 1: Try with default language
    try {
      console.log('📋 Trying method 1: Default language');
    const transcript = await YoutubeTranscript.fetchTranscript(id);
    
    if (transcript && transcript.length > 0) {
        console.log('✅ SUCCESS (Method 1): Transcript fetched!', transcript.length, 'segments');
        console.log('📝 First segment:', transcript[0]);
        return transcript;
      }
    } catch (error1) {
      console.log('⚠️ Method 1 failed:', error1.message);
    }

    // Method 2: Try with explicit English language
    try {
      console.log('📋 Trying method 2: Explicit English');
      const transcript = await YoutubeTranscript.fetchTranscript(id, {
        lang: 'en',
        country: 'US'
      });
      
      if (transcript && transcript.length > 0) {
        console.log('✅ SUCCESS (Method 2): Transcript fetched!', transcript.length, 'segments');
        console.log('📝 First segment:', transcript[0]);
        return transcript;
      }
    } catch (error2) {
      console.log('⚠️ Method 2 failed:', error2.message);
    }

    // Method 3: Try without any options
    try {
      console.log('📋 Trying method 3: No options');
      const transcript = await YoutubeTranscript.fetchTranscript(id, {});
      
      if (transcript && transcript.length > 0) {
        console.log('✅ SUCCESS (Method 3): Transcript fetched!', transcript.length, 'segments');
        console.log('📝 First segment:', transcript[0]);
        return transcript;
      }
    } catch (error3) {
      console.log('⚠️ Method 3 failed:', error3.message);
    }

    // Method 4: Try with different language options
    const languageOptions = ['en', 'en-US', 'en-GB', 'auto'];
    for (const lang of languageOptions) {
      try {
        console.log(`📋 Trying method 4: Language ${lang}`);
        const transcript = await YoutubeTranscript.fetchTranscript(id, { lang });
        
        if (transcript && transcript.length > 0) {
          console.log(`✅ SUCCESS (Method 4 - ${lang}): Transcript fetched!`, transcript.length, 'segments');
      console.log('📝 First segment:', transcript[0]);
      return transcript;
        }
      } catch (error4) {
        console.log(`⚠️ Method 4 (${lang}) failed:`, error4.message);
      }
    }

    // Method 5: Try alternative library (youtube-transcript-ts)
    try {
      console.log('📋 Trying method 5: Alternative library (youtube-transcript-ts)');
      const transcriptTS = await YoutubeTranscriptTS.fetchTranscript(id);
      
      if (transcriptTS && transcriptTS.length > 0) {
        // Convert format to match our expected interface
        const formattedTranscript = transcriptTS.map(item => ({
          text: item.text,
          duration: item.duration,
          offset: item.offset
        }));
        
        console.log('✅ SUCCESS (Method 5): Alternative library worked!', formattedTranscript.length, 'segments');
        console.log('📝 First segment:', formattedTranscript[0]);
        return formattedTranscript;
      }
    } catch (error5) {
      console.log('⚠️ Method 5 failed:', error5.message);
    }

    // Method 6: Try alternative library with language options
    const altLanguageOptions = ['en', 'en-US'];
    for (const lang of altLanguageOptions) {
      try {
        console.log(`📋 Trying method 6: Alternative library with ${lang}`);
        const transcriptTS = await YoutubeTranscriptTS.fetchTranscript(id, { lang });
        
        if (transcriptTS && transcriptTS.length > 0) {
          const formattedTranscript = transcriptTS.map(item => ({
            text: item.text,
            duration: item.duration,
            offset: item.offset
          }));
          
          console.log(`✅ SUCCESS (Method 6 - ${lang}): Alternative library worked!`, formattedTranscript.length, 'segments');
          console.log('📝 First segment:', formattedTranscript[0]);
          return formattedTranscript;
        }
      } catch (error6) {
        console.log(`⚠️ Method 6 (${lang}) failed:`, error6.message);
      }
    }

    console.log('🚫 ALL METHODS FAILED: Transcript NOT AVAILABLE for video:', id);
    console.log('This video may not have captions enabled, may be private/restricted, or the YouTube transcript APIs are temporarily unavailable');
    
    // Development fallback: Generate a mock transcript for testing
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 DEVELOPMENT MODE: Generating mock transcript for testing');
      return generateMockTranscript(id);
    }
    
    return [];
    
  } catch (error: any) {
    console.error('💥 General error in fetchTranscript:', error);
    return [];
  }
}

// Test function for known working videos with transcripts
export const testTranscriptWithKnownVideos = async () => {
  // List of videos that definitely have transcripts available
  const testVideos = [
    { id: 'TLPWmPWZwr8', name: 'TED Talk - How to speak so that people want to listen' },
    { id: 'fJ9rUzIMcZQ', name: 'Popular coding tutorial' },
    { id: 'yQq1-_ujXnM', name: 'Another TED Talk' },
    { id: 'LDU_Txk06tM', name: 'Educational video' },
  ];
  
  for (const video of testVideos) {
    console.log(`\n🧪 Testing: ${video.name} (${video.id})`);
    const transcript = await fetchTranscript(video.id);
    
    if (transcript.length > 0) {
      console.log(`✅ SUCCESS: Found ${transcript.length} transcript segments`);
      console.log(`📝 Sample: "${transcript[0].text.substring(0, 100)}..."`);
      return { 
        success: true, 
        videoId: video.id, 
        name: video.name,
        transcriptLength: transcript.length,
        sample: transcript[0].text.substring(0, 200)
      };
    } else {
      console.log(`❌ FAILED: No transcript for ${video.name}`);
    }
  }
  
  return { success: false, message: 'No transcripts found for any test videos' };
};

// fetch transcription rows from database
 export const fetchTranscriptionRows = async (id: string, creator: string) => {
    const transcript = await db
      .select()
      .from(transcriptRows)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .where(eq(transcriptRows.videoId, id));
    
      // const res = await db
      // .select({
      //   userId: {
      //     id: users.id,
      //     name: users.name,
      //     email: users.email,
      //     image: users.image,
      //   },
      //   videoId: transcriptions.videoId,
      //   title: transcriptions.title,
      //   rows: {
      //     id: transcriptRows.id,
      //     transcriptText: transcriptRows.transcriptText,
      //     duration: transcriptRows.duration,
      //     offset: transcriptRows.offset,
      //   }
      // })
      // .from(transcriptions)
      // .fullJoin(transcriptRows, eq(transcriptions.videoId, transcriptRows.videoId))
      // .fullJoin(users, eq(transcriptions.userId, users.id))

      // console.log(res)
    // setres(transcript);
    // console.log(transcript)
    return transcript;
  }

export const fetchMetaData = async(id: string): Promise<
  {
    title: string;
    author_name: string;
    provider_name: string;
    thumbnail_url: string;
  }
> => {
  try {
    console.log('📊 Fetching metadata for video ID:', id);
    const url = 'https://www.youtube.com/watch?v=' + id;
    const fetchUrl = `https://youtube.com/oembed?url=${url}&format=json`;
    
    console.log('🌐 Requesting metadata from:', fetchUrl);
    const data = await fetch(fetchUrl);
    
    if (!data.ok) {
      console.log('❌ Metadata fetch failed with status:', data.status);
      throw new Error(`Failed to fetch metadata: ${data.status}`);
    }

    const res = await data.json();
    console.log('✅ Metadata received:', res.title || 'No title');
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    if(!res.title || !res.author_name || !res.provider_name || !res.thumbnail_url) {
      console.log('⚠️ Incomplete metadata, redirecting...');
      return redirect("/generate") 
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return res;
  } catch (error) {
    console.error('💥 Error fetching metadata:', error);
    throw error;
  }
} 


export const getUser = async (id: string) => {
  const res = await db
  .select()
  .from(users)
  .where(eq(users.id, id));
  return res[0];
}

export const fetchVideoTranscrptDB = async (id: string) => {
  
  const res = await db
    .select()
    .from(transcriptions)
    .where(eq(transcriptions.videoId, id));

  return res
}


export const fetchTranscriptDBCreator = async (id: string, creator: string) => {
  const res = await db
  .select()
  .from(transcriptions)
  .where(and(eq(transcriptions.videoId, id), eq(transcriptions.userId, creator)));
  
  return res;
}

// Mock transcript generator for development/testing
function generateMockTranscript(videoId: string): Array<{text: string, duration: number, offset: number}> {
  const mockSegments = [
    "Welcome to this educational video about the topic we're exploring today.",
    "In this section, we'll cover the fundamental concepts you need to understand.",
    "Let's start with the basic principles and work our way up to more advanced topics.",
    "Here's an important point that many people often misunderstand.",
    "Pay close attention to this demonstration as it illustrates the key concept.",
    "Now let's look at some practical examples of how this applies in real life.",
    "This technique has been proven effective in numerous studies and applications.",
    "Remember that practice makes perfect, so don't be discouraged if it takes time.",
    "The next section will build upon what we've learned so far.",
    "Let's explore some common mistakes and how to avoid them.",
    "Here are some tips and tricks that will help you master this skill.",
    "We'll also discuss some advanced strategies for more experienced learners.",
    "Don't forget to apply these concepts in your own projects and experiments.",
    "If you have questions, feel free to pause and review the material again.",
    "Thank you for watching, and I hope this information was helpful to you."
  ];

  let currentOffset = 0;
  return mockSegments.map((text, index) => {
    // Calculate realistic duration based on text length (avg 150 words per minute)
    const wordCount = text.split(' ').length;
    const duration = Math.max(2.0, Math.min(8.0, (wordCount / 150) * 60)); // 2-8 seconds
    
    const segment = {
      text,
      duration: Math.round(duration * 10) / 10, // Round to 1 decimal
      offset: Math.round(currentOffset * 10) / 10 // Round to 1 decimal
    };
    
    // Update offset for next segment (no overlap)
    currentOffset += duration + 0.5; // Add small gap between segments
    
    return segment;
  });
}

export default fetchTranscript;