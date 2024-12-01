/**
 * Imports
 */

import { Buffer } from '@providers/buffer.provider';

/**
 * Tests
 */

test('buffer.write("hex") should truncate odd string lengths', () => {
    const buf = Buffer.alloc(32);
    const charset = '0123456789abcdef';

    let str = '';
    for (let i = 0; i < 63; i++) {
        str += charset[Math.random() * charset.length | 0];
    }

    expect(buf.write('abcde', 'hex')).toBe(2);
    expect(buf.toString('hex', 0, 3)).toBe('abcd00');

    buf.fill(0);

    expect(buf.write(str, 'hex')).toBe(31);
    expect(buf.toString('hex', 0, 32)).toBe(str.slice(0, -1) + '00');
});
