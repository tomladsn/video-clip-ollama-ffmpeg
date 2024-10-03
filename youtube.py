from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Path to your chromedriver.exe
chrome_driver_path = "./chromedriver-win64/chromedriver.exe"

# Set up the ChromeDriver service
service = Service(executable_path=chrome_driver_path)

# Launch the Chrome browser using Selenium
driver = webdriver.Chrome(service=service)

# Open the YouTube video page
driver.get("https://www.youtube.com/watch?v=yHO8HGAZUpY")

# Wait for the page to load fully
try:
    # Wait up to 20 seconds for the description element to be present
    description_element = WebDriverWait(driver, 20).until(
        EC.visibility_of_element_located((By.ID, "description"))
    )

    # Extract all text from the span tags inside the description element
    spans = description_element.find_elements(By.TAG_NAME, "span")
    video_description = " ".join(span.text for span in spans if span.text)

    print("Video Description:", video_description)

except Exception as e:
    print("Error:", e)

finally:
    # Close the browser
    driver.quit()
