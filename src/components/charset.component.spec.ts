/**
 * Imports
 */

import {
    encodeHEX,
    decodeHEX,
    encodeASCII,
    decodeASCII,
    decodeBase64,
    encodeBase64,
    encodeUTF16LE,
    decodeUTF16LE
} from '@components/charset.component';
import { encodeUTF8 } from '@components/utf8.component';

/**
 * Charset
 */

describe('ASCII Encoding and Decoding', () => {
    describe('encodeASCII', () => {
        test('should encode a regular string to ASCII bytes', () => {
            const input = 'Hello';
            const result = encodeASCII(input);
            const expected = new Uint8Array([ 72, 101, 108, 108, 111 ]);
            expect(result).toEqual(expected);
        });

        test('should encode a string with special characters to ASCII bytes', () => {
            const input = 'Hello, World!';
            const result = encodeASCII(input);
            const expected = new Uint8Array([ 72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100, 33 ]);
            expect(result).toEqual(expected);
        });

        test('should handle an empty string correctly', () => {
            const input = '';
            const result = encodeASCII(input);
            const expected = new Uint8Array([]);
            expect(result).toEqual(expected);
        });

        test('should respect the provided length and truncate the string', () => {
            const input = 'Hello, World!';
            const result = encodeASCII(input, 5);
            const expected = new Uint8Array([ 72, 101, 108, 108, 111 ]);
            expect(result).toEqual(expected);
        });

        test('should handle the case where the length is longer than the string', () => {
            const input = 'Hi';
            const result = encodeASCII(input, 10);
            const expected = new Uint8Array([ 72, 105 ]);
            expect(result).toEqual(expected);
        });
    });
    describe('decodeASCII', () => {
        test('should throw an error if input is not a Uint8Array', () => {
            const invalidInput = 'not-a-uint8array'; // String input, not Uint8Array
            expect(() => decodeASCII(invalidInput as any)).toThrow('decodeASCII input must be a Uint8Array');
        });

        test('should decode ASCII byte array to string', () => {
            const input = new Uint8Array([ 72, 101, 108, 108, 111 ]);
            const result = decodeASCII(input);
            const expected = 'Hello';
            expect(result).toBe(expected);
        });

        test('should decode a byte array with special characters to a string', () => {
            const input = new Uint8Array([ 72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100, 33 ]);
            const result = decodeASCII(input);
            const expected = 'Hello, World!';
            expect(result).toBe(expected);
        });

        test('should handle an empty byte array correctly', () => {
            const input = new Uint8Array([]);
            const result = decodeASCII(input);
            const expected = '';
            expect(result).toBe(expected);
        });

        test('should handle bytes outside the ASCII range and truncate them to 0xFF', () => {
            const input = new Uint8Array([ 255, 256, 200 ]);
            const result = decodeASCII(input);
            // 255 stays as 0xFF, 256 wraps to 0x00, and 200 stays as 0xC8
            const expected = String.fromCharCode(0xFF, 0x00, 0xC8);
            expect(result).toBe(expected);
        });
    });
});

