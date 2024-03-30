
import { normaliseUrl } from ".";

export const fetchWebPageAsText = async (url: string) => {
    const formatedUrl = normaliseUrl(url);
    const res = await fetch(formatedUrl);
    const html = await res.text();
    return html;
};