/**
 * Imports
 */

import { Buffer } from '@providers/buffer.provider';

/**
 * Tests
 */

test('validates encoding types', () => {
    expect(Buffer.isEncoding('HEX')).toBe(true); // Case-insensitive
    expect(Buffer.isEncoding('hex')).toBe(true);
    expect(Buffer.isEncoding('bad')).toBe(false); // Invalid encoding
});

test('validates if input is a Buffer', () => {
    expect(Buffer.isBuffer(Buffer.from('hey', 'utf8'))).toBe(true); // Buffer instance
    expect(Buffer.isBuffer(Buffer.from([ 1, 2, 3 ]))).toBe(true); // Buffer instance
    expect(Buffer.isBuffer(<any> 'hey')).toBe(false); // String, not a Buffer
});
