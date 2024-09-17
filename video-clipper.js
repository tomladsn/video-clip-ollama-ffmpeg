// video-clipper.js
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';

const videoFilePath = path.join(process.cwd(), './input.mp4');
const outputDir = path.join(process.cwd(), 'clips');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Function to clip video based on timestamps
export async function clipVideoFromTimestamps(timestamps) {
    const lines = timestamps.split('\n').filter(Boolean);

    for (let i = 0; i < lines.length; i++) {
        const [start, end, description] = lines[i].split(' --> ');
        const outputFileName = path.join(outputDir, `clip_${i + 1}.mp4`);

        ffmpeg(videoFilePath)
            .setStartTime(start)
            .setDuration(end - start)
            .output(outputFileName)
            .on('end', () => console.log(`Clip generated: ${outputFileName}`))
            .on('error', (err) => console.error(`Error generating clip: ${err.message}`))
            .run();
    }
}
