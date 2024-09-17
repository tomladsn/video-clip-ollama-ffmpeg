import fs from 'fs-extra'; // For reading the SRT file
import { exec } from 'child_process'; // To execute shell commands

// Function to process the SRT file and send the content to Ollama
export async function processSRTWithOllama(filePath) {
  try {
    // Read the content of the SRT file
    const srtData = await fs.readFile(filePath, 'utf-8');

    // Prepare the prompt for Ollama
    const prompt = `i want you to pick a perfect 30 seconds I can clip from a video and here is the srt of the video: "${srtData}" just write a time stamp of the 30 seconds I can use in a single line from where to where`;

    // Use child_process to send the SRT as input to Ollama
    exec(`ollama run llama3.1 "${prompt}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Ollama: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Error in Ollama output: ${stderr}`);
        return;
      }

      // Output the response from Ollama
      console.log(`Ollama Response:\n${stdout}`);
    });
  } catch (error) {
    console.error('Error processing SRT file:', error);
  }
}
