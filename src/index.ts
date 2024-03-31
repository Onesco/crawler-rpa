#!/usr/bin/env node
import { Command } from "commander";
import { getPdfFiles, fetchWebPageAsText, elapsedTime } from "./utils";
import download from "./worker";

const program = new Command();
program
.option('-u --url','the url to site to process')
.option('-s --search <type>','the string to search for pdf files on the site')
.option('-conc --concurrent','the boolean value that is provided in order to execute both the get of pdf files and download of the pdf files concurrently')
.arguments('<url> [search]')
.action( async (url: string, search: string) => {
    elapsedTime('start crawling RPA');
    const options = program.opts();
    const optionSearch = options.search;
    const isConCurrent = options.concurrent;
   
    const [websiteAstext, hostname] = await fetchWebPageAsText(url);
    const pdfFiles = getPdfFiles(websiteAstext, hostname, search || optionSearch, url, isConCurrent);
     if (!isConCurrent) download(url,'',pdfFiles);
    elapsedTime('end crawling RPA');
     
}).description("this crawler require url arg for a website process it in order to fet all available pdf files in the page and also download them either after all pdf files have been retrieved or currently available pdf files for each pdf file seen. It also has an internal caching mechanism that save all retrieved filed to the disk with a ttl of 24 hours upon which a further query to the provided website will return invalidated the cache and make a free query for the given url");  


program.parse(process.argv);
