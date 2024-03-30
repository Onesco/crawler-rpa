import { fetchWebPageAsText } from '../src/utils';


const mockedHtmlBody = `
<html>
    <body>
        <h1>Hello World!</h1>
        <embed src="https/static/somefile.pdf" width="100%"></embed>
    </body>
</html>
`
global.fetch = jest
    .fn()
    .mockImplementation((_input: RequestInfo | URL, _init?: RequestInit | undefined) => {
      return Promise.resolve({
        ok: true,
        text: () => mockedHtmlBody,
      });
    });

describe('fetchWebPageAsText', () => {
    it('should return the html element of the page', async () => {
        const response = await fetchWebPageAsText('google.com');
        expect(response).toEqual(mockedHtmlBody);
    });
});