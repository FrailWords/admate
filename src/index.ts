import {visit} from "./visit_websites.js";
import dotenv from "dotenv";
import {login} from "./google_login.js";
import vanillaPuppeteer, {PuppeteerLaunchOptions} from "puppeteer";
import {addExtra} from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import {getProfile} from "./init-creds.js";

dotenv.config()

const thisProfile = await getProfile();

// initialize puppeteer
const options: PuppeteerLaunchOptions = {
    headless: false,
    slowMo: 10, // slow down by 10ms
    args: ['--disable-web-security', '--disable-features=IsolateOrigins,site-per-process']
}
const puppeteer = addExtra(vanillaPuppeteer);
puppeteer.use(StealthPlugin());
const browser = await puppeteer.launch(options);

// Login into Google
await login(browser, thisProfile);

// Visit top websites associated with this profile
await visit(browser, thisProfile)

await browser.close();
