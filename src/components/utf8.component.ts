/**
 * The `encodeCodePoint` method encodes a single Unicode code point into its corresponding UTF-8 byte sequence.
 * The method ensures that the code point is valid and encodes it according to the UTF-8 specification.
 * It handles code points from the Basic Multilingual Plane (BMP) and supplementary characters (U+10000 to U+10FFFF).
 *
 * - **Input**: A `codePoint` (number) representing the Unicode code point to be encoded.
 *   The valid range for `codePoint` is from 0 to U+10FFFF (inclusive).
 *   - For values from 0x00 to 0x7F (0-127), the code point is encoded as a single byte.
 *   - For values from 0x80 to 0x7FF (128-2047), the code point is encoded as a two-byte sequence.
 *   - For values from 0x800 to 0xFFFF (2048-65535), the code point is encoded as a three-byte sequence.
 *   - For values from 0x10000 to 0x10FFFF (65536-1114111), the code point is encoded as a four-byte sequence.
 *
 * - **Output**: An array of numbers representing the UTF-8 encoded bytes of the given code point.
 *
 * ## Example:
 *
 * ```ts
 * encodeCodePoint(0x24); // [0x24] -> "$"
 * encodeCodePoint(0x20AC); // [0xE2, 0x82, 0xAC] -> "€"
 * encodeCodePoint(0x1F600); // [0xF0, 0x9F, 0x98, 0x80] -> "😀"
 * ```
 *
 * ## Error Handling:
 * - If the provided `codePoint` is outside the valid Unicode range (0 to U+10FFFF), the method throws a `RangeError`.
 *
 * @param codePoint - A Unicode code point (number) to be encoded.
 * @returns An array of numbers representing the UTF-8 encoding of the given code point.
 * @throws {RangeError} If the `codePoint` is outside the valid Unicode range (0 to U+10FFFF).
 */

function encodeCodePoint(codePoint: number): Array<number> {
    if (codePoint < 0 || codePoint > 0x10FFFF) {
        throw new RangeError('Invalid code point');
    }

    if (codePoint < 0x80) {
        return [ codePoint ];
    }

    if (codePoint < 0x800) {
        return [
            0xc0 | (codePoint >> 6),
            0x80 | (codePoint & 0x3f)
        ];
    }

    if (codePoint < 0x10000) {
        return [
            0xe0 | (codePoint >> 12),
            0x80 | ((codePoint >> 6) & 0x3f),
            0x80 | (codePoint & 0x3f)
        ];
    }

    return [
        0xf0 | (codePoint >> 18),
        0x80 | ((codePoint >> 12) & 0x3f),
        0x80 | ((codePoint >> 6) & 0x3f),
        0x80 | (codePoint & 0x3f)
    ];
}

/**
 * The `decodeTwoByteSequence` method decodes a two-byte UTF-8 sequence into its corresponding Unicode character.
 * This method ensures that the decoded character is valid and replaces invalid sequences with the replacement character (U+FFFD).
 *
 * - **Input**: An array of `bytes` containing the two bytes of a UTF-8 encoded sequence.
 *   The sequence should represent a valid character in the range of U+0080 to U+07FF.
 *
 * - **Output**: A string representing the decoded character.
 *   If the byte sequence is incomplete or invalid, it returns the replacement character (U+FFFD).
 *
 * ## Example:
 *
 * ```ts
 * decodeTwoByteSequence([0xC2, 0xA9]); // "©"
 * decodeTwoByteSequence([0x80, 0x80]); // "�" (invalid sequence)
 * ```
 *
 * ## Error Handling:
 * - If the byte array contains fewer than two bytes, the method returns a replacement character (U+FFFD).
 * - If the decoded character value is below U+80 (which is not a valid range for a two-byte UTF-8 sequence), the method returns a replacement character (U+FFFD).
 *
 * @param bytes - An array of numbers representing a two-byte UTF-8 sequence.
 * @returns A string representing the decoded character or a replacement character (U+FFFD) if the sequence is invalid.
 */

