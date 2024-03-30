export const normaliseUrl = (url: string): string => {
    const {hostname, pathname} = new URL(url);
    if(pathname === '/') return hostname;
    const normalisedUrl = `${hostname}${pathname}`;
    if(normalisedUrl.endsWith('/')) return normalisedUrl.slice(0, -1);
    return normalisedUrl;
};