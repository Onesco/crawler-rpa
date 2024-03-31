export const normaliseUrl = (url: string): string => {
    if (!(url.startsWith('https://') || url.startsWith('http://'))) {
        url = `http://${url}`;
    }
    try {
        const newUrl = new URL(url);
        const {hostname, pathname, protocol, searchParams} = newUrl;
        if(pathname === '/') return `${protocol}//${hostname}`;
        if(url.endsWith('/')) return url.slice(0, -1);
        return newUrl.href;
    } catch (err) {
        console.log(err);
        return ''
    }
};