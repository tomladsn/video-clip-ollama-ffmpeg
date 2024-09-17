import fs from 'fs';
import ollama from 'ollama';

// Function to extract timestamps and write to a file
async function extractTimestampFromSRT(srtFilePath, outputFilePath) {
  try {
    // Read the SRT file content
    const srtContent = fs.readFileSync(srtFilePath, 'utf8');

    // Modify the prompt to ask LLaMA to extract only the timestamps
    const prompt = 
   ` Here is a transcription from a video. Pick out the best 30 seconds (very important it is 30 seconds at minimum") to clip in the video:
    
    ${srtContent}
    
Only return the time stamp of  multiple minimum of 30 seconds of clip per each duration in the transcription like "start - end" in a txt format starting with hh:mm:ss,SSS - hh:mm:ss,SSS and only that. Do not write any other words apart from the druation of the clip you picked from the transcription, just provide the time durations, nothing more.
   pls in this format only "00:01:22,000 - 00:02:17,300
00:00:05,200 - 00:00:35,599" do not write words like "here is whatever" just all the duration alone so it is reusable for api` ;

    // Send the modified prompt to LLaMA
    const response = await ollama.chat({
      model: 'llama3.1',
      messages: [{ role: 'user', content: prompt }],
    });

    // Get the extracted timestamps and remove backticks if present
    let extractedTimestamps = response.message.content.replace(/```/g, '').trim();

    // Write the response to a file, appending the content to keep it updated
    fs.appendFileSync(outputFilePath, `\n${extractedTimestamps}\n`, 'utf8');

    console.log('Extracted Timestamps written to:', outputFilePath);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example usage
const srtFilePath = './trans.srt'; // Replace with your actual SRT file path
const outputFilePath = './timestamps.txt'; // File to store extracted timestamps

extractTimestampFromSRT(srtFilePath, outputFilePath);
