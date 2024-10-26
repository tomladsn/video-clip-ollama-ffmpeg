import { exec } from 'child_process';
import fs from 'fs';

// Function to add subtitles to a video using ffmpeg
const addSubtitlesToVideo = (inputVideo, subtitleFile, outputVideo) => {
  // FFmpeg command to add subtitles
  const ffmpegCommand = `ffmpeg -i ${inputVideo} -vf subtitles=${subtitleFile} ${outputVideo}`;

  // Execute the FFmpeg command
  exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error adding subtitles: ${error.message}`);
      return;
    }
    console.log(`Subtitles added successfully to ${outputVideo}`);
  });
};

// Example usage
const inputVideo = 'videoasset/clip_clip_1.mp4'; // Path to your input video file
const subtitleFile = 'output/emojis_with_timestamps.srt'; // Path to your subtitle file
const outputVideo = 'output/export.mp4'; // Output file with subtitles

// Check if the video and subtitle files exist
if (fs.existsSync(inputVideo) && fs.existsSync(subtitleFile)) {
  addSubtitlesToVideo(inputVideo, subtitleFile, outputVideo);
} else {
  console.error('Video or subtitle file not found.');
}
