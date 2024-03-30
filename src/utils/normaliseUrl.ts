export const normaliseUrl = (url: string): string => {
    const {hostname, pathname} = new URL(url);
    return hostname+pathname;
};