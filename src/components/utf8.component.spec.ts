/**
 * Imports
 */

import { decodeUTF8, encodeUTF8 } from '@components/utf8.component';

/**
 * Tests
 */

describe('encodeUTF8 and decodeUTF8', () => {
    test('should correctly encode and decode basic ASCII string', () => {
        const input = 'Hello, World!';
        const decoded = decodeUTF8(input);
        const encoded = encodeUTF8(decoded);

        expect(encoded).toBe(input);
        expect(decoded).toEqual(new Uint8Array(
            [ 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x57, 0x6f, 0x72, 0x6c, 0x64, 0x21 ]
        ));
    });

    test('should correctly decode with length limit and encode basic ASCII string', () => {
        const input = 'Hello, World!';
        const decoded = decodeUTF8(input, 5);
        const encoded = encodeUTF8(decoded);
        expect(encoded).toBe('Hello');
        expect(decoded).toEqual(new Uint8Array(
            [ 0x48, 0x65, 0x6c, 0x6c, 0x6f ]
        ));
    });

    test('should correctly decode and encode with length limit basic ASCII string', () => {
        const input = 'Hello, World!';
        const decoded = decodeUTF8(input);
        const encoded = encodeUTF8(decoded, 5);
        expect(encoded).toBe('Hello');
        expect(decoded).toEqual(new Uint8Array(
            [ 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x57, 0x6f, 0x72, 0x6c, 0x64, 0x21 ]
        ));
    });

    test('should correctly decode and encode UTF-8 characters', () => {
        const input = '你好，世界！'; // Chinese characters (Hello, World!)
        const decoded = decodeUTF8(input);
        const encoded = encodeUTF8(decoded);
        expect(encoded).toBe(input);
        expect(decoded).toEqual(new Uint8Array(
            [ 0xe4, 0xbd, 0xa0, 0xe5, 0xa5, 0xbd, 0xef, 0xbc, 0x8c, 0xe4, 0xb8, 0x96, 0xe7, 0x95, 0x8c, 0xef, 0xbc, 0x81 ]
        ));
    });

    test('should handle encoding and decoding surrogate pairs correctly', () => {
        const input = '𠜎'; // A character beyond the BMP (U+20B0E)
        const decoded = decodeUTF8(input);
        const encoded = encodeUTF8(decoded);
        expect(encoded).toBe(input);
        expect(decoded).toEqual(new Uint8Array(
            [ 0xf0, 0xa0, 0x9c, 0x8e ]
        ));
    });

    test('should handle invalid surrogate pairs gracefully during decoding', () => {
        const invalidEncoded = new Uint8Array([ 0xf0, 0x90, 0x8c, 0x8e, 0x00 ]); // Invalid byte sequence (null byte added)
        const encoded = encodeUTF8(invalidEncoded);
        expect(encoded).toBe(Buffer.from(invalidEncoded).toString());
    });

    test('should handle incomplete byte sequences during decoding', () => {
        const incompleteEncoded = new Uint8Array([ 0xe2, 0x82 ]); // Incomplete multi-byte character
        const encoded = encodeUTF8(incompleteEncoded);
        expect(encoded).toBe(Buffer.from(incompleteEncoded).toString());
    });

    test('should handle strings with mixed ASCII and multi-byte characters', () => {
        const input = 'Hello, 世界!';
        const decoded = decodeUTF8(input);
        const encoded = encodeUTF8(decoded);
        expect(encoded).toBe(input);
        expect(decoded).toEqual(new Uint8Array(
            [ 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0xe4, 0xb8, 0x96, 0xe7, 0x95, 0x8c, 0x21 ]
        ));
    });

    test('should stop encoding after a specified byte length on decode', () => {
        const input = 'Hello, 世界!';
        const decoded = decodeUTF8(input, 10); // Limit to 10 bytes
        const encoded = encodeUTF8(decoded);
        expect(encoded).toBe('Hello, 世'); // Only partial string due to length restriction
        expect(decoded).toEqual(new Uint8Array(
            [ 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0xe4, 0xb8, 0x96 ]
        ));
    });

    test('should stop encoding after a specified byte length on encode', () => {
        const input = 'Hello, 世界!';
        const decoded = decodeUTF8(input);
        const encoded = encodeUTF8(decoded, 10); // Limit to 10 bytes
        expect(encoded).toBe('Hello, 世'); // Only partial string due to length restriction
        expect(decoded).toEqual(new Uint8Array(
            [ 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0xe4, 0xb8, 0x96, 0xe7, 0x95, 0x8c, 0x21 ]
        ));
    });

    test('should return empty string when decoding empty byte array', () => {
        const emptyArray = new Uint8Array([]);
        const encoded = encodeUTF8(emptyArray);
        expect(encoded).toBe('');
    });

    test('should correctly handle invalid byte sequences by replacing with replacement character', () => {
        const invalidEncoded = new Uint8Array([ 0x80, 0x80, 0x80 ]); // Invalid UTF-8 sequence
        const encoded = encodeUTF8(invalidEncoded);
        expect(encoded).toBe(Buffer.from(invalidEncoded).toString()); // Should replace with replacement characters
    });

    test('should handle valid characters in the upper Unicode range', () => {
        const input = '😀'; // Unicode character outside the BMP (U+1F600)
        const decoded = decodeUTF8(input);
        const encoded = encodeUTF8(decoded);
        expect(encoded).toBe(input);
        expect(decoded).toEqual(new Uint8Array(
            [ 0xf0, 0x9f, 0x98, 0x80 ]
        ));
    });

    test('should correctly encode and decode characters near UTF-16 surrogate boundary', () => {
        const input = 'D800'; // Single Unicode code point near the surrogate range
        const decoded = decodeUTF8(input);
        const encoded = encodeUTF8(decoded);
        expect(encoded).toBe(input); // Surrogate boundary (high surrogate)
        expect(decoded).toEqual(new Uint8Array(
            [ 0x44, 0x38, 0x30, 0x30 ]
        ));
    });

    test('should handle valid code points at the maximum Unicode range (U+10FFFF)', () => {
        const input = '𐍈'; // Valid character (U+10348)
        const decoded = decodeUTF8(input);
        const encoded = encodeUTF8(decoded);
        expect(encoded).toBe(input);
        expect(decoded).toEqual(new Uint8Array(
            [ 0xf0, 0x90, 0x8d, 0x88 ]
        ));
    });

    test('should handle invalid code points above U+10FFFF by replacing with replacement character', () => {
        const input = String.fromCharCode(0x110000); // Invalid code point, exceeds Unicode limit
        const decoded = decodeUTF8(input);
        const encoded = encodeUTF8(decoded);
        expect(encoded).toBe(Buffer.from(input).toString()); // Should replace invalid code point with replacement character
    });

    test('should decode valid surrogate pairs', () => {
        const text = '\uD83D\uDE38'; // Smiling face with cold sweat (U+1F638)
        const result = Array.from(decodeUTF8(text)).map(byte => byte.toString(16).padStart(2, '0')).join(' ');
        expect(result).toBe('f0 9f 98 b8'); // Expected UTF-8 encoding
    });

    test('should replace invalid surrogate pairs with U+FFFD', () => {
        const text = '\uD83D\uDE38' + '\uDCAD' + '\uD83D\uDC4D'; // Valid, invalid low surrogate, and valid pair
        const result = Array.from(decodeUTF8(text)).map(byte => byte.toString(16).padStart(2, '0')).join(' ');
        expect(result).toBe('f0 9f 98 b8 ef bf bd f0 9f 91 8d'); // Expected UTF-8 encoding with replacement character
    });

    test('should replace standalone low surrogate with U+FFFD', () => {
        const text = '\uDCAD'; // Invalid standalone low surrogate
        const result = Array.from(decodeUTF8(text)).map(byte => byte.toString(16).padStart(2, '0')).join(' ');
        expect(result).toBe('ef bf bd'); // Replacement character
    });

    test('should replace high surrogate without a low surrogate with U+FFFD', () => {
        const text = '\uD83D'; // High surrogate without a pair
        const result = Array.from(decodeUTF8(text)).map(byte => byte.toString(16).padStart(2, '0')).join(' ');
        expect(result).toBe('ef bf bd'); // Replacement character
    });

    test('should decode regular BMP characters correctly', () => {
        const text = 'ABC'; // Regular ASCII characters
        const result = Array.from(decodeUTF8(text)).map(byte => byte.toString(16).padStart(2, '0')).join(' ');
        expect(result).toBe('41 42 43'); // UTF-8 encoding of "ABC"
    });

    test('should decode a mix of valid and invalid characters', () => {
        const text = 'A\uD83D\uDE38\uDCAD\uD83D\uDC4D'; // A + valid pair + invalid low surrogate + valid pair
        const result = Array.from(decodeUTF8(text)).map(byte => byte.toString(16).padStart(2, '0')).join(' ');
        expect(result).toBe('41 f0 9f 98 b8 ef bf bd f0 9f 91 8d');
    });

    test('should respect the maxLength parameter', () => {
        const text = '\uD83D\uDE38\uD83D\uDC4D'; // Two valid surrogate pairs
        const result = Array.from(decodeUTF8(text, 4)).map(byte => byte.toString(16).padStart(2, '0')).join(' ');
        expect(result).toBe('f0 9f 98 b8'); // Only the first character fits in the maxLength
    });
});

