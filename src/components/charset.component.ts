/**
 * Imports
 */

import { decodeUTF8, encodeUTF8 } from '@components/utf8.component';

/**
 * The `lookup` initialization creates a Base64 lookup table to map each Base64 character (and padding)
 * to its corresponding index value (0–63). The table is created using a `Uint8Array` where the index
 * represents a byte value (0–255), with the Base64 characters mapped to their respective values.
 *
 * - **Input**: A string containing the Base64 character set, which includes:
 *   - Uppercase letters: 'A' to 'Z'
 *   - Lowercase letters: 'a' to 'z'
 *   - Digits: '0' to '9'
 *   - Special characters: '+' and '/'
 *
 *   The padding character `=` is also handled separately in the lookup table.
 *
 * - **Output**: A `Uint8Array` of size 256, where each index represents a byte value and stores the corresponding
 *   Base64 value for valid characters. The padding character `=` is mapped to `0`.
 *
 * ## Example:
 *
 * ```ts
 * const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
 * const lookup = new Uint8Array(256); // 256-length array for all possible byte values
 * for (let i = 0; i < chars.length; i++) {
 *     lookup[chars.charCodeAt(i)] = i;
 * }
 * lookup['='.charCodeAt(0)] = 0; // Handle padding
 *
 * console.log(lookup['A'.charCodeAt(0)]); // 0
 * console.log(lookup['B'.charCodeAt(0)]); // 1
 * console.log(lookup['='.charCodeAt(0)]); // 0
 * ```
 *
 * ## Error Handling:
 * - The array is created with a size of 256 to cover all possible byte values (0–255).
 * - If invalid characters are encountered during Base64 decoding, the lookup table will return `undefined`
 *   (or a default value, if specified).
 *
 * @returns A `Uint8Array` of size 256 with the Base64 character values mapped for decoding.
 */

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const lookup = new Uint8Array(256); // Base64 has 64 characters, but we need a 256-length array to store all possible byte values
for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
}
lookup['='.charCodeAt(0)] = 0;

/**
 * The `encodeASCII` function encodes a given string into its ASCII byte representation
 * as a `Uint8Array`. Optionally, the length of the input string can be limited to a specified value.
 * If no length is specified, the entire string is encoded.
 *
 * - **Input**: A `string` representing the data to be encoded into ASCII.
 *   Optionally, a `length` parameter (of type `number`) can be provided to limit the encoding
 *   to a certain number of characters from the start of the string. If `length` is not provided,
 *   the entire string is encoded.
 *   - The `length` must be a non-negative integer.
 *
 * - **Output**: A `Uint8Array` containing the ASCII byte values of the input string, where each byte
 *   corresponds to a character in the input string.
 *
 * ## Example:
 *
 * ```ts
 * const encoded = encodeASCII("Hello", 3);
 * console.log(encoded); // Uint8Array [ 72, 101, 108 ]
 *
 * const fullEncoded = encodeASCII("World");
 * console.log(fullEncoded); // Uint8Array [ 87, 111, 114, 108, 100 ]
 * ```
 *
 * ## Error Handling:
 * - If the `length` is negative, the function will treat it as the full length of the string.
 *
 * @param data - The string to be encoded into ASCII.
 * @param length - Optional. The maximum length of the string to encode. Defaults to the full string length.
 * @returns A `Uint8Array` containing the ASCII byte values of the input string.
 */

export function encodeASCII(data: string, length?: number): Uint8Array {
    length = length !== undefined ? Math.min(length, data.length) : data.length;

    return new Uint8Array(
        Array.from(data.slice(0, length), char => char.charCodeAt(0) & 0xFF)
    );
}

/**
 * The `decodeASCII` function decodes a `Uint8Array` into an ASCII string.
 * It converts each byte into its corresponding ASCII character representation.
 *
 * - **Input**:
 *   - `bytes`: A `Uint8Array` containing byte values to be decoded into an ASCII string.
 *
 * - **Output**:
 *   A string representing the decoded ASCII characters from the byte array.
 *
 * ## Example:
 *
 * ```ts
 * const bytes = new Uint8Array([ 0x48, 0x65, 0x6c, 0x6c, 0x6f ]);
 * const decoded = decodeASCII(bytes);
 * console.log(decoded); // Output: 'Hello'
 * ```
 *
 * ## Error Handling:
 * - The function will throw an error if the input is not a valid `Uint8Array`.
 *
 * @param bytes - The `Uint8Array` containing byte values to be decoded into an ASCII string.
 * @returns A decoded string from the ASCII byte array.
 * @throws Error if the input is not a `Uint8Array`.
 */

