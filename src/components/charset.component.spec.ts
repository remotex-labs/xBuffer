/**
 * Imports
 */

import {
    decodeASCII,
    decodeBase64,
    decodeHEX,
    decodeUTF16LE,
    encodeASCII,
    encodeBase64,
    encodeHEX,
    encodeUTF16LE,
    isInstance
} from '@components/charset.component';
import { decodeUTF8, encodeUTF8 } from '@components/utf8.component';

/**
 * Tests
 */

describe('isInstance', () => {
    class MyClass {
    }

    class AnotherClass {
    }

    test('should return true for objects that are instances of the provided type', () => {
        const instance = new MyClass();
        expect(isInstance(instance, MyClass)).toBe(true);
    });

    test('should return false for objects that are not instances of the provided type', () => {
        const instance = new MyClass();
        expect(isInstance(instance, AnotherClass)).toBe(false);
    });

    test('should return true for objects that have the same constructor name as the provided type', () => {
        // Create an object with the same constructor name
        const anotherInstance = Object.create(MyClass.prototype);
        expect(isInstance(anotherInstance, MyClass)).toBe(true);
    });

    test('should return false for objects that have different constructor names from the provided type', () => {
        const anotherInstance = Object.create(AnotherClass.prototype);
        expect(isInstance(anotherInstance, MyClass)).toBe(false);
    });

    test('should return false for null input', () => {
        expect(isInstance(null, MyClass)).toBe(false);
    });

    test('should return false for undefined input', () => {
        expect(isInstance(undefined, MyClass)).toBe(false);
    });

    test('should return false for primitives', () => {
        expect(isInstance(42, MyClass)).toBe(false);
        expect(isInstance('string', MyClass)).toBe(false);
        expect(isInstance(true, MyClass)).toBe(false);
    });

    test('should return true for instances of classes with constructor names that match', () => {
        const AnotherInstance = class ZZZ {
        };
        const instance = new (class ZZZ {
        })();
        expect(isInstance(instance, AnotherInstance)).toBe(true);
    });
});

describe('ASCII Encoding and Decoding', () => {
    describe('decodeASCII', () => {
        test('should decode a regular string to ASCII bytes', () => {
            const input = 'Hello';
            const result = decodeASCII(input);
            const expected = new Uint8Array([ 72, 101, 108, 108, 111 ]);
            expect(result).toEqual(expected);
        });

        test('should encode a string with special characters to ASCII bytes', () => {
            const input = 'Hello, World!';
            const result = decodeASCII(input);
            const expected = new Uint8Array([ 72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100, 33 ]);
            expect(result).toEqual(expected);
        });

        test('should handle an empty string correctly', () => {
            const input = '';
            const result = decodeASCII(input);
            const expected = new Uint8Array([]);
            expect(result).toEqual(expected);
        });

        test('should respect the provided length and truncate the string', () => {
            const input = 'Hello, World!';
            const result = decodeASCII(input, 5);
            const expected = new Uint8Array([ 72, 101, 108, 108, 111 ]);
            expect(result).toEqual(expected);
        });

        test('should handle the case where the length is longer than the string', () => {
            const input = 'Hi';
            const result = decodeASCII(input, 10);
            const expected = new Uint8Array([ 72, 105 ]);
            expect(result).toEqual(expected);
        });
    });
    describe('encodeASCII', () => {
        test('should throw an error if input is not a Uint8Array', () => {
            const invalidInput = 'not-a-uint8array'; // String input, not Uint8Array
            expect(() => encodeASCII(invalidInput as any)).toThrow('encodeASCII input must be a Uint8Array');
        });

        test('should decode ASCII byte array to string', () => {
            const input = new Uint8Array([ 72, 101, 108, 108, 111 ]);
            const result = encodeASCII(input);
            const expected = 'Hello';
            expect(result).toBe(expected);
        });

        test('should decode a byte array with special characters to a string', () => {
            const input = new Uint8Array([ 72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100, 33 ]);
            const result = encodeASCII(input);
            const expected = 'Hello, World!';
            expect(result).toBe(expected);
        });

        test('should handle an empty byte array correctly', () => {
            const input = new Uint8Array([]);
            const result = encodeASCII(input);
            const expected = '';
            expect(result).toBe(expected);
        });

        test('should handle bytes outside the ASCII range and truncate them to 0xFF', () => {
            const input = new Uint8Array([ 255, 256, 200 ]);
            const result = encodeASCII(input);
            // 255 stays as 0xFF, 256 wraps to 0x00, and 200 stays as 0xC8
            const expected = String.fromCharCode(0xFF, 0x00, 0xC8);
            expect(result).toBe(expected);
        });

        test('should respect the provided length and truncate the string', () => {
            const result = encodeASCII(new Uint8Array([ 72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100, 33 ]), 5);
            expect(result).toEqual('Hello');
        });

        test('should handle the case where the length is longer than the string', () => {
            const result = encodeASCII(new Uint8Array([ 72, 105 ]), 10);
            expect(result).toEqual('Hi');
        });
    });
});

