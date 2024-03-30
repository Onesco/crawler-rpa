#!/usr/bin/env node
import { Command } from "commander";
import { getPdfFiles, fetchWebPageAsText } from "./utils";

const program = new Command();
const startTime = Date.now();
program
.option('-u --url','the url to site to process')
.argument('<url>', '<url> the url to site to process')
.action( async (url: string) => {
    const websiteAstext = await fetchWebPageAsText(url);
    const pdfFiles = await getPdfFiles(websiteAstext);
    console.log(pdfFiles, 'duration:', Date.now() - startTime + 'ms');
}).description("this command take in an arg url for a website url process it in order to get all pdf file in the page and merge them ");   


program.parse(process.argv);