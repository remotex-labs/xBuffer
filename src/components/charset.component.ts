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
 * A private static method that checks whether the given object is an instance of the specified type.
 * This method works by verifying if the object is an instance of the provided class or constructor function,
 * either directly or through prototype chain checks.
 * It also handles cases where the prototype's constructor name is available.
 *
 * ## Description:
 * The `isInstance` method verifies if the object `obj` is an instance of the provided `type`.
 * It uses both
 * the `instanceof` operator and a fallback check using the prototype chain to support environments
 * where `instanceof` might not work as expected.
 *
 * - **Input**:
 *   - `obj`: The object to check against the `type`.
 *   - `type`: The class or constructor function that is being checked.
 *
 * - **Output**: Returns a boolean indicating whether `obj` is an instance of `type`.
 *   - `true`: if `obj` is an instance of `type` or inherits from it.
 *   - `false`: otherwise.
 *
 * ## Example:
 *
 * ```ts
 * class MyClass {}
 * const obj = new MyClass();
 * console.log(MyClass.isInstance(obj, MyClass)); // true
 * console.log(MyClass.isInstance({}, MyClass)); // false
 * ```
 *
 * ## Error Handling:
 * - This method does not throw errors but assumes that both `obj` and `type` are provided.
 *   If `obj` is `null` or `undefined`, it will safely return `false`.
 *
 * @private
 * @static
 * @param obj - The object to check.
 * @param type - The constructor or class type to check against.
 * @returns A boolean indicating whether `obj` is an instance of `type`.
 */

export function isInstance(obj: unknown, type: any): boolean {
    if (obj == null) {
        return false;
    }

    // Check for regular instance matching
    if (obj instanceof type) {
        return true;
    }

    // Handle cases where the type might be an anonymous class or function
    const objProto = Object.getPrototypeOf(obj);
    if (objProto && objProto.constructor && objProto.constructor.name) {
        // If the constructor has a name, check for it
        return objProto.constructor.name === type.name;
    }

    return false;
}

/**
 * Encodes a `Uint8Array` into an ASCII string.
 *
 * ## Description:
 * This function takes a `Uint8Array` and converts it into an ASCII string.
 * Each byte is clamped to the range `0x00`–`0xFF`
 * using a bitwise AND operation, ensuring compatibility with ASCII character codes.
 * An optional `length` parameter can limit the number of bytes processed from the input array.
 *
 * - **Input**:
 *   - `bytes`: A `Uint8Array` containing the byte values to encode.
 *   - `length`: (Optional) The maximum number of bytes to process from the input array.
 *
 * - **Output**:
 *   - Returns the resulting ASCII string representation of the provided byte array.
 *
 * ## Error Handling:
 * - Throws an error if the `bytes` parameter is not a `Uint8Array`.
 *
 * ## Example:
 *
 * ```ts
 * const data = new Uint8Array([65, 66, 67, 68]); // ASCII codes for "ABCD"
 * console.log(encodeASCII(data));               // Outputs: "ABCD"
 *
 * const partialData = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
 * console.log(encodeASCII(partialData, 3));    // Outputs: "Hel"
 * ```
 *
 * @param bytes - The `Uint8Array` containing the bytes to encode.
 * @param length - (Optional) The maximum number of bytes to process.
 * Defaults to the entire array length.
 * @returns An ASCII string representation of the encoded bytes.
 * @throws {Error} If the input is not a `Uint8Array`.
 */

export function encodeASCII(bytes: Uint8Array, length?: number): string {
    if (!isInstance(bytes, Uint8Array)) {
        throw new Error('encodeASCII input must be a Uint8Array');
    }

    // Clamp the length to the array bounds if specified.
    const maxLength = length !== undefined ? Math.min(length, bytes.length) : bytes.length;

    // Process only up to the specified length.
    return String.fromCharCode(...bytes.slice(0, maxLength).map(byte => byte & 0xFF));
}