describe('UTF16 Encoding and Decoding', () => {
    describe('encodeUTF16', () => {
        test('should throw an error if input is not a Uint8Array', () => {
            const invalidInput = 'not-a-uint8array'; // String input, not Uint8Array
            expect(() => encodeUTF16LE(invalidInput as any)).toThrow('encodeUTF16LE input must be a Uint8Array');
        });

        test('should decode a simple UTF-16 encoded string', () => {
            const input = new Uint8Array([ 72, 0, 101, 0, 108, 0, 108, 0, 111, 0 ]);
            const result = encodeUTF16LE(input);
            const expected = 'Hello';
            expect(result).toBe(expected);
        });

        test('should decode an empty byte array', () => {
            const input = new Uint8Array([]);
            const result = encodeUTF16LE(input);
            const expected = '';
            expect(result).toBe(expected);
        });

        test('should stop decoding at null byte (0x00)', () => {
            const input = new Uint8Array([ 72, 0, 101, 0, 0, 0 ]);
            const result = encodeUTF16LE(input);
            const expected = 'He';
            expect(result).toBe(expected);
        });

        test('should decode string with null byte inside', () => {
            const input = new Uint8Array([ 72, 0, 101, 0, 0, 0, 87, 0, 111, 0 ]);
            const result = encodeUTF16LE(input);
            const expected = 'He';
            expect(result).toBe(expected);
        });

        test('should handle incomplete UTF-16 pairs gracefully', () => {
            const input = new Uint8Array([ 72, 0, 101, 0, 255 ]); // Invalid UTF-16 encoding
            const result = encodeUTF16LE(input);
            const expected = 'He'; // Handling as much as possible

            expect(result).toBe(expected);
        });

        test('should handle odd-length input gracefully', () => {
            const input = new Uint8Array([ 72, 0, 101, 0, 108, 0, 111 ]); // Odd-length input
            const result = encodeUTF16LE(input);
            const expected = 'Hel'; // Should decode 'Hel' and ignore last byte
            expect(result).toBe(expected);
        });

        test('should handle a string with characters at the start and end of the Unicode range', () => {
            const input = new Uint8Array([ 0x00, 0xD8, 0x48, 0xdf ]); // A surrogate pair for "𐍈"
            const result = encodeUTF16LE(input);
            const expected = '𐍈'; // Unicode character U+10348
            expect(result).toBe(expected);
        });

        test('should handle UTF-16 encoded string with extended characters', () => {
            const input = new Uint8Array([ 0x01, 0xd8, 0x34, 0xdc, 0x01, 0xd8, 0x31, 0xdc ]); // Some extended characters
            const result = encodeUTF16LE(input);
            const expected = '𐐴𐐱'; // Characters U+10334, U+10331
            expect(result).toBe(expected);
        });

        test('should encode a string with a specific length', () => {
            const result = encodeUTF16LE(new Uint8Array([ 72, 0, 101, 0, 108, 0, 108, 0, 111, 0 ]), 10); // Encoding only first 5 characters
            expect(result).toEqual('Hello');
        });
    });

    describe('decodeUTF16', () => {
        test('should encode a simple string into UTF-16', () => {
            const input = 'Hello';
            const result = decodeUTF16LE(input);
            const expected = new Uint8Array([ 72, 0, 101, 0, 108, 0, 108, 0, 111, 0 ]);
            expect(result).toEqual(expected);
        });

        test('should encode an empty string into an empty Uint8Array', () => {
            const input = '';
            const result = decodeUTF16LE(input);
            const expected = new Uint8Array(0);
            expect(result).toEqual(expected);
        });

        test('should encode a string with a specific length', () => {
            const input = 'Hello, world!';
            const result = decodeUTF16LE(input, 10); // Encoding only first 5 characters
            const expected = new Uint8Array([ 72, 0, 101, 0, 108, 0, 108, 0, 111, 0 ]); // Only 'Hello'
            expect(result).toEqual(expected);
        });

        test('should handle odd length input gracefully by truncating to an even length', () => {
            const input = 'Hello';
            const result = decodeUTF16LE(input, 9);

            const expected = new Uint8Array([ 0x48, 0x00, 0x65, 0x00, 0x6c, 0x00, 0x6c, 0x00 ]); // Only 'Hello'
            expect(result).toEqual(expected);
        });

        test('should handle extended characters (surrogate pairs)', () => {
            const input = '𐍈'; // Character U+10348 (a character outside the BMP)
            const result = decodeUTF16LE(input);
            const expected = new Uint8Array([ 0x00, 0xD8, 0x48, 0xdf ]); // Surrogate pair
            expect(result).toEqual(expected);
        });

        test('should handle truncation when length is provided', () => {
            const input = 'Hello, world!';
            const result = decodeUTF16LE(input, 8); // Length of 8, only 'Hello'
            const expected = new Uint8Array([ 72, 0, 101, 0, 108, 0, 108, 0 ]); // Only 'Hello'
            expect(result).toEqual(expected);
        });

        test('should encode special unicode characters correctly', () => {
            const input = '😀'; // U+1F600
            const result = decodeUTF16LE(input);
            const expected = new Uint8Array([ 0x3d, 0xd8, 0x00, 0xde ]); // Surrogate pair for '😀'
            expect(result).toEqual(expected);
        });

        test('should return an empty array when length is 0', () => {
            const input = 'Hello';
            const result = decodeUTF16LE(input, 0); // Encoding with length 0
            const expected = new Uint8Array(0); // Should return an empty array
            expect(result).toEqual(expected);
        });
    });
});

