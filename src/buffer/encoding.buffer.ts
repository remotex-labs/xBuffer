/**
 * Encodes a string into UTF-8 bytes.
 *
 * @param data - The input string to be encoded.
 * @param length - The maximum number of bytes to encode. Default is Infinity.
 * @returns A Uint8Array containing the UTF-8 encoded bytes.
 */

export function utf8Encode(data: string, length: number = Infinity): Uint8Array {
    const utf8 = [];
    let bytesEncoded = 0;

    for (let i = 0; i < data.length; i++) {
        const charCode = data.charCodeAt(i);

        if (bytesEncoded >= length) {
            break;
        }

        if (charCode < 0x80) {
            if ((bytesEncoded += 1) <= length) utf8.push(charCode);
        } else if (charCode < 0x800) {
            if ((bytesEncoded += 2) <= length) {
                utf8.push(
                    0xc0 | (charCode >> 6),
                    0x80 | (charCode & 0x3f)
                );
            }
        } else if (charCode < 0x10000) {
            if ((bytesEncoded += 3) <= length) {
                if (charCode >= 0xD800 && charCode <= 0xDBFF) {
                    // High surrogate
                    const highSurrogate = charCode;
                    const lowSurrogate = data.charCodeAt(i + 1);

                    if (lowSurrogate >= 0xDC00 && lowSurrogate <= 0xDFFF) {
                        // Low surrogate
                        const codePoint = ((highSurrogate - 0xD800) << 10) + (lowSurrogate - 0xDC00) + 0x10000;
                        utf8.push(
                            0xf0 | (codePoint >> 18),
                            0x80 | ((codePoint >> 12) & 0x3f),
                            0x80 | ((codePoint >> 6) & 0x3f),
                            0x80 | (codePoint & 0x3f)
                        );

                        i++; // Skip the next character as it was part of the surrogate pair
                    } else {
                        // Unmatched surrogate, treat as replacement character
                        utf8.push(0xef, 0xbf, 0xbd);
                    }
                } else {
                    utf8.push(
                        0xe0 | (charCode >> 12),
                        0x80 | ((charCode >> 6) & 0x3f),
                        0x80 | (charCode & 0x3f)
                    );
                }
            }
        } else if (charCode < 0x110000) {
            if ((bytesEncoded += 4) <= length) {
                utf8.push(
                    0xf0 | (charCode >> 18),
                    0x80 | ((charCode >> 12) & 0x3f),
                    0x80 | ((charCode >> 6) & 0x3f),
                    0x80 | (charCode & 0x3f)
                );
            }
        }
    }

    return new Uint8Array(utf8);
}

/**
 * Decodes UTF-8 bytes into a string.
 *
 * @param bytes - The input Uint8Array containing UTF-8 encoded bytes.
 * @returns The decoded string.
 */

export function utf8Decode(bytes: Uint8Array): string {
    let decodedString = '';
    let i = 0;

    while (i < bytes.length) {
        const byte = bytes[i++];

        if (byte < 0x80) {
            // Single-byte character
            decodedString += String.fromCharCode(byte);
        } else if (byte < 0xE0) {
            // Two-byte character
            const secondByte = bytes[i++];
            const char = ((byte & 0x1F) << 6) | (secondByte & 0x3F);

            if (char > 0) {
                decodedString += String.fromCharCode(char);
            } else {
                decodedString += '\uFFFD\uFFFD'; // Replace invalid sequence with replacement character
            }
        } else if (byte < 0xF0) {
            // Three-byte character
            const secondByte = bytes[i++];
            const thirdByte = bytes[i++];
            const char = ((byte & 0xF) << 12) | ((secondByte & 0x3F) << 6) | (thirdByte & 0x3F);

            if (char > 0) {
                decodedString += String.fromCharCode(char);
            } else {
                decodedString += '\uFFFD\uFFFD\uFFFD'; // Replace invalid sequence with replacement character
            }
        } else {
            // Four-byte character
            const secondByte = bytes[i++];
            const thirdByte = bytes[i++];
            const fourthByte = bytes[i++];
            const codePoint =
                ((byte & 0x7) << 18) | ((secondByte & 0x3F) << 12) | ((thirdByte & 0x3F) << 6) | (fourthByte & 0x3F);

            // Check for valid code point range
            if (codePoint < 0x10FFFF && (codePoint < 0xD800 || codePoint > 0xDFFF)) {
                // Check for surrogate pairs
                if (codePoint > 0xFFFF) {
                    const surrogatePair = codePoint - 0x10000;
                    const highSurrogate = 0xD800 | (surrogatePair >> 10);
                    const lowSurrogate = 0xDC00 | (surrogatePair & 0x3FF);
                    decodedString += String.fromCharCode(highSurrogate, lowSurrogate);
                } else {
                    decodedString += String.fromCharCode(codePoint);
                }
            } else {
                // Invalid code point, treat as replacement character
                decodedString += '\uFFFD\uFFFD\uFFFD';
            }
        }
    }

    return decodedString;
}

