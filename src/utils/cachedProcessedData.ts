import fs from "fs";
import  path from 'path';
import { readPdfFile } from ".";

type PdfLinkObject = {
  [key: string]: {
    pdfs: string[];
    expired_at: number;
  };
}

export const cachedProcessedData = (pdfLinks: string[], fileName: string, url: string, ttl = 86_400) => { // ttl: the time to live of 24 hours

    console.log('caching data to disk')
    const baseDownloadDir = "cached-crawled-pdf-links";
    if (!fs.existsSync(baseDownloadDir)) {
      fs.mkdirSync(baseDownloadDir); 
    }
    const data: PdfLinkObject = readPdfFile(fileName);
  
    if (data[`${url}`]) {
      const {expired_at} = data[`${url}`];
      if (Date.now() < expired_at) {
        return;
      }
      else{
        delete data[`${url}`];
      }
    }
  
    data[`${url}`] = {
      pdfs: pdfLinks,
      expired_at: Date.now() + ttl,
    }
    const destination = path.resolve(baseDownloadDir, `${fileName}.json`);
  
    fs.writeFile(destination, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.log("error in caching file");
        return;
      }
      console.log("The file was saved!");
    });
  };