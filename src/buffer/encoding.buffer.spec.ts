import {
    asciiDecode,
    asciiEncode, base64Decode, base64Encode,
    hexDecode, hexEncode,
    utf16leDecode,
    utf16leEncode,
    utf8Decode,
    utf8Encode
} from './encoding.buffer';

describe('UTF-8 Encoding and Decoding', () => {
    const testCases = [
        {
            name: 'Encode and decode basic ASCII characters',
            input: 'Hello, World!',
        },
        {
            name: 'Encode and decode characters with multiple bytes',
            input: '😊🌍',
        },
        {
            name: 'Encode and decode a string with special characters',
            input: '© OpenAI - ∞',
        },
        {
            name: 'Encode and decode an empty string',
            input: '',
        },
        {
            name: 'Encode and decode non-ASCII text',
            input: '你好，世界！',
        },
        {
            name: 'Encode and decode text with emojis',
            input: '😊 Unicode Test 😍',
        },
        {
            name: 'Encode and decode empty string',
            input: '',
        },
        {
            name: 'Encode and decode a very large string',
            input: 'A'.repeat(1000000),
        }
    ];
    test.each(testCases)('$name', ({ input }) => {
        const encoded = utf8Encode(input);
        const decoded = utf8Decode(encoded);

        const nodejsBuffer = Buffer.from(input, 'utf-8');

        // Expectations
        expect(decoded).toEqual(input);

        // Validate against Node.js Buffer
        expect(Array.from(encoded)).toEqual(Array.from(nodejsBuffer));
        expect(decoded).toEqual(nodejsBuffer.toString('utf-8'));
    });

    // Test for error scenarios
    test('Handles invalid UTF-8 data', () => {
        const invalidData = new Uint8Array([ 0xc0, 0x80, 0xe0, 0x80, 0x80 ]); // Invalid UTF-8 bytes
        const decoded = utf8Decode(invalidData);

        expect(decoded).toEqual('\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD'); // In case of error, expect an empty string or handle accordingly
        expect(decoded).toEqual(Buffer.from(invalidData).toString('utf-8'));
    });

    test('Decode invalid UTF-8 bytes', () => {
        const invalidBytes = new Uint8Array([ 0xFF, 0xFE, 0xFD ]); // Invalid UTF-8 bytes
        const decoded = utf8Decode(invalidBytes);

        expect(decoded).toEqual('\uFFFD\uFFFD\uFFFD'); // In case of error, expect an empty string or handle accordingly
        expect(decoded).toEqual(Buffer.from(invalidBytes).toString());
    });

    test('encodes a string with size limit', () => {
        const result = utf8Encode('Hello, 世界!', 10); // Encode up to 10 bytes
        expect(result).toEqual(new Uint8Array([ 72, 101, 108, 108, 111, 44, 32, 228, 184, 150 ])); // Only the first 10 bytes are encoded
        expect(result.buffer).toEqual(Buffer.from(result, 0, 10).buffer);
    });
});

describe('ASCII Encoding and Decoding', () => {
    const testCases = [
        {
            name: 'Encode and decode ASCII string',
            input: 'Hello, ASCII!',
        },
        {
            name: 'Encode and decode empty string',
            input: '',
        }
    ];
    test.each(testCases)('$name', ({ input }) => {
        const encoded = asciiEncode(input);
        const decoded = asciiDecode(encoded);

        const nodejsBuffer = Buffer.from(input, 'ascii');

        // Expectations
        expect(decoded).toEqual(input);

        // Validate against Node.js Buffer
        expect(Array.from(encoded)).toEqual(Array.from(nodejsBuffer));
        expect(decoded).toEqual(nodejsBuffer.toString('ascii'));
    });

    test('Decode invalid ASCII bytes should throw an error', () => {
        const invalidBytes = new Uint8Array([ 128, 129, 130 ]); // Contains bytes outside ASCII range
        expect(asciiDecode(invalidBytes)).toEqual(Buffer.from(invalidBytes).toString('ascii'));
    });

    test('should encode the specified number of characters when length is provided', () => {
        const data = 'Hello';
        const result = asciiEncode(data, 3);
        expect(result).toEqual(new Uint8Array([ 72, 101, 108 ]));
    });

    test('should encode the full string when length is greater than string length', () => {
        const data = 'Hello';
        const result = asciiEncode(data, 10);
        expect(result).toEqual(new Uint8Array([ 72, 101, 108, 108, 111 ]));
    });
});