describe('encodeHEX and decodeHEX', () => {
    test('should throw an error if input is not a Uint8Array', () => {
        const invalidInput = 'not-a-uint8array'; // String input, not Uint8Array
        expect(() => encodeHEX(invalidInput as any)).toThrow('encodeHEX input must be a Uint8Array');
    });

    test('should encode and decode hex string correctly', () => {
        const hexString = '48656c6c6f';
        const decoded = decodeHEX(hexString);
        const encoded = encodeHEX(decoded);

        // Encoding should produce the expected byte array
        expect(decoded).toEqual(new Uint8Array([ 0x48, 0x65, 0x6c, 0x6c, 0x6f ]));

        // Decoding should return the original hex string
        expect(encoded).toBe(hexString);
    });

    test('should handle an odd-length hex string by truncating to the even length', () => {
        const hexString = '48656c6c6f1'; // Odd-length hex string (with an extra '1')
        const decoded = decodeHEX(hexString);
        const encoded = encodeHEX(decoded);

        // Encoding should truncate the odd part, resulting in only the first part of the hex string
        expect(decoded).toEqual(new Uint8Array([ 0x48, 0x65, 0x6c, 0x6c, 0x6f ]));

        // Decoding should return the original truncated hex string
        expect(encoded).toBe('48656c6c6f');
    });

    test('should handle empty hex string', () => {
        const hexString = '';
        const decoded = decodeHEX(hexString);
        const encoded = encodeHEX(decoded);

        // An empty hex string should produce an empty byte array
        expect(decoded).toEqual(new Uint8Array(0));

        // Decoding should return an empty string
        expect(encoded).toBe('');
    });

    test('should handle hex string with even length correctly', () => {
        const hexString = '1234abcd';
        const decoded = decodeHEX(hexString);
        const encoded = encodeHEX(decoded);

        // Encoding should produce the expected byte array
        expect(decoded).toEqual(new Uint8Array([ 0x12, 0x34, 0xab, 0xcd ]));

        // Decoding should return the original hex string
        expect(encoded).toBe(hexString);
    });

    test('should throw an error for invalid hex characters in the string', () => {
        const invalidHexString = 'xyz123'; // Invalid hex string containing non-hex characters
        expect(() => {
            decodeHEX(invalidHexString);
        }).toThrow('Invalid hex string: contains non-hex characters');
    });

    test('should handle provided length for encoding (truncate correctly)', () => {
        const hexString = '48656c6c6f';
        const decoded = decodeHEX(hexString, 3);
        const encoded = encodeHEX(decoded);

        // Encoding should truncate to the correct length (3 bytes)
        expect(decoded).toEqual(new Uint8Array([ 0x48, 0x65, 0x6c ]));

        // Decoding should return the truncated hex string
        expect(encoded).toBe('48656c');
    });

    test('should handle large hex strings', () => {
        const largeHexString = 'a'.repeat(1000); // 1000 "a" characters
        const decoded = decodeHEX(largeHexString);
        const encoded = encodeHEX(decoded);

        // Encoding and decoding should work for large strings as well
        expect(decoded.length).toBe(500); // 2 hex characters per byte, 1000 chars => 500 bytes
        expect(encoded).toBe(largeHexString);
    });

    test('should handle a string with non-printable hex characters', () => {
        const hexString = '00010203040506';
        const decoded = decodeHEX(hexString);
        const encoded = encodeHEX(decoded);

        // Encoding should produce the expected byte array
        expect(decoded).toEqual(new Uint8Array([ 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06 ]));

        // Decoding should return the original hex string
        expect(encoded).toBe(hexString);
    });

    test('should handle a hex string with only one byte', () => {
        const hexString = 'ff';
        const decoded = decodeHEX(hexString);
        const encoded = encodeHEX(decoded);

        // Encoding should produce the expected byte array
        expect(decoded).toEqual(new Uint8Array([ 0xff ]));

        // Decoding should return the original hex string
        expect(encoded).toBe(hexString);
    });

    test('should handle invalid hex string length', () => {
        const invalidLengthString = '123'; // Odd-length string
        const decoded = decodeHEX(invalidLengthString);
        const encoded = encodeHEX(decoded);

        // Encoding should handle odd-length string by truncating the last digit
        expect(decoded).toEqual(new Uint8Array([ 0x12 ]));

        // Decoding should return the truncated string
        expect(encoded).toBe('12');
    });
});

