import {visit} from "./visit_websites.js";
import pkg from 'buttercup';
import {env, exit} from "process";
const { Credentials, FileDatasource, Vault, init } = pkg;
import dotenv from "dotenv";
import {login} from "./google_login";
import vanillaPuppeteer, {PuppeteerLaunchOptions} from "puppeteer";
import {addExtra} from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

dotenv.config()

init()

const datasourceCredentials = Credentials.fromDatasource({
    path: "./user.bcup",
    type: 'test',
}, env["MASTER_PASSWORD"]);
const fileDatasource = new FileDatasource(datasourceCredentials);

// Read vault from disk (returns history and format)
const vaultCredentials = Credentials.fromPassword("password marvel custom shine!");
const loadedState = await fileDatasource.load(vaultCredentials);
// Create a new vault instance from the loaded data
const vault = Vault.createFromHistory(loadedState.history, loadedState.Format);

vault.getAllGroups()

const profile = env['PROFILE']

if (profile === undefined) {
    console.log("Profile is undefined!")
    exit(0)
}

const entries = vault.findEntriesByProperty('title', profile)
const thisProfile = entries[0]!;

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