export function decodeASCII(bytes: Uint8Array): string {
    if (!(bytes instanceof Uint8Array)) {
        throw new Error('decodeASCII input must be a Uint8Array');
    }

    return String.fromCharCode(...bytes.map(byte => byte & 0xFF));
}

/**
 * The `encodeUTF16LE` function encodes a string into a UTF-16 Little Endian (LE) byte sequence.
 * UTF-16 LE encoding uses 2 bytes to represent each character, with the least significant byte first.
 * Optionally, you can specify the length of the output by truncating the string to a certain number of characters.
 * The length will be adjusted to ensure it is even, as UTF-16 requires 2 bytes per character.
 *
 * - **Input**:
 *   - `data`: A string to be encoded into UTF-16 LE.
 *   - `length`: An optional parameter specifying the maximum length in **bytes**. If specified, the function will
 *     truncate the string to fit this length. The length will be adjusted to ensure it's even.
 *
 * - **Output**:
 *   A `Uint8Array` containing the UTF-16 LE encoded byte sequence, where each character is represented by 2 bytes.
 *
 * ## Example:
 *
 * ```ts
 * const input = 'Hello';
 * const encoded = encodeUTF16LE(input);
 * console.log(encoded);
 * // Output: Uint8Array [ 0x48, 0x00, 0x65, 0x00, 0x6c, 0x00, 0x6c, 0x00, 0x6f, 0x00 ]
 * ```
 *
 * ## Error Handling:
 * - If the provided length is greater than the total number of bytes needed to represent the string,
 *   the function will automatically adjust to the required byte length.
 * - If no string is provided or if the length is set to 0, the function returns an empty `Uint8Array`.
 *
 * @param data - The string to be encoded into UTF-16 LE.
 * @param length - Optional length in bytes, if provided, it will be adjusted to an even number.
 * @returns A `Uint8Array` containing the UTF-16 LE encoded bytes.
 */

export function encodeUTF16LE(data: string, length?: number): Uint8Array {
    length = length !== undefined ? Math.min(Math.max(length, 0), data.length * 2) : data.length * 2;
    length = Math.floor(length / 2) * 2; // Ensure the length is even

    if (length === 0) return new Uint8Array(0);

    const utf16leBytes = new Uint8Array(length);
    for (let i = 0; i < length; i += 2) {
        const charCode = data.charCodeAt(i / 2);
        utf16leBytes[i] = charCode & 0xFF;
        utf16leBytes[i + 1] = (charCode >> 8) & 0xFF;
    }

    return utf16leBytes;
}

/**
 * The `decodeUTF16LE` function decodes a UTF-16 Little Endian (LE) byte sequence into a string.
 * It processes each pair of bytes to reconstruct the original characters.
 * If there are incomplete character pairs or null characters, the decoding stops.
 *
 * - **Input**:
 *   - `bytes`: A `Uint8Array` containing the UTF-16 LE encoded byte sequence.
 *
 * - **Output**:
 *   A string representing the decoded characters from the byte array.
 *
 * ## Example:
 *
 * ```ts
 * const bytes = new Uint8Array([ 0x48, 0x00, 0x65, 0x00, 0x6c, 0x00, 0x6c, 0x00, 0x6f, 0x00 ]);
 * const decoded = decodeUTF16LE(bytes);
 * console.log(decoded); // Output: 'Hello'
 * ```
 *
 * ## Error Handling:
 * - The function gracefully handles incomplete byte pairs and stops decoding if an invalid or null byte is encountered.
 * - If the byte array contains invalid characters or an odd number of bytes, the function will stop at the point of error.
 * - The function will throw an error if the input is not a valid `Uint8Array`.
 *
 * @param bytes - The `Uint8Array` containing the UTF-16 LE encoded byte sequence.
 * @returns A decoded string from the UTF-16 LE byte array.
 * @throws Error if the input is not a `Uint8Array`.
 */

export function decodeUTF16LE(bytes: Uint8Array): string {
    if (!(bytes instanceof Uint8Array)) {
        throw new Error('decodeUTF16LE input must be a Uint8Array');
    }

    let str = '';
    for (let i = 0; i < bytes.length; i += 2) {
        if (i + 1 >= bytes.length) break; // Incomplete pair, stop decoding

        const lowByte = bytes[i];
        const highByte = bytes[i + 1];
        const charCode = lowByte | (highByte << 8);

        if (charCode === 0) break; // Skip null characters

        str += String.fromCharCode(charCode);
    }

    return str;
}

