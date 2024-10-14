const { exec } = require('child_process');
const path = require('path');

const audioFilePath = path.join(__dirname, 'your_audio_file.mp3'); // Replace with your audio file path

// Function to run the Python script
const runWhisperTranscription = (audioPath) => {
  return new Promise((resolve, reject) => {
    // Command to run the Python script
    const command = `python transcribe_audio.py ${audioPath}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Whisper script: ${stderr}`);
        return reject(error);
      }

      try {
        // Parse the result and return the transcription
        const result = JSON.parse(stdout);
        resolve(result);
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
};

// Call the transcription function
runWhisperTranscription(audioFilePath)
  .then((transcription) => {
    console.log('Transcription result:', transcription.text);
  })
  .catch((err) => {
    console.error('Error during transcription:', err);
  });
