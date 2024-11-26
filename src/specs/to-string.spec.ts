/**
 * Imports
 */

import { Buffer } from '@providers/buffer.provider';

/**
 * Tests
 */

test('utf8 buffer to base64', () => {
    expect(Buffer.from('Ձאab', 'utf8').toString('base64')).toBe('1YHXkGFi');
});

test('utf8 buffer to hex', () => {
    expect(Buffer.from('Ձאab', 'utf8').toString('hex')).toBe('d581d7906162');
});

test('utf8 to utf8', () => {
    expect(Buffer.from('öäüõÖÄÜÕ', 'utf8').toString('utf8')).toBe('öäüõÖÄÜÕ');
});

test('utf16le to utf16', () => {
    expect(
        Buffer.from(Buffer.from('abcd', 'utf8').toString('utf16le'), 'utf16le').toString('utf8')
    ).toBe('abcd');
});

test('utf16le to utf16 with odd byte length input', () => {
    expect(
        Buffer.from(Buffer.from('abcde', 'utf8').toString('utf16le'), 'utf16le').toString('utf8')
    ).toBe('abcd');
});

test('utf16le to hex', () => {
    expect(Buffer.from('abcd', 'utf16le').toString('hex')).toBe('6100620063006400');
});

test('ascii buffer to base64', () => {
    expect(Buffer.from('123456!@#$%^', 'ascii').toString('base64')).toBe(
        'MTIzNDU2IUAjJCVe'
    );
});

test('ascii buffer to hex', () => {
    expect(Buffer.from('123456!@#$%^', 'ascii').toString('hex')).toBe(
        '31323334353621402324255e'
    );
});

test('base64 buffer to utf8', () => {
    expect(Buffer.from('1YHXkGFi', 'base64').toString('utf8')).toBe('Ձאab');
});

test('hex buffer to utf8', () => {
    expect(Buffer.from('d581d7906162', 'hex').toString('utf8')).toBe('Ձאab');
});

test('base64 buffer to ascii', () => {
    expect(Buffer.from('MTIzNDU2IUAjJCVe', 'base64').toString('ascii')).toBe(
        '123456!@#$%^'
    );
});

test('hex buffer to ascii', () => {
    expect(Buffer.from('31323334353621402324255e', 'hex').toString('ascii')).toBe(
        '123456!@#$%^'
    );
});

test('base64 buffer to binary', () => {
    expect(Buffer.from('MTIzNDU2IUAjJCVe', 'base64').toString('binary')).toBe(
        '123456!@#$%^'
    );
});

test('hex buffer to binary', () => {
    expect(Buffer.from('31323334353621402324255e', 'hex').toString('binary')).toBe(
        '123456!@#$%^'
    );
});

test('utf8 to binary', () => {
    /* jshint -W100 */
    expect(Buffer.from('öäüõÖÄÜÕ', 'utf8').toString('binary')).toBe(
        'Ã¶Ã¤Ã¼ÃµÃÃÃÃ'
    );
    /* jshint +W100 */
});

test('utf8 replacement chars (1 byte sequence)', () => {
    expect(Buffer.from([ 0x80 ]).toString()).toBe('\uFFFD');
    expect(Buffer.from([ 0x7F ]).toString()).toBe('\u007F');
});

test('utf8 replacement chars (2 byte sequences)', () => {
    expect(Buffer.from([ 0xC7 ]).toString()).toBe('\uFFFD');
    expect(Buffer.from([ 0xC7, 0xB1 ]).toString()).toBe('\u01F1');
    expect(Buffer.from([ 0xC0, 0xB1 ]).toString()).toBe('\uFFFD\uFFFD');
    expect(Buffer.from([ 0xC1, 0xB1 ]).toString()).toBe('\uFFFD\uFFFD');
});

test('utf8 replacement chars (3 byte sequences)', () => {
    expect(Buffer.from([ 0xE0 ]).toString()).toBe('\uFFFD');
    expect(Buffer.from([ 0xE0, 0xAC ]).toString()).toBe('\uFFFD\uFFFD');
    expect(Buffer.from([ 0xE0, 0xAC, 0xB9 ]).toString()).toBe('\u0B39');
});

