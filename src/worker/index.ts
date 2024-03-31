import { downloadPdfFile, readPdfFile } from "../utils";

const main = async (url: string, fileName='pdf-links', pdfLinks?: string[]) =>{
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

// main("https://www.google.com/search?q=cardiovascular+risk+factors+pdf&rlz=1C5CHFA_enNG1080NG1081&oq=cardiovascular+risk+factors+pdf&gs_lcrp=EgZjaHJvbWUqBggAEEUYOzIGCAAQRRg7MgYIARBFGDwyBggCEEUYPDIGCAMQRRg80gEIMzA0NWowajeoAgCwAgA&sourceid");

export default main;