/**
 * Imports
 */

import { Buffer } from '@providers/buffer.provider';

/**
 * Tests
 */

test('detect utf16 surrogate pairs', () => {
    const text = '\uD83D\uDE38' + '\uD83D\uDCAD' + '\uD83D\uDC4D';
    const buf = Buffer.from(text);
    expect(buf.toString()).toBe(text);
});

test('detect utf16 surrogate pairs over U+20000 until U+10FFFF', () => {
    const text = '\uD842\uDFB7' + '\uD93D\uDCAD' + '\uDBFF\uDFFF';
    const buf = Buffer.from(text);
    expect(buf.toString()).toBe(text);
});

test('replace orphaned utf16 surrogate lead code point', () => {
    const text = '\uD83D\uDE38' + '\uD83D' + '\uD83D\uDC4D';
    const buf = Buffer.from(text);
    expect(buf).toEqual(Buffer.from([ 0xf0, 0x9f, 0x98, 0xb8, 0xef, 0xbf, 0xbd, 0xf0, 0x9f, 0x91, 0x8d ]));
});

test('replace orphaned utf16 surrogate trail code point', () => {
    const text = '\uD83D\uDE38' + '\uDCAD' + '\uD83D\uDC4D';
    const buf = Buffer.from(text);
    expect(buf).toEqual(Buffer.from([ 0xf0, 0x9f, 0x98, 0xb8, 0xef, 0xbf, 0xbd, 0xf0, 0x9f, 0x91, 0x8d ]));
});

test('do not write partial utf16 code units', () => {
    const f = Buffer.from([ 0, 0, 0, 0, 0 ]);
    expect(f.length).toBe(5);
    const size = f.write('あいうえお', 'utf16le');
    expect(size).toBe(4);
    expect(f).toEqual(Buffer.from([ 0x42, 0x30, 0x44, 0x30, 0x00 ]));
});

test('handle partial utf16 code points when encoding to utf8 the way node does', () => {
    const text = '\uD83D\uDE38' + '\uD83D\uDC4D';

    let buf = Buffer.alloc(8);
    buf.write(text);
    expect(buf).toEqual(Buffer.from([ 0xf0, 0x9f, 0x98, 0xb8, 0xf0, 0x9f, 0x91, 0x8d ]));

    buf = Buffer.alloc(7);
    buf.write(text);
    expect(buf).toEqual(Buffer.from([ 0xf0, 0x9f, 0x98, 0xb8, 0x00, 0x00, 0x00 ]));

    buf = Buffer.alloc(6);
    buf.write(text);
    expect(buf).toEqual(Buffer.from([ 0xf0, 0x9f, 0x98, 0xb8, 0x00, 0x00 ]));

    buf = Buffer.alloc(5);
    buf.write(text);
    expect(buf).toEqual(Buffer.from([ 0xf0, 0x9f, 0x98, 0xb8, 0x00 ]));

    buf = Buffer.alloc(4);
    buf.write(text);
    expect(buf).toEqual(Buffer.from([ 0xf0, 0x9f, 0x98, 0xb8 ]));

    buf = Buffer.alloc(3);
    buf.write(text);
    expect(buf).toEqual(Buffer.from([ 0x00, 0x00, 0x00 ]));

    buf = Buffer.alloc(2);
    buf.write(text);
    expect(buf).toEqual(Buffer.from([ 0x00, 0x00 ]));

    buf = Buffer.alloc(1);
    buf.write(text);
    expect(buf).toEqual(Buffer.from([ 0x00 ]));
});

test('handle invalid utf16 code points when encoding to utf8 the way node does', () => {
    const text = 'a' + '\uDE38\uD83D' + 'b';

    let buf = Buffer.alloc(8);
    buf.write(text);
    expect(buf).toEqual(Buffer.from([ 0x61, 0xef, 0xbf, 0xbd, 0xef, 0xbf, 0xbd, 0x62 ]));

    buf = Buffer.alloc(7);
    buf.write(text);
    expect(buf).toEqual(Buffer.from([ 0x61, 0xef, 0xbf, 0xbd, 0xef, 0xbf, 0xbd ]));

    buf = Buffer.alloc(6);
    buf.write(text);
    expect(buf).toEqual(Buffer.from([ 0x61, 0xef, 0xbf, 0xbd, 0x00, 0x00 ]));

    buf = Buffer.alloc(5);
    buf.write(text);
    expect(buf).toEqual(Buffer.from([ 0x61, 0xef, 0xbf, 0xbd, 0x00 ]));

    buf = Buffer.alloc(4);
    buf.write(text);
    expect(buf).toEqual(Buffer.from([ 0x61, 0xef, 0xbf, 0xbd ]));

    buf = Buffer.alloc(3);
    buf.write(text);
    expect(buf).toEqual(Buffer.from([ 0x61, 0x00, 0x00 ]));

    buf = Buffer.alloc(2);
    buf.write(text);
    expect(buf).toEqual(Buffer.from([ 0x61, 0x00 ]));

    buf = Buffer.alloc(1);
    buf.write(text);
    expect(buf).toEqual(Buffer.from([ 0x61 ]));
});