test('utf8 replacement chars (4 byte sequences)', () => {
    expect(Buffer.from([ 0xF4 ]).toString()).toBe('\uFFFD');
    expect(Buffer.from([ 0xF4, 0x8F ]).toString()).toBe('\uFFFD\uFFFD');
    expect(Buffer.from([ 0xF4, 0x8F, 0x80 ]).toString()).toBe('\uFFFD\uFFFD\uFFFD');
    expect(Buffer.from([ 0xF4, 0x8F, 0x80, 0x84 ]).toString()).toBe('\uDBFC\uDC04');
    expect(Buffer.from([ 0xFF ]).toString()).toBe('\uFFFD');
    expect(Buffer.from([ 0xFF, 0x8F, 0x80, 0x84 ]).toString()).toBe('\uFFFD\uFFFD\uFFFD\uFFFD');
});

test('utf8 replacement chars on 256 random bytes', () => {
    // eslint-disable-next-line max-len
    const randomBytes = Buffer.from([ 152, 130, 206, 23, 243, 238, 197, 44, 27, 86, 208, 36, 163, 184, 164, 21, 94, 242, 178, 46, 25, 26, 253, 178, 72, 147, 207, 112, 236, 68, 179, 190, 29, 83, 239, 147, 125, 55, 143, 19, 157, 68, 157, 58, 212, 224, 150, 39, 128, 24, 94, 225, 120, 121, 75, 192, 112, 19, 184, 142, 203, 36, 43, 85, 26, 147, 227, 139, 242, 186, 57, 78, 11, 102, 136, 117, 180, 210, 241, 92, 3, 215, 54, 167, 249, 1, 44, 225, 146, 86, 2, 42, 68, 21, 47, 238, 204, 153, 216, 252, 183, 66, 222, 255, 15, 202, 16, 51, 134, 1, 17, 19, 209, 76, 238, 38, 76, 19, 7, 103, 249, 5, 107, 137, 64, 62, 170, 57, 16, 85, 179, 193, 97, 86, 166, 196, 36, 148, 138, 193, 210, 69, 187, 38, 242, 97, 195, 219, 252, 244, 38, 1, 197, 18, 31, 246, 53, 47, 134, 52, 105, 72, 43, 239, 128, 203, 73, 93, 199, 75, 222, 220, 166, 34, 63, 236, 11, 212, 76, 243, 171, 110, 78, 39, 205, 204, 6, 177, 233, 212, 243, 0, 33, 41, 122, 118, 92, 252, 0, 157, 108, 120, 70, 137, 100, 223, 243, 171, 232, 66, 126, 111, 142, 33, 3, 39, 117, 27, 107, 54, 1, 217, 227, 132, 13, 166, 3, 73, 53, 127, 225, 236, 134, 219, 98, 214, 125, 148, 24, 64, 142, 111, 231, 194, 42, 150, 185, 10, 182, 163, 244, 19, 4, 59, 135, 16 ]);
    expect(randomBytes.toString()).toBeTruthy();
});

test('utf8 replacement chars for anything in the surrogate pair range', () => {
    expect(Buffer.from([ 0xED, 0x9F, 0xBF ]).toString()).toBe('\uD7FF');
    expect(Buffer.from([ 0xED, 0xA0, 0x80 ]).toString()).toBe('\uFFFD\uFFFD\uFFFD');
    expect(Buffer.from([ 0xED, 0xBE, 0x8B ]).toString()).toBe('\uFFFD\uFFFD\uFFFD');
    expect(Buffer.from([ 0xED, 0xBF, 0xBF ]).toString()).toBe('\uFFFD\uFFFD\uFFFD');
    expect(Buffer.from([ 0xEE, 0x80, 0x80 ]).toString()).toBe('\uE000');
});

test('utf8 don\'t replace the replacement char', () => {
    expect(Buffer.from('\uFFFD').toString()).toBe('\uFFFD');
});
