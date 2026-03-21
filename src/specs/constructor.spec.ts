/**
 * Imports
 */

import { Buffer } from '@providers/buffer.provider';

/**
 * Tests
 */

test('new buffer from array', () => {
    const buf = Buffer.from([ 1, 2, 3 ]);
    expect(buf.toString()).toBe('\u0001\u0002\u0003');
});

test('new buffer from array w/ negatives', () => {
    const buf = Buffer.from([ -1, -2, -3 ]);
    expect(buf.toString('hex')).toBe('fffefd');
});

test('new buffer from array with mixed signed input', () => {
    const buf = Buffer.from([ -255, 255, -128, 128, 512, -512, 511, -511 ]);
    expect(buf.toString('hex')).toBe('01ff80800000ff01');
});

test('new buffer from string', () => {
    const buf = Buffer.from('hey', 'utf8');
    expect(buf.toString()).toBe('hey');
});

test('new buffer from buffer', () => {
    const b1 = Buffer.from('asdf');
    const b2 = Buffer.from(b1);
    expect(b1.toString('hex')).toBe(b2.toString('hex'));
});

test('new buffer from ArrayBuffer', () => {
    if (typeof ArrayBuffer !== 'undefined') {
        const arraybuffer = new Uint8Array([ 0, 1, 2, 3 ]).buffer;
        const buf = Buffer.from(arraybuffer);
        expect(buf.length).toBe(4);
        expect(buf[0]).toBe(0);
        expect(buf[1]).toBe(1);
        expect(buf[2]).toBe(2);
        expect(buf[3]).toBe(3);
        expect(buf[4]).toBeUndefined();
    }
});

test('new buffer from ArrayBuffer, shares memory', () => {
    const u = new Uint8Array([ 0, 1, 2, 3 ]);
    const arraybuffer = u.buffer;
    const buf = Buffer.from(arraybuffer);
    expect(buf.length).toBe(4);
    expect(buf[0]).toBe(0);
    expect(buf[1]).toBe(1);
    expect(buf[2]).toBe(2);
    expect(buf[3]).toBe(3);
    expect(buf[4]).toBeUndefined();

    // changing the Uint8Array (and thus the ArrayBuffer), changes the Buffer
    u[0] = 10;
    expect(buf[0]).toBe(10);
    u[1] = 11;
    expect(buf[1]).toBe(11);
    u[2] = 12;
    expect(buf[2]).toBe(12);
    u[3] = 13;
    expect(buf[3]).toBe(13);
});

test('new buffer from Uint8Array', () => {
    if (typeof Uint8Array !== 'undefined') {
        const b1 = new Uint8Array([ 0, 1, 2, 3 ]);
        const b2 = Buffer.from(b1);
        expect(b1.length).toBe(b2.length);
        expect(b1[0]).toBe(0);
        expect(b1[1]).toBe(1);
        expect(b1[2]).toBe(2);
        expect(b1[3]).toBe(3);
        expect(b1[4]).toBeUndefined();
    }
});

test('new buffer from Uint16Array', () => {
    if (typeof Uint16Array !== 'undefined') {
        const b1 = new Uint16Array([ 0, 1, 2, 3 ]);
        const b2 = Buffer.from(b1);
        expect(b1.length).toBe(b2.length);
        expect(b1[0]).toBe(0);
        expect(b1[1]).toBe(1);
        expect(b1[2]).toBe(2);
        expect(b1[3]).toBe(3);
        expect(b1[4]).toBeUndefined();
    }
});

test('new buffer from Uint32Array', () => {
    if (typeof Uint32Array !== 'undefined') {
        const b1 = new Uint32Array([ 0, 1, 2, 3 ]);
        const b2 = Buffer.from(b1);
        expect(b1.length).toBe(b2.length);
        expect(b1[0]).toBe(0);
        expect(b1[1]).toBe(1);
        expect(b1[2]).toBe(2);
        expect(b1[3]).toBe(3);
        expect(b1[4]).toBeUndefined();
    }
});
