import {Browser} from "puppeteer";
import {scrollTowardsBottom, scrollTowardsTop} from "./util.js";

export const WebsiteVisitor = async (browser: Browser, websites: string[]) => {
    for (const site of websites) {
        const url = `https://www.${site}`
        const page = await browser.newPage();
        try {
            console.log("Started visiting -", url);
            await page.goto(url, {waitUntil: 'load', timeout: 30000})
            for (let i = 0; i < 5; i++) {
                await scrollTowardsBottom(page);
            }
            for (let i = 0; i < 5; i++) {
                await scrollTowardsTop(page);
            }
            console.log("Done visiting -", url);
        } catch (e) {
            console.error('Error visiting website: ', e);
        } finally {
            await page.close()
        }
    }
}
