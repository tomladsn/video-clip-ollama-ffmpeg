import fs from 'fs';
import { exec } from 'child_process';

// Read the JSON file
const clipsData = JSON.parse(fs.readFileSync('clipsd.json', 'utf-8'));

// Define the source video file
const inputVideo = 'input.mp4'; // Replace with the actual video file path

// Function to generate and run ffmpeg command for each clip
const clipVideo = (startTime, endTime, clipId) => {
  // Set the output filename
  const outputFile = `clip_${clipId}.mp4`;

  // Use ffmpeg to clip the video
  const ffmpegCommand = `ffmpeg -i ${inputVideo} -ss ${startTime} -to ${endTime} -c copy ${outputFile}`;

  // Execute the ffmpeg command
  exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error clipping ${clipId}: ${error.message}`);
      return;
    }
    console.log(`Clip ${clipId} has been created: ${outputFile}`);
  });
};

// Loop through the clips and clip the video
clipsData.clips.forEach(clip => {
  clipVideo(clip.start_time, clip.end_time, clip.clip_id);
});
