import ollama from 'ollama';
import fs from 'fs';

// Step 1: Read the text file
const readTextFile = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error("Error reading the text file:", error);
    throw error; // Propagate the error
  }
};

// Step 2: Generate prompt for Llama
const generateBest30SecondsPrompt = (transcript) => {
  return `Here is a web scrap of a youtube video timestamp :\n\n${transcript}\n\n Please convert it to a json format simailar to this but the problem is there is no end time in the txt file but you will use the next time stamp as the end of the initial like this {
  "clips": [
    {
      "clip_id": "clip_1",
      "start_time": "00:00:00",
      "end_time": "00:00:31"
    },
    {
      "clip_id": "clip_2",
      "start_time": "00:00:31",
      "end_time": "00:01:00"
    }
  ]
}`;
};

// Step 3: Send request to Llama model
const getBest30Seconds = async (transcript) => {
  const message = { role: 'user', content: generateBest30SecondsPrompt(transcript) };
  try {
    const response = await ollama.chat({ model: 'llama3.1', messages: [message] });
    return response.message.content;
  } catch (error) {
    console.error("Error during Llama request:", error);
    throw error; // Propagate the error
  }
};

// Step 4: Main function
const main = async (txtFilePath) => {
  try {
    const fullTranscript = readTextFile(txtFilePath);

    const best30Seconds = await getBest30Seconds(fullTranscript);
    
    try {
      const parsedResponse = JSON.parse(best30Seconds);
      fs.writeFileSync('clips.json', JSON.stringify(parsedResponse, null, 2), 'utf-8');
      console.log('AI response saved to clips.json');
    } catch (error) {
      console.error('Failed to save AI response:', error);
    }
  } catch (error) {
    console.error('Error in the main function:', error);
  }
};

// Example usage
main('video_description.txt');
