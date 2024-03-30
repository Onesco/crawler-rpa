import { getPdfFiles } from '../src/utils';

const mockedHtmlBody = `
<html>
    <body>
        <h1>Hello World!</h1>
        <embed src="https/static/somefile.pdf" width="100%"></embed>
        <iframe src="https://youtube.com/somefile.pdf" width="100%"></iframe>
        <object data="https://youtube.com/somefile.pdf" width="100%"></object>
        <a href="https://youtube.com/somefile.pdf" width="100%">first</a>
        <a href="https://youtube.com/somefile.jpeg" width="100%"></a>
    </body>
</html>
`

describe('get Pdf files by seach', () => {
    it('should return all pdf files on the page without search text', () => {
        const pdfFiles = getPdfFiles(mockedHtmlBody);
        const expected = ['https/static/somefile.pdf', 
        'https://youtube.com/somefile.pdf', 
        'https://youtube.com/somefile.pdf', 
        'https://youtube.com/somefile.pdf'];
        expect(pdfFiles).toEqual(expected);
    })

    it('should return all pdf files on the page with this search key', () => {
        const pdfFiles = getPdfFiles(mockedHtmlBody, 'first');
        const expected = ['https://youtube.com/somefile.pdf'];
        expect(pdfFiles).toEqual(expected);
    })

    it('should return all pdf files on the page with this search key in a nested section', () => {
        const mockedHtmlBody = `
        <html>
            <body>
                <h1>Hello World!</h1>
                <embed src="https/static/somefile.pdf" width="100%"></embed>
                <div>
                    group of pdf files
                    <iframe src="https://youtube.com/somefile.pdf" width="100%"></iframe>
                    <object data="https://youtube.com/somefile.pdf" width="100%"></object>
                    <a href="https://youtube.com/somefile.pdf" width="100%"></a>
                </div>
                <a href="https://youtube.com/somefile.jpeg" width="100%"></a>
            </body>
        </html>
        `

        const pdfFiles = getPdfFiles(mockedHtmlBody, 'group of pdf files');
        const expected =  ["https://youtube.com/somefile.pdf", "https://youtube.com/somefile.pdf", "https://youtube.com/somefile.pdf" ];
        expect(pdfFiles).toEqual(expected);
    })
    
})