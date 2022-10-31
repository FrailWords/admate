import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import {env} from 'process';
import {randomUUID} from 'crypto'
import pkg from 'puppeteer-autoscroll-down';

const {scrollPageToBottom, scrollPageToTop} = pkg;

if (!env.GUSER || !env.GPASS) throw 'Set GUSER and GPASS';

puppeteer.use(StealthPlugin());

const browser = await puppeteer.launch({
    headless: false,
    args: ['--disable-web-security', '--disable-features=IsolateOrigins,site-per-process']
});
const page = await browser.newPage();
page.setDefaultNavigationTimeout(0);

await page.setExtraHTTPHeaders({
    'accept-language': 'en-US,en;q=0.9,hy;q=0.8'
});

await page.goto('https://medium.com/m/connect/google?state=google-%7Chttps%3A%2F%2Fmedium.com%2F');

await page.waitForSelector('input[type="email"]')
await page.type('input[type="email"]', env.GUSER);

await Promise.all([
    page.waitForNavigation(),
    await page.keyboard.press('Enter')
]);

await page.waitForSelector('input[type="password"]', {visible: true});
await page.type('input[type="password"]', env.GPASS);

const res = await Promise.all([
    page.waitForFunction(() => location.href === 'https://medium.com/'),
    await page.keyboard.press('Enter')
]);

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

await page.goto('https://www.timesofindia.com', {
    waitUntil: 'domcontentloaded',
});

// await page.click("a.clickhere")

// await delay(2000);

// await scrollPageToBottom(page, {
//     size: 500,
//     delay: 250
// })
//
// await scrollPageToTop(page, {
//     size: 500,
//     delay: 250
// })

// evaluate will run the function in the page context
// await page.evaluate(_ => {
//     // this will be executed within the page, that was loaded before
//     document.body.style.background = '#000';
// });

await page.evaluate(() => {
    document.scrollingElement.scrollTop = document.body.scrollHeight
})

await delay(5000);

const screenshot_ads = async () => {
    const ads = await page.$$('iframe[id^="google_ads_iframe"]')
    for (const ad of ads) {
        const uuid = randomUUID()
        await delay(1000);
        try {
            await ad.focus()
            await ad.hover()
        } catch (_) {
        }
        const box = await ad.boundingBox()
        await page.screenshot({
            clip: box, path: `${uuid}.jpg`
        })
    }
}

await screenshot_ads()

await page.reload()

await delay(5000);

await screenshot_ads()

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