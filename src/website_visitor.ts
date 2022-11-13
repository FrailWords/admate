import {Browser} from "puppeteer";
import {scrollTowardsBottom, scrollTowardsTop} from "./util.js";

export const WebsiteVisitor = async (browser: Browser, websites: string[]) => {
    for (const site of websites) {
        const url = `https://www.${site}`
        console.log("Started visiting -", url);
        const page = await browser.newPage();
        try {
            await page.goto(url, {waitUntil: 'load', timeout: 10000})
        } catch (e) {
            console.error('Error visiting website: ', e);
            continue;
        }
        for(let i = 0; i < 5; i++){
            await scrollTowardsBottom(page);
        }
        for(let i = 0; i < 5; i++){
            await scrollTowardsTop(page);
        }
        await page.close()
        console.log("Done visiting -", url);
    }
}
