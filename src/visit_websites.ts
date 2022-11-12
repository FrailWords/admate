import {Browser} from "puppeteer";

import {Entry} from "buttercup";
import {WebsiteVisitor} from "./website_visitor.js";
import path from "path";
import * as fs from "fs";


export const visit = async (browser: Browser, profile: Entry) => {
    const filePath = path.join('similarweb_data', `${profile.getProperty('title')}.txt`);
    const websites = fs.readFileSync(filePath, 'utf-8')
        .split('\n')
        .filter(Boolean);
    await WebsiteVisitor(browser, websites)
}