describe('Base64 Encoding and Decoding', () => {
    test('should decode a basic string correctly', () => {
        const decoded = decodeBase64('SGVsbG8=');
        expect(encodeASCII(decoded)).toEqual('Hello');
    });

    test('should handle truncation during decoding', () => {
        const input = 'SGVsbG8hIFdvcmxk';
        const decoded = decodeBase64(input, 5); // Truncate to first 5 bytes (half of the string)
        expect(encodeASCII(decoded)).toEqual('Hello');
    });

    test('should handle truncation during encoding', () => {
        const decoded = encodeBase64(new Uint8Array(
            [ 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x21, 0x20, 0x57, 0x6f, 0x72, 0x6c, 0x64 ]
        ), 5); // Truncate to first 5 bytes (half of the string)
        expect(decoded).toEqual('SGVsbG8=');
    });

    test('should encode truncated Base64 string correctly', () => {
        const truncated = new Uint8Array([ 0x48, 0x65, 0x6c, 0x6c, 0x6f ]);
        const decoded = encodeBase64(truncated, 3);
        expect(decoded).toBe('SGVs');
    });

    test('should handle empty string in decoding', () => {
        const input = '';
        const result = decodeBase64(input);
        const expected = new Uint8Array([]);
        expect(result).toEqual(expected);
    });

    test('should handle empty Base64 string encoding', () => {
        const input = new Uint8Array([]);
        const result = encodeBase64(input);
        const expected = '';
        expect(result).toBe(expected);
    });

    test('should return empty array when decoding invalid Base64 string', () => {
        const input = 'SGVsbG/Dvw==';
        const decoded = decodeBase64(input);
        expect(decoded).toEqual(new Uint8Array([ 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0xc3, 0xbf ]));
    });

    test('should handle invalid Base64 and encode gracefully', () => {
        const input = new Uint8Array([ 0xFF, 0xFF ]); // Invalid Base64 values
        const result = encodeBase64(input);
        expect(result).toBe('//8=');
    });

    test('should handle padding correctly during encoding', () => {
        const input = 'Foo'; // Length 3 (no padding)
        const result = encodeBase64(decodeASCII(input));
        expect(result).toEqual(Buffer.from(input).toString('base64'));
    });

    test('should add padding correctly during encoding', () => {
        const input = 'Fo'; // Length 2 (requires padding)
        const result = encodeBase64(decodeASCII(input));
        expect(result).toEqual(Buffer.from(input).toString('base64'));
    });

    test('should decode Base64 with padding correctly', () => {
        expect(decodeBase64('Rm9v')).toEqual(new Uint8Array([ 70, 111, 111 ]));
    });

    test('should handle corrupted or incomplete padding gracefully', () => {
        const decoded = decodeBase64('Rm8');
        expect(encodeASCII(decoded)).toBe('Fo');
    });

    test('should encode and decode non-ASCII characters correctly', () => {
        const input = '你好'; // Chinese characters
        const encoded = encodeBase64(decodeUTF8(input));
        const decoded = decodeBase64(encoded);
        expect(encoded).toBe('5L2g5aW9');
        expect(encodeUTF8(decoded)).toBe(input);
    });

    test('should handle long strings correctly', () => {
        const input = 'a'.repeat(1000); // Large input string
        const decoded = decodeBase64(input);
        const encoded = encodeBase64(decoded);
        expect(encoded).toBe(input);
    });

    test('should handle Base64 string with non-Base64 characters', () => {
        const input = decodeBase64('SGVsbG8@'); // Invalid character '@'
        expect(encodeASCII(input)).toEqual('Hello');
    });

    test('should return ASCII for Base64 string with excessive padding', () => {
        const result = decodeBase64('SGVsbG8==='); // Decode the Base64 back to the original string.
        expect(encodeASCII(result)).toEqual('Hello'); // The decoded string should be "Hello".
    });

    test('should decode valid Base64 string without padding', () => {
        const result = decodeBase64('SGVsbG8');
        expect(encodeASCII(result)).toEqual('Hello');
    });

    test('should handle empty input gracefully', () => {
        const input = decodeBase64('');
        const result = encodeBase64(input);
        expect(result).toEqual('');
    });
});