describe('UTF16 Encoding and Decoding', () => {
    describe('decodeUTF16', () => {
        test('should throw an error if input is not a Uint8Array', () => {
            const invalidInput = 'not-a-uint8array'; // String input, not Uint8Array
            expect(() => decodeUTF16LE(invalidInput as any)).toThrow('decodeUTF16LE input must be a Uint8Array');
        });

        test('should decode a simple UTF-16 encoded string', () => {
            const input = new Uint8Array([ 72, 0, 101, 0, 108, 0, 108, 0, 111, 0 ]);
            const result = decodeUTF16LE(input);
            const expected = 'Hello';
            expect(result).toBe(expected);
        });

        test('should decode an empty byte array', () => {
            const input = new Uint8Array([]);
            const result = decodeUTF16LE(input);
            const expected = '';
            expect(result).toBe(expected);
        });

        test('should stop decoding at null byte (0x00)', () => {
            const input = new Uint8Array([ 72, 0, 101, 0, 0, 0 ]);
            const result = decodeUTF16LE(input);
            const expected = 'He';
            expect(result).toBe(expected);
        });

        test('should decode string with null byte inside', () => {
            const input = new Uint8Array([ 72, 0, 101, 0, 0, 0, 87, 0, 111, 0 ]);
            const result = decodeUTF16LE(input);
            const expected = 'He';
            expect(result).toBe(expected);
        });

        test('should handle incomplete UTF-16 pairs gracefully', () => {
            const input = new Uint8Array([ 72, 0, 101, 0, 255 ]); // Invalid UTF-16 encoding
            const result = decodeUTF16LE(input);
            const expected = 'He'; // Handling as much as possible

            expect(result).toBe(expected);
        });

        test('should handle odd-length input gracefully', () => {
            const input = new Uint8Array([ 72, 0, 101, 0, 108, 0, 111 ]); // Odd-length input
            const result = decodeUTF16LE(input);
            const expected = 'Hel'; // Should decode 'Hel' and ignore last byte
            expect(result).toBe(expected);
        });

        test('should handle a string with characters at the start and end of the Unicode range', () => {
            const input = new Uint8Array([ 0x00, 0xD8, 0x48, 0xdf ]); // A surrogate pair for "𐍈"
            const result = decodeUTF16LE(input);
            const expected = '𐍈'; // Unicode character U+10348
            expect(result).toBe(expected);
        });

        test('should handle UTF-16 encoded string with extended characters', () => {
            const input = new Uint8Array([ 0x01, 0xd8, 0x34, 0xdc, 0x01, 0xd8, 0x31, 0xdc ]); // Some extended characters
            const result = decodeUTF16LE(input);
            const expected = '𐐴𐐱'; // Characters U+10334, U+10331
            expect(result).toBe(expected);
        });
    });

    describe('encodeUTF16', () => {
        test('should encode a simple string into UTF-16', () => {
            const input = 'Hello';
            const result = encodeUTF16LE(input);
            const expected = new Uint8Array([ 72, 0, 101, 0, 108, 0, 108, 0, 111, 0 ]);
            expect(result).toEqual(expected);
        });

        test('should encode an empty string into an empty Uint8Array', () => {
            const input = '';
            const result = encodeUTF16LE(input);
            const expected = new Uint8Array(0);
            expect(result).toEqual(expected);
        });

        test('should encode a string with a specific length', () => {
            const input = 'Hello, world!';
            const result = encodeUTF16LE(input, 10); // Encoding only first 5 characters
            const expected = new Uint8Array([ 72, 0, 101, 0, 108, 0, 108, 0, 111, 0 ]); // Only 'Hello'
            expect(result).toEqual(expected);
        });

        test('should handle odd length input gracefully by truncating to an even length', () => {
            const input = 'Hello';
            const result = encodeUTF16LE(input, 9);

            const expected = new Uint8Array([ 0x48, 0x00, 0x65, 0x00, 0x6c, 0x00, 0x6c, 0x00 ]); // Only 'Hello'
            expect(result).toEqual(expected);
        });

        test('should handle extended characters (surrogate pairs)', () => {
            const input = '𐍈'; // Character U+10348 (a character outside the BMP)
            const result = encodeUTF16LE(input);
            const expected = new Uint8Array([ 0x00, 0xD8, 0x48, 0xdf ]); // Surrogate pair
            expect(result).toEqual(expected);
        });

        test('should handle truncation when length is provided', () => {
            const input = 'Hello, world!';
            const result = encodeUTF16LE(input, 8); // Length of 8, only 'Hello'
            const expected = new Uint8Array([ 72, 0, 101, 0, 108, 0, 108, 0 ]); // Only 'Hello'
            expect(result).toEqual(expected);
        });

        test('should encode special unicode characters correctly', () => {
            const input = '😀'; // U+1F600
            const result = encodeUTF16LE(input);
            const expected = new Uint8Array([ 0x3d, 0xd8, 0x00, 0xde ]); // Surrogate pair for '😀'
            expect(result).toEqual(expected);
        });

        test('should return an empty array when length is 0', () => {
            const input = 'Hello';
            const result = encodeUTF16LE(input, 0); // Encoding with length 0
            const expected = new Uint8Array(0); // Should return an empty array
            expect(result).toEqual(expected);
        });
    });
});

