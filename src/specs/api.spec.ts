/**
 * Imports
 */

import { Buffer } from '@providers/buffer.provider';

/**
 * Tests
 */

test('buffer.toJSON', () => {
    const data = [ 1, 2, 3, 4 ];
    const buffer = Buffer.from(data);
    expect(buffer.toJSON()).toEqual({ type: 'Buffer', data: [ 1, 2, 3, 4 ] });
});

test('buffer.copy', () => {
    const buf1 = Buffer.alloc(26);
    const buf2 = Buffer.alloc(26);

    for (let i = 0; i < 26; i++) {
        buf1[i] = i + 97; // ASCII a-z
        buf2[i] = 33; // ASCII !
    }

    buf1.copy(buf2, 8, 16, 20);

    expect(buf2.toString('ascii', 0, 25)).toBe('!!!!!!!!qrst!!!!!!!!!!!!!');
});

test('test offset returns are correct', () => {
    const b = Buffer.alloc(16);
    expect(b.writeUInt32LE(0, 0)).toBe(4);
    expect(b.writeUInt16LE(0, 4)).toBe(6);
    expect(b.writeUInt8(0, 6)).toBe(7);
    expect(b.writeInt8(0, 7)).toBe(8);
    expect(b.writeDoubleLE(0, 8)).toBe(16);
});

test('concat() a varying number of buffers', () => {
    const zero: Buffer[] = [];
    const one = [ Buffer.from('asdf') ];
    const long: Buffer[] = Array(10).fill(Buffer.from('asdf'));

    const flatZero = Buffer.concat(zero);
    const flatOne = Buffer.concat(one);
    const flatLong = Buffer.concat(long);
    const flatLongLen = Buffer.concat(long, 40);

    expect(flatZero.length).toBe(0);
    expect(flatOne.toString()).toBe('asdf');
    expect(flatOne).toEqual(one[0]);
    expect(flatLong.toString()).toBe('asdf'.repeat(10));
    expect(flatLongLen.toString()).toBe('asdf'.repeat(10));
});

test('concat() works on Uint8Array instances', () => {
    const result = Buffer.concat([ new Uint8Array([ 1, 2 ]), new Uint8Array([ 3, 4 ]) ]);
    const expected = Buffer.from([ 1, 2, 3, 4 ]);
    expect(result).toEqual(expected);
});

test('concat() works on Uint8Array instances for smaller provided totalLength', () => {
    const result = Buffer.concat([ new Uint8Array([ 1, 2 ]), new Uint8Array([ 3, 4 ]) ], 3);
    const expected = Buffer.from([ 1, 2, 3 ]);
    expect(result).toEqual(expected);
});

test('fill', () => {
    const b = Buffer.alloc(10);
    b.fill(2);
    expect(b.toString('hex')).toBe('02020202020202020202');
});

test('fill (string)', () => {
    const b = Buffer.alloc(10);
    b.fill('abc');
    expect(b.toString()).toBe('abcabcabca');
    b.fill('է');
    expect(b.toString()).toBe('էէէէէ');
});

test('copy() empty buffer with sourceEnd=0', () => {
    const source = Buffer.from([ 42 ]);
    const destination = Buffer.from([ 43 ]);
    source.copy(destination, 0, 0, 0);

    expect(destination.readUInt8(0)).toBe(43);
});

test('copy() after slice()', () => {
    const source = Buffer.alloc(200);
    const dest = Buffer.alloc(200);
    const expected = Buffer.alloc(200);

    for (let i = 0; i < 200; i++) {
        source[i] = i;
        dest[i] = 0;
    }

    source.slice(2).copy(dest);
    source.copy(expected, 0, 2);
    expect(dest).toEqual(expected);
});

test('copy() ascending', () => {
    const b = Buffer.from('abcdefghij');
    b.copy(b, 0, 3, 10);
    expect(b.toString()).toBe('defghijhij');
});

test('copy() descending', () => {
    const b = Buffer.from('abcdefghij');
    b.copy(b, 3, 0, 7);
    expect(b.toString()).toBe('abcabcdefg');
});

test('buffer.slice sets indexes', () => {
    expect(Buffer.from('hallo').slice(0, 5).toString()).toBe('hallo');
});

test('buffer.slice out of range', () => {
    const buffer = Buffer.from('hallo');
    expect(buffer.slice(0, 10).toString()).toBe('hallo');
    expect(buffer.slice(10, 2).toString()).toBe('');
});
