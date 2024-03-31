import fs from "fs";
import  path from 'path';

export const readPdfFile = (fileName: string) => {
    const baseDownloadDir = "cached-crawled-pdf-links";
    const destination = path.resolve(baseDownloadDir, `${fileName}.json`);
    try {
      const data = fs.readFileSync(destination, 'utf8');
      return JSON.parse(data.toString());
    } catch (error) {
      console.log('errror occure while trying to read file from disk');
      return {};
    }
  }