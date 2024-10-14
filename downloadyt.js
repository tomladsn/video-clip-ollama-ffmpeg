import { readFileSync, writeFileSync } from 'fs';
import { Ollama } from 'ollama';

// Read and parse the SRT file
const srtContent = readFileSync('output/output.srt', 'utf-8');

// Function to pass transcription to LLaMA
async function selectBestClipsFromTranscription(transcription) {
    const ollama = new Ollama();

    const prompt = `
    You are provided with a transcription of a video, including timestamps:

    "${transcription}"

    Please review the entire transcription and suggest the best 30-second sections that would make suitable highlight clips. 
    Each highlight clip should be exactly 10 seconds long. Make sure that each clip represents a meaningful segment from the transcription. 

    Return the results as a JSON array, where each entry includes the start and end timestamps for the 10-second clip and a brief description explaining why that section was selected.
    `;

    const response = await ollama.generate({
        model: "llama3.1",
        prompt
    });

    // Parse the response to extract the JSON part
    const match = response.response.match(/```json([\s\S]*?)```/);
    if (match && match[1]) {
        const cleanJson = match[1].trim();

        try {
            // Parse the cleaned JSON
            const parsedJson = JSON.parse(cleanJson);

            // Write the cleaned JSON to a file
            writeFileSync('selectedclips.json', JSON.stringify(parsedJson, null, 2));

            console.log("Selected Clips in JSON:");
            console.log(parsedJson);  // Output the cleaned JSON to the terminal

        } catch (err) {
            console.error("Failed to parse JSON:", err);
        }
    } else {
        console.log("No valid JSON found in the response.");
    }
}

// Call the function and display the results
selectBestClipsFromTranscription(srtContent);
