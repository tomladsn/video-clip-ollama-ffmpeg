import { execSync } from "child_process";
import { readFileSync } from "fs";

// Replace with your input video file and JSON file paths
const inputFilePath = "C:/Users/USER/Downloads/project/video-clip-ollama-ffmpeg/videoasset/clip_clip_1.mp4";
const jsonFilePath = "C:/Users/USER/Downloads/project/video-clip-ollama-ffmpeg/output/emojis_with_timestamps.json";

// Read JSON file and parse it
const emojiData = JSON.parse(readFileSync(jsonFilePath));

// Create overlay filters for each emoji
let overlayFilters = "";

emojiData.forEach((emoji, index) => {
  const emojiFileName = `emojis/${emoji.emoji}.png`; // Assuming emoji images are in an 'emojis' folder

  // Generate overlay filter (convert timestamp to seconds)
  const timestampParts = emoji.timestamp.split(':');
  const seconds =
    parseFloat(timestampParts[0]) * 3600 +
    parseFloat(timestampParts[1]) * 60 +
    parseFloat(timestampParts[2].replace(',', '.'));

  overlayFilters += `[0][${index + 1}:v] overlay=10:10:enable='between(t,${seconds},${seconds + 2})' [v${index}]; `;
});

// Final ffmpeg command
const ffmpegCommand = `ffmpeg -i "${inputFilePath}" ${emojiData.map((emoji, index) => `-i "emojis/${emoji.emoji}.png"`).join(' ')} -filter_complex "${overlayFilters.trim()}[v${emojiData.length - 1}]" -map "[v${emojiData.length - 1}]" -map 0:a output.mp4`;

try {
  execSync(ffmpegCommand);
  console.log("Output file written to output.mp4");
} catch (error) {
  console.error("Error executing ffmpeg command:", error);
}