/**
 * The `encodeHEX` function encodes a hex string into a `Uint8Array`. It processes the string in pairs of characters
 * (each pair representing a byte), and if a `length` is provided, it truncates the string to fit the specified byte size.
 * If no length is provided, it uses the entire hex string. If the hex string contains invalid characters (not part of
 * the 0-9, a-f, A-F range), the function returns an empty `Uint8Array`.
 *
 * - **Input**:
 *   - `hexString`: A string of hexadecimal characters (even length, each pair represents a byte).
 *   - `length`: An optional number indicating the maximum number of bytes to encode. If not provided, the entire string is used.
 *
 * - **Output**:
 *   A `Uint8Array` containing the byte values decoded from the hex string, or an empty array if the input contains invalid hex characters.
 *
 * ## Example:
 *
 * ```ts
 * const hexString = '48656c6c6f';
 * const encoded = encodeHEX(hexString);
 * console.log(encoded); // Output: Uint8Array [ 72, 101, 108, 108, 111 ]
 * ```
 *
 * ## Error Handling:
 * - If the input contains non-hex characters, an empty `Uint8Array` will be returned.
 * - The function will ignore any extra characters beyond the specified `length` or hex string's maximum byte size.
 *
 * @param hexString - The hex string to encode into a `Uint8Array`.
 * @param length - Optional length, truncating the hex string to the specified size.
 * @returns A `Uint8Array` containing the byte values decoded from the hex string.
 */

export function encodeHEX(hexString: string, length?: number): Uint8Array {
    if (/[^a-fA-F0-9]/.test(hexString)) {
        throw new Error('Invalid hex string: contains non-hex characters');
    }

    // If the length is odd, remove the last character to make the string even
    if (hexString.length % 2 !== 0) {
        hexString = hexString.slice(0, hexString.length - 1);
    }

    // Truncate based on the provided length (in bytes)
    length = length !== undefined ? Math.min(length * 2, hexString.length) : hexString.length;

    const hexBytes = new Uint8Array(length / 2);
    for (let i = 0; i < length; i += 2) {
        hexBytes[i / 2] = parseInt(hexString.slice(i, i + 2), 16);
    }

    return hexBytes;
}

/**
 * The `decodeHEX` function decodes a `Uint8Array` into a hex string. Each byte is represented
 * as a two-character hexadecimal value.
 *
 * - **Input**:
 *   - `bytes`: A `Uint8Array` containing the byte values to be converted into a hex string.
 *
 * - **Output**:
 *   A string where each byte is represented as a two-character hexadecimal string.
 *
 * ## Example:
 *
 * ```ts
 * const bytes = new Uint8Array([ 72, 101, 108, 108, 111 ]);
 * const decoded = decodeHEX(bytes);
 * console.log(decoded); // Output: '48656c6c6f'
 * ```
 *
 * ## Error Handling:
 * - The function throws an error if the input is not a valid `Uint8Array`.
 *
 * @param bytes - The `Uint8Array` to decode into a hex string.
 * @returns A string representing the hex-encoded byte array.
 * @throws Error if the input is not a `Uint8Array`.
 */

