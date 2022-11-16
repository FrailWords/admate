import {visit} from "./visit_websites.js";
import dotenv from "dotenv";
import {login} from "./google_login.js";
import vanillaPuppeteer, {PuppeteerLaunchOptions} from "puppeteer";
import {addExtra} from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import {getProfile} from "./init-creds.js";
import {env, exit} from "process";
import path from "path";
import rimraf from 'rimraf';

dotenv.config()

const profile = env['PROFILE']

if (profile === undefined) {
    console.log("Profile is undefined!")
    exit(0)
}

// Cleanup cache in profile data
const profileDataPath = path.join('.', 'user-data', profile)
rimraf.sync(path.join(profileDataPath, 'DevToolsActivePort'));
rimraf.sync(path.join(profileDataPath, 'Default', 'Cache'));
rimraf.sync(path.join(profileDataPath, 'Default', 'Code Cache'));
rimraf.sync(path.join(profileDataPath, 'Default', 'DawnCache'));

// initialize puppeteer
const options: PuppeteerLaunchOptions = {
    headless: true,
    devtools: false,
    slowMo: 10, // slow down by 10ms
    args: ['--no-default-browser-check', '--disable-dev-shm-usage', `--user-data-dir=user-data/${profile}`, '--use-gl=egl']
}
if (env['CHROME_PATH']) {
    options['executablePath'] = env['CHROME_PATH']
}

const puppeteer = addExtra(vanillaPuppeteer);
puppeteer.use(StealthPlugin());
const browser = await puppeteer.launch(options);

const thisProfile = await getProfile(profile!);

// Login into Google
await login(browser, thisProfile);

// Visit top websites associated with this profile
await visit(browser, thisProfile)

await browser.close();
