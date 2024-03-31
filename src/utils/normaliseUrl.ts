export const normaliseUrl = (url: string): string[] => {
    if (!(url.startsWith('https://') || url.startsWith('http://'))) {
        url = `http://${url}`;
    }
    try {
        const newUrl = new URL(url);
        const {hostname, pathname, protocol, searchParams} = newUrl;
        if(pathname === '/') return [`${protocol}//${hostname}`, hostname];
        if(url.endsWith('/')) return [url.slice(0, -1), hostname];
        return [newUrl.href, hostname];
    } catch (err: any) {
        console.log('wrong url provided, failed to parsed the url: ' + err.message);
        return ['']
    }
};