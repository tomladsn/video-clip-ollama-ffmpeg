import { readFile, writeFile } from 'fs';

// Read the file (ensure the path is correct)
readFile('video_description.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Split the file content into lines
  const lines = data.split('\n');

  // Initialize a result array to hold the unique sections with timestamps
  let result = [];
  let lastTitle = '';

  // Iterate over the lines to process the text
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim(); // Remove leading/trailing spaces

    // If it's a timestamp (matches the time pattern)
    if (/^\d{2}:\d{2}:\d{2}$/.test(line)) {
      // Add the last valid title and timestamp to the result
      if (lastTitle && !result.find(item => item.title === lastTitle)) {
        result.push({ title: lastTitle, startTime: line });
      }
    } else if (line && !line.startsWith("Coming up")) {
      // If it's a section title (not empty and not "Coming up")
      lastTitle = line;
    }
  }

  // Now calculate the endTime for each section
  for (let i = 0; i < result.length - 1; i++) {
    result[i].endTime = result[i + 1].startTime;
  }
  // For the last entry, set endTime to null
  if (result.length > 0) {
    result[result.length - 1].endTime = null;
  }

  // Display the cleaned-up result
  console.log(JSON.stringify(result, null, 2));

  // Optional: Write the result to a new JSON file
  writeFile('output.json', JSON.stringify(result, null, 2), err => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('Formatted JSON written to output.json');
    }
  });
});
