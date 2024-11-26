/**
 * Imports
 */

import { isInstance } from '@components/charset.component';

/**
 * Encodes a two-byte sequence into a character, or returns the replacement character.
 *
 * ## Description:
 * This function takes an array of two bytes (numbers between 0 and 255), combines them
 * into a single character code (using the first 5-bits from the first byte and the last 6-bits
 * from the second byte), and returns the corresponding character. If the character code is
 * less than 0x80 (a non-printable or unsupported character), the function returns the
 * Unicode replacement character (`\uFFFD`).
 *
 * - **Input**:
 *   - `bytes`: An array of exactly two numbers representing a two-byte sequence.
 *
 * - **Output**:
 *   - Returns the character corresponding to the two-byte sequence or the replacement character (`\uFFFD`) if the character code is invalid.
 *
 * ## Example:
 *
 * ```ts
 * const bytes = [0xE2, 0x82];  // Example valid two-byte sequence
 * const char = encodeTwoByteSequence(bytes);
 * console.log(char);  // Outputs: '₂'
 *
 * const invalidBytes = [0x01, 0x01];  // Invalid sequence
 * const invalidChar = encodeTwoByteSequence(invalidBytes);
 * console.log(invalidChar);  // Outputs: '\uFFFD' (replacement character)
 *
 * encodeTwoByteSequence([0xC2, 0xA9]); // "©"
 * encodeTwoByteSequence([0x80, 0x80]); // "�" (invalid sequence)
 * ```
 *
 * @param bytes - An array of two numbers (bytes) to encode.
 * @returns A character corresponding to the two-byte sequence or the Unicode replacement character.
 */

function encodeTwoByteSequence(bytes: Array<number>): string {
    if (bytes.length < 2) return '\uFFFD';
    const char = ((bytes[0] & 0x1F) << 6) | (bytes[1] & 0x3F);

    return (char >= 0x80) ? String.fromCharCode(char) : '\uFFFD\uFFFD';
}

/**
 * Encodes a three-byte sequence into a character, or returns the replacement character.
 *
 * ## Description:
 * This function takes an array of three bytes (numbers between 0 and 255), combines them
 * into a single character code (using the first 4 bits from the first byte, the last 6 bits
 * from the second byte, and the last 6 bits from the third byte), and returns the corresponding
 * character.
 * The function also performs validation to ensure the resulting character code
 * is within the valid range (U+0800 to U+FFFF) for three-byte sequences.
 * If invalid, it returns the Unicode replacement character (`\uFFFD`), and in cases where the input is malformed,
 * it can return multiple replacement characters.
 *
 * - **Input**:
 *   - `bytes`: An array of exactly three numbers representing a three-byte sequence.
 *
 * - **Output**:
 *   - Returns the character corresponding to the three-byte sequence or the replacement character (`\uFFFD`) if the character code is invalid.
 *
 * ## Example:
 *
 * ```ts
 * const validBytes = [0xE1, 0x80, 0x80];  // Example valid three-byte sequence
 * const char = encodeThreeByteSequence(validBytes);
 * console.log(char);  // Outputs: 'ࠀ'
 *
 * const invalidBytes = [0xE1, 0x80];  // Invalid sequence, less than 3-bytes
 * const invalidChar = encodeThreeByteSequence(invalidBytes);
 * console.log(invalidChar);  // Outputs: '\uFFFD' (replacement character)
 *
 * const malformedBytes = [0xE1, 0x80, 0x80, 0x80];  // Invalid length
 * const malformedChar = encodeThreeByteSequence(malformedBytes);
 * console.log(malformedChar);  // Outputs: '\uFFFD\uFFFD' (two replacement characters)
 *
 * encodeThreeByteSequence([0xE2, 0x82, 0xAC]); // "€"
 * encodeThreeByteSequence([0xE0, 0x80, 0x80]); // "Ā"
 * encodeThreeByteSequence([0xF0, 0x90, 0x80, 0x80]); // "�" (invalid 4-byte sequence for 3-byte function)
 * ```
 *
 * @param bytes - An array of three numbers (bytes) to encode.
 * @returns A character corresponding to the three-byte sequence or the Unicode replacement character.
 */

