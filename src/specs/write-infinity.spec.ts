/**
 * Imports
 */

import { Buffer } from '@providers/buffer.provider';

/**
 * Tests
 */

// Test for writing and reading Infinity as a float
test('write/read Infinity as a float', () => {
    const buf = Buffer.alloc(4);
    expect(buf.writeFloatBE(Infinity, 0)).toBe(4);
    expect(buf.readFloatBE(0)).toBe(Infinity);
});

// Test for writing and reading -Infinity as a float
test('write/read -Infinity as a float', () => {
    const buf = Buffer.alloc(4);
    expect(buf.writeFloatBE(-Infinity, 0)).toBe(4);
    expect(buf.readFloatBE(0)).toBe(-Infinity);
});

// Test for writing and reading Infinity as a double
test('write/read Infinity as a double', () => {
    const buf = Buffer.alloc(8);
    expect(buf.writeDoubleBE(Infinity, 0)).toBe(8);
    expect(buf.readDoubleBE(0)).toBe(Infinity);
});

// Test for writing and reading -Infinity as a double
test('write/read -Infinity as a double', () => {
    const buf = Buffer.alloc(8);
    expect(buf.writeDoubleBE(-Infinity, 0)).toBe(8);
    expect(buf.readDoubleBE(0)).toBe(-Infinity);
});

// Test for writing and reading a float greater than max (should return Infinity)
test('write/read float greater than max', () => {
    const buf = Buffer.alloc(4);
    expect(buf.writeFloatBE(4e38, 0)).toBe(4);
    expect(buf.readFloatBE(0)).toBe(Infinity);
});

// Test for writing and reading a float less than min (should return -Infinity)
test('write/read float less than min', () => {
    const buf = Buffer.alloc(4);
    expect(buf.writeFloatBE(-4e40, 0)).toBe(4);
    expect(buf.readFloatBE(0)).toBe(-Infinity);
});
