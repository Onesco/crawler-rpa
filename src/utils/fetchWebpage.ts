
import { normaliseUrl } from ".";

export const fetchWebPageAsText = async (url: string) => {
    console.log(`Fetching data`);
    const [formatedUrl, hostname] = normaliseUrl(url);
    try{
        const res = await fetch(formatedUrl);
        const html = await res.text();
        return [html, hostname];
    }
    catch (err) {
        console.log('Failed to reach the provided URL it could be due to ERR_FR_TOO_MANY_REDIRECTS', );
        return ['', hostname];
    }
};