/**
 * Decodes an ASCII string into a `Uint8Array`.
 *
 * ## Description:
 * This function takes an ASCII string and converts it into a `Uint8Array`, where each character is mapped to its
 * corresponding ASCII byte value (clamped to the range `0x00`–`0xFF`).
 * An optional `length` parameter can limit
 * the number of characters processed from the input string.
 *
 * - **Input**:
 *   - `data`: The ASCII string to decode.
 *   - `length`: (Optional) The maximum number of characters to process from the input string.
 *
 * - **Output**:
 *   - Returns a `Uint8Array` containing the byte representation of the input ASCII string.
 *
 * ## Error Handling:
 * - Throws an error if the `data` parameter is not a string.
 *
 * ## Example:
 *
 * ```ts
 * const asciiString = "Hello";
 * console.log(decodeASCII(asciiString));        // Outputs: Uint8Array(5) [ 72, 101, 108, 108, 111 ]
 *
 * const partialString = "ABCD";
 * console.log(decodeASCII(partialString, 2));  // Outputs: Uint8Array(2) [ 65, 66 ]
 * ```
 *
 * @param data - The ASCII string to decode.
 * @param length - (Optional) The maximum number of characters to process.
 * Defaults to the entire string length.
 * @returns A `Uint8Array` containing the byte representation of the ASCII string.
 * @throws {Error} If the input is not a string.
 */

export function decodeASCII(data: string, length?: number): Uint8Array {
    if (typeof data !== 'string') {
        throw new Error('decodeASCII input must be a string');
    }

    // Clamp the length to the array bounds if specified.
    const maxLength = length !== undefined ? Math.min(length, data.length) : data.length;

    // Process only up to the specified length.
    return new Uint8Array(
        Array.from(data.slice(0, maxLength), char => char.charCodeAt(0) & 0xFF)
    );
}

/**
 * Encodes a `Uint8Array` into a UTF-16 little-endian string.
 *
 * ## Description:
 * This function takes a `Uint8Array` representing a sequence of bytes and decodes it into a UTF-16 little-endian string.
 * The function processes the array in pairs of bytes (low and high byte) to generate the corresponding
 * character codes. It stops decoding when an incomplete byte pair is encountered or when a null character is found.
 *
 * - **Input**:
 *   - `bytes`: The `Uint8Array` to encode.
 *   - `length`: (Optional) The maximum number of bytes to process from the array.
 *
 * - **Output**:
 *   - Returns a string corresponding to the UTF-16 little-endian encoding of the input byte sequence.
 *
 * ## Error Handling:
 * - Throws an error if the `bytes` parameter is not an instance of `Uint8Array`.
 *
 * ## Example:
 *
 * ```ts
 * const byteArray = new Uint8Array([72, 0, 101, 0, 108, 0, 108, 0, 111, 0]);
 * console.log(encodeUTF16LE(byteArray));  // Outputs: "Hello"
 *
 * const partialArray = new Uint8Array([72, 0, 101, 0]);
 * console.log(encodeUTF16LE(partialArray));  // Outputs: "He"
 * ```
 *
 * @param bytes - The `Uint8Array` to encode into a UTF-16 little-endian string.
 * @param length - (Optional) The maximum number of bytes to process from the `Uint8Array`. Defaults to the entire array length.
 * @returns A string corresponding to the UTF-16 little-endian encoding of the byte sequence.
 * @throws {Error} If the `bytes` parameter is not a `Uint8Array`.
 */

export function encodeUTF16LE(bytes: Uint8Array, length?: number): string {
    if (!isInstance(bytes, Uint8Array)) {
        throw new Error('encodeUTF16LE input must be a Uint8Array');
    }

    // Clamp the length to the array bounds if specified.
    const maxLength = length !== undefined ? Math.min(length, bytes.length) : bytes.length;

    let str = '';
    for (let i = 0; i < maxLength; i += 2) {
        if (i + 1 >= maxLength) break; // Incomplete pair, stop decoding

        const lowByte = bytes[i];
        const highByte = bytes[i + 1];
        const charCode = lowByte | (highByte << 8);

        if (charCode === 0) break; // Skip null characters

        str += String.fromCharCode(charCode);
    }

    return str;
}

