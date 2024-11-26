/**
 * Imports
 */

import { DataViewProvider } from '@providers/data-view.provider';

/**
 * Tests
 */

describe('read', () => {
    let buffer: DataViewProvider;
    beforeAll(() => {
        const arrayBuffer = new ArrayBuffer(13); // 8 bytes for testing
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < 8; i++) {
            uint8Array[i] = i + 1; // [1, 2, 3, 4, 5, 6, 7, 8]
        }

        uint8Array[8] = 0x80;
        uint8Array[9] = 0x18;
        uint8Array[10] = 0xf2;
        uint8Array[11] = 0xff;
        uint8Array[12] = 0xff;
        buffer = new DataViewProvider(arrayBuffer); // Mock your DataViewProvider class
    });

    describe.each([
        [ 'readUIntLE', 0x0201, 0x040302, 0x04030201, 0x0504030201, 0x060504030201, 0x80, 0xf218, 0xffff ],
        [ 'readUIntBE', 0x0102, 0x020304, 0x01020304, 0x0102030405, 0x010203040506, 0x80, 0x18f2, 0xffff ],
        [ 'readIntLE', 0x0201, 0x040302, 0x04030201, 0x0504030201, 0x060504030201, -128, -0xde8, -1 ], // Little-endian test cases for signed integers
        [ 'readIntBE', 0x0102, 0x020304, 0x01020304, 0x0102030405, 0x010203040506, -128, 0x18f2, -1 ] // Big-endian test cases for signed integers
    ])('when the function is %s', (readFnName, ...expectedValues) => {
        let readFn: (offset: number, byteLength: number) => number;
        beforeAll(() => {
            readFn = <any> buffer[<any> readFnName];
        });

        test('reads a single byte correctly', () => {
            expect(readFn.call(buffer, 0, 1)).toBe(1); // First byte
            expect(readFn.call(buffer, 7, 1)).toBe(8); // Last byte
        });

        test('reads multi-byte values correctly', () => {
            expect(readFn.call(buffer, 0, 2)).toBe(expectedValues[0]); // Little-endian or Big-endian: [1, 2]
            expect(readFn.call(buffer, 1, 3)).toBe(expectedValues[1]); // [2, 3, 4]
            expect(readFn.call(buffer, 0, 4)).toBe(expectedValues[2]); // [1, 2, 3, 4]
            expect(readFn.call(buffer, 0, 5)).toBe(expectedValues[3]); // [1, 2, 3, 4, 5]
            expect(readFn.call(buffer, 0, 6)).toBe(expectedValues[4]); // [1, 2, 3, 4, 5, 6]
            expect(readFn.call(buffer, 8, 1)).toBe(expectedValues[5]); // [-1]
            expect(readFn.call(buffer, 9, 2)).toBe(expectedValues[6]); // [-1, 245]
            expect(readFn.call(buffer, 11, 2)).toBe(expectedValues[7]); // [-1, -1]
        });

        test('validates byte length and handles maximum byte length supported', () => {
            expect(readFn.call(buffer, 0, 6)).toBe(expectedValues[4]); // Check 6 bytes

            // Invalid case: byte length too large
            expect(() => readFn.call(buffer, 0, 7)).toThrow(RangeError);
            expect(() => readFn.call(buffer, 0, 7)).toThrow(
                'The value of "byteLength" is out of range. It must be >= 1 and <= 6. Received 7'
            );
        });

        test('throws RangeError for invalid byteLength', () => {
            expect(() => readFn.call(buffer, 0, 0)).toThrow(RangeError); // Byte length of 0 is invalid
            expect(() => readFn.call(buffer, 0, 9)).toThrow(RangeError); // Byte length greater than buffer length
        });

        test('throws RangeError for out-of-bounds offset', () => {
            expect(() => readFn.call(buffer, 13, 1)).toThrow(RangeError); // Offset out of range
            expect(() => readFn.call(buffer, 12, 2)).toThrow(RangeError); // Offset + byteLength out of range
        });

        test('handles edge case of reading the last valid byte', () => {
            expect(readFn.call(buffer, 7, 1)).toBe(8); // Reading last byte with a length of 1
        });

        test('handles zero-padding for unused bytes', () => {
            const smallBufferArray = new ArrayBuffer(4);
            const smallBuffer = new DataViewProvider(smallBufferArray);

            expect(readFn.call(smallBuffer, 0, 4)).toBe(0); // All bytes initialized to 0
        });

        test('does not modify the original buffer', () => {
            const dataView = (<any> buffer).dataView;
            const originalData = new Uint8Array(dataView.buffer).slice();
            readFn.call(buffer, 0, 4); // Perform a read
            expect(new Uint8Array(dataView.buffer)).toEqual(originalData); // Ensure data is unchanged
        });

        test('throws for operations on zero-length buffer', () => {
            const zeroBuffer = new DataViewProvider(new ArrayBuffer(0));
            expect(() => readFn.call(zeroBuffer, 0, 1)).toThrow(RangeError);
        });
    });
});

