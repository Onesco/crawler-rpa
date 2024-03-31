import fs from "fs";
import  path from 'path';

export const readPdfFile = (fileName: string) => {
    const baseDownloadDir = "cached-crawled-pdf-links";
    const destination = path.resolve(baseDownloadDir, `${fileName}.json`);
    if (!fs.existsSync(destination)) return {};
    const data = fs.readFileSync(destination, 'utf8');
    return JSON.parse(data.toString());
  }