/**
 * Decodes a UTF-16 little-endian string into a `Uint8Array`.
 *
 * ## Description:
 * This function takes a UTF-16 little-endian encoded string and decodes it into a `Uint8Array` of bytes.
 * It processes each character from the string and splits its `charCode` into two bytes (low and high byte).
 * The function ensures that the `length` parameter is valid,
 * and the resulting byte array has an even length (as required for UTF-16).
 *
 * - **Input**:
 *   - `data`: The string to decode from UTF-16 little-endian encoding.
 *   - `length`: (Optional) The number of bytes to decode.
 *   Defaults to the length of the entire string.
 *
 * - **Output**:
 *   - Returns a `Uint8Array` corresponding to the UTF-16 little-endian encoded byte sequence of the input string.
 *
 * ## Error Handling:
 * - Throws an error if the `data` parameter is not a string.
 *
 * ## Example:
 *
 * ```ts
 * const str = "Hello";
 * const byteArray = decodeUTF16LE(str);
 * console.log(byteArray);  // Outputs: Uint8Array [ 72, 0, 101, 0, 108, 0, 108, 0, 111, 0 ]
 *
 * const str2 = "Hi";
 * const byteArray2 = decodeUTF16LE(str2, 2);
 * console.log(byteArray2);  // Outputs: Uint8Array [ 72, 0, 105, 0 ]
 * ```
 *
 * @param data - The UTF-16 little-endian string to decode.
 * @param length - (Optional) The number of bytes to decode from the string.
 * Defaults to the full length of the string in bytes.
 * @returns A `Uint8Array` corresponding to the UTF-16 little-endian byte sequence.
 * @throws {Error} If the `data` parameter is not a string.
 */

