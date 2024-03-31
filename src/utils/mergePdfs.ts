import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

export const mergePdfs = async (filePaths: string[], onlinePdfUrls?: string[]) => {
  
    // read all files concurrently and same time cream PDFDocument instance
    const allPdfsPromise: Promise<any>[] = [PDFDocument.create()];
    for (const pdfFilePath of filePaths) {
        allPdfsPromise.push(fs.promises.readFile(pdfFilePath));
    };
    const [pdfDoc, ...fetchedPdfBytes] = await Promise.all(allPdfsPromise);
    // (pdfDoc as PDFDocument)
    // load all pdf docuemts to the PDFDocument concurrently
    const allPdfBuffers = [];
    for(let pdfDoc of (fetchedPdfBytes as Buffer[]))  {
        allPdfBuffers.push(PDFDocument.load(pdfDoc, { ignoreEncryption: true })); 
    };
    const loadedPdfFiles =  await Promise.all(allPdfBuffers);

    // get pdf pages
    const allPdfPages = [];
    for(let loadedPdfFile of loadedPdfFiles) {
        allPdfPages.push(...loadedPdfFile.getPages());
    };

    // console.log(allPdfPages.length);
    for(let pdfPage of allPdfPages) {
        (pdfDoc as PDFDocument).addPage(pdfPage);
    };

    // save merged pdf
    const mergedPdfBytes = await (pdfDoc as PDFDocument).save();
    fs.writeFileSync('merged.pdf', mergedPdfBytes);
};

mergePdfs(['/Users/mac/Documents/project/cli-project/crawler-rpa/downloads/9241545852.pdf','/Users/mac/Documents/project/cli-project/crawler-rpa/downloads/risk.pdf'])