import { fetchTranscript } from './transcript';
import { textTotext } from './gemini';

// Transcript item interface
export interface TranscriptItem {
  text: string;
  duration: number;
  offset: number;
}

// Enhanced transcript storage interface
export interface EnhancedTranscriptData {
  fullTranscriptText: string;
  timestampedTranscript: TranscriptItem[];
  formattedTranscriptWithTimestamps: string;
  aiSummary: string;
  keyTopics: string[];
  totalDuration: number;
  segmentCount: number;
}

// Enhanced transcript processor class
export class TranscriptProcessor {
  private fullTranscriptVariable: string = '';
  private timestampedSegments: TranscriptItem[] = [];

  /**
   * Fetch and store the complete YouTube transcript in a variable
   * @param videoId - YouTube video ID
   * @returns Enhanced transcript data with AI processing
   */
  async processVideoTranscript(videoId: string): Promise<EnhancedTranscriptData> {
    console.log('🚀 Enhanced Transcript Processing started for:', videoId);

    // Fetch transcript using the standard system
    this.timestampedSegments = await fetchTranscript(videoId);
    
    if (this.timestampedSegments.length === 0) {
      throw new Error('No transcript available for this video');
    }

    // Store the complete transcript in a variable
    this.fullTranscriptVariable = this.createFullTranscriptText();
    console.log('📝 Full transcript stored in variable, length:', this.fullTranscriptVariable.length);

    // Create formatted transcript with timestamps
    const formattedTranscriptWithTimestamps = this.createTimestampedFormat();
    
    // Generate AI summary using Gemini API
    const aiSummary = await this.generateEnhancedSummary();
    
    // Extract key topics
    const keyTopics = await this.extractKeyTopics();
    
    // Calculate metadata
    const totalDuration = this.calculateTotalDuration();
    const segmentCount = this.timestampedSegments.length;

    console.log('✅ Enhanced transcript processing completed');

    return {
      fullTranscriptText: this.fullTranscriptVariable,
      timestampedTranscript: this.timestampedSegments,
      formattedTranscriptWithTimestamps,
      aiSummary,
      keyTopics,
      totalDuration,
      segmentCount
    };
  }

  /**
   * Store the complete transcript text in a single variable
   */
  private createFullTranscriptText(): string {
    return this.timestampedSegments
      .map(segment => segment.text)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Create formatted transcript with timestamps for display
   */
  private createTimestampedFormat(): string {
    return this.timestampedSegments
      .map(segment => {
        const timestamp = this.formatTimestamp(segment.offset);
        return `[${timestamp}] ${segment.text}`;
      })
      .join('\n\n');
  }

  /**
   * Format seconds to MM:SS or HH:MM:SS format
   */
  private formatTimestamp(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Generate enhanced AI summary using Gemini API
   */
  private async generateEnhancedSummary(): Promise<string> {
    try {
      console.log('🤖 Generating enhanced AI summary with Gemini...');
      
      const enhancedPrompt = `Create a comprehensive summary of this video transcript. Include:
      • Main topic and key themes
      • Important points discussed (as bullet points)
      • Key takeaways or conclusions
      • Any actionable insights mentioned
      
      Make the summary well-structured and easy to read.`;

      const summary = await textTotext(enhancedPrompt, this.fullTranscriptVariable);
      console.log('✅ AI summary generated successfully');
      return summary;
    } catch (error) {
      console.error('❌ Error generating AI summary:', error);
      return `• Unable to generate AI summary at this time
• The full transcript is available for manual review
• Please try again later or check your internet connection
• Video contains: ${this.timestampedSegments.length} transcript segments`;
    }
  }

  /**
   * Extract key topics using AI
   */
  private async extractKeyTopics(): Promise<string[]> {
    try {
      console.log('🔍 Extracting key topics with AI...');
      
      const topicsPrompt = `Extract the main topics and themes discussed in this video. 
      Return them as a simple comma-separated list of keywords or short phrases.
      Focus on the most important concepts mentioned.`;

      const topicsResponse = await textTotext(topicsPrompt, this.fullTranscriptVariable);
      
      // Parse the response into an array
      const topics = topicsResponse
        .split(',')
        .map(topic => topic.trim())
        .filter(topic => topic.length > 0)
        .slice(0, 10); // Limit to top 10 topics

      console.log('✅ Key topics extracted:', topics.length);
      return topics;
    } catch (error) {
      console.error('❌ Error extracting topics:', error);
      return ['Video Content', 'Educational Material', 'Key Concepts'];
    }
  }

  /**
   * Calculate total video duration from transcript
   */
  private calculateTotalDuration(): number {
    if (this.timestampedSegments.length === 0) return 0;
    
    const lastSegment = this.timestampedSegments[this.timestampedSegments.length - 1];
    return lastSegment.offset + lastSegment.duration;
  }

  /**
   * Get the stored full transcript variable
   */
  getFullTranscript(): string {
    return this.fullTranscriptVariable;
  }

  /**
   * Get timestamped segments
   */
  getTimestampedSegments(): TranscriptItem[] {
    return this.timestampedSegments;
  }

  /**
   * Search within the transcript
   */
  searchTranscript(query: string): { segment: TranscriptItem; timestamp: string }[] {
    const searchTerm = query.toLowerCase();
    const results: { segment: TranscriptItem; timestamp: string }[] = [];

    this.timestampedSegments.forEach(segment => {
      if (segment.text.toLowerCase().includes(searchTerm)) {
        results.push({
          segment,
          timestamp: this.formatTimestamp(segment.offset)
        });
      }
    });

    return results;
  }
}

/**
 * Helper function for easy usage
 */
export async function processYouTubeTranscript(videoId: string): Promise<EnhancedTranscriptData> {
  const processor = new TranscriptProcessor();
  return await processor.processVideoTranscript(videoId);
}

/**
 * Enhanced API function that stores transcript in variable and processes with Gemini
 */
export async function fetchAndProcessTranscript(videoId: string): Promise<{
  transcriptVariable: string;
  timestampedData: TranscriptItem[];
  formattedDisplay: string;
  aiAnalysis: {
    summary: string;
    keyTopics: string[];
    insights: string;
  };
  metadata: {
    duration: number;
    segmentCount: number;
    wordCount: number;
  };
}> {
  console.log('🎬 Starting enhanced transcript fetch and processing...');
  
  const processor = new TranscriptProcessor();
  const enhancedData = await processor.processVideoTranscript(videoId);

  // Generate additional insights
  const insightsPrompt = `Based on this video transcript, provide 3-5 key insights or practical takeaways that viewers should remember. Make them actionable and valuable.`;
  const insights = await textTotext(insightsPrompt, enhancedData.fullTranscriptText);

  // Calculate word count
  const wordCount = enhancedData.fullTranscriptText.split(/\s+/).length;

  return {
    // The main transcript variable as requested
    transcriptVariable: enhancedData.fullTranscriptText,
    
    // Timestamped data for display
    timestampedData: enhancedData.timestampedTranscript,
    
    // Formatted transcript with timestamps for display
    formattedDisplay: enhancedData.formattedTranscriptWithTimestamps,
    
    // AI analysis using Gemini API
    aiAnalysis: {
      summary: enhancedData.aiSummary,
      keyTopics: enhancedData.keyTopics,
      insights: insights
    },
    
    // Metadata
    metadata: {
      duration: enhancedData.totalDuration,
      segmentCount: enhancedData.segmentCount,
      wordCount: wordCount
    }
  };
} 