export function decodeUTF16LE(data: string, length?: number): Uint8Array {
    if (typeof data !== 'string') {
        throw new Error('decodeUTF16LE input must be a string');
    }

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
 * Encodes a `Uint8Array` into a hexadecimal string.
 *
 * ## Description:
 * This function takes a `Uint8Array` of bytes and converts it into a hexadecimal string representation.
 * Each byte is converted to a two-character hexadecimal string,
 * and the results are concatenated together to form the final string.
 * The function supports an optional `length` parameter to limit the number of bytes to encode.
 *
 * - **Input**:
 *   - `bytes`: A `Uint8Array` representing the bytes to encode.
 *   - `length`: (Optional) The number of bytes to encode.
 *   Defaults to the entire length of the `bytes` array.
 *
 * - **Output**:
 *   - Returns a hexadecimal string representation of the bytes,
 *   with each byte represented by two hexadecimal characters.
 *
 * ## Error Handling:
 * - Throws an error if the `bytes` parameter is not a `Uint8Array`.
 *
 * ## Example:
 *
 * ```ts
 * const byteArray = new Uint8Array([255, 16, 32]);
 * const hexString = encodeHEX(byteArray);
 * console.log(hexString);  // Outputs: "ff1020"
 *
 * const byteArray2 = new Uint8Array([1, 2, 3, 4, 5]);
 * const hexString2 = encodeHEX(byteArray2, 3);
 * console.log(hexString2);  // Outputs: "010203"
 * ```
 *
 * @param bytes - The `Uint8Array` to encode into hexadecimal.
 * @param length - (Optional) The number of bytes to encode.
 * Defaults to the full length of the array.
 * @returns A string representing the hexadecimal encoding of the bytes.
 * @throws {Error} If the `bytes` parameter is not a `Uint8Array`.
 */

export function encodeHEX(bytes: Uint8Array, length?: number): string {
    if (!isInstance(bytes, Uint8Array)) {
        throw new Error('encodeHEX input must be a Uint8Array');
    }

    // Clamp the length to the array bounds if specified.
    const maxLength = length !== undefined ? Math.min(length, bytes.length) : bytes.length;

    return Array.from(bytes.slice(0, maxLength))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Decodes a hexadecimal string into a `Uint8Array`.
 *
 * ## Description:
 * This function takes a hexadecimal string and converts it into a `Uint8Array` of bytes.
 * The string is parsed in pairs of hexadecimal digits (representing one byte each),
 * and the corresponding byte values are placed into the resulting array.
 * It supports truncating the result to a specific byte length if required.
 *
 * - **Input**:
 *   - `data`: A hexadecimal string to decode.
 *   - `length`: (Optional) The number of bytes to decode.
 *   If not specified, the entire string will be decoded.
 *
 * - **Output**:
 *   - Returns a `Uint8Array` containing the decoded byte values.
 *
 * ## Error Handling:
 * - Throws an error if the `data` is not a valid string.
 * - Throws an error if the `data` contains any non-hexadecimal characters.
 *
 * ## Example:
 *
 * ```ts
 * const hexString = "ff1020";
 * const bytes = decodeHEX(hexString);
 * console.log(bytes);  // Outputs: Uint8Array [ 255, 16, 32 ]
 *
 * const hexString2 = "01020304";
 * const bytes2 = decodeHEX(hexString2, 3);
 * console.log(bytes2);  // Outputs: Uint8Array [ 1, 2, 3 ]
 * ```
 *
 * @param data - The hexadecimal string to decode.
 * @param length - (Optional) The number of bytes to decode.
 * Defaults to the entire string.
 * @returns A `Uint8Array` containing the decoded byte values.
 * @throws {Error} If the input is not a string or contains non-hex characters.
 */

export function decodeHEX(data: string, length?: number): Uint8Array {
    if (typeof data !== 'string') {
        throw new Error('decodeHEX input must be a string');
    }

    if (/[^a-fA-F0-9]/.test(data)) {
        throw new Error('Invalid hex string: contains non-hex characters');
    }

    // If the length is odd, remove the last character to make the string even
    if (data.length % 2 !== 0) {
        data = data.slice(0, data.length - 1);
    }

    // Truncate based on the provided length (in bytes)
    const maxLength = length !== undefined ? Math.min(length * 2, data.length) : data.length;
    const hexBytes = new Uint8Array(maxLength / 2);
    for (let i = 0; i < maxLength; i += 2) {
        hexBytes[i / 2] = parseInt(data.slice(i, i + 2), 16);
    }

    return hexBytes;
}

/**
 * Encodes a `Uint8Array` into a Base64 string.
 *
 * ## Description:
 * This function takes a `Uint8Array` of bytes and converts it into a Base64 encoded string.
 * The function processes the bytes in blocks of three, combining them into a 24-bit number,
 * then extracting the corresponding for Base64 characters from that number.
 * The result is padded with `=` as needed.
 *
 * - **Input**:
 *   - `bytes`: A `Uint8Array` representing the bytes to encode.
 *   - `length`: (Optional) The number of bytes to encode.
 *   Defaults to the entire array.
 *
 * - **Output**:
 *   - Returns a Base64 encoded string.
 *
 * ## Error Handling:
 * - Throws an error if the `bytes` parameter is not a `Uint8Array`.
 *
 * ## Example:
 *
 * ```ts
 * const byteArray = new Uint8Array([255, 16, 32]);
 * const base64String = encodeBase64(byteArray);
 * console.log(base64String);  // Outputs: "fwY="
 *
 * const byteArray2 = new Uint8Array([1, 2, 3, 4, 5]);
 * const base64String2 = encodeBase64(byteArray2, 3);
 * console.log(base64String2);  // Outputs: "AQID"
 * ```
 *
 * @param bytes - The `Uint8Array` to encode into Base64.
 * @param length - (Optional) The number of bytes to encode.
 * Defaults to the full length of the array.
 * @returns A Base64 encoded string.
 * @throws {Error} If the `bytes` parameter is not a `Uint8Array`.
 */

export function encodeBase64(bytes: Uint8Array, length?: number): string {
    if (!isInstance(bytes, Uint8Array)) {
        throw new Error('encodeBase64 input must be a Uint8Array');
    }

    let i = 0;
    const result = [];
    const maxLength = length !== undefined ? Math.min(length, bytes.length) : bytes.length;

    while (i < maxLength) {
        const byte1 = bytes[i++];
        const byte2 = i < maxLength ? bytes[i++] : 0;
        const byte3 = i < maxLength ? bytes[i++] : 0;

        // Combine the 3 bytes into a 24-bit number
        const combined = (byte1 << 16) | (byte2 << 8) | byte3;

        // Extract 4 Base64 characters from the 24-bit number
        result.push(
            chars.charAt((combined >> 18) & 0x3F),
            chars.charAt((combined >> 12) & 0x3F),
            i - 1 < maxLength ? chars.charAt((combined >> 6) & 0x3F) : '=',
            i < maxLength + 1 ? chars.charAt(combined & 0x3F) : '='
        );
    }

    // Handle padding based on the number of bytes processed
    const padding = maxLength % 3;
    if (padding === 1) {
        result.splice(result.length - 2, 2, '==');
    } else if (padding === 2) {
        result.splice(result.length - 1, 1, '=');
    }

    return result.join('');
}

/**
 * Decodes a Base64 encoded string into a `Uint8Array`.
 *
 * ## Description:
 * This function takes a Base64 encoded string and converts it into a `Uint8Array` of bytes.
 * It decodes the string in chunks of 4 characters, converting each 4-character Base64 block
 * into 3 bytes.
 * Padding characters (`=`) are handled appropriately to adjust the final decoded result.
 *
 * - **Input**:
 *   - `data`: A Base64 encoded string to decode.
 *   - `length`: (Optional) The number of bytes to decode.
 *   If not specified, the entire Base64 string will be decoded.
 *
 * - **Output**:
 *   - Returns a `Uint8Array` containing the decoded byte values.
 *
 * ## Error Handling:
 * - Throws an error if the `data` is not a valid string.
 *
 * ## Example:
 *
 * ```ts
 * const base64String = "fwY=";
 * const bytes = decodeBase64(base64String);
 * console.log(bytes);  // Outputs: Uint8Array [ 255, 16, 32 ]
 *
 * const base64String2 = "AQID";
 * const bytes2 = decodeBase64(base64String2, 3);
 * console.log(bytes2);  // Outputs: Uint8Array [ 1, 2, 3 ]
 * ```
 *
 * @param data - The Base64 encoded string to decode.
 * @param length - (Optional) The number of bytes to decode.
 * Defaults to the entire string.
 * @returns A `Uint8Array` containing the decoded byte values.
 * @throws {Error} If the input is not a string.
 */

export function decodeBase64(data: string, length?: number): Uint8Array {
    if (typeof data !== 'string') {
        throw new Error('decodeHEX input must be a string');
    }

    if (!/^[A-Za-z0-9+/=\n\s@]*$/.test(data)) {
        return new Uint8Array(0);
    }

    // Remove non-Base64 characters (e.g., @, or any other invalid characters)
    const sanitizedData = data.replace(/[\s\n=@]/g, '');
    const maxLength = length !== undefined ? Math.min(length, data.length) : data.length;

    const decodedBytes: number[] = [];
    for (let i = 0; i < sanitizedData.length; i += 4) {
        const sextet1 = lookup[sanitizedData.charCodeAt(i)];
        const sextet2 = lookup[sanitizedData.charCodeAt(i + 1)];
        const sextet3 = sanitizedData[i + 2] !== undefined ? lookup[sanitizedData.charCodeAt(i + 2)] : 0;
        const sextet4 = sanitizedData[i + 3] !== undefined ? lookup[sanitizedData.charCodeAt(i + 3)] : 0;

        // Decode 4 Base64 characters into 3 bytes
        const byte1 = (sextet1 << 2) | (sextet2 >> 4);
        const byte2 = ((sextet2 & 15) << 4) | (sextet3 >> 2);
        const byte3 = ((sextet3 & 3) << 6) | sextet4;

        decodedBytes.push(byte1);
        if (sanitizedData[i + 2] !== undefined) decodedBytes.push(byte2);
        if (sanitizedData[i + 3] !== undefined) decodedBytes.push(byte3);

        // Stop decoding if the optional length is reached
        if (maxLength !== undefined && decodedBytes.length >= maxLength) {
            return new Uint8Array(decodedBytes.slice(0, maxLength));
        }
    }

    // Trim all trailing zeros from the decoded array
    while (decodedBytes[decodedBytes.length - 1] === 0) {
        decodedBytes.pop();
    }

    return new Uint8Array(decodedBytes);
}