describe('UTF-16LE Encoding and Decoding', () => {
    const testCases = [
        {
            name: 'Encode and decode UTF-16LE string',
            input: 'Hello, UTF-16LE!',
        },
        {
            name: 'Encode and decode empty string',
            input: '',
        },
        {
            name: 'Encode and decode string with special characters',
            input: '😊 Unicode Test 😍'
        }
    ];
    test.each(testCases)('$name', ({ input }) => {
        const encoded = utf16leEncode(input);
        const decoded = utf16leDecode(encoded);

        const nodejsBuffer = Buffer.from(input, 'utf16le');

        // Expectations
        expect(decoded).toEqual(input);

        // Validate against Node.js Buffer
        expect(Array.from(encoded)).toEqual(Array.from(nodejsBuffer));
        expect(decoded).toEqual(nodejsBuffer.toString('utf16le'));
    });

    test('should encode the specified number of characters when length is provided', () => {
        const data = 'Hello';
        const result = utf16leEncode(data, 3);

        expect(result).toEqual(new Uint8Array([ 72, 0 ]));
    });

    test('should encode the full string when length is greater than string length', () => {
        const data = 'Hello';
        const result = utf16leEncode(data, 10);
        expect(result).toEqual(new Uint8Array([ 72, 0, 101, 0, 108, 0, 108, 0, 111, 0 ]));
    });
});

describe('Hex Encoding and Decoding', () => {
    const testCases = [
        {
            name: 'Decode and encode hex string',
            input: '48656c6c6f2c2048657821',
        },
        {
            name: 'Encode and decode empty string',
            input: '',
        },
        {
            name: 'Encode and decode string with special characters',
            input: '1f3a19'
        }
    ];
    test.each(testCases)('$name', ({ input }) => {
        const encoded = hexEncode(input);
        const decoded = hexDecode(encoded);

        const nodejsBuffer = Buffer.from(input, 'hex');

        // Expectations
        expect(decoded).toEqual(input);

        // Validate against Node.js Buffer
        expect(Array.from(encoded)).toEqual(Array.from(nodejsBuffer));
        expect(decoded).toEqual(nodejsBuffer.toString('hex'));
    });

    test('should encode the specified number of bytes when length is provided', () => {
        const hexString = 'aabbcc';
        const result = hexEncode(hexString, 2);
        const buff = Buffer.alloc(2);
        buff.write(hexString, 0, 2, 'hex');

        expect(result).toEqual(new Uint8Array([ 0xaa, 0xbb ]));
        expect(Array.from(result)).toEqual(Array.from(buff));
    });

    test('should decode the full hex string when length is greater than hex string length', () => {
        const hexString = 'aabbcc';
        const result = hexEncode(hexString, 10);
        expect(result).toEqual(new Uint8Array([ 0xaa, 0xbb, 0xcc ]));
    });
});

describe('base64Encode base64Decode', () => {
    test('encodes a base64 string into a Uint8Array', () => {
        const base64String = 'SGVsbG8gd29ybGQ='; // Example base64 string
        const result = base64Encode(base64String);

        // You can add more specific assertions based on the expected result
        expect(result).toBeInstanceOf(Uint8Array);
        expect(result.length).toBeGreaterThan(0);
    });

    test('encodes a base64 string into a truncated Uint8Array when length is provided', () => {
        const base64String = 'SGVsbG8gd29ybGQ='; // Example base64 string
        const length = 5;
        const result = base64Encode(base64String, length);

        // You can add more specific assertions based on the expected result
        expect(result).toBeInstanceOf(Uint8Array);
        expect(result.length).toBe(length);
    });

    test('decodes a Uint8Array into a base64-encoded string', () => {
        const bytes = new Uint8Array([ 72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100 ]);
        const result = base64Decode(bytes);

        // You can add more specific assertions based on the expected result
        expect(typeof result).toBe('string');
        expect(result).toBe('SGVsbG8gV29ybGQ=');
    });
});