describe('encodeHEX and decodeHEX', () => {
    test('should throw an error if input is not a Uint8Array', () => {
        const invalidInput = 'not-a-uint8array'; // String input, not Uint8Array
        expect(() => decodeHEX(invalidInput as any)).toThrow('decodeHEX input must be a Uint8Array');
    });

    test('should encode and decode hex string correctly', () => {
        const hexString = '48656c6c6f';
        const encoded = encodeHEX(hexString);
        const decoded = decodeHEX(encoded);

        // Encoding should produce the expected byte array
        expect(encoded).toEqual(new Uint8Array([ 0x48, 0x65, 0x6c, 0x6c, 0x6f ]));

        // Decoding should return the original hex string
        expect(decoded).toBe(hexString);
    });

    test('should handle an odd-length hex string by truncating to the even length', () => {
        const hexString = '48656c6c6f1'; // Odd-length hex string (with an extra '1')
        const encoded = encodeHEX(hexString);
        const decoded = decodeHEX(encoded);

        // Encoding should truncate the odd part, resulting in only the first part of the hex string
        expect(encoded).toEqual(new Uint8Array([ 0x48, 0x65, 0x6c, 0x6c, 0x6f ]));

        // Decoding should return the original truncated hex string
        expect(decoded).toBe('48656c6c6f');
    });

    test('should handle empty hex string', () => {
        const hexString = '';
        const encoded = encodeHEX(hexString);
        const decoded = decodeHEX(encoded);

        // An empty hex string should produce an empty byte array
        expect(encoded).toEqual(new Uint8Array(0));

        // Decoding should return an empty string
        expect(decoded).toBe('');
    });

    test('should handle hex string with even length correctly', () => {
        const hexString = '1234abcd';
        const encoded = encodeHEX(hexString);
        const decoded = decodeHEX(encoded);

        // Encoding should produce the expected byte array
        expect(encoded).toEqual(new Uint8Array([ 0x12, 0x34, 0xab, 0xcd ]));

        // Decoding should return the original hex string
        expect(decoded).toBe(hexString);
    });

    test('should throw an error for invalid hex characters in the string', () => {
        const invalidHexString = 'xyz123'; // Invalid hex string containing non-hex characters
        expect(() => {
            encodeHEX(invalidHexString);
        }).toThrow('Invalid hex string: contains non-hex characters');
    });

    test('should handle provided length for encoding (truncate correctly)', () => {
        const hexString = '48656c6c6f';
        const length = 3; // Only take the first 3 bytes (6 characters)
        const encoded = encodeHEX(hexString, length);
        const decoded = decodeHEX(encoded);

        // Encoding should truncate to the correct length (3 bytes)
        expect(encoded).toEqual(new Uint8Array([ 0x48, 0x65, 0x6c ]));

        // Decoding should return the truncated hex string
        expect(decoded).toBe('48656c');
    });

    test('should handle large hex strings', () => {
        const largeHexString = 'a'.repeat(1000); // 1000 "a" characters
        const encoded = encodeHEX(largeHexString);
        const decoded = decodeHEX(encoded);

        // Encoding and decoding should work for large strings as well
        expect(encoded.length).toBe(500); // 2 hex characters per byte, 1000 chars => 500 bytes
        expect(decoded).toBe(largeHexString);
    });

    test('should handle a string with non-printable hex characters', () => {
        const hexString = '00010203040506';
        const encoded = encodeHEX(hexString);
        const decoded = decodeHEX(encoded);

        // Encoding should produce the expected byte array
        expect(encoded).toEqual(new Uint8Array([ 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06 ]));

        // Decoding should return the original hex string
        expect(decoded).toBe(hexString);
    });

    test('should handle a hex string with only one byte', () => {
        const hexString = 'ff';
        const encoded = encodeHEX(hexString);
        const decoded = decodeHEX(encoded);

        // Encoding should produce the expected byte array
        expect(encoded).toEqual(new Uint8Array([ 0xff ]));

        // Decoding should return the original hex string
        expect(decoded).toBe(hexString);
    });

    test('should handle invalid hex string length', () => {
        const invalidLengthString = '123'; // Odd-length string
        const encoded = encodeHEX(invalidLengthString);
        const decoded = decodeHEX(encoded);

        // Encoding should handle odd-length string by truncating the last digit
        expect(encoded).toEqual(new Uint8Array([ 0x12 ]));

        // Decoding should return the truncated string
        expect(decoded).toBe('12');
    });
});

