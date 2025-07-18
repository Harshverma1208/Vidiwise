'use server'

// Alternative transcript fetching methods when the main library fails

export interface TranscriptItem {
  text: string;
  duration: number;
  offset: number;
}

// Fallback method 1: Direct YouTube API approach
export const fetchTranscriptViaAPI = async (videoId: string): Promise<TranscriptItem[]> => {
  try {
    console.log('🌐 Attempting direct YouTube API approach for:', videoId);
    
    // Try to get transcript via YouTube's internal API
    const response = await fetch(`https://www.youtube.com/api/timedtext?v=${videoId}&lang=en&fmt=json3`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Direct API response received');
      
      if (data.events) {
        const transcript: TranscriptItem[] = data.events
          .filter((event: any) => event.segs)
          .map((event: any) => ({
            text: event.segs.map((seg: any) => seg.utf8).join(''),
            offset: event.tStartMs / 1000,
            duration: event.dDurationMs / 1000
          }));
        
        console.log('✅ Transcript parsed from direct API:', transcript.length, 'items');
        return transcript;
      }
    }
    
    console.log('⚠️ Direct API approach failed');
    return [];
  } catch (error) {
    console.log('❌ Direct API error:', (error as Error).message);
    return [];
  }
};

// Fallback method 2: Try different language codes and formats
export const fetchTranscriptWithLanguageFallback = async (videoId: string): Promise<TranscriptItem[]> => {
  const languages = ['en', 'en-US', 'en-GB', 'auto'];
  const formats = ['json3', 'srv3', 'ttml'];
  
  for (const lang of languages) {
    for (const fmt of formats) {
      try {
        console.log(`🌐 Trying lang: ${lang}, format: ${fmt}`);
        
        const url = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=${lang}&fmt=${fmt}`;
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        if (response.ok) {
          const text = await response.text();
          
          if (fmt === 'json3') {
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
                  console.log(`✅ Success with lang: ${lang}, format: ${fmt}`, transcript.length, 'items');
                  return transcript;
                }
              }
            } catch (parseError) {
              console.log(`❌ Parse error for ${lang}/${fmt}:`, (parseError as Error).message);
            }
          }
        }
      } catch (error) {
        console.log(`❌ Error with ${lang}/${fmt}:`, (error as Error).message);
      }
    }
  }
  
  return [];
};

// Fallback method 3: Mock transcript for testing (remove in production)
export const createMockTranscript = (videoId: string): TranscriptItem[] => {
  console.log('🧪 Creating mock transcript for testing purposes');
  
  return [
    {
      text: "Welcome to this video! This is a mock transcript for testing purposes.",
      offset: 0,
      duration: 3
    },
    {
      text: "The transcript fetching system is working but no real transcript was found.",
      offset: 3,
      duration: 4
    },
    {
      text: "This demonstrates that the UI and data flow are functioning correctly.",
      offset: 7,
      duration: 4
    },
    {
      text: "In a real scenario, this would contain the actual video transcript.",
      offset: 11,
      duration: 4
    },
    {
      text: "You can use this to test the chat and summary features.",
      offset: 15,
      duration: 3
    }
  ];
};

// Main fallback function that tries all methods
export const fetchTranscriptFallback = async (videoId: string, enableMock = false): Promise<TranscriptItem[]> => {
  console.log('🔄 Starting fallback transcript fetch for:', videoId);
  
  // Method 1: Direct API
  let transcript = await fetchTranscriptViaAPI(videoId);
  if (transcript.length > 0) {
    return transcript;
  }
  
  // Method 2: Language/format fallback
  transcript = await fetchTranscriptWithLanguageFallback(videoId);
  if (transcript.length > 0) {
    return transcript;
  }
  
  // Method 3: Mock transcript for testing (only if enabled)
  if (enableMock) {
    console.log('⚠️ Using mock transcript for testing');
    return createMockTranscript(videoId);
  }
  
  console.log('🚫 All fallback methods failed');
  return [];
}; 