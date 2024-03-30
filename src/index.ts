#!/usr/bin/env node
import { Command } from "commander";
import { getPdfFiles, fetchWebPageAsText } from "../src/utils";

const program = new Command();

type Url = string;
program
.option('-u --url','the url to site to process')
.argument('<url>', '<url> the url to site to process')
.action((url: Url) => {
    console.log(`Hello ${url}!`);
}).description("this command take in an arg url for a website url process it in order to get all pdf file in the page and merge them ");   


program.parse(process.argv);