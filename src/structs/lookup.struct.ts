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
