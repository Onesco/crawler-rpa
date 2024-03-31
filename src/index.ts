#!/usr/bin/env node
import { Command } from "commander";
import { getPdfFiles, fetchWebPageAsText } from "./utils";

const program = new Command();
const startTime = Date.now();
program
.option('-u --url','the url to site to process')
.option('-s --search <type>','the string to search for pdf files on the site')
.arguments('<url> [search]')
.action( async (url: string, search: string) => {
    const options = program.opts();
    const optionSearch = options.search;
    const websiteAstext = await fetchWebPageAsText(url);
    const pdfFiles = getPdfFiles(websiteAstext, search || optionSearch, url);
    console.log(pdfFiles, 'duration:', Date.now() - startTime + 'ms');
}).description("this command take in an arg url for a website url process it in order to get all pdf file in the page and merge them ");  


program.parse(process.argv);