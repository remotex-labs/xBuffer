import { Buffer as MyBuffer } from './buffer.module';

describe('new Buffer', () => {
    test('should create an instance with length parameter', () => {
        const instance = new MyBuffer(5);
        expect(instance).toBeInstanceOf(MyBuffer);
        expect(instance.length).toBe(5);
    });

    test('should create an instance with ArrayLike<number> parameter', () => {
        const arrayLikeObject = { length: 3, 0: 1, 1: 2, 2: 3 };
        const instance = new MyBuffer(arrayLikeObject);
        expect(instance).toBeInstanceOf(MyBuffer);
        expect(instance.toString()).toBe(Buffer.from(new Uint8Array(arrayLikeObject)).toString());
    });

    test('should create an instance with ArrayBufferLike parameter', () => {
        const arrayBuffer = new ArrayBuffer(8);
        const instance = new MyBuffer(arrayBuffer);
        expect(instance).toBeInstanceOf(MyBuffer);
        expect(instance.length).toBe(8);
    });
});

describe('Buffer.from method', () => {
    test('should create a Buffer from a string', () => {
        const result = MyBuffer.from('example', 'utf-8');
        expect(result).toBeInstanceOf(MyBuffer);
        expect(result.toString()).toBe('example');
    });

    test('should create a Buffer from an ArrayBufferView or array', () => {
        const arrayBufferView = new Uint8Array([ 1, 2, 3 ]);
        const result = MyBuffer.from(arrayBufferView);
        expect(result).toBeInstanceOf(MyBuffer);
        expect(result.toString('hex')).toBe('010203');
    });

    test('should throw a TypeError for unsupported input', () => {
        const unsupportedInput = 42;
        expect(() => MyBuffer.from(<any>unsupportedInput)).toThrow(TypeError);
    });

    test('should create a new Buffer from an array of bytes', () => {
        const result = MyBuffer.from([ 0x62, 0x75, 0x66, 0x66, 0x65, 0x72 ]);
        expect(result.toString()).toEqual('buffer');
    });

    test('should create a new Buffer from an ArrayBuffer', () => {
        const arrayBuffer = new Uint8Array([ 0x62, 0x75, 0x66, 0x66, 0x65, 0x72 ]);
        const result = MyBuffer.from(arrayBuffer);
        expect(result.toString()).toEqual('buffer');
    });

    test('should create a new Buffer from a string', () => {
        const result = MyBuffer.from('buffer', 'utf8');
        expect(result.toString()).toEqual('buffer');
    });
});

describe('Buffer.of method', () => {
    test('should create a new Buffer from a list of values', () => {
        const result = MyBuffer.of(0x62, 0x75, 0x66, 0x66, 0x65, 0x72);
        expect(result.toString()).toEqual('buffer');
    });

    test('should create a new Buffer from a single value', () => {
        const result = MyBuffer.of(0x62);
        expect(result.toString()).toEqual('b');
    });

    test('should create a new Buffer from multiple values', () => {
        const result = MyBuffer.of(0x62, 0x75, 0x66);
        expect(result.toString()).toEqual('buf');
    });
});

describe('Buffer.isEncoding method', () => {
    test('should return true for a supported encoding', () => {
        const result = MyBuffer.isEncoding('utf8');
        expect(result).toBe(true);
    });

    test('should return true for another supported encoding', () => {
        const result = MyBuffer.isEncoding('hex');
        expect(result).toBe(true);
    });

    test('should return false for an unsupported encoding', () => {
        const result = MyBuffer.isEncoding('utf/8');
        expect(result).toBe(false);
    });

    test('should return false for an empty string', () => {
        const result = MyBuffer.isEncoding('');
        expect(result).toBe(false);
    });
});

describe('Buffer.byteLength method', () => {
    test('should return correct byte length for a string with utf8 encoding', () => {
        const result = MyBuffer.byteLength('½ + ¼ = ¾', 'utf8');
        expect(result).toBe(12);
    });

    test('should return correct byte length for a string with base64 encoding', () => {
        const result = MyBuffer.byteLength('SGVsbG8gd29ybGQ=', 'base64');
        expect(result).toBe(11);
    });

    test('should return correct byte length for an ArrayBuffer', () => {
        const arrayBuffer = new Uint8Array([ 0xc2, 0xbd, 0x20, 0x2b, 0xc2, 0xbc, 0x20, 0x3d, 0xc2, 0xbe ]).buffer;
        const result = MyBuffer.byteLength(arrayBuffer);
        expect(result).toBe(10);
    });

    test('should throw an error for unsupported input type', () => {
        // Replace with your actual test logic for the error case
        expect(() => MyBuffer.byteLength(<any>123)).toThrowError(TypeError);
    });
});

describe('Buffer.concat method', () => {
    test('should concatenate Buffers with totalLength', () => {
        const buf1 = MyBuffer.alloc(10);
        const buf2 = MyBuffer.alloc(14);
        const buf3 = MyBuffer.alloc(18);
        const totalLength = buf1.length + buf2.length + buf3.length;
        const result = MyBuffer.concat([ buf1, buf2, buf3 ], totalLength);
        expect(result.length).toBe(42);
    });

    test('should concatenate Buffers without totalLength', () => {
        const buf1 = MyBuffer.alloc(10);
        const buf2 = MyBuffer.alloc(14);
        const buf3 = MyBuffer.alloc(18);

        const result = MyBuffer.concat([ buf1, buf2, buf3 ]);
        expect(result.length).toBe(42);
    });

    test('should handle an empty list', () => {
        const result = MyBuffer.concat([]);
        expect(result.length).toBe(0);
    });

    test('should handle totalLength of 0', () => {
        const result = MyBuffer.concat([ MyBuffer.alloc(10), MyBuffer.alloc(20) ], 0);
        expect(result.length).toBe(0);
    });
});

describe('Buffer.copyBytesFrom method', () => {
    test('should copy bytes from TypedArray with default offset and length', () => {
        const typedArray = new Uint16Array([ 0, 0xffff ]);
        const result = MyBuffer.copyBytesFrom(typedArray);

        // Replace the expectation with your actual expected result
        expect(result.length).toBe(4); // Uint16Array has 2 elements, each element is 2 bytes
        expect(result[0]).toBe(0);
        expect(result[1]).toBe(0);
        expect(result[2]).toBe(255);
        expect(result[3]).toBe(255);
    });

    test('should throw RangeError for an invalid offset', () => {
        const typedArray = new Uint16Array([ 0, 0xffff ]);

        // Replace with your actual test logic for the error case
        expect(() => MyBuffer.copyBytesFrom(typedArray, -1)).toThrowError(RangeError);
    });

    test('should handle undefined length (copy till the end)', () => {
        const typedArray = new Uint16Array([ 0, 0xffff ]);
        const result = MyBuffer.copyBytesFrom(typedArray, 1);

        // Replace the expectation with your actual expected result
        expect(result.length).toBe(2); // Copying till the end, each element is 2 bytes
        expect(result[0]).toBe(255);
        expect(result[1]).toBe(255);
    });

    // Add more test cases based on your implementation
});