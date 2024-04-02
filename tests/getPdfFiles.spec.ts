import { getPdfFiles } from '../src/utils';

jest.mock('../src/utils/cachedProcessedData', ()=>{
    return {
        cachedProcessedData: jest.fn()
    }
})

const mockedHtmlBody = `
<html>
    <body>
        <h1>Hello World!</h1>
        <embed src="https/static/somefile.pdf" width="100%"></embed>
        <iframe src="https://youtube.com/somefile.pdf" width="100%"></iframe>
        <object data="https://youtube.com/somefile.pdf" width="100%"></object>
        <a href="https://youtube.com/somefile.pdf" width="100%">first</a>
        <a href="https://youtube.com/somefile2.jpeg" width="100%"></a>
        <a href="/somefile2.pdf" width="100%"></a>
    </body>
</html>
`

describe('get Pdf files', () => {
    it('should return all pdf files on the page include relative paths', () => {
        const pdfFiles = getPdfFiles(mockedHtmlBody, 'static.com');
        const expected = [
        'https/static/somefile.pdf', 
        'https://youtube.com/somefile.pdf', 
        'https://youtube.com/somefile.pdf', 
        'https://youtube.com/somefile.pdf',
        'http://static.com/somefile2.pdf'
    ];
        expect(pdfFiles).toEqual(expected);
    })

    it('should return all pdf files on the page with this search key', () => {
        const pdfFiles = getPdfFiles(mockedHtmlBody, 'fakehostname','first');
        const expected = ['https://youtube.com/somefile.pdf'];
        expect(pdfFiles).toEqual(expected);
    });

    it('should return all pdf files on the page with this search key in a nested section', () => {
        const mockedHtmlBody = `
        <html>
            <body>
                <h1>Hello World!</h1>
                <embed src="https/static/somefile.pdf" width="100%"></embed>
                <div>
                    group of pdf files
                    <iframe src="https://youtube.com/somefile.pdf" width="100%">hello</iframe>
                    <object data="https://youtube.com/somefile.pdf" width="100%"></object>
                    <a href="https://youtube.com/somefile.pdf" width="100%"></a>
                </div>
                <a href="https://youtube.com/somefile.jpeg" width="100%"></a>
                <object data="https://youtube.com/somefile.pdf" width="100%"></object>
                <a href="https://youtube.com/somefile.pdf" width="100%"></a>
            </body>
        </html>
        `
        const pdfFiles = getPdfFiles(mockedHtmlBody, 'fakehostmane', 'group of pdf files');
        const expected =  ["https://youtube.com/somefile.pdf", "https://youtube.com/somefile.pdf", "https://youtube.com/somefile.pdf" ];
        expect(pdfFiles).toEqual(expected);
    })
    
})