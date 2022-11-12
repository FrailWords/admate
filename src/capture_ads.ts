import {addExtra} from 'puppeteer-extra'
import vanillaPuppeteer, {PuppeteerLaunchOptions} from "puppeteer";
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import {env} from 'process';
import {delay} from "./util.js";
// import {GoogleSearcher} from "./google_search.js";
// import {randomUUID} from "crypto";

import {Entry} from "buttercup";
import {WebsiteVisitor} from "./website_visitor.js";
import path from "path";
import * as fs from "fs";


export const visit = async (profile: Entry) => {
    //TODO: remove this later
    if (!env["GUSER"] || !env["GPASS"]) throw 'Set GUSER and GPASS';

    const options: PuppeteerLaunchOptions = {
        headless: false,
        slowMo: 10, // slow down by 10ms
        args: ['--disable-web-security', '--disable-features=IsolateOrigins,site-per-process']
    }
    const puppeteer = addExtra(vanillaPuppeteer);
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch(options);

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);

    await page.setExtraHTTPHeaders({
        'accept-language': 'en-US,en;q=0.9,hy;q=0.8'
    });

    await page.goto('https://accounts.google.com/v3/signin/identifier?dsh=S-889076191%3A1667933776610676&continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&rip=1&sacu=1&service=mail&flowName=GlifWebSignIn&flowEntry=ServiceLogin&ifkv=ARgdvAuSj61Lh246-HEq3m7Em3UaLHiy6tAhNcd97cPmo0fl1cb5EDzhcabE4EARC9nhtfOxMzHkvg');

    await page.waitForSelector('input[type="email"]')
    await page.type('input[type="email"]', env["GUSER"]);

    await Promise.all([
        page.waitForNavigation(),
        await page.keyboard.press('Enter')
    ]);

    await delay(2000);

    await page.waitForSelector('input[type="password"]', {visible: true});
    await page.type('input[type="password"]', env["GPASS"]);
    await page.keyboard.press('Enter')

    await page.waitForNavigation();

    await delay(2000);

    const filePath = path.join('similarweb_data', `${profile.getProperty('title')}.txt`);
    const websites = fs.readFileSync(filePath, 'utf-8')
        .split('\n')
        .filter(Boolean);
    await WebsiteVisitor(browser, websites)

    // await GoogleSearcher(browser, ["baby food", "baby health", "huggies"])

    await page.evaluate(() => {
        // @ts-ignore
        document["scrollingElement"]?.scrollTop = document.body.scrollHeight
    })

    await delay(5000);

// const screenshot_ads = async () => {
//     const ads = await page.$$('iframe[id^="google_ads_iframe"]')
//     for (const ad of ads) {
//         const uuid = randomUUID()
//         await delay(1000);
//         try {
//             await ad.focus()
//             await ad.hover()
//         } catch (_) {
//         }
//         const box = (await ad.boundingBox()) || undefined
//         await page.screenshot({
//             clip: box, path: `${uuid}.jpg`
//         })
//     }
// }

// await screenshot_ads()

// await page.reload()

    await delay(2000);


    await page.screenshot({
        path: 'page.png', fullPage: true
    })

// await page.screenshot({'path': `banner_ad.png`, 'clip': {'x': 100, 'y': 100, 'width': 500, 'height': 500}});     // take screenshot of the required area in puppeteer

    await delay(1000);

// print user id
// await page.waitForFunction(() => window?.branch?.g);
// const myId = await page.evaluate(() => window.branch.g);
// console.log("myId:", myId);

    await browser.close();

}


