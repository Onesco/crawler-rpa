import fs from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

export const mergePdfs = async (filePaths: string[], mergedAs?: string, onlinePdfUrls?: string[]) => {
    const fileNames = [];
  
    try{
            // read all files concurrently and same time cream PDFDocument instance
        const allPdfsPromise: Promise<any>[] = [PDFDocument.create()];
        for (const pdfFilePath of filePaths) {
            allPdfsPromise.push(fs.promises.readFile(pdfFilePath));
            fileNames.push(pdfFilePath.split('/').pop()?.slice(0, -4))
        };
        const [pdfDoc, ...fetchedPdfBytes] = await Promise.all(allPdfsPromise);
       
        // load all pdf docuemts to the PDFDocument concurrently
        const allPdfBuffers = [];
        for(let pdfDoc of (fetchedPdfBytes as Buffer[]))  {
            allPdfBuffers.push(PDFDocument.load(pdfDoc, { ignoreEncryption: true })); 
        };
        const loadedPdfFiles =  await Promise.all(allPdfBuffers);

        // get pdf pages
        const allPdfPagesPromise = [];
        for(let loadedPdfFile of loadedPdfFiles) {
            allPdfPagesPromise.push(pdfDoc.copyPages(loadedPdfFile, loadedPdfFile.getPageIndices()));
        };
        const allPdfPages = await Promise.all(allPdfPagesPromise);


        // console.log(allPdfPages.length);
        for(let pdfPage of allPdfPages) {
            pdfPage.forEach((page: any) => (pdfDoc as PDFDocument).addPage(page));
            // .addPage(pdfPage);
        };

        // save merged pdf
        const mergedPdfBytes = await (pdfDoc as PDFDocument).save();

        // write merged pdf to disk
        const fileName = mergedAs || fileNames.join('__');
        const baseDownloadDir = "merged-pdf-files";
        if (!fs.existsSync(baseDownloadDir)) await mkdir(baseDownloadDir); 
        const destination = path.resolve(baseDownloadDir, `${fileName}.pdf`);

        const fileStream = fs.createWriteStream(destination);
        fileStream.write(mergedPdfBytes);
        console.log(`mergeging file ${fileName} to ${destination}`)

    }catch(err: any) {
        console.log(`Failed to merge file: ${err.message}`)
    };

};