/**
 * Imports
 */

import { Buffer } from '@providers/buffer.provider';

/**
 * Tests
 */

test('buffer.compare', () => {
    const b = Buffer.from('a', 'utf8'); // Create Buffer from string 'a'
    const c = Buffer.from('c', 'utf8'); // Create Buffer from string 'c'
    const d = Buffer.from('aa', 'utf8'); // Create Buffer from string 'aa'

    expect(b.compare(c)).toBe(-1);
    expect(c.compare(d)).toBe(1);
    expect(d.compare(b)).toBe(1);
    expect(b.compare(d)).toBe(-1);

    // static method
    expect(Buffer.compare(b, c)).toBe(-1);
    expect(Buffer.compare(c, d)).toBe(1);
    expect(Buffer.compare(d, b)).toBe(1);
    expect(Buffer.compare(b, d)).toBe(-1);
});

test('buffer.compare argument validation', () => {
    expect(() => {
        const b = Buffer.from('a');
        Buffer.compare(b, <any> 'abc');
    }).toThrowError();

    expect(() => {
        const b = Buffer.from('a');
        Buffer.compare(<any> 'abc', b);
    }).toThrowError();

    expect(() => {
        const b = Buffer.from('a');
        b.compare(<any> 'abc');
    }).toThrowError();
});

test('buffer.equals', () => {
    const b = Buffer.from('abcdf', 'utf8');
    const c = Buffer.from('abcdf', 'utf8');
    const d = Buffer.from('abcde', 'utf8');
    const e = Buffer.from('abcdef', 'utf8');

    expect(b.equals(c)).toBe(true);
    expect(c.equals(d)).toBe(false);
    expect(d.equals(e)).toBe(false);
});

test('buffer.equals argument validation', () => {
    expect(() => {
        const b = Buffer.from('a');
        b.equals(<any> 'abc');
    }).toThrowError();
});
