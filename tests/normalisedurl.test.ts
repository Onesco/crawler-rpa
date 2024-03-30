
import { normaliseUrl } from '../src/utils/normaliseUrl';

test('normaliseUrl', () => {
    expect(normaliseUrl('http://www.google.com')).toBe('http://www.google.com');
});