import {Browser} from "puppeteer";

const BASE_URL = "https://www.google.com/";
const INPUT_SELECTOR = "input[title='Search']";

export const GoogleSearcher = async (browser: Browser, query_list: string[]) => {
    for (const query of query_list) {
        const page = await browser.newPage();
        await page.goto(BASE_URL);
        await page.waitForSelector(INPUT_SELECTOR)
        await page.type(INPUT_SELECTOR, query);
        await page.keyboard.press('Enter')
        await page.waitForNavigation({
            waitUntil: 'domcontentloaded',
        });
        await page.close()
    }
}
