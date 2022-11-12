import {Browser} from "puppeteer";
import {scrollTowardsBottom, scrollTowardsTop} from "./util.js";

export const WebsiteVisitor = async (browser: Browser, websites: string[]) => {
    for (const site of websites) {
        const url = `https://www.${site}`
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(url);
        for(let i = 0; i < 5; i++){
            await scrollTowardsBottom(page);
        }
        for(let i = 0; i < 5; i++){
            await scrollTowardsTop(page);
        }
        await page.close()
    }
}
