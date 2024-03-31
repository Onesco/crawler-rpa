import fs from "fs";
import  path from 'path';

export const readPdfFile = (fileName: string) => {
    const baseDownloadDir = "cached-crawled-pdf-links";
    const destination = path.resolve(baseDownloadDir, `${fileName}.json`);
   if(fs.existsSync(destination)){
    const data = fs.readFileSync(destination, 'utf8');
    return JSON.parse(data.toString());
   }
   console.log('errror occure while trying to read file from disk');
   return {};
  }