describe('UTF-8 Encoding and Decoding', () => {
    const testCases = [
        {
            name: 'Encode and decode basic ASCII characters',
            input: 'Hello, World!'
        },
        {
            name: 'Encode and decode characters with multiple bytes',
            input: '😊🌍'
        },
        {
            name: 'Encode and decode a string with special characters',
            input: '© OpenAI - ∞'
        },
        {
            name: 'Encode and decode an empty string',
            input: ''
        },
        {
            name: 'Encode and decode non-ASCII text',
            input: '你好，世界！'
        },
        {
            name: 'Encode and decode text with emojis',
            input: '😊 Unicode Test 😍'
        },
        {
            name: 'Encode and decode empty string',
            input: ''
        },
        {
            name: 'Encode and decode a very large string',
            input: 'A'.repeat(1000000)
        }
    ];
    test.each(testCases)('$name', ({ input }) => {
        const decoded = decodeUTF8(input);
        const encoded = encodeUTF8(decoded);

        const nodejsBuffer = Buffer.from(input, 'utf-8');

        // Expectations
        expect(encoded).toEqual(input);

        // Validate against Node.js Buffer
        expect(Array.from(decoded)).toEqual(Array.from(nodejsBuffer));
        expect(encoded).toEqual(nodejsBuffer.toString('utf-8'));
    });

    // Test for error scenarios
    test('Handles invalid UTF-8 data', () => {
        const invalidData = new Uint8Array([ 0xc0, 0x80, 0xe0, 0x80, 0x80 ]); // Invalid UTF-8 bytes
        const encoded = encodeUTF8(invalidData);

        expect(encoded).toEqual('\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD'); // In case of error, expect an empty string or handle accordingly
        expect(encoded).toEqual(Buffer.from(invalidData).toString('utf-8'));
    });

    test('Decode invalid UTF-8 bytes', () => {
        const invalidBytes = new Uint8Array([ 0xFF, 0xFE, 0xFD ]); // Invalid UTF-8 bytes
        const encoded = encodeUTF8(invalidBytes);

        expect(encoded).toEqual('\uFFFD\uFFFD\uFFFD'); // In case of error, expect an empty string or handle accordingly
        expect(encoded).toEqual(Buffer.from(invalidBytes).toString());
    });

    test('encodes a string with size limit', () => {
        const result = decodeUTF8('Hello, 世界!', 10); // Encode up to 10 bytes
        expect(result).toEqual(new Uint8Array([ 72, 101, 108, 108, 111, 44, 32, 228, 184, 150 ])); // Only the first 10 bytes are encoded
        expect(result.buffer).toEqual(Buffer.from(result, 0, 10).buffer);
    });
});
