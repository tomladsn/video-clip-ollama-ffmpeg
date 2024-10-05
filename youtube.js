import { Builder, By, until } from 'selenium-webdriver';
import fs from 'fs'; // Import file system module
import ollama from 'ollama'; // Import ollama module

// Step 1: Extract YouTube video description
async function getYoutubeDescription() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // Open the YouTube video page
        await driver.get('https://www.youtube.com/watch?v=yHO8HGAZUpY');

        // Wait for the description to load
        await driver.wait(until.elementLocated(By.id('description')), 20000);

        // Extract all elements containing the description
        const descriptionElements = await driver.findElements(By.css('div.style-scope ytd-macro-markers-list-item-renderer'));

        // Combine the text from each element
        const videoDescriptions = await Promise.all(descriptionElements.map(async (el) => {
            return await el.getAttribute('innerText');
        }));

        // Join the descriptions into a single string
        const fullDescription = videoDescriptions.join('\n').trim();

        // Return the extracted description
        return fullDescription;
    } catch (error) {
        console.error("Error extracting YouTube description:", error);
        throw error; // Re-throw the error to stop further execution in case of failure
    } finally {
        // Close the browser
        await driver.quit();
    }
}

// Step 2: Generate prompt for Llama
function generatePrompt(description) {
    return `The following text is an unorganized extract from a YouTube video timestamp:\n\n"${description}"\n\nPlease arrange this data in an organized JSON format like this "{
  "title": "The Radical Distortion of Music, “Music Used to Be a Living Entity”",
  "start_time": "53:03",
  "end_time": "59:03"
},
{
  "title": "Putting Forth the Pillars of Our Civilization, the Exhausted Middle",
  "start_time": "59:03",
  "end_time": "01:10:35"
},
{
  "title": "A Secular Thinker on the Spiritual Battle We Are All Engaged In",
  "start_time": "01:10:35",
  "end_time": "01:40:35"
},". Include the start time and end time for each segment, and provide the title for each timestamped section. Format your response as JSON.`;
}

// Step 3: Send request to Llama model with retry mechanism
async function sendToLlama(description, retries = 3) {
    const message = { role: 'user', content: generatePrompt(description) };

    while (retries > 0) {
        try {
            const response = await ollama.chat({ model: 'llama3.1', messages: [message] });
            return response.message.content; // This will be the formatted JSON response
        } catch (error) {
            console.error("Error during Llama request:", error);

            retries -= 1;
            console.log(`Retrying... Attempts left: ${retries}`);

            if (retries <= 0) {
                throw new Error("Failed to connect to Llama API after multiple attempts");
            }
        }
    }
}

// Step 4: Save the result to a file
async function saveToFile(data) {
    try {
        fs.writeFileSync('organized_video_data.json', data, 'utf8');
        console.log("Organized video data saved to organized_video_data.json");
    } catch (error) {
        console.error("Error saving the file:", error);
        throw error; // Re-throw error if saving fails
    }
}

// Main function to coordinate the entire process
(async function main() {
    try {
        // Step 1: Extract description
        const description = await getYoutubeDescription();

        // Step 2: Send the description to Llama for processing
        const llamaResponse = await sendToLlama(description);

        // Step 3: Save the response as a JSON file
        await saveToFile(llamaResponse);

    } catch (error) {
        console.error("Error during process:", error);
    }
})();
