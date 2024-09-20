import ollama from 'ollama';
import fs from 'fs';
import SrtParser from 'srt-parser-2';

// Step 1: Parse the SRT file
const parseSrtFile = (filePath) => {
  const srtContent = fs.readFileSync(filePath, 'utf-8');
  const parser = new SrtParser();
  const parsedData = parser.fromSrt(srtContent);
  return parsedData;
};

// Step 2: Generate prompt to Llama
const generateBest30SecondsPrompt = (transcript) => {
  return `Here is a transcription:\n\n${transcript}\n\nPlease choose at least multiple 30 seconds i can clip off the transcription and your answer should only be in this format just write the json "{
  "clips": [
    {
      "clip_id": "clip_1",
      "start_time": "00:00:00",
      "end_time": "00:00:30"
    },
    {
      "clip_id": "clip_2",
      "start_time": "00:00:31",
      "end_time": "00:01:00"
    }
  ]
}
"`;
};

// Step 3: Send request to Llama model
const getBest30Seconds = async (transcript) => {
  const message = { role: 'user', content: generateBest30SecondsPrompt(transcript) };
  const response = await ollama.chat({ model: 'llama3.1', messages: [message] });
  return response.message.content;
};

// Step 4: Main function
const main = async (srtFilePath) => {
  const parsedTranscript = parseSrtFile(srtFilePath);
  // Concatenate all the text in the SRT file for the prompt
  const fullTranscript = parsedTranscript.map(entry => entry.text).join(' ');
  
  const best30Seconds = await getBest30Seconds(fullTranscript);
  try {
    const parsedResponse = JSON.parse(best30Seconds);
    fs.writeFileSync('clipsd.json', JSON.stringify(parsedResponse, null, 2), 'utf-8');
    console.log('AI response saved to best_30_seconds.json');
  } catch (error) {
    console.error('Failed to save AI response:', error);
  }
};

// Example usage
main('trans.srt');
