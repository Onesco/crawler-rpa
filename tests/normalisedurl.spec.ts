
import { normaliseUrl } from '../src/utils';

describe('normaliseUrl', () => {
    it('should normaliseUrl srip out the protocol', () => {
        expect(normaliseUrl('http://www.google.com')).toEqual('www.google.com');
        expect(normaliseUrl('http://www.google.com/path')).toEqual('www.google.com/path');
    });
    it('should normaliseUrl srip out traying foreward slash', () => {
        expect(normaliseUrl('http://www.google.com/hello/')).toEqual('www.google.com/hello');
    });
})