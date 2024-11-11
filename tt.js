import ytdl from 'ytdl-core';
import { createWriteStream } from 'fs';
import { config } from 'dotenv';
import ffmpeg from 'fluent-ffmpeg';

const { filterFormats, } = ytdl;

// Load .env file
config({ path: './.env' });

const url = 'https://www.youtube.com/watch?v=eUp18_QhX5w'; // replace with YouTube video URL
const destPath = './video'; // you may add or modify the directory before the destination name
const desiredQuality = filterFormats('videoonly').find((format) => format.itag === 22);

ytdl(url, { filter: desiredQuality })
  .pipe(convertStream())
  .pipe(createWriteStream(join(destPath, 'video.mp4')))
  .on('finish', () => {
    console.log('Download complete.');
  })
  .on('error', (error) => {
    console.error('Error during download:', error);
  });

function convertStream() {
  const args = ['-i', 'pipe:0', 'pipe:1'];

  const conversion = new streamConverter({ args });
  conversion.on('data', (data) => {});
  return conversion;
}
