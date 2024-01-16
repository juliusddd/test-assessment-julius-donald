const puppeteer = require('puppeteer');
const { writeFile } = require('fs');

const getScrape = async () => {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
  
    const page = await browser.newPage();
  
    await page.goto("https://www.imdb.com/search/title/?genres=horror", {
      waitUntil: "domcontentloaded",
    });
  
    // Get page data
    const scrapes = await page.evaluate(() => {
      const scrapeList = document.querySelectorAll(".ipc-metadata-list-summary-item");
  
      return Array.from(scrapeList).map((scrape) => {
        const title = scrape.querySelector(".ipc-title-link-wrapper").innerText;
        const summary = scrape.querySelector(".ipc-html-content-inner-div").innerText;
        const rating = scrape.querySelector(".sc-1e00898e-7.hcJWUf.dli-title-metadata").innerText;
        return { title, summary, rating };
      });
    });
  
    // Display the quotes
    console.log(scrapes);

    writeFile('testtt.json', JSON.stringify(scrapes, null, 2), (error) => {
        if (error) {
          console.log('An error has occurred ', error);
          return;
        }
        console.log('Data written successfully to disk');
      });
  
    // Close the browser
    await browser.close();
  };
  
  // Start the scraping
  getScrape();