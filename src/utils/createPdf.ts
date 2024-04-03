import { PDFDocument, StandardFonts, rgb,  } from "pdf-lib";
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from "path";


const fontPath = path.resolve('fonts', 'OpenSans-VariableFont_wdth,wght.ttf');
const fontBytes = fs.readFileSync(fontPath);

export const createPDF = async (text: string)  => {
    
    try {
        const pdfDoc = await PDFDocument.create();
        pdfDoc.registerFontkit(fontkit);
        const page = pdfDoc.addPage();
  
        // Embed a Unicode font (e.g., OpenSans)
        const font = await pdfDoc.embedFont(fontBytes);
        const lines = text.split('\n');
            // Add pages for the multiline text
        let pageIndex = 0;
        let currentPage = pdfDoc.addPage();

        const lineHeight = 15;
        const startY = 800;
        const linesPerPage = 45;

        lines.forEach((line, index) => {
            if (index % linesPerPage === 0 && index !== 0) {
                currentPage = pdfDoc.addPage();
                pageIndex++;
            }

            const y = startY - (index % linesPerPage) * lineHeight;

            currentPage.drawText(line, {
                x: 20,
                y,
                font: font,
                size: 9,
                color: rgb(0, 0, 0),
            });
        });
        pdfDoc.removePage(0);
        return await pdfDoc.save();
    } catch (error:any) {
        console.error('Failed to create PDF Document' + error.message)
        process.exit(1);
    }
};