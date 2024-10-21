import { readFileSync, writeFileSync } from 'fs';
import { Ollama } from 'ollama';

// Helper function to split text into chunks by word count
function splitTextIntoChunks(text, maxWords) {
    const words = text.split(/\s+/);
    const chunks = [];

    for (let i = 0; i < words.length; i += maxWords) {
        const chunk = words.slice(i, i + maxWords).join(' ');
        chunks.push(chunk);
    }

    return chunks;
}

// Read and parse the SRT file
const srtContent = readFileSync('output/output.srt', 'utf-8');

// Function to parse AI response and convert to SRT format with timestamp and emoji
function parseResponseToSRT(response) {
    const lines = response.trim().split('\n');
    let srtResponse = '';
    let index = 1;

    let previousTimestamp = null;
    let currentTimestamp = null;

    for (let i = 0; i < lines.length; i++) {
        const match = lines[i].match(/^(\d{2}:\d{2}:\d{2},\d{3})\s+(.+)$/);
        if (match) {
            const [_, timestamp, emoji] = match;

            if (previousTimestamp) {
                currentTimestamp = timestamp; // current timestamp
                srtResponse += `${index}\n${previousTimestamp} --> ${currentTimestamp}\n${emoji.trim()}\n\n`;
                index++;
            }
            previousTimestamp = timestamp; // Update previous timestamp for next iteration
        } else {
            console.warn(`Line ${i + 1} did not match:`, lines[i]);
        }
    }

    return srtResponse;
}

// Function to process each chunk with retries and parse the response
async function processChunk(chunk, ollama, retries) {
    const prompt = `
    You are provided with a part of a transcription of a video, including timestamps:
    "${chunk}"

    For each timestamp, add one relevant emoji that describes the emotion of the line. 
    Only respond with the timestamp followed by the emoji in the format "00:00:00,000 😄".
    `;

    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const response = await ollama.generate({
                model: "llama3.1",
                prompt,
                options: {
                    timeout: 120000
                }
            });

            return parseResponseToSRT(response.response);
        } catch (error) {
            console.error(`Attempt ${attempt + 1} failed for chunk:`, error);
            if (attempt === retries - 1) {
                console.error("All retries failed for this chunk.");
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

// Function to add emojis to the transcription and output as SRT
async function addEmojisToTranscription(transcription, retries = 3) {
    const ollama = new Ollama();
    const maxWordsPerChunk = 1500;

    const wordCount = transcription.split(/\s+/).length;

    let completeSRT = '';

    if (wordCount <= maxWordsPerChunk) {
        console.log("Processing the entire transcription at once...");
        const srtResponse = await processChunk(transcription, ollama, retries);
        completeSRT = srtResponse;
    } else {
        const transcriptionChunks = splitTextIntoChunks(transcription, maxWordsPerChunk);

        for (let i = 0; i < transcriptionChunks.length; i++) {
            const chunk = transcriptionChunks[i];
            console.log(`Processing chunk ${i + 1} of ${transcriptionChunks.length}...`);
            const chunkResponse = await processChunk(chunk, ollama, retries);
            completeSRT += chunkResponse;
        }
    }

    writeFileSync('output/emojis_with_timestamps.srt', completeSRT, { encoding: 'utf-8' });
    console.log(`Final AI Response saved to output/emojis_with_timestamps.srt`);
}

// Call the function to process the SRT file with emojis
addEmojisToTranscription(srtContent);
