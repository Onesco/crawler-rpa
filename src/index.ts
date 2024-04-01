#!/usr/bin/env node
import { Command } from "commander";
import { getPdfFiles, fetchWebPageAsText, elapsedTime, mergePdfs } from "./utils";
import download from "./worker";
import { translatePDF } from "./utils/translatePdf";

const program = new Command();

program
.option('-u --url','the url to site to process')
.option('-s --search <string>','the string to search for pdf files on the site')
.option('-conc --concurrent','the boolean value that is provided in order to execute both the get of pdf files and download of the pdf files concurrently')
.option('-t --ttl <number>', 'the time to live (in seconds) of retrieved pdf files links from a given web page (default: 86_400 seconds that is 24 hours)')
.option('-sa --save-as <string>', 'json file name to save the cached retrieved pdf file cached-crawled-pdf-links directory, if absent default to pdf-links')
.arguments('<url> [search]')
.action( async (url: string, search: string) => {
    elapsedTime('start crawling RPA');
    const options = program.opts();
    const optionSearch = options.search;
    const isConCurrent = options.concurrent;
    const optionSaveAs = options.saveAs;
    const optionTtl = options.ttl;
   
    const [websiteAstext, hostname] = await fetchWebPageAsText(url.trim());
    const pdfFiles = getPdfFiles(websiteAstext, hostname, search || optionSearch, url, isConCurrent, optionSaveAs, optionTtl);
    if(pdfFiles.length  === 0) console.info("no pdf files found for this url: " + url);
    if (!isConCurrent) download(url,'',pdfFiles);
    elapsedTime('end crawling RPA');
     
}).description("this crawler require url argument for a website in order to process it and retrieve all available pdf files in the page and also download them either after all pdf files have been retrieved or currently available pdf files for each pdf file seen. It also has an internal caching mechanism that save all retrieved filed to the disk with a ttl of 24 hours upon which a further query to the provided website will return invalidated the cache and make a free query for the given url.\nIt also has option to that allows you to merge list of pdf files into one by providing the file path to the pdf files");  


program.command('merge')
.argument('<files>', 'string of file paths to the pdf files to be merge separate by comma delimiter[","] example-  to "myfirstpdffile.pdf,mysecondpdffile.pdf"')
.argument('[marge-as]', 'the name you want want to merge the files to. if not provide it is default to merged.pdf')
.action( async (files: string, mergedAs?: string) => {
    elapsedTime('start merging files');
    mergePdfs(files.split(',').map((e:string)=>e.trim()), mergedAs);
    elapsedTime('merging ended');
} )

program.command('translate')
.argument('<file>', 'string to the path to the pdf file to be translated "mysecondpdffile.pdf"')
.argument('<to>', 'the target locale to translate the pdf file to (default"en"). It can be any of the following supported locales: en,nl,kr,')
.option('-f --from<string>', 'the locale of the pdf file (default"auto"). It can be any of the following supported locales: en,nl,kr,')
.option('-ta --translated-as <string>', 'the name you want to save the translated file as. if not provide it is default to old-filename-<to>.pdf')
.action( async (file: string, to: string) => {
    elapsedTime('start translating');
    const options = program.opts();
    const optionFrom = options.from;
    const optionTranslatedAs = options.translatedAs;
    // todo: add translation handler
    translatePDF(file, to, optionFrom, optionTranslatedAs);
    elapsedTime('translation ended');
} )


program.parse(process.argv);