describe('write', () => {
    let buffer: DataViewProvider;
    beforeEach(() => {
        const arrayBuffer = new ArrayBuffer(13); // 13 bytes for testing
        buffer = new DataViewProvider(arrayBuffer); // Mock your DataViewProvider class
    });

    describe.each([
        [ 'writeUIntLE', 0x0201, 0x040302, 0x04030201, 0x0504030201, 0x060504030201 ], // Little-endian test cases for unsigned integers
        [ 'writeUIntBE', 0x0102, 0x020304, 0x01020304, 0x0102030405, 0x010203040506 ], // Big-endian test cases for unsigned integers
        [ 'writeIntLE', 0x0201, 0x040302, 0x04030201, 0x0504030201, 0x060504030201 ],  // Little-endian test cases for signed integers
        [ 'writeIntBE', 0x0102, 0x020304, 0x01020304, 0x0102030405, 0x010203040506 ]   // Big-endian test cases for signed integers
    ])('when the function is %s', (writeFnName, ...expectedValues) => {
        let writeFn: (value: number, offset: number, byteLength: number) => number;
        beforeAll(() => {
            writeFn = <any> DataViewProvider.prototype[<any> writeFnName];
        });

        test('writes a single byte correctly', () => {
            const arrayBuffer = new ArrayBuffer(1);
            const smallBuffer = new DataViewProvider(arrayBuffer);
            writeFn.call(smallBuffer, 0x01, 0, 1);
            expect(smallBuffer[0]).toBe(0x01); // Check the first byte
        });

        test('writes multi-byte values correctly', () => {
            writeFn.call(buffer, expectedValues[0], 0, 2);
            expect(Array.from(buffer.subarray(0, 2))).toEqual([ 0x01, 0x02 ]);

            writeFn.call(buffer, expectedValues[1], 1, 3);
            expect(Array.from(buffer.subarray(1, 4))).toEqual([ 0x02, 0x03, 0x04 ]);

            writeFn.call(buffer, expectedValues[2], 0, 4);
            expect(Array.from(buffer.subarray(0, 4))).toEqual([ 0x01, 0x02, 0x03, 0x04 ]);

            writeFn.call(buffer, expectedValues[3], 0, 5);
            expect(Array.from(buffer.subarray(0, 5))).toEqual([ 0x01, 0x02, 0x03, 0x04, 0x05 ]);

            writeFn.call(buffer, expectedValues[4], 0, 6);
            expect(Array.from(buffer.subarray(0, 6))).toEqual([ 0x01, 0x02, 0x03, 0x04, 0x05, 0x06 ]);
        });

        test('validates byte length and handles maximum byte length supported', () => {
            writeFn.call(buffer, expectedValues[4], 0, 6); // Write 6 bytes
            expect(Array.from(buffer.subarray(0, 6))).toEqual([ 0x01, 0x02, 0x03, 0x04, 0x05, 0x06 ]);

            // Invalid case: byte length too large
            expect(() => writeFn.call(buffer, expectedValues[4], 0, 7)).toThrow(
                'The value of "byteLength" is out of range. It must be >= 1 and <= 6. Received 7'
            );
        });

        test('throws RangeError for invalid byteLength', () => {
            expect(() => writeFn.call(buffer, expectedValues[4], 0, 0)).toThrow(RangeError); // Byte length of 0 is invalid
            expect(() => writeFn.call(buffer, expectedValues[4], 0, 9)).toThrow(RangeError); // Byte length greater than buffer length
        });

        test('throws RangeError for out-of-bounds offset', () => {
            expect(() => writeFn.call(buffer, expectedValues[4], 13, 1)).toThrow(RangeError); // Offset out of range
            expect(() => writeFn.call(buffer, expectedValues[4], 12, 2)).toThrow(RangeError); // Offset + byteLength out of range
        });

        test('handles edge case of writing the last valid byte', () => {
            writeFn.call(buffer, 0x01, 0, 1); // Write last byte
            expect(new Uint8Array(buffer)[0]).toBe(0x01); // Check if it is written correctly
        });

        test('throws for writes that overlap buffer boundaries', () => {
            expect(() => writeFn.call(buffer, 0x01, 12, 2)).toThrow(RangeError);
        });

        test('throws for operations on zero-length buffer', () => {
            const zeroBuffer = new DataViewProvider(new ArrayBuffer(0));
            expect(() => writeFn.call(zeroBuffer, 0x01, 0, 1)).toThrow(RangeError);
        });
    });
});