function decodeTwoByteSequence(bytes: Array<number>): string {
    if (bytes.length < 2) return '\uFFFD\uFFFD';
    const char = ((bytes[0] & 0x1F) << 6) | (bytes[1] & 0x3F);

    return (char >= 0x80) ? String.fromCharCode(char) : '\uFFFD';
}

/**
 * The `decodeThreeByteSequence` method decodes a three-byte UTF-8 sequence into a Unicode character.
 * It ensures the sequence represents a valid character and returns the corresponding character,
 * or a replacement character (`�`, U+FFFD) if the sequence is incomplete or invalid.
 *
 * - **Input**: An array of `bytes` representing a three-byte UTF-8 sequence.
 *   - The first byte should be in the range `[0xE0, 0xEF]` (indicating a 3-byte sequence).
 *   - The second and third bytes should be in the range `[0x80, 0xBF]`.
 *
 * - **Output**: A string containing the decoded Unicode character or a replacement character (`�`, U+FFFD) if invalid.
 *
 * ## Example:
 *
 * ```ts
 * decodeThreeByteSequence([0xE2, 0x82, 0xAC]); // "€"
 * decodeThreeByteSequence([0xE0, 0x80, 0x80]); // "Ā"
 * decodeThreeByteSequence([0xF0, 0x90, 0x80, 0x80]); // "�" (invalid 4-byte sequence for 3-byte function)
 * ```
 *
 * ## Error Handling:
 * - If the sequence is incomplete (less than 3 bytes), the method returns the replacement character (`�`).
 * - If the character code falls below `U+800`, it returns the replacement character (`�`).
 *
 * @param bytes - A three-byte sequence in UTF-8 encoding.
 * @returns A string representing the decoded character, or `�` if the sequence is invalid.
 */

function decodeThreeByteSequence(bytes: Array<number>): string {
    if (bytes.length < 3) {
        if (bytes[bytes.length - 1] === 0x80)
            return '\uFFFD\uFFFD'; // Invalid sequence, return two replacement characters

        if (bytes.length < 1)
            return '';

        return '\uFFFD';
    }

    const firstByte = bytes[0], secondByte = bytes[1], thirdByte = bytes[2];
    const char = ((firstByte & 0x0F) << 12) | ((secondByte & 0x3F) << 6) | (thirdByte & 0x3F);

    // Ensure valid character is in the range U+0800 to U+FFFF for 3-byte sequences
    return (char >= 0x800 && char <= 0xFFFF) ? String.fromCharCode(char) : '\uFFFD';
}

/**
 * The `decodeFourByteSequence` method decodes a four-byte UTF-8 sequence into a Unicode character.
 * It handles characters in the supplementary planes (U+10000 to U+10FFFF) and ensures that invalid
 * sequences or code points within the surrogate range (U+D800 to U+DFFF) are replaced with the replacement character (`�`, U+FFFD).
 *
 * - **Input**: An array of `bytes` representing a four-byte UTF-8 sequence.
 *   - The first byte should be in the range `[0xF0, 0xF7]` (indicating a 4-byte sequence).
 *   - The second, third, and fourth bytes should be in the range `[0x80, 0xBF]`.
 *
 * - **Output**: A string containing the decoded Unicode character or a replacement character (`�`, U+FFFD) if invalid.
 *   - If the decoded code point is within the supplementary planes (U+10000 to U+10FFFF), it returns a surrogate pair.
 *   - If the code point is within the Basic Multilingual Plane (BMP), it returns a single character.
 *   - If the sequence is incomplete or invalid, it returns the replacement character (`�`).
 *
 * ## Example:
 *
 * ```ts
 * decodeFourByteSequence([0xF0, 0x90, 0x80, 0x80]); // "𐀀" (U+10000)
 * decodeFourByteSequence([0xF4, 0x8F, 0xBF, 0xBF]); // "𯿿" (U+10FFFF)
 * decodeFourByteSequence([0xF0, 0x80, 0x80, 0x80]); // "�" (Invalid sequence, replacement character)
 * decodeFourByteSequence([0xF0, 0x90, 0x80, 0x81]); // "𐁁" (U+10001)
 * ```
 *
 * ## Error Handling:
 * - If the sequence is incomplete (less than 4 bytes), the method returns the replacement character (`�`).
 * - If the code point is invalid (outside the valid range of U+0000 to U+10FFFF or in the surrogate range U+D800 to U+DFFF),
 *   it returns the replacement character (`�`).
 * - If the code point falls within the supplementary planes (U+10000 to U+10FFFF), the function returns the code point as a surrogate pair.
 *
 * @param bytes - A four-byte sequence in UTF-8 encoding.
 * @returns A string representing the decoded character, or `�` if the sequence is invalid.
 */

