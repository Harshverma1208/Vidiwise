'use server'

import { YoutubeTranscript } from "youtube-transcript";

// Interface for transcript items
export interface TranscriptItem {
  text: string;
  duration: number;
  offset: number;
}

// Method 1: Using youtube-transcript library
const fetchWithYoutubeTranscript = async (videoId: string): Promise<TranscriptItem[]> => {
  try {
    console.log('📋 Trying youtube-transcript library...');
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    
    if (transcript && transcript.length > 0) {
      console.log('✅ youtube-transcript successful:', transcript.length, 'segments');
      return transcript.map(item => ({
        text: item.text,
        duration: item.duration || 0,
        offset: item.offset || 0
      }));
    }
    
    return [];
  } catch (error) {
    console.log('❌ youtube-transcript failed:', (error as Error).message);
    return [];
  }
};

// Method 2: Using youtube-transcript with language options
const fetchWithLanguageOptions = async (videoId: string): Promise<TranscriptItem[]> => {
  const languages = ['en', 'en-US', 'en-GB', 'auto'];
  
  for (const lang of languages) {
    try {
      console.log(`🌐 Trying language: ${lang}`);
      const transcript = await YoutubeTranscript.fetchTranscript(videoId, { lang });
      
      if (transcript && transcript.length > 0) {
        console.log(`✅ Success with language ${lang}:`, transcript.length, 'segments');
        return transcript.map(item => ({
          text: item.text,
          duration: item.duration || 0,
          offset: item.offset || 0
        }));
      }
    } catch (error) {
      console.log(`❌ Language ${lang} failed:`, (error as Error).message);
    }
  }
  
  return [];
};

// Method 3: Direct API call to YouTube's timedtext API
const fetchWithDirectAPI = async (videoId: string): Promise<TranscriptItem[]> => {
  try {
    console.log('🌐 Trying direct YouTube API...');
    
    const apiUrl = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en&fmt=json3`;
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.events) {
        const transcript: TranscriptItem[] = data.events
          .filter((event: any) => event.segs)
          .map((event: any) => ({
            text: event.segs.map((seg: any) => seg.utf8).join(''),
            offset: event.tStartMs / 1000,
            duration: event.dDurationMs / 1000
          }));
        
        if (transcript.length > 0) {
          console.log('✅ Direct API successful:', transcript.length, 'segments');
          return transcript;
        }
      }
    }
    
    return [];
  } catch (error) {
    console.log('❌ Direct API failed:', (error as Error).message);
    return [];
  }
};

// Method 4: Alternative API with different formats
const fetchWithAlternativeAPI = async (videoId: string): Promise<TranscriptItem[]> => {
  const formats = ['json3', 'srv3'];
  const languages = ['en', 'auto'];
  
  for (const format of formats) {
    for (const lang of languages) {
      try {
        console.log(`🔄 Trying format: ${format}, language: ${lang}`);
        
        const apiUrl = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=${lang}&fmt=${format}`;
        const response = await fetch(apiUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (response.ok) {
          const text = await response.text();
          
          if (format === 'json3' && text.trim()) {
            try {
              const data = JSON.parse(text);
              if (data.events) {
                const transcript: TranscriptItem[] = data.events
                  .filter((event: any) => event.segs)
                  .map((event: any) => ({
                    text: event.segs.map((seg: any) => seg.utf8).join(''),
                    offset: event.tStartMs / 1000,
                    duration: event.dDurationMs / 1000
                  }));
                
                if (transcript.length > 0) {
                  console.log(`✅ Alternative API successful (${format}/${lang}):`, transcript.length, 'segments');
                  return transcript;
                }
              }
            } catch (parseError) {
              console.log(`❌ Parse error for ${format}/${lang}`);
            }
          }
        }
      } catch (error) {
        console.log(`❌ ${format}/${lang} failed:`, (error as Error).message);
      }
    }
  }
  
  return [];
};

// Main improved transcript fetching function
export const fetchTranscriptImproved = async (videoId: string): Promise<TranscriptItem[]> => {
  console.log('🚀 Starting improved transcript fetch for:', videoId);
  
  // Method 1: Standard youtube-transcript
  let transcript = await fetchWithYoutubeTranscript(videoId);
  if (transcript.length > 0) return transcript;
  
  // Method 2: youtube-transcript with language options
  transcript = await fetchWithLanguageOptions(videoId);
  if (transcript.length > 0) return transcript;
  
  // Method 3: Direct API call
  transcript = await fetchWithDirectAPI(videoId);
  if (transcript.length > 0) return transcript;
  
  // Method 4: Alternative API formats
  transcript = await fetchWithAlternativeAPI(videoId);
  if (transcript.length > 0) return transcript;
  
  console.log('🚫 All methods failed for video:', videoId);
  return [];
};

// Test function with known working videos
export const testImprovedTranscript = async (): Promise<any> => {
  const testVideos = [
    { id: 'yQq1-_ujXnM', name: 'Julian Treasure: How to speak so that people want to listen | TED' },
    { id: 'TQMbvJNRpLE', name: 'Susan Pinker: The secret to living longer may be your social life | TED' },
    { id: '8Gj2KXtTzyQ', name: 'JavaScript Tutorial for Beginners' },
    { id: 'dQw4w9WgXcQ', name: 'Rick Astley - Never Gonna Give You Up' },
  ];
  
  for (const video of testVideos) {
    console.log(`\n🧪 Testing: ${video.name}`);
    const transcript = await fetchTranscriptImproved(video.id);
    
    if (transcript.length > 0) {
      console.log(`✅ SUCCESS: ${transcript.length} segments found`);
      return {
        success: true,
        videoId: video.id,
        name: video.name,
        transcriptLength: transcript.length,
        sample: transcript[0].text.substring(0, 150) + '...'
      };
    }
  }
  
  return { success: false, message: 'No working transcripts found' };
}; 