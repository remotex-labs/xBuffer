import { decodeUTF8, encodeUTF8 } from '@components/utf8.component';

describe('encodeUTF8 and decodeUTF8', () => {
    test('should correctly encode and decode basic ASCII string', () => {
        const input = 'Hello, World!';
        const encoded = encodeUTF8(input);
        const decoded = decodeUTF8(encoded);
        expect(decoded).toBe(input);
    });

    test('should correctly encode and decode UTF-8 characters', () => {
        const input = '你好，世界！'; // Chinese characters (Hello, World!)
        const encoded = encodeUTF8(input);
        const decoded = decodeUTF8(encoded);
        expect(decoded).toBe(input);
    });

    test('should handle encoding and decoding surrogate pairs correctly', () => {
        const input = '𠜎'; // A character beyond the BMP (U+20B0E)
        const encoded = encodeUTF8(input);
        const decoded = decodeUTF8(encoded);
        expect(decoded).toBe(input);
    });

    test('should handle invalid surrogate pairs gracefully during decoding', () => {
        const invalidEncoded = new Uint8Array([ 0xf0, 0x90, 0x8c, 0x8e, 0x00 ]); // Invalid byte sequence (null byte added)
        const decoded = decodeUTF8(invalidEncoded);
        expect(decoded).toBe(Buffer.from(invalidEncoded).toString());
    });

    test('should handle incomplete byte sequences during decoding', () => {
        const incompleteEncoded = new Uint8Array([ 0xe2, 0x82 ]); // Incomplete multi-byte character
        const decoded = decodeUTF8(incompleteEncoded);
        expect(decoded).toBe(Buffer.from(incompleteEncoded).toString());
    });

    test('should handle strings with mixed ASCII and multi-byte characters', () => {
        const input = 'Hello, 世界!';
        const encoded = encodeUTF8(input);
        const decoded = decodeUTF8(encoded);
        expect(decoded).toBe(input);
    });

    test('should stop encoding after a specified byte length', () => {
        const input = 'Hello, 世界!';
        const encoded = encodeUTF8(input, 10); // Limit to 10 bytes
        const decoded = decodeUTF8(encoded);
        expect(decoded).toBe('Hello, 世'); // Only partial string due to length restriction
    });

    test('should return empty string when decoding empty byte array', () => {
        const emptyArray = new Uint8Array([]);
        const decoded = decodeUTF8(emptyArray);
        expect(decoded).toBe('');
    });

    test('should correctly handle invalid byte sequences by replacing with replacement character', () => {
        const invalidEncoded = new Uint8Array([ 0x80, 0x80, 0x80 ]); // Invalid UTF-8 sequence
        const decoded = decodeUTF8(invalidEncoded);
        expect(decoded).toBe(Buffer.from(invalidEncoded).toString()); // Should replace with replacement characters
    });

    test('should handle valid characters in the upper Unicode range', () => {
        const input = '😀'; // Unicode character outside the BMP (U+1F600)
        const encoded = encodeUTF8(input);
        const decoded = decodeUTF8(Buffer.from(encoded));
        expect(decoded).toBe(input);
    });

    test('should correctly encode and decode characters near UTF-16 surrogate boundary', () => {
        const input = 'D800'; // Single Unicode code point near the surrogate range
        const encoded = encodeUTF8(input);
        const decoded = decodeUTF8(encoded);
        expect(decoded).toBe(input); // Surrogate boundary (high surrogate)
    });

    test('should handle valid code points at the maximum Unicode range (U+10FFFF)', () => {
        const input = '𐍈'; // Valid character (U+10348)
        const encoded = encodeUTF8(input);
        const decoded = decodeUTF8(encoded);
        expect(decoded).toBe(input);
    });

    test('should handle invalid code points above U+10FFFF by replacing with replacement character', () => {
        const input = String.fromCharCode(0x110000); // Invalid code point, exceeds Unicode limit
        const encoded = encodeUTF8(input);
        const decoded = decodeUTF8(encoded);
        expect(decoded).toBe(Buffer.from(input).toString()); // Should replace invalid code point with replacement character
    });
});
