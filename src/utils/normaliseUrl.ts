export const normaliseUrl = (url: string): string => {
    if (!(url.startsWith('https://') || url.startsWith('http://'))) {
        url = `http://${url}`;
    }
    try {
        const {hostname, pathname, protocol} = new URL(url);
        if(pathname === '/') return `${protocol}//${hostname}`;
        const normalisedUrl = `${protocol}//${hostname}${pathname}`;
        if(normalisedUrl.endsWith('/')) return normalisedUrl.slice(0, -1);
        return normalisedUrl;
    } catch (err) {
        console.log(err);
        return ''
    }
};