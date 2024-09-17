// Function to extract text from SRT
function extractImportantParts(srtContent) {
  const lines = srtContent.split('\n');
  const parts = [];

  lines.forEach((line, index) => {
    if (line.match(/^\d+$/)) {
      const time = lines[index + 1];  // Time format example: 00:00:05,000 --> 00:00:10,000
      const text = lines[index + 2];  // The dialogue or text content

      if (text && text.length > 5) {
        parts.push({ time, text });
      }
    }
  });

  return parts;
}

export  { extractImportantParts };
