export function getVideoId(videoUrlOrId: string): string {
  // Regex pattern to match YouTube video URLs and IDs
  const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;

  // Check if the input matches the YouTube URL pattern
  const match: RegExpMatchArray | null = videoUrlOrId.match(youtubeRegex);

  if (match) {
    // Extract the video ID from the match
    return match[1] ?? videoUrlOrId;
  } else {
    // If it's not a YouTube URL, assume it's already a video ID
    return videoUrlOrId;
  }
}

export function isYouTubeVideoId(input: string) {
    // Regular expression to match YouTube video ID
    const regEx = /^[a-zA-Z0-9_-]{11}$/;
    return regEx.test(input);
}