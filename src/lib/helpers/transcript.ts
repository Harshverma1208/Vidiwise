/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use server'


import { and, eq } from "drizzle-orm";
import { YoutubeTranscript } from "youtube-transcript";
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
    console.log('🎬 Attempting to fetch REAL transcript for video ID:', id);
    
    // Use the improved transcript fetching system
    const { fetchTranscriptImproved } = await import('./transcript-improved');
    const transcript = await fetchTranscriptImproved(id);
    
    if (transcript && transcript.length > 0) {
      console.log('✅ SUCCESS: Real transcript fetched using improved system!', transcript.length, 'segments');
      console.log('📝 First segment:', transcript[0]);
      return transcript;
    }

    console.log('🚫 REAL transcript NOT AVAILABLE for video:', id);
    console.log('This video may not have captions enabled or may be private/restricted');
    return [];
    
  } catch (error: any) {
    console.error('💥 Critical error in fetchTranscript:', error);
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

export default fetchTranscript;