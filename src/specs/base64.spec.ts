/**
 * Imports
 */

import { Buffer } from '@providers/buffer.provider';

/**
 * Tests
 */

test('base64: ignore whitespace', () => {
    const text = '\n   YW9ldQ==  ';
    const buf = Buffer.from(text, 'base64');  // Assuming you're using Node.js Buffer
    expect(buf.toString()).toBe('aoeu');
});

test('base64: strings without padding', () => {
    expect(Buffer.from('YW9ldQ', 'base64').toString()).toBe('aoeu');
});

test('base64: newline in utf8 -- should not be an issue', () => {
    expect(
        Buffer.from('LS0tCnRpdGxlOiBUaHJlZSBkYXNoZXMgbWFya3MgdGhlIHNwb3QKdGFnczoK', 'base64').toString('utf8')
    ).toBe('---\ntitle: Three dashes marks the spot\ntags:\n');
});

test('base64: newline in base64 -- should get stripped', () => {
    expect(
        Buffer.from('LS0tCnRpdGxlOiBUaHJlZSBkYXNoZXMgbWFya3MgdGhlIHNwb3QKdGFnczoK\nICAtIHlhbWwKICAtIGZyb250LW1hdHRlcgogIC0gZGFzaGVzCmV4cGFuZWQt', 'base64').toString('utf8')
    ).toBe('---\ntitle: Three dashes marks the spot\ntags:\n  - yaml\n  - front-matter\n  - dashes\nexpaned-');
});

test('base64: tab characters in base64 - should get stripped', () => {
    expect(
        Buffer.from('LS0tCnRpdGxlOiBUaHJlZSBkYXNoZXMgbWFya3MgdGhlIHNwb3QKdGFnczoK\t\t\t\tICAtIHlhbWwKICAtIGZyb250LW1hdHRlcgogIC0gZGFzaGVzCmV4cGFuZWQt', 'base64').toString('utf8')
    ).toBe('---\ntitle: Three dashes marks the spot\ntags:\n  - yaml\n  - front-matter\n  - dashes\nexpaned-');
});

test('base64: invalid non-alphanumeric characters -- should be stripped', () => {
    expect(
        Buffer.from('!"#$%&\'()*,.:;<=>?@[\\]^`{|}~', 'base64').toString('utf8')
    ).toBe('');
});

test('base64: high byte', () => {
    const highByte = Buffer.from([ 128 ]);
    expect(Buffer.alloc(1, highByte.toString('base64'), 'base64')).toEqual(highByte);
});
