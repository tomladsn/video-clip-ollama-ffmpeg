import { Builder, By, until } from 'selenium-webdriver';

(async function getYoutubeDescription() {
    // Set up the Chrome browser
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // Open the YouTube video page
        await driver.get('https://www.youtube.com/watch?v=yHO8HGAZUpY');

        // Wait for the description to be loaded
        await driver.wait(until.elementLocated(By.id('description')), 20000); // Wait for the description div

        // Extract all span elements containing the description
        const descriptionElements = await driver.findElements(By.css('#description span.yt-core-attributed-string--link-inherit-color'));

        // Extract and combine the text from each span element
        const videoDescriptions = await Promise.all(descriptionElements.map(async (el) => {
            return await el.getAttribute('innerText');
        }));

        // Join the descriptions into a single string
        const fullDescription = videoDescriptions.join('\n').trim();
        console.log("Video Description:", fullDescription);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        // Close the browser
        await driver.quit();
    }
})();
