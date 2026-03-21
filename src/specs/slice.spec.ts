/**
 * Imports
 */

import { Buffer } from '@providers/buffer.provider';

/**
 * Tests
 */

describe('Buffer.slice', () => {
    let buffer: Buffer;
    beforeEach(() => {
        buffer = Buffer.alloc(26);
        for (let i = 0; i < 26; i++) {
            buffer[i] = i + 97; // 97 is ASCII 'a'
        }
    });

    test('modifying buffer created by .slice() modifies original memory', () => {
        const buf2 = buffer.slice(0, 3);
        expect(buf2.toString('ascii', 0, buf2.length)).toBe('abc');

        buf2[0] = '!'.charCodeAt(0);
        expect(buf2.toString('ascii', 0, buf2.length)).toBe('!bc');
    });

    test('modifying parent buffer modifies .slice() buffer\'s memory', () => {
        const buf2 = buffer.slice(0, 3);
        expect(buf2.toString('ascii', 0, buf2.length)).toBe('abc');

        buf2[0] = '!'.charCodeAt(0);
        expect(buf2.toString('ascii', 0, buf2.length)).toBe('!bc');
    });
});
