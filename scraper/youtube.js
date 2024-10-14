import { Builder, By, until } from 'selenium-webdriver';
import fs from 'fs';  // Import the file system module

(async function getYoutubeDescription() {
    // Set up the Chrome browser
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // Open the YouTube video page
        await driver.get('https://www.youtube.com/watch?v=yHO8HGAZUpY');

        // Wait for the description to be loaded
        await driver.wait(until.elementLocated(By.id('description')), 20000); // Wait for the description div

        // Extract all span elements containing the description
        const descriptionElements = await driver.findElements(By.css('div.style-scope ytd-macro-markers-list-item-renderer'));

        // Extract and combine the text from each span element
        const videoDescriptions = await Promise.all(descriptionElements.map(async (el) => {
            return await el.getAttribute('innerText');
        }));

        // Join the descriptions into a single string
        const fullDescription = videoDescriptions.join('\n').trim();

        // Display description in the console
        console.log("Video Description:", fullDescription);

        // Save the description to a text file
        fs.writeFileSync('video_description.txt', fullDescription, 'utf8');
        console.log("Video Description saved to video_description.txt");

    } catch (error) {
        console.error("Error:", error);
    } finally {
        // Close the browser
        await driver.quit();
    }
})();
