import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import { writeFile } from 'fs';

// Function to read SRT file and parse subtitles
const readSrtFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const subtitles = [];
    const fileStream = createReadStream(filePath);
    const rl = createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let subtitle = null;
    let currentText = '';

    rl.on('line', (line) => {
      if (line.trim() === '') {
        // End of the current subtitle block
        if (subtitle) {
          subtitle.subtitleText = currentText.trim();
          subtitles.push(subtitle);
        }
        subtitle = null;
        currentText = '';
      } else if (!subtitle) {
        // First line: index
        subtitle = { index: line.trim(), startTime: '', endTime: '', subtitleText: '' };
      } else if (!subtitle.startTime) {
        // Second line: start and end time
        const timeMatch = line.match(/^(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})$/);
        if (timeMatch) {
          subtitle.startTime = `${timeMatch[1]}:${timeMatch[2]}:${timeMatch[3]},${timeMatch[4]}`;
          subtitle.endTime = `${timeMatch[5]}:${timeMatch[6]}:${timeMatch[7]},${timeMatch[8]}`;
        }
      } else {
        // Rest of the lines: subtitle text
        currentText += ` ${line.trim()}`;
      }
    });

    rl.on('close', () => {
      if (subtitle) {
        subtitle.subtitleText = currentText.trim();
        subtitles.push(subtitle);
      }
      resolve(subtitles);
    });

    rl.on('error', (error) => {
      reject(error);
    });
  });
};

// Parse SRT file and output it to a JSON file
const parseSrtFile = async (filePath, outputFile) => {
  try {
    const subtitles = await readSrtFile(filePath);

    // Write the subtitles as JSON to an output file
    writeFile(outputFile, JSON.stringify(subtitles, null, 2), (err) => {
      if (err) {
        console.error('Error writing to JSON file:', err);
      } else {
        console.log(`Subtitles successfully written to ${outputFile}`);
      }
    });
  } catch (error) {
    console.error('Error reading SRT file:', error);
  }
};

// Example usage
const srtFilePath = 'output.srt';  // Replace with the actual SRT file path
const jsonOutputFile = 'output.json'; // Replace with desired output JSON file name
parseSrtFile(srtFilePath, jsonOutputFile);