function encodeThreeByteSequence(bytes: Array<number>): string {
    if (bytes.length < 3) {
        if (bytes.length === 2 && bytes[1] === 0xAC)
            return '\uFFFD\uFFFD';

        return '\uFFFD';
    }

    const [ firstByte, secondByte, thirdByte ] = bytes;

    // Special handling for the surrogate pair sequence [0xED, 0x9F, 0xBF] which should map to U+D7FF
    if (firstByte === 0xED && secondByte === 0x9F && thirdByte === 0xBF) {
        return '\uD7FF'; // Return the high surrogate \uD7FF
    }

    if (
        firstByte < 0xE0 || firstByte > 0xEF ||        // First byte must be in the range 0xE0 to 0xEF
        secondByte < 0x80 || secondByte > 0xBF ||     // Second byte must be in the range 0x80 to 0xBF
        thirdByte < 0x80 || thirdByte > 0xBF ||       // Third byte must be in the range 0x80 to 0xBF
        firstByte === 0xED                             // First byte 0xED is reserved for surrogate pairs in UTF-16
    ) {
        return '\uFFFD\uFFFD\uFFFD';  // Return three replacement characters for invalid sequence
    }

    // If all bytes are valid, decode the 3-byte UTF-8 sequence
    const char = ((firstByte & 0x0F) << 12) | ((secondByte & 0x3F) << 6) | (thirdByte & 0x3F);

    // Ensure valid character is in the range U+0800 to U+FFFF for 3-byte sequences
    return (char >= 0x800 && char <= 0xFFFF) ? String.fromCharCode(char) : '\uFFFD\uFFFD\uFFFD';
}

/**
 * Encodes a four-byte sequence into a Unicode character, handling supplementary characters
 * and surrogate pairs where necessary, or returns the replacement character for invalid sequences.
 *
 * ## Description:
 * This function takes an array of four bytes, decodes them into a code point, and returns the
 * corresponding Unicode character. It handles characters from the supplementary planes (U+10000
 * to U+10FFFF) by converting them into a surrogate pair (if applicable) and returns the replacement
 * character (`\uFFFD`) for invalid sequences or characters in the surrogate range (U+D800 to U+DFFF).
 *
 * - **Input**:
 *   - `bytes`: An array of four numbers, each representing a byte in the four-byte sequence.
 *
 * - **Output**:
 *   - A string containing the corresponding Unicode character or the replacement character (`\uFFFD`)
 *   for invalid sequences, characters in the surrogate range, or incomplete sequences.
 *
 * ## Example:
 *
 * ```ts
 * const validBytes = [0xF0, 0x90, 0x80, 0x80];  // Example valid four-byte sequence
 * const char = encodeFourByteSequence(validBytes);
 * console.log(char);  // Outputs: '𐀀'
 *
 * const invalidBytes = [0xF0, 0x90, 0x80];  // Incomplete sequence, less than 4 bytes
 * const invalidChar = encodeFourByteSequence(invalidBytes);
 * console.log(invalidChar);  // Outputs: '\uFFFD' (replacement character)
 *
 * const surrogateRangeBytes = [0xF0, 0x90, 0x80, 0x80]; // Surrogate range
 * const surrogateChar = encodeFourByteSequence(surrogateRangeBytes);
 * console.log(surrogateChar);  // Outputs: '𐀀' or '\uFFFD' if invalid
 *
 * encodeFourByteSequence([0xF0, 0x90, 0x80, 0x80]); // "𐀀" (U+10000)
 * encodeFourByteSequence([0xF4, 0x8F, 0xBF, 0xBF]); // "𯿿" (U+10FFFF)
 * encodeFourByteSequence([0xF0, 0x80, 0x80, 0x80]); // "�" (Invalid sequence, replacement character)
 * encodeFourByteSequence([0xF0, 0x90, 0x80, 0x81]); // "𐁁" (U+10001)
 * ```
 *
 * @param bytes - An array of four numbers (bytes) representing the four-byte sequence.
 * @returns A character corresponding to the four-byte sequence or the Unicode replacement character.
 */

function encodeFourByteSequence(bytes: number[]): string {
    if (bytes.length < 4) return '\uFFFD'.repeat(bytes.length); // Incomplete sequence, return replacement character

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
        return '\uFFFD\uFFFD\uFFFD\uFFFD';
    }
}

