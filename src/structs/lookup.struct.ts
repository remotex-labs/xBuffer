/**
 * Lookup table for hexadecimal character values.
 *
 * ## Description:
 * This table maps ASCII character codes to their corresponding hexadecimal values.
 * It is used to efficiently decode hexadecimal strings into numeric values without
 * repeatedly calling computationally expensive functions like `parseInt`.
 *
 * - The array index corresponds to the ASCII character code.
 * - The value at each index represents the numeric value of the corresponding hexadecimal digit:
 *   - `'0'` (ASCII code 48) to `'9'` (ASCII code 57) map to 0–9.
 *   - `'A'` (ASCII code 65) to `'F'` (ASCII code 70) and
 *     `'a'` (ASCII code 97) to `'f'` (ASCII code 102) map to 10–15.
 *   - All non-hexadecimal characters are assigned a value of `-1` to indicate invalid input.
 *
 * - **Input**:
 *   - ASCII character codes (index into the array).
 *
 * - **Output**:
 *   - Numeric values of valid hexadecimal characters (0–15).
 *   - `-1` for non-hexadecimal characters.
 *
 * ## Example:
 *
 * ```ts
 * // Example usage:
 * const hexChar = 'A'; // ASCII code 65
 * const value = hexCharValueTable[hexChar.charCodeAt(0)];
 * console.log(value);  // Outputs: 10
 *
 * const invalidChar = 'G'; // ASCII code 71
 * const invalidValue = hexCharValueTable[invalidChar.charCodeAt(0)];
 * console.log(invalidValue);  // Outputs: -1
 * ```
 */

export const hexCharLookupTable = [
    -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1,
    0, 1, 2, 3, 4, 5, 6, 7,
    8, 9, -1, -1, -1, -1, -1, -1,
    -1, 10, 11, 12, 13, 14, 15, -1,
    -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1,
    -1, 10, 11, 12, 13, 14, 15, -1,
    -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1
];

/**
 * Lookup table for encoding byte values into hexadecimal strings.
 *
 * ## Description:
 * This table contains precomputed hexadecimal string representations for all byte values
 * (0–255). Each byte is represented as a two-character hexadecimal string.
 * It is used to efficiently encode byte values into their corresponding hexadecimal format
 * without needing to repeatedly call computationally expensive functions like `toString(16)`.
 *
 * - The array index corresponds to the byte value (0–255).
 * - The value at each index is the two-character hexadecimal string representation of that byte:
 *   - For example, index `0` will be `'00'`, index `255` will be `'ff'`, and index `128` will be `'80'`.
 *
 * - **Input**:
 *   - A byte value in the range `0–255`.
 *
 * - **Output**:
 *   - A two-character hexadecimal string representation of the byte.
 *
 * ## Example:
 *
 * ```ts
 * // Example usage:
 * const byte = 255;
 * const hexString = hexByteLookupTable[byte];
 * console.log(hexString);  // Outputs: "ff"
 *
 * const anotherByte = 128;
 * const anotherHexString = hexByteLookupTable[anotherByte];
 * console.log(anotherHexString);  // Outputs: "80"
 * ```
 */

export const hexByteLookupTable = Array.from(
    { length: 256 },
    (_, i) => i.toString(16).padStart(2, '0')
);

/**
 * Lookup table for Base64 character decoding.
 *
 * ## Description:
 * This table maps Base64-encoded characters (A-Z, a-z, 0-9, '+', '/') to their corresponding 6-bit values.
 * The table is initialized with a default value of `-1` for each index, and then populated with valid Base64 character
 * values where each character corresponds to a 6-bit integer (0–63).
 * This lookup table allows for fast Base64 decoding by directly mapping characters to their numeric equivalents,
 * eliminating the need for repeated string comparisons or complex parsing.
 *
 * - The array index corresponds to the ASCII value of the Base64 character.
 * - The value at each index is the numeric value (0–63) of the Base64 character:
 *   - `'A'` to `'Z'` (ASCII codes 65–90) map to values 0–25.
 *   - `'a'` to `'z'` (ASCII codes 97–122) map to values 26–51.
 *   - `'0'` to `'9'` (ASCII codes 48–57) map to values 52–61.
 *   - `'+'` (ASCII code 43) maps to 62.
 *   - `'/'` (ASCII code 47) maps to 63.
 *   - All other characters are initialized to `-1`, indicating they are not valid Base64 characters.
 *
 * - **Input**:
 *   - ASCII character codes (from Base64-encoded string characters).
 *
 * - **Output**:
 *   - Numeric values (0–63) for valid Base64 characters.
 *   - `-1` for invalid Base64 characters.
 *
 * ## Example:
 *
 * ```ts
 * // Example usage:
 * const char = 'A'; // ASCII code 65
 * const value = base64LookupTable[char.charCodeAt(0)];
 * console.log(value);  // Outputs: 0 (Base64 value for 'A')
 *
 * const invalidChar = '@'; // ASCII code 64
 * const invalidValue = base64LookupTable[invalidChar.charCodeAt(0)];
 * console.log(invalidValue);  // Outputs: -1 (Invalid character for Base64)
 * ```
 */

export const base64LookupTable = new Array(256).fill(-1);
export const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
for (let i = 0; i < base64Chars.length; i++) {
    base64LookupTable[base64Chars.charCodeAt(i)] = i;
}

/**
 * Lookup table for UTF-16LE character decoding.
 *
 * ## Description:
 * This table maps all possible 16-bit integer values (0x0000 to 0xFFFF) to their corresponding UTF-16 characters.
 * Each index in the array represents a 16-bit integer value, and the value at that index is the corresponding
 * character decoded using `String.fromCharCode`.
 *
 * By precomputing this table, repeated calls to `String.fromCharCode` are avoided, enabling faster UTF-16 decoding,
 * especially for large datasets or frequent operations involving UTF-16LE decoding.
 *
 * - The array index represents a 16-bit integer value (0 to 65535).
 * - The value at each index is the corresponding character as defined in the UTF-16LE encoding.
 * - This table is primarily useful in scenarios where decoding UTF-16LE strings is required for performance-critical
 * applications or repeated decoding tasks.
 *
 * ## Usage:
 * This lookup table is used for fast UTF-16LE decoding by directly mapping 16-bit integer values to characters.
 * Instead of calling `String.fromCharCode` for every value during decoding, the corresponding character can be
 * fetched directly from this precomputed table.
 *
 * - **Input**:
 *   - A 16-bit integer value (0x0000 to 0xFFFF).
 *
 * - **Output**:
 *   - The UTF-16LE character corresponding to the given 16-bit integer value.
 *
 * ## Example:
 *
 * ```ts
 * // Example usage:
 * const codeUnit = 0x0041; // 16-bit integer for 'A'
 * const char = utf16leLookupTable[codeUnit];
 * console.log(char); // Outputs: 'A'
 *
 * const anotherCodeUnit = 0x3042; // 16-bit integer for 'あ' (Hiragana letter A)
 * const anotherChar = utf16leLookupTable[anotherCodeUnit];
 * console.log(anotherChar); // Outputs: 'あ'
 * ```
 */

export const utf16leLookupTable: string[] = new Array(0x10000);
for (let i = 0; i <= 0xFFFF; i++) {
    utf16leLookupTable[i] = String.fromCharCode(i);
}
