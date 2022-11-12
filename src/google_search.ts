import {delay} from "./util.js";
import {Browser} from "puppeteer";

const BASE_URL = "https://www.google.com/";
const INPUT_SELECTOR = "input[title='Search']";
const RESULT_SELECTOR = "div.g div[data-header-feature=\"0\"] a";
// const CLICK_COUNT = 5;
// const DELAY = 20;

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
        await delay(2000);
        // @ts-ignore
        await page.$$eval(RESULT_SELECTOR, links => links.forEach(link => link.click()))
        await page.close()
    }
}