describe('Base64 Encoding and Decoding', () => {
    test('should encode a basic string correctly', () => {
        const input = 'Hello';
        const result = encodeBase64(input);
        expect(decodeASCII(result)).toEqual(Buffer.from(input).toString('base64'));
    });

    test('should decode the encoded string correctly', () => {
        const encoded = new Uint8Array([ 0x53, 0x47, 0x56, 0x73, 0x62, 0x47, 0x38, 0x3d ]);
        const decoded = decodeBase64(encoded);
        const expected = 'Hello';
        expect(decoded).toBe(expected);
    });

    test('should handle truncation during encoding', () => {
        const input = 'HelloWorld';
        const result = encodeBase64(input, 5); // Truncate to first 5 bytes (half of the string)
        expect(decodeASCII(result)).toEqual(Buffer.from('Hello').toString('base64'));
    });

    test('should decode truncated Base64 string correctly', () => {
        const truncated = new Uint8Array([ 0x53, 0x47, 0x56, 0x73 ]);
        const decoded = decodeBase64(truncated);
        const expected = 'Hel';
        expect(decoded).toBe(expected);
    });

    test('should handle empty string encoding', () => {
        const input = '';
        const result = encodeBase64(input);
        const expected = new Uint8Array([]);
        expect(result).toEqual(expected);
    });

    test('should handle empty Base64 string decoding', () => {
        const input = new Uint8Array([]);
        const result = decodeBase64(input);
        const expected = '';
        expect(result).toBe(expected);
    });

    test('should return empty array when encoding invalid Base64 string', () => {
        const input = 'Hello\xFF'; // Invalid character \xFF
        const result = encodeBase64(input); // Way nodejs support incurrect data ??
        expect(decodeASCII(result)).toEqual(Buffer.from(input).toString('base64'));
    });

    test('should handle invalid Base64 decoding gracefully', () => {
        const input = new Uint8Array([ 0xFF, 0xFF ]); // Invalid Base64 values
        const result = decodeBase64(input);

        expect(result).toBe('');
    });

    test('should handle padding correctly during encoding', () => {
        const input = 'Foo'; // Length 3 (no padding)
        const result = encodeBase64(input);
        expect(decodeASCII(result)).toEqual(Buffer.from(input).toString('base64'));
    });

    test('should add padding correctly during encoding', () => {
        const input = 'Fo'; // Length 2 (requires padding)
        const result = encodeBase64(input);
        expect(decodeASCII(result)).toEqual(Buffer.from(input).toString('base64'));
    });

    test('should decode Base64 with padding correctly', () => {
        const input = new Uint8Array([ 0x52, 0x6d, 0x39, 0x76 ]);
        const decoded = decodeBase64(input);
        const expected = 'Foo';
        expect(decoded).toBe(expected);
    });

    test('should handle corrupted or incomplete padding gracefully', () => {
        const input = new Uint8Array([ 0x52, 0x6d, 0x38 ]); // Incomplete padding (missing '=')
        const decoded = decodeBase64(input);
        expect(decoded).toBe('Fo');
    });

    test('should encode and decode non-ASCII characters correctly', () => {
        const input = '你好'; // Chinese characters
        const encoded = encodeBase64(input);
        const decoded = decodeBase64(encoded);
        expect(decoded).toBe(input);
    });

    test('should handle long strings correctly', () => {
        const input = 'a'.repeat(1000); // Large input string
        const encoded = encodeBase64(input);
        const decoded = decodeBase64(encoded);
        expect(decoded).toBe(input);
    });

    test('should handle Base64 string with non-Base64 characters', () => {
        const input = encodeASCII('SGVsbG8@'); // Invalid character '@'
        const result = decodeBase64(input);
        expect(result).toEqual('Hello');
    });

    test('should return ASCII for Base64 string with excessive padding', () => {
        // First, Base64 encode "Hello" (this is the base64 encoded form with padding)
        const input = encodeASCII('SGVsbG8==='); // "Hello" Base64 encoded with excessive padding.
        const result = decodeBase64(input); // Decode the Base64 back to the original string.
        expect(result).toEqual('Hello'); // The decoded string should be "Hello".
    });

    test('should decode valid Base64 string without padding', () => {
        const input = encodeUTF8('SGVsbG8'); // "Hello" without padding
        const result = decodeBase64(input);
        expect(result).toEqual('Hello');
    });

    test('should handle empty input gracefully', () => {
        const input = encodeASCII('');
        const result = decodeBase64(input);
        expect(result).toEqual('');
    });
});
