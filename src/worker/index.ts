import { downloadPdfFile, readPdfFile } from "../utils";

const download = async (url: string, fileName='pdf-links', pdfLinks?: string[]) =>{
    if(pdfLinks) {
        for(let pdfLink of pdfLinks) {
          downloadPdfFile(pdfLink);
        }
    }
    else{
        const savedData = readPdfFile(fileName); 
        if(!savedData[`${url}`]){
          console.log(`no pdf file crawled for this url:`);
          process.exit(0)
        };
        const { pdfs } = savedData[`${url}`];
        for(let pdfLink of pdfs) {
          downloadPdfFile(pdfLink); 
       }
    }
};

export default download;