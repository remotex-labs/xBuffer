/**
 * Imports
 */

import { Buffer } from '@providers/buffer.provider';

/**
 * Tests
 */

test('buffer.write should parse a string as a number', () => {
    const buf = Buffer.alloc(64);
    buf.writeUInt16LE('1003', 0);
    expect(buf.readUInt16LE(0)).toBe(1003);
});

test('buffer.writeUInt8 should floor fractional numbers', () => {
    const buf = Buffer.alloc(1);
    buf.writeInt8(5.5, 0); // Floored to 5
    expect(buf[0]).toBe(5);
});

test('buffer.writeUInt8 should throw for negative numbers', () => {
    const buf = Buffer.alloc(1);
    expect(() => buf.writeUInt8(-3, 0)).toThrow(
        'The value of "value" is out of range. It must be >= 0 and <= 255. Received -3'
    );
});

test('hex of write{Uint,Int}{8,16,32}{LE,BE}', () => {
    const types = [ 'UInt', 'Int' ];
    const bitLengths = [ 8, 16, 32 ];
    const expectedReads = [ 3, 3, 3, 3, 3, -3, -3, -3, -3, -3 ];
    const expectedHex = [
        '03', '0300', '0003', '03000000', '00000003',
        'fd', 'fdff', 'fffd', 'fdffffff', 'fffffffd'
    ];

    // Loop through each type and bit length combination
    types.forEach(type => {
        bitLengths.forEach(bitLength => {
            const endianessOptions = bitLength === 8 ? [ '' ] : [ 'LE', 'BE' ];
            endianessOptions.forEach(endianess => {
                const buffer: any = Buffer.alloc(bitLength / 8);
                const writeMethod = `write${ type }${ bitLength }${ endianess }`;
                const value = type === 'Int' ? -3 : 3;

                // Write value to buffer
                buffer[writeMethod](value, 0);

                // Assert hex output
                expect(buffer.toString('hex')).toBe(expectedHex.shift());

                // Read value from buffer
                const readMethod = `read${ type }${ bitLength }${ endianess }`;
                expect(buffer[readMethod](0)).toBe(expectedReads.shift());
            });
        });
    });
});

test('large values do not improperly roll over (ref #80)', () => {
    const nums = [ -25589992, -633756690, -898146932 ];
    const buf = Buffer.alloc(12);
    buf.fill(0);

    nums.forEach((num, index) => {
        buf.writeInt32BE(num, index * 4);
        expect(buf.readInt32BE(index * 4)).toBe(num);
    });
});
