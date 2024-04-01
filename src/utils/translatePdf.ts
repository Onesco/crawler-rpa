import fs from 'fs';
import pdf from 'pdf-parse';
import {translate} from '@vitalets/google-translate-api';
import { mkdir } from 'fs/promises';
import path from 'path';
import { createPDF } from '.';

// Function to extract text from PDF
const extractTextFromPDF = async(pdfFilePath: string): Promise<string> =>{
    try {
        const dataBuffer = fs.readFileSync(pdfFilePath);
        const data = await pdf(dataBuffer);
        return data.text;
    } catch (error: any) {
        console.error('Error extracting text from PDF:', error.message);
        process.exit(1);
    }
}

// Function to translate text using Google Translate API
const translateText = async(textToTranslate: string, to: string, from?: string): Promise<string>  =>{
    try {
        const { text } = await translate(textToTranslate, { to, from });
        return text;
    } catch (error: any) {
        console.error('Error translating text:', error.message);
        process.exit(1)
    }
}

export const translatePDF = async (pdfFilePath: string, to: string, from?: string, filename?: string): Promise<void> => {
    try {
        // Extract text from PDF
        const text = await extractTextFromPDF(pdfFilePath);
        
        // Translate text
        const translatedText = await translateText(text, to);
        // console.log(translatedText)
        
        const createdPdf = await createPDF(translatedText);

         // write translated pdf to the disk
         const fileName = filename || pdfFilePath.split('/').pop()?.slice(0, -4);
         const baseDownloadDir = "translated-pdf-files";
         if (!fs.existsSync(baseDownloadDir)) await mkdir(baseDownloadDir); 
         const destination = path.resolve(baseDownloadDir, `${fileName}.pdf`);
 
      
        console.log(` translated complete! ${fileName} file saved to ${destination}`)
        fs.writeFileSync(destination, createdPdf);

    } catch (error) {
        console.error('Error translating PDF:', error);
    }
};
