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
 * const hexString = hexByteEncodeTable[byte];
 * console.log(hexString);  // Outputs: "ff"
 *
 * const anotherByte = 128;
 * const anotherHexString = hexByteEncodeTable[anotherByte];
 * console.log(anotherHexString);  // Outputs: "80"
 * ```
 */

export const hexByteEncodeTable = Array.from(
    { length: 256 },
    (_, i) => i.toString(16).padStart(2, '0')
);