describe('BufferSwap methods', () => {
    let bufferSwap: DataViewProvider;
    let dataView: DataView;

    beforeEach(() => {
        bufferSwap = new DataViewProvider(16);
        dataView = (<any> bufferSwap).dataView;
    });

    test('swap16 should swap 16-bit values correctly', () => {
        dataView.setUint16(0, 0x0102, true);  // 0x0102 (little-endian)
        dataView.setUint16(2, 0x0304, true);  // 0x0304 (little-endian)
        bufferSwap.swap16();

        // After swapping: should be 0x0201 and 0x0403 (little-endian)
        expect(dataView.getUint16(0, true)).toBe(0x0201);
        expect(dataView.getUint16(2, true)).toBe(0x0403);
    });

    test('swap16 should throw error for odd-length buffers', () => {
        const buffer = new ArrayBuffer(3); // Odd-length buffer (3 bytes)
        expect(() => {
            const bufferSwapOdd = new DataViewProvider(buffer);
            bufferSwapOdd.swap16();
        }).toThrow(RangeError);
    });

    test('swap32 should swap 32-bit values correctly', () => {
        dataView.setUint32(0, 0x01020304, true);  // 0x01020304 (little-endian)
        dataView.setUint32(4, 0x05060708, true);  // 0x05060708 (little-endian)
        bufferSwap.swap32();

        // After swapping: should be 0x03040102 and 0x07080506 (little-endian)
        expect(dataView.getUint32(0, true)).toBe(0x04030201);
        expect(dataView.getUint32(4, true)).toBe(0x08070605);
    });

    test('swap32 should throw error for non-divisible-by-4 length buffers', () => {
        const buffer = new ArrayBuffer(5); // Non-divisible by 4 length buffer
        expect(() => {
            const bufferSwapOdd = new DataViewProvider(buffer);
            bufferSwapOdd.swap32();
        }).toThrow(RangeError);
    });

    test('swap64 should swap 64-bit values correctly', () => {
        dataView.setBigUint64(0, 0x0102030405060708n, true); // 0x0102030405060708 (little-endian)
        dataView.setBigUint64(8, 0x090A0B0C0D0E0F10n, true); // 0x090A0B0C0D0E0F10 (little-endian)
        bufferSwap.swap64();

        // After swapping: should be 0x0807060504030201 and 0x10100F0E0D0C0B09 (little-endian)
        expect(dataView.getBigUint64(0, true)).toBe(0x0807060504030201n);
        expect(dataView.getBigUint64(8, true)).toBe(0x100f0e0d0c0b0a09n);
    });

    test('swap64 should throw error for non-divisible-by-8 length buffers', () => {
        const buffer = new ArrayBuffer(7); // Non-divisible by 8 length buffer
        expect(() => {
            const bufferSwapOdd = new DataViewProvider(buffer);
            bufferSwapOdd.swap64();
        }).toThrow(RangeError);
    });
});

