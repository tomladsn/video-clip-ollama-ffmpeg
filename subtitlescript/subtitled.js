import { readFileSync, writeFileSync } from 'fs';
import SrtParser from 'srt-parser-2';

// Step 1: Load and parse the SRT file
const parseSrtFile = (filePath) => {
  const srtContent = readFileSync(filePath, 'utf-8');
  const parser = new SrtParser();
  return parser.fromSrt(srtContent);
};

// Step 2: Split text into chunks of 4 words max
const splitText = (text, maxWords) => {
  const words = text.split(' ');
  let result = [];

  for (let i = 0; i < words.length; i += maxWords) {
    result.push(words.slice(i, i + maxWords).join(' '));
  }

  return result;
};

// Step 3: Convert SRT time (HH:MM:SS,MS) to seconds
const srtTimeToSeconds = (srtTime) => {
  const [hours, minutes, seconds] = srtTime.split(':');
  const [sec, ms] = seconds.split(',');
  return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(sec) + parseFloat(ms / 1000);
};

// Step 4: Convert seconds back to SRT time (HH:MM:SS,MS)
const secondsToSrtTime = (timeInSeconds) => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  const milliseconds = Math.floor((timeInSeconds - Math.floor(timeInSeconds)) * 1000);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
};

// Step 5: Create new SRT file with adjusted timestamps and split subtitles
const createNewSrt = (parsedSrt, maxWordsPerChunk) => {
  const newSubtitles = [];
  
  parsedSrt.forEach(sub => {
    const chunks = splitText(sub.text, maxWordsPerChunk);
    const startTimeInSeconds = srtTimeToSeconds(sub.startTime);
    const endTimeInSeconds = srtTimeToSeconds(sub.endTime);
    
    // Calculate the duration of the original subtitle
    const originalDuration = endTimeInSeconds - startTimeInSeconds;
    
    // Divide the original duration among the chunks
    const chunkDuration = originalDuration / chunks.length;
    
    chunks.forEach((chunk, index) => {
      const start = startTimeInSeconds + (index * chunkDuration);
      const end = start + chunkDuration;
      newSubtitles.push({
        id: newSubtitles.length + 1,
        startTime: secondsToSrtTime(start),
        endTime: secondsToSrtTime(end),
        text: chunk
      });
    });
  });

  return newSubtitles;
};

// Step 6: Convert new subtitle object to SRT format
const convertToSrtFormat = (newSubtitles) => {
  const parser = new SrtParser();
  return parser.toSrt(newSubtitles);
};

// Step 7: Main function to read, process, and write new SRT
const processSrtFile = (inputFilePath, outputFilePath) => {
  const parsedSrt = parseSrtFile(inputFilePath);
  const newSubtitles = createNewSrt(parsedSrt, 4); // 4 words max per chunk
  const newSrtContent = convertToSrtFormat(newSubtitles);
  
  writeFileSync(outputFilePath, newSrtContent, 'utf-8');
  console.log('New SRT file created:', outputFilePath);
};

// Example usage
processSrtFile('clip1.srt', 'output.srt');
