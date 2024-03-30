import { normaliseUrl } from '../src/utils';

describe('normaliseUrl', () => {
    it('should normaliseUrl srip out the protocol', () => {
        expect(normaliseUrl('http://www.google.com')).toEqual('http://www.google.com');
        expect(normaliseUrl('http://www.google.com/path')).toEqual('http://www.google.com/path');
    });
    it('should normaliseUrl srip out traying foreward slash', () => {
        expect(normaliseUrl('http://www.google.com/hello/')).toEqual('http://www.google.com/hello');
    });

    it('should normaliseUrl by attarching protocol to url', () => {
        expect(normaliseUrl('www.google.com/hello/')).toEqual('http://www.google.com/hello');
    });
});