describe('Buffer reading functions', () => {
    const buffer = new ArrayBuffer(21);
    const dataView: any = new DataViewProvider(buffer);

    // Test setup for various offsets
    beforeAll(() => {
        // Fill the buffer with test data for various types
        dataView.dataView.setUint8(0, 0x12);
        dataView.dataView.setUint16(1, 0x1234, true);  // Little-endian
        dataView.dataView.setUint16(3, 0x5678, false); // Big-endian
        dataView.dataView.setUint32(5, 0x9ABCDEF0, true);  // Little-endian
        dataView.dataView.setUint32(9, 0x12345678, false); // Big-endian
        dataView.dataView.setBigUint64(13, BigInt(0x1234567890ABCDEF), true); // Little-endian
    });

    // Test cases for each function
    test.each([
        [ 'readUInt8', 0, 0x12 ],
        [ 'readUInt16LE', 1, 0x1234 ],
        [ 'readUInt16BE', 3, 0x5678 ],
        [ 'readUInt32LE', 5, 0x9ABCDEF0 ],
        [ 'readUInt32BE', 9, 0x12345678 ],
        [ 'readBigUInt64LE', 13, BigInt(0x1234567890ABCDEF) ]
    ])('%s should read correctly from buffer at default offset', (method, offset, expectedValue) => {
        const result = dataView[method](offset);
        expect(result).toBe(expectedValue);
    });

    test.each([
        [ 'readUInt8', 0, 0x12 ],
        [ 'readUInt16LE', 1, 0x1234 ],
        [ 'readUInt16BE', 3, 0x5678 ],
        [ 'readUInt32LE', 5, 0x9ABCDEF0 ],
        [ 'readUInt32BE', 9, 0x12345678 ],
        [ 'readBigUInt64LE', 13, BigInt(0x1234567890ABCDEF) ]
    ])('%s should read correctly from buffer at custom offset', (method, offset, expectedValue) => {
        const result = dataView[method](offset);
        expect(result).toBe(expectedValue);
    });

    test.each([
        [ 'readInt8', 0, 0x12 ],
        [ 'readInt16LE', 1, 0x1234 ],
        [ 'readInt16BE', 3, 0x5678 ],
        [ 'readInt32LE', 5, -0x65432110 ],
        [ 'readInt32BE', 9, 0x12345678 ],
        [ 'readBigInt64LE', 13, BigInt('0x1234567890abce00') ],
        [ 'readBigInt64BE', 13, BigInt('0xceab9078563412') ]
    ])('%s should handle signed reads correctly', (method, offset, expectedValue) => {
        const result = dataView[method](offset);
        expect(result).toBe(expectedValue);
    });

    test.each([
        [ 'readFloatLE', 5, -7.811515253664679e-23 ],  // You might need to adjust this based on your data
        [ 'readFloatBE', 9, 5.690456613903524e-28 ],  // Adjust this as well
        [ 'readDoubleLE', 13, 5.626349108908533e-221 ],  // Adjust for double precision
        [ 'readDoubleBE', 9, 5.626346736689188e-221 ]  // Same as for readFloatBE
    ])('%s should read correctly from the buffer', (method, offset, expectedValue) => {
        const result = dataView[method](offset);
        expect(result).toBe(expectedValue);
    });

    test.each([
        [ 'readUInt8', 22 ],  // Beyond buffer size
        [ 'readUInt16LE', 20 ],  // Beyond buffer size
        [ 'readUInt32LE', 18 ],  // Beyond buffer size
        [ 'readBigUInt64LE', 15 ],  // Beyond buffer size
        [ 'readBigUInt64BE', 15 ],  // Beyond buffer size
        [ 'readInt8', 21 ],  // Beyond buffer size
        [ 'readFloatLE', 18 ]  // Beyond buffer size
    ])('%s should throw an error for out-of-bounds offset', (method, offset) => {
        expect(() => {
            dataView[method](offset);
        }).toThrow(RangeError);  // or the specific error you're expecting
    });
});