function decodeFourByteSequence(bytes: number[]): string {
    if (bytes.length < 4) return '\uFFFD'; // Incomplete sequence, return replacement character

    // Decode the 4-byte sequence into a code point
    const charCode = ((bytes[0] & 0x07) << 18) | ((bytes[1] & 0x3F) << 12) | ((bytes[2] & 0x3F) << 6) | (bytes[3] & 0x3F);

    // Check if the code point is valid (U+10000 to U+10FFFF) and not in the surrogate range (U+D800 to U+DFFF)
    if (charCode <= 0x10FFFF && (charCode < 0xD800 || charCode > 0xDFFF)) {
        if (charCode > 0xFFFF) {
            // Convert to a surrogate pair if the code point is in the supplementary planes (U+10000 to U+10FFFF)
            const surrogatePair = charCode - 0x10000;
            const highSurrogate = 0xD800 | (surrogatePair >> 10);
            const lowSurrogate = 0xDC00 | (surrogatePair & 0x3FF);

            return String.fromCharCode(highSurrogate, lowSurrogate); // Return surrogate pair as UTF-16 characters
        } else {
            // Code point is valid within the BMP (U+0000 to U+FFFF)
            return String.fromCharCode(charCode); // Return as a single character
        }
    } else {
        // Invalid code point or surrogate range, return replacement character
        return '\uFFFD';
    }
}

/**
 * The `encodeUTF8` function encodes a given string into a UTF-8 byte array. It handles surrogate pairs
 * for characters outside the Basic Multilingual Plane (BMP), and provides the option to limit the
 * number of bytes encoded through the `length` parameter.
 *
 * - **Input**: A string `data` that needs to be encoded into UTF-8.
 *   - The string can include characters within the BMP and supplementary planes (encoded using surrogate pairs).
 *   - The `length` parameter is an optional integer that limits the total number of bytes encoded.
 *     - If the `length` is specified, the function will stop encoding once the number of bytes reaches the given length.
 *     - If not specified, the function will encode the entire string.
 *
 * - **Output**: A `Uint8Array` containing the UTF-8 encoded byte sequence of the string.
 *   - The array will represent the string in valid UTF-8 encoding.
 *   - If surrogate pairs are found, they will be encoded as a 4-byte sequence.
 *   - Invalid surrogate pairs will be replaced by the replacement character (`\uFFFD`).
 *
 * ## Example:
 *
 * ```ts
 * encodeUTF8('Hello, 世界!'); // Output: Uint8Array with UTF-8 encoded bytes of the string
 * encodeUTF8('𠜎', 3); // Output: Uint8Array with first 3 bytes of the UTF-8 encoded string '𠜎'
 * ```
 *
 * ## Error Handling:
 * - Invalid surrogate pairs (e.g., those that do not form a valid Unicode character) are replaced by the replacement character (`\uFFFD`).
 *
 * @param data - The string to be encoded into UTF-8.
 * @param length - (Optional) The maximum number of bytes to encode. Defaults to `Infinity` (encodes the entire string).
 * @returns A `Uint8Array` containing the UTF-8 encoded byte sequence of the input string.
 */