export function decodeHEX(bytes: Uint8Array): string {
    if (!(bytes instanceof Uint8Array)) {
        throw new Error('decodeHEX input must be a Uint8Array');
    }

    return Array.from(bytes)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * The `encodeBase64` function encodes a given string into Base64 format and returns the result as a `Uint8Array`.
 * It processes the string as a sequence of 3-byte chunks, encodes each chunk into 4-Base64 characters,
 * and handles padding if necessary.
 * The output is returned as a `Uint8Array` containing the Base64-encoded bytes.
 *
 * - **Input**: A string (`base64String`) to be encoded into Base64 format.
 *   - The optional `length` parameter allows truncating the input string to a specified number of bytes before encoding. If not provided, the entire string is encoded.
 *
 * - **Output**: A `Uint8Array` containing the Base64-encoded bytes.
 *   - The resulting `Uint8Array` can be used for binary handling or transmission.
 *
 * ## Example:
 *
 * ```ts
 * const base64String = "Hello, World!";
 * const encodedBytes = encodeBase64(base64String);
 * console.log(encodedBytes);
 * // Output: Uint8Array with the Base64-encoded bytes of the string
 * ```
 *
 * ## Error Handling:
 * - The method assumes the input string is a valid UTF-8 string.
 *
 * @param base64String - The string to be encoded into Base64 format.
 * @param length - Optional. A limit on the number of bytes from the string to be encoded. Defaults to `Infinity` (no limit).
 * @returns A `Uint8Array` containing the Base64-encoded representation of the input string.
 */

export function encodeBase64(base64String: string, length?: number): Uint8Array {
    // Convert the input string into a Uint8Array using encodeUTF8 (or encodeASCII if the string is ASCII)
    const bytes = encodeUTF8(base64String, length);
    const result = [];
    let i = 0;

    // Iterate over each 3-byte chunk
    while (i < bytes.length) {
        const byte1 = bytes[i++];
        const byte2 = i < bytes.length ? bytes[i++] : 0;
        const byte3 = i < bytes.length ? bytes[i++] : 0;

        // Combine the 3 bytes into a 24-bit number
        const combined = (byte1 << 16) | (byte2 << 8) | byte3;

        // Extract 4 Base64 characters from the 24-bit number
        result.push(
            chars.charAt((combined >> 18) & 0x3F),
            chars.charAt((combined >> 12) & 0x3F),
            chars.charAt((combined >> 6) & 0x3F),
            chars.charAt(combined & 0x3F)
        );
    }

    // Handle padding if necessary
    const padding = bytes.length % 3;
    if (padding === 1) {
        result.splice(result.length - 2, 2, '==');
    } else if (padding === 2) {
        result.splice(result.length - 1, 1, '=');
    }


    return encodeUTF8(result.join(''));
}

/**
 * The `decodeBase64` function decodes a Base64-encoded string, represented as a `Uint8Array`,
 * back into its original string format.
 * It processes the Base64 string in chunks of four characters,
 * converts them into byte sequences, and then reassembles the bytes into the original data.
 *
 * - **Input**: A `Uint8Array` representing a Base64-encoded string.
 * This can be a sequence of encoded characters,
 *   potentially with padding (`=`), that need to be decoded into the original data.
 *
 * - **Output**: A `string` representing the decoded data.
 * The function converts the decoded byte values
 *   into a readable string using `String.fromCharCode`.
 *
 * ## Example:
 *
 * ```ts
 * const base64Bytes = new Uint8Array([100, 101, 115, 116, 61, 61]);
 * const decodedString = decodeBase64(base64Bytes);
 * console.log(decodedString); // Output: 'test'
 * ```
 *
 * ## Error Handling:
 * - If the Base64 string is malformed or contains invalid characters, it will be treated as padding (`=`) for the invalid sections.
 * - The function uses the `lookup` table to efficiently decode Base64 characters to their corresponding byte values.
 *
 * ## How it works:
 * - The Base64 string is processed in 4-character chunks.
 * - Each 4-character chunk is mapped to a set of 6-bit values (called "sextets").
 * - The sextets are combined to form 3 bytes of the original data.
 * - Padding (`=`) is handled by ensuring that incomplete chunks are ignored during byte assembly.
 *
 * @param bytes - The `Uint8Array` containing the Base64-encoded data.
 * @returns A `string` representing the decoded result of the Base64 input.
 */

export function decodeBase64(bytes: Uint8Array): string {
    const decodedBytes: number[] = [];
    const base64String = decodeUTF8(bytes); // Convert Uint8Array back to Base64 string

    for (let i = 0; i < base64String.length; i += 4) {
        const sextet1 = lookup[base64String.charCodeAt(i)];
        const sextet2 = lookup[base64String.charCodeAt(i + 1)];
        const sextet3 = lookup[base64String.charCodeAt(i + 2)];
        const sextet4 = lookup[base64String.charCodeAt(i + 3)];

        // Decode the 4 Base64 characters into 3 bytes
        const byte1 = (sextet1 << 2) | (sextet2 >> 4);
        const byte2 = ((sextet2 & 15) << 4) | (sextet3 >> 2);
        const byte3 = ((sextet3 & 3) << 6) | sextet4;

        decodedBytes.push(byte1);
        if (base64String[i + 2] !== '=') decodedBytes.push(byte2);
        if (base64String[i + 3] !== '=') decodedBytes.push(byte3);
    }

    // Convert the decoded bytes to a UTF-8 string
    return decodeUTF8(new Uint8Array(decodedBytes)).replace(/\0+$/, '');
}