describe('Buffer writing functions', () => {
    const buffer = new ArrayBuffer(21);
    const dataView: any = new DataViewProvider(buffer);

    // Test setup for various types
    beforeAll(() => {
        // Initialize buffer with default values
        new Uint8Array(buffer).fill(0);
    });

    // Test cases for each write function
    test.each([
        [ 'UInt8', 0, 0x12, 1 ],  // Value 0x12 at offset 0, expect 1 byte written
        [ 'UInt16LE', 1, 0x1234, 2 ],  // Little-endian, expect 2 bytes written
        [ 'UInt16BE', 3, 0x5678, 2 ],  // Big-endian, expect 2 bytes written
        [ 'UInt32LE', 5, 0x9ABCDEF0, 4 ],  // Little-endian, expect 4 bytes written
        [ 'UInt32BE', 9, 0x12345678, 4 ],  // Big-endian, expect 4 bytes written
        [ 'BigUInt64LE', 13, BigInt(0x1234567890ABCDEF), 8 ],  // Little-endian, expect 8 bytes written
        [ 'BigUInt64BE', 13, BigInt(0x1234567890ABCDEF), 8 ]  // Big-endian, expect 8 bytes written
    ])('%s should write correctly to buffer at default offset', (method, offset, value, expectedBytes) => {
        const result = dataView[`write${ method }`](value, offset);
        const read = dataView[`read${ method }`](offset);
        expect(result).toBe(expectedBytes + offset);  // Expect the number of bytes written
        expect(read).toBe(value);
    });

    // Test cases for writing signed numbers
    test.each([
        [ 'Int8', 0, 0x12, 1 ],  // Value 0x12 at offset 0, expect 1 byte written
        [ 'Int16LE', 1, 0x1234, 2 ],  // Little-endian, expect 2 bytes written
        [ 'Int16BE', 3, 0x5678, 2 ],  // Big-endian, expect 2 bytes written
        [ 'Int32LE', 5, -0x65432110, 4 ],  // Little-endian, expect 4 bytes written
        [ 'Int32BE', 9, 0x12345678, 4 ],  // Big-endian, expect 4 bytes written
        [ 'BigInt64LE', 13, BigInt(0x1234567890ABCDEF), 8 ],  // Little-endian, expect 8 bytes written
        [ 'BigInt64BE', 13, BigInt(0x1234567890ABCDEF), 8 ]  // Big-endian, expect 8 bytes written
    ])('%s should handle signed writes correctly', (method, offset, value, expectedBytes) => {
        const result = dataView[`write${ method }`](value, offset);
        const read = dataView[`read${ method }`](offset);
        expect(result).toBe(expectedBytes + offset);  // Expect the number of bytes written
        expect(read).toBe(value);
    });

    // Test cases for floating point writes
    test.each([
        [ 'FloatLE', 5, -7.811515253664679e-23, 4 ],  // Adjust this based on your data
        [ 'FloatBE', 9, 5.690456613903524e-28, 4 ],  // Adjust this as well
        [ 'DoubleLE', 13, 5.626349108908533e-221, 8 ],  // Adjust for double precision
        [ 'DoubleBE', 9, 5.626346736689188e-221, 8 ]  // Same as for writeFloatBE
    ])('%s should write floating-point numbers correctly to buffer', (method, offset, value, expectedBytes) => {
        const result = dataView[`write${ method }`](value, offset);
        const read = dataView[`read${ method }`](offset);
        expect(result).toBe(expectedBytes + offset);  // Expect the number of bytes written
        expect(read).toBe(value);
    });

    // Test for out-of-bounds offsets
    test.each([
        [ 'writeUInt8', 21, 0x12 ],  // Beyond buffer size
        [ 'writeUInt16LE', 20, 0x1234 ],  // Beyond buffer size
        [ 'writeUInt32LE', 18, 0x9ABCDEF0 ],  // Beyond buffer size
        [ 'writeBigUInt64LE', 15, BigInt(0x1234567890ABCDEF) ],  // Beyond buffer size
        [ 'writeBigUInt64BE', 15, BigInt(0x1234567890ABCDEF) ],  // Beyond buffer size
        [ 'writeInt8', 21, 0x12 ],  // Beyond buffer size
        [ 'writeFloatLE', 18, 3.14 ]  // Beyond buffer size
    ])('%s should throw an error for out-of-bounds offset', (method, offset, value) => {
        expect(() => {
            dataView[method](value, offset);
        }).toThrow(RangeError);  // or the specific error you're expecting
    });

    test.each([
        [ 'writeUInt8', 21, '@0x12' ],
        [ 'writeUInt16LE', 20, '@0x1234' ],
        [ 'writeUInt32LE', 18, '@0x9ABCDEF0' ],
        [ 'writeInt8', 21, '@0x12' ]  // Beyond buffer size
    ])('%s should throw an error for NaN', (method, offset, value) => {
        expect(() => {
            dataView[method](value, offset);
        }).toThrow(TypeError);  // or the specific error you're expecting
    });
});

