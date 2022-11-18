import {Entry} from "buttercup";
import {Browser} from "puppeteer";
import {delay} from "./util.js";

export const login = async (browser: Browser, profile: Entry) => {
    const USERNAME = profile.getProperty('username') as string;
    const PASSWORD = profile.getProperty('password') as string;

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);

    await page.setExtraHTTPHeaders({
        'accept-language': 'en-US,en;q=0.9,hy;q=0.8'
    });

    await page.goto('https://accounts.google.com/AccountChooser?service=mail&amp;continue=https://mail.google.com/mail/',
        { waitUntil: 'networkidle2' });

    const currentUrl = page.url();
    if (currentUrl.indexOf('https://mail.google.com/') != -1) {
        console.log("Already logged in!");
        return;
    }

    await page.waitForSelector('input[type="email"]')
    await page.type('input[type="email"]', USERNAME);

    await Promise.all([
        page.waitForNavigation(),
        await page.keyboard.press('Enter')
    ]);

    await delay(2000);

    await page.waitForSelector('input[type="password"]', {visible: true});
    await page.type('input[type="password"]', PASSWORD);
    await page.keyboard.press('Enter')

    await page.waitForNavigation();

    console.log("Google Log In Complete!")
}