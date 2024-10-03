from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def get_youtube_description(video_url):
    # Set up the Chrome browser
    driver = webdriver.Chrome()

    try:
        # Open the YouTube video page
        driver.get(video_url)

        # Wait for the description to be loaded
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "span.yt-core-attributed-string--link-inherit-color"))
        )

        # Select all span elements containing the description
        description_elements = driver.find_elements(By.CSS_SELECTOR, "span.yt-core-attributed-string--link-inherit-color")

        if description_elements:
            # Get the text content of the descriptions
            video_descriptions = [el.text.strip() for el in description_elements]
            print("Video Descriptions:", "\n".join(video_descriptions))
        else:
            print("Description elements not found or not loaded yet.")
    except Exception as e:
        print("Error:", e)
    finally:
        # Close the browser
        driver.quit()

if __name__ == "__main__":
    # URL of the YouTube video
    video_url = "https://www.youtube.com/watch?v=yHO8HGAZUpY"
    get_youtube_description(video_url)