/**
 * Encodes a string into ASCII bytes.
 *
 * @param data - The input string to be encoded.
 * @param length - The maximum number of bytes to encode.
 * @returns A Uint8Array containing the ASCII encoded bytes.
 */

export function asciiEncode(data: string, length?: number): Uint8Array {
    const asciiBytes = [];
    length = length !== undefined ? Math.min(length, data.length) : data.length;

    for (let i = 0; i < length; ++i) {
        // Node's code seems to be doing this and not & 0x7F..
        asciiBytes.push(data.charCodeAt(i) & 0xFF);
    }

    return new Uint8Array(asciiBytes);
}

/**
 * Decodes ASCII bytes into a string.
 *
 * @param  bytes - The input Uint8Array containing ASCII encoded bytes.
 * @returns  The decoded string.
 */

export function asciiDecode(bytes: Uint8Array): string {
    let str = '';

    for (let i = 0; i < bytes.length; ++i) {
        str += String.fromCharCode(bytes[i] & 0x7F);
    }

    return str;
}

/**
 * Encodes a string into UTF-16LE bytes.
 *
 * @param data - The input string to be encoded.
 * @param length - The maximum number of bytes to encode.
 * @returns A Uint8Array containing the UTF-16LE encoded bytes.
 */
export function utf16leEncode(data: string, length?: number): Uint8Array {
    // Ensure that length is even and greater than 0
    length = length !== undefined ? Math.max(Math.floor(length / 2) * 2, 0) : data.length * 2;
    length =  Math.min(length, data.length * 2);

    if (length === 0) {
        // Skip the function
        return new Uint8Array(0);
    }

    const utf16leBytes = new Uint8Array(length);
    for (let i = 0; i < length; i += 2) {
        const charCode = data.charCodeAt(i / 2);
        utf16leBytes[i] = charCode & 0xFF;
        utf16leBytes[i + 1] = (charCode >> 8) & 0xFF;
    }

    return utf16leBytes;
}

/**
 * Decodes UTF-16LE bytes into a string.
 *
 * @param bytes - The input Uint8Array containing UTF-16LE encoded bytes.
 * @returns {string} The decoded string.
 */

export function utf16leDecode(bytes: Uint8Array): string {
    let str = '';
    for (let i = 0; i < bytes.length; i += 2) {
        const lowByte = bytes[i];
        const highByte = bytes[i + 1];
        const charCode = lowByte | (highByte << 8);

        // Check for null byte
        if (charCode === 0) {
            break;
        }

        str += String.fromCharCode(charCode);
    }

    return str;
}

/**
 * Converts a hex string to a Uint8Array.
 *
 * @param hexString - The input hex string.
 * @param length - The maximum number of bytes to encode.
 * @returns A Uint8Array containing the decoded bytes.
 */

export function hexEncode(hexString: string, length?: number): Uint8Array {
    const bytes = [];
    const hexLength = hexString.length;

    // Calculate the actual length to decode based on the provided length or the full length of the hex string
    const actualLength = length !== undefined ? Math.min(length * 2, hexLength) : hexLength;

    for (let i = 0; i < actualLength; i += 2) {
        const byte = parseInt(hexString.slice(i, i + 2), 16);
        bytes.push(byte);
    }

    return new Uint8Array(bytes);
}

/**
 * Converts a Uint8Array to a hex string.
 *
 * @param bytes - The input Uint8Array.
 * @returns A hex string representation of the input bytes.
 */

export function hexDecode(bytes: Uint8Array): string {
    return Array.from(bytes)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Encodes a base64 string into a Uint8Array containing the corresponding hexadecimal representation.
 *
 * @param base64String - The base64-encoded string to be converted.
 * @param length - Optional. The length of the resulting Uint8Array. If provided, the output will be truncated or padded accordingly.
 * @returns A Uint8Array containing the hexadecimal representation of the base64-encoded string.
 *
 * @throws {DOMException} Throws a DOMException with the message "Failed to execute 'atob' on 'Window':
 * The string to be decoded is not correctly encoded." if the input base64String is not a valid base64 encoding.
 */

export function base64Encode(base64String: string, length?: number): Uint8Array {
    if (base64String.length < 2) {
        return new Uint8Array(0);
    }

    try {
        base64String = atob(base64String);
        length = length !== undefined ? Math.min(length, base64String.length) : base64String.length;
        const bytes = new Uint8Array(length);

        for (let i = 0; i < length; ++i) {
            bytes[i] = base64String.charCodeAt(i);
        }

        return bytes;
    } catch (e) {
        return new Uint8Array(0);
    }
}

/**
 * Decodes a Uint8Array containing binary data into a base64-encoded string.
 *
 * @param bytes - The Uint8Array containing binary data to be encoded.
 * @returns A base64-encoded string representing the input binary data.
 */

export function base64Decode(bytes: Uint8Array) {
    let binaryString = '';

    if (!bytes[0]) {
        return '';
    }

    for (let i = 0; i < bytes.length; i++) {
        binaryString += String.fromCharCode(bytes[i]);
    }

    return btoa(binaryString);
}