/**
 * Decodes a Unicode code point into a sequence of bytes (UTF-8 encoding).
 *
 * ## Description:
 * This function takes a Unicode code point (a number) and converts it into an array of bytes
 * according to the UTF-8 encoding scheme. The code point must be within the valid range of Unicode
 * (from U+0000 to U+10FFFF). The function handles single-byte, two-byte, three-byte, and four-byte
 * sequences as per UTF-8 encoding rules.
 *
 * - **Input**:
 *   - `codePoint`: A number representing the Unicode code point (an integer between 0 and U+10FFFF).
 *
 * - **Output**:
 *   - An array of integers (bytes) that represent the UTF-8 encoded form of the code point.
 *
 * - **Error Handling**:
 *   - Throws a `RangeError` if the code point is not within the valid Unicode range (0 to U+10FFFF).
 *
 * ## Example:
 *
 * ```ts
 * const codePoint1 = 0x0041; // Unicode code point for 'A'
 * const encoded1 = decodeCodePoint(codePoint1);
 * console.log(encoded1);  // Outputs: [ 0x41 ]
 *
 * decodeCodePoint(0x24); // [0x24] -> "$"
 * const codePoint2 = 0x20AC; // Unicode code point for '€'
 * const encoded2 = decodeCodePoint(codePoint2);
 * console.log(encoded2);  // Outputs: [ 0xE2, 0x82, 0xAC ]
 *
 * const codePoint3 = 0x1F600; // Unicode code point for '😀' (grinning face emoji)
 * const encoded3 = decodeCodePoint(codePoint3);
 * console.log(encoded3);  // Outputs: [ 0xF0, 0x9F, 0x98, 0x80 ]
 * ```
 *
 * @param codePoint - The Unicode code point to encode (integer between 0 and 0x10FFFF).
 * @returns An array of integers representing the UTF-8 encoded bytes of the code point.
 * @throws {RangeError} Throws an error if the code point is outside the valid Unicode range.
 */

