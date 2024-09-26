import { exec } from 'child_process';
import fs from 'fs';

// Paths to your input video, subtitle file, and output files
const inputVideo = './clip_clip_1.mp4';  // Path to your input video
const subtitleFile = './output.ass';  // Path to your SRT file
const outputVideo = 'export.mp4';  // Output file name

// Function to add subtitles to the video
const addSubtitlesToVideo = (inputVideo, subtitleFile, outputVideo) => {
  // FFmpeg command to add subtitles
  const ffmpegCommand = `ffmpeg -i ${inputVideo} -vf "subtitles=${subtitleFile}" -c:a copy ${outputVideo}`;

  // Execute the FFmpeg command
  exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error adding subtitles: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`FFmpeg stderr: ${stderr}`);
    }
    console.log(`Subtitles added successfully. Output file: ${outputVideo}`);
  });
};

// Example usage
addSubtitlesToVideo(inputVideo, subtitleFile, outputVideo);