describe('Buffer endianness swap functions', () => {
    // swap16 Tests
    describe('swap16', () => {
        test('should swap byte order of each 16-bit element', () => {
            const dataView = new DataViewProvider([ 0x01, 0x02, 0x03, 0x04 ]);
            dataView.swap16();

            // Expect the buffer to swap byte order: [0x02, 0x01, 0x04, 0x03]
            expect(dataView.buffer).toEqual(new Uint8Array([ 0x02, 0x01, 0x04, 0x03 ]).buffer);
        });

        test('should throw RangeError for buffers with odd length', () => {
            const oddDataView = new DataViewProvider(3);

            expect(() => oddDataView.swap16()).toThrowError(RangeError);
        });
    });

    // swap32 Tests
    describe('swap32', () => {
        test('should swap byte order of each 32-bit element', () => {
            const dataView = new DataViewProvider([ 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08 ]);
            dataView.swap32();

            // Expect the buffer to swap byte order: [0x04, 0x03, 0x02, 0x01, 0x08, 0x07, 0x06, 0x05]
            expect(dataView.buffer).toEqual(new Uint8Array([ 0x04, 0x03, 0x02, 0x01, 0x08, 0x07, 0x06, 0x05 ]).buffer);
        });

        test('should throw RangeError for buffers with length not divisible by 4', () => {
            const oddDataView = new DataViewProvider(7);

            expect(() => oddDataView.swap32()).toThrowError(RangeError);
        });
    });

    // swap64 Tests
    describe('swap64', () => {
        test('should swap byte order of each 64-bit element', () => {
            const dataView = new DataViewProvider([ 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10 ]);
            dataView.swap64();

            // Expect the buffer to swap byte order: [0x08, 0x07, 0x06, 0x05, 0x04, 0x03, 0x02, 0x01, 0x10, 0x0F, 0x0E, 0x0D, 0x0C, 0x0B, 0x0A, 0x09]
            expect(dataView.buffer).toEqual(new Uint8Array([ 0x08, 0x07, 0x06, 0x05, 0x04, 0x03, 0x02, 0x01, 0x10, 0x0F, 0x0E, 0x0D, 0x0C, 0x0B, 0x0A, 0x09 ]).buffer);
        });

        test('should throw RangeError for buffers with length not divisible by 8', () => {
            const oddDataView = new DataViewProvider(15);

            expect(() => oddDataView.swap64()).toThrowError(RangeError);
        });
    });
});