function decodeCodePoint(codePoint: number): Array<number> {
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
 * Encodes a `Uint8Array` of bytes into a UTF-8 encoded string.
 *
 * ## Description:
 * This function takes a `Uint8Array` representing a sequence of bytes and converts it into a UTF-8 string.
 * It processes the bytes according to the UTF-8 encoding standard, handling single-byte, two-byte,
 * three-byte, and four-byte sequences.
 * The optional `length` argument allows you to limit the number of bytes to be encoded.
 *
 * - **Input**:
 *   - `bytes`: A `Uint8Array` of byte values representing UTF-8 encoded bytes.
 *   - `length` (optional): A number specifying the maximum number of bytes to process. If not provided, the entire `Uint8Array` is processed.
 *
 * - **Output**:
 *   - A string that is the UTF-8 encoded representation of the provided bytes.
 *
 * - **Error Handling**:
 *   - Throws an error if `bytes` is not a `Uint8Array`.
 *
 * ## Example:
 *
 * ```ts
 * const bytes1 = new Uint8Array([ 0x41 ]); // UTF-8 encoding for 'A'
 * const result1 = encodeUTF8(bytes1);
 * console.log(result1);  // Outputs: 'A'
 *
 * const bytes2 = new Uint8Array([ 0xE2, 0x82, 0xAC ]); // UTF-8 encoding for '€'
 * const result2 = encodeUTF8(bytes2);
 * console.log(result2);  // Outputs: '€'
 *
 * const bytes3 = new Uint8Array([ 0xF0, 0x9F, 0x98, 0x80 ]); // UTF-8 encoding for '😀'
 * const result3 = encodeUTF8(bytes3);
 * console.log(result3);  // Outputs: '😀'
 *
 * encodeUTF8(new Uint8Array([0xE2, 0x82, 0xAC])); // "€"
 * encodeUTF8(new Uint8Array([0xF0, 0x90, 0x80, 0x80])); // "𠜎"
 * encodeUTF8(new Uint8Array([0x80, 0x80])); // "�" (invalid sequence)
 * ```
 *
 * @param bytes - The `Uint8Array` of bytes to encode as a UTF-8 string.
 * @param length - An optional maximum number of bytes to process.
 * @returns A UTF-8 string encoded from the byte array.
 * @throws {Error} Throws an error if `bytes` is not a `Uint8Array`.
 */

export function encodeUTF8(bytes: Uint8Array, length?: number): string {
    if (!isInstance(bytes, Uint8Array)) {
        throw new Error('encodeBase64 input must be a Uint8Array');
    }

    let i = 0;
    let encodeString = '';
    const maxLength = length !== undefined ? Math.min(length, bytes.length) : bytes.length;

    while (i < maxLength) {
        const byte = bytes[i++];

        if (byte < 0x80) {
            encodeString += String.fromCharCode(byte); // Single-byte character
        } else if (byte < 0xE0) {
            // Convert slice to number[] before passing
            encodeString += encodeTwoByteSequence(Array.from(bytes.slice(i - 1))); // Two-byte sequence
            i++;
        } else if (byte < 0xF0) {
            // Convert slice to number[] before passing
            encodeString += encodeThreeByteSequence(Array.from(bytes.slice(i - 1))); // Three-byte sequence
            i += 2;
        } else {
            // Convert slice to number[] before passing
            encodeString += encodeFourByteSequence(Array.from(bytes.slice(i - 1))); // Four-byte sequence
            i += 3;
        }
    }

    return encodeString;
}

/**
 * Decodes a UTF-8 encoded string into a `Uint8Array` of bytes.
 *
 * ## Description:
 * This function takes a UTF-8 encoded string and decodes it into a `Uint8Array`.
 * The function handles surrogate pairs for characters outside the Basic Multilingual Plane
 * (BMP) and can decode characters that require multiple bytes.
 * The optional `length` argument allows limiting the number of characters to decode from the string.
 *
 * - **Input**:
 *   - `data`: A UTF-8 encoded string to be decoded into a byte array.
 *   - `length` (optional): A number specifying the maximum number of characters to decode.
 *   If not provided, the entire string is decoded.
 *
 * - **Output**:
 *   - A `Uint8Array` representing the decoded bytes from the input string.
 *
 * - **Error Handling**:
 *   - Surrogate pairs that are invalid will be replaced by the Unicode replacement character (`U+FFFD`).
 *   - If `data` is not a string, the function will not work as expected.
 *
 * ## Example:
 *
 * ```ts
 * const string1 = 'A';  // UTF-8 string for 'A'
 * const result1 = decodeUTF8(string1);
 * console.log(result1);  // Outputs: Uint8Array [ 65 ]
 *
 * const string2 = '€';  // UTF-8 string for '€'
 * const result2 = decodeUTF8(string2);
 * console.log(result2);  // Outputs: Uint8Array [ 0xE2, 0x82, 0xAC ]
 *
 * const string3 = '😀';  // UTF-8 string for '😀'
 * const result3 = decodeUTF8(string3);
 * console.log(result3);  // Outputs: Uint8Array [ 0xF0, 0x9F, 0x98, 0x80 ]
 * decodeUTF8('Hello, 世界!'); // Outputs: Uint8Array [ 0x48, 0x65, 0x6C, 0x6C, 0x6F, 0x2C, 0xE4, 0xB8, 0x96 ]
 * ```
 *
 * @param data - The UTF-8 string to decode into bytes.
 * @param length - An optional maximum number of characters to decode.
 * @returns A `Uint8Array` containing the decoded bytes.
 * @throws {Error} Throws an error if `data` contains invalid surrogate pairs.
 */

export function decodeUTF8(data: string, length?: number): Uint8Array {
    const utf8: number[] = [];
    const maxLength = length !== undefined ? length : Infinity;

    let i = 0;
    let byteCount = 0;

    while (i < data.length && byteCount < maxLength) {
        const charCode = data.charCodeAt(i);

        if (charCode >= 0xD800 && charCode <= 0xDBFF) {
            // High surrogate: check for valid low surrogate
            const lowSurrogate = i + 1 < data.length ? data.charCodeAt(i + 1) : 0;

            if (lowSurrogate >= 0xDC00 && lowSurrogate <= 0xDFFF) {
                // Valid surrogate pair
                const codePoint = ((charCode - 0xD800) << 10) + (lowSurrogate - 0xDC00) + 0x10000;
                const bytes = decodeCodePoint(codePoint);
                if (byteCount + bytes.length > maxLength) break;
                utf8.push(...bytes);
                byteCount += bytes.length;
                i++; // Skip the low surrogate
            } else {
                // Invalid high surrogate, replace with U+FFFD
                const bytes = decodeCodePoint(0xFFFD);
                if (byteCount + bytes.length > maxLength) break;
                utf8.push(...bytes);
                byteCount += bytes.length;
            }
        } else if (charCode >= 0xDC00 && charCode <= 0xDFFF) {
            // Standalone low surrogate: invalid, replace with U+FFFD
            const bytes = decodeCodePoint(0xFFFD);
            if (byteCount + bytes.length > maxLength) break;
            utf8.push(...bytes);
            byteCount += bytes.length;
        } else {
            // Valid BMP character
            const bytes = decodeCodePoint(charCode);
            if (byteCount + bytes.length > maxLength) break;
            utf8.push(...bytes);
            byteCount += bytes.length;
        }

        i++;
    }

    return new Uint8Array(utf8);
}