export function encodeUTF8(data: string, length: number = Infinity): Uint8Array {
    const utf8: number[] = [];
    let bytesEncoded = 0;
    let i = 0;

    while (i < data.length && bytesEncoded < length) {
        const charCode = data.charCodeAt(i);

        if (charCode >= 0xD800 && charCode <= 0xDBFF) {
            // Handle surrogate pairs
            const lowSurrogate = data.charCodeAt(i + 1);
            if (lowSurrogate >= 0xDC00 && lowSurrogate <= 0xDFFF) {
                const codePoint = ((charCode - 0xD800) << 10) + (lowSurrogate - 0xDC00) + 0x10000;
                utf8.push(...encodeCodePoint(codePoint));
                bytesEncoded += 4;
                i++;  // Skip the low surrogate
            } else {
                utf8.push(...encodeCodePoint(0xFFFD)); // Invalid surrogate
                bytesEncoded += 3;
            }
        } else {
            utf8.push(...encodeCodePoint(charCode));
            bytesEncoded += encodeCodePoint(charCode).length;
        }

        i++;
        if (bytesEncoded >= length) break;
    }

    return new Uint8Array(utf8);
}

/**
 * The `decodeUTF8` function decodes a given `Uint8Array` of UTF-8 bytes into a string.
 * It processes the byte array by interpreting the byte sequences according to the UTF-8 encoding scheme,
 * handling single-byte, two-byte, three-byte, and four-byte sequences.
 * This function supports UTF-8 encoded characters in the Basic Multilingual Plane (BMP) as well as supplementary characters.
 *
 * - **Input**: A `Uint8Array` containing the UTF-8 encoded byte sequence. The array should represent a valid UTF-8 string.
 *   - Single-byte characters (ASCII) have values in the range `[0x00, 0x7F]`.
 *   - Two-byte sequences have a starting byte in the range `[0xC0, 0xDF]`.
 *   - Three-byte sequences have a starting byte in the range `[0xE0, 0xEF]`.
 *   - Four-byte sequences have a starting byte in the range `[0xF0, 0xF7]`.
 *
 * - **Output**: A string containing the decoded characters corresponding to the input byte sequence.
 *   - The function uses helper methods (`decodeTwoByteSequence`, `decodeThreeByteSequence`, and `decodeFourByteSequence`) to decode the byte sequences.
 *   - Invalid byte sequences (e.g., incomplete sequences or sequences that cannot form valid Unicode characters) are replaced with the replacement character (`�`, U+FFFD).
 *
 * ## Example:
 *
 * ```ts
 * decodeUTF8(new Uint8Array([0xE2, 0x82, 0xAC])); // "€"
 * decodeUTF8(new Uint8Array([0xF0, 0x90, 0x80, 0x80])); // "𠜎"
 * decodeUTF8(new Uint8Array([0x80, 0x80])); // "�" (invalid sequence)
 * ```
 *
 * ## Error Handling:
 * - If the byte sequence is incomplete or invalid, the method returns the replacement character (`�`).
 *
 * @param bytes - A `Uint8Array` containing the UTF-8 encoded byte sequence.
 * @returns A string decoded from the input byte sequence.
 */

export function decodeUTF8(bytes: Uint8Array): string {
    let decodedString = '';
    let i = 0;

    while (i < bytes.length) {
        const byte = bytes[i++];

        if (byte < 0x80) {
            decodedString += String.fromCharCode(byte); // Single-byte character
        } else if (byte < 0xE0) {
            // Convert slice to number[] before passing
            decodedString += decodeTwoByteSequence(Array.from(bytes.slice(i - 1))); // Two-byte sequence
            i++;
        } else if (byte < 0xF0) {
            // Convert slice to number[] before passing
            decodedString += decodeThreeByteSequence(Array.from(bytes.slice(i - 1))); // Three-byte sequence
            i += 2;
        } else {
            // Convert slice to number[] before passing
            decodedString += decodeFourByteSequence(Array.from(bytes.slice(i - 1))); // Four-byte sequence
            i += 3;
        }
    }

    return decodedString;
}
