import { downloadPdfFile, readPdfFile } from "../utils";

const main = (url: string, fileName='pdf-links' ) =>{
    const savedData = readPdfFile(fileName); 
    if(!savedData[`${url}`]){
        console.log(`no pdf file crawled for this url:`);
       process.exit(0)
    };
    const pdfs = savedData[`${url}`];
    for(let pdfLink of pdfs) {
        downloadPdfFile(pdfLink);
    }
};