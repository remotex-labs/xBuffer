/**
 * Import will remove at compile time
 */

import type { primitiveInputType } from '@providers/interfaces/buffer.interfaces';

/**
 * Imports
 */

import { DataViewProvider } from '@providers/data-view.provider';
import { decodeUTF8, encodeUTF8 } from '@components/utf8.component';
import {
    encodeHEX,
    decodeHEX,
    isInstance,
    encodeASCII,
    decodeASCII,
    decodeBase64,
    encodeBase64,
    decodeUTF16LE,
    encodeUTF16LE
} from '@components/charset.component';

export class Buffer extends DataViewProvider {
    /**
     * Limits of buffer
     */

    static readonly constants = {
        MAX_LENGTH: 4294967296,
        MAX_STRING_LENGTH: 536870888
    };

    /**
     * The private constructor for a custom class extending `Uint8Array`.
     * This constructor initializes an instance based on the input type (length, array-like structure, or buffer),
     * and also creates an associated `DataView` for working with the underlying buffer.
     */

    private constructor(length: number);
    private constructor(array: ArrayLike<number> | ArrayBufferLike);
    private constructor(buffer: ArrayBufferLike, byteOffset?: number, length?: number);
    private constructor(arg: number | ArrayLike<number> | ArrayBufferLike, byteOffset?: number, length?: number) {
        super(<any> arg, byteOffset, length);
    }

    /**
     * A static method that creates a new `Buffer` instance from various input types.
     * It supports creating a buffer from a string, a `Uint8Array`, an array of numbers,
     * or an `ArrayBuffer` (with optional byte offset and length).
     * This method offers flexible ways to initialize buffers from different types of input data.
     *
     * ## Description:
     * The `from` method allows the creation of a new `Buffer` instance from a wide variety of input types.
     * This includes strings, arrays, typed arrays, and `ArrayBuffer` instances, making it highly versatile
     * for various use cases. It also supports optional encoding for string inputs and can handle different
     * types of binary data sources.
     *
     * - **Input**:
     *   - `string`: A string to be converted into a buffer.
     *   - `Uint8Array | readonly number[]`: A typed array or regular array representing raw binary data.
     *   - `WithImplicitCoercion<string>`: A string to be encoded with the specified `encoding` format.
     *   - `ArrayBuffer | SharedArrayBuffer`: A low-level binary data object.
     *   - `byteOffset` (optional): A starting index for creating the buffer from an `ArrayBuffer`.
     *   - `length` (optional): The length of the resulting buffer when working with an `ArrayBuffer`.
     *
     * - **Output**: Returns a new `Buffer` instance that contains the encoded or copied data.
     *
     * ## Example:
     *
     * ```ts
     * const buffer1 = Buffer.from("Hello, world!", "utf8");
     * const buffer2 = Buffer.from([72, 101, 108, 108, 111]);
     * const buffer3 = Buffer.from(new Uint8Array([1, 2, 3, 4]));
     * const buffer4 = Buffer.from(new ArrayBuffer(16));
     * ```
     *
     * ## Error Handling:
     * - Throws a `TypeError` if the input type is not recognized or is unsupported.
     * - If the `encoding` argument is provided but is invalid, it will throw an error.
     * - When using `ArrayBuffer`, if the provided `byteOffset` or `length` is out of bounds, it throws an error.
     */

    static override from(value: Uint8Array | readonly number[]): Buffer;
    static override from(value: string | Uint8Array | readonly number[]): Buffer;
    static override from(value: WithImplicitCoercion<string>, encoding: BufferEncoding): Buffer;
    static override from(arrayBuffer: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer | ArrayBufferLike>, byteOffset?: number, length?: number): Buffer;
    static override from(arg1: unknown, arg2?: BufferEncoding | number, length?: number): Buffer {
        if (typeof arg1 === 'string') {
            return new Buffer(this.decoding(arg1, <BufferEncoding> arg2));
        } else if (ArrayBuffer.isView(arg1) || Array.isArray(arg1)) {
            return new Buffer(new Uint8Array(<any> arg1, <number> arg2, length));
        } else if(isInstance(arg1, ArrayBuffer)) {
            return new Buffer(<any> arg1, <number> arg2, length);
        } else {
            // Throw a TypeError if the argument is not supported
            throw new TypeError('The "from" method expects valid input arguments.');
        }
    }

    /**
     * A static method that creates a new `Buffer` instance containing the provided list of numbers.
     * Each number is treated as a byte value and is used to populate the resulting `Buffer`.
     * This method is useful when you want to create a buffer directly from a series of numbers
     * representing byte values.
     *
     * ## Description:
     * The `of` method takes a series of numbers as arguments and creates a new `Buffer` instance
     * where each number is used as a byte in the buffer. This method is convenient when you have raw
     * byte data that you want to store in a buffer.
     *
     * - **Input**:
     *   - `...items`: A series of numbers (each between 0 and 255) to be included in the new buffer.
     *
     * - **Output**: Returns a new `Buffer` instance containing the provided byte values.
     *
     * ## Example:
     *
     * ```ts
     * const buffer = Buffer.of(72, 101, 108, 108, 111); // Creates a buffer with the byte values [72, 101, 108, 108, 111]
     * ```
     *
     * ## Error Handling:
     * - Throws a `TypeError` if any of the values provided are not valid numbers (i.e., not between 0 and 255).
     *
     * @static
     * @param items - A series of numbers to be converted into a buffer.
     * @returns A new `Buffer` instance containing the provided byte values.
     * @throws TypeError if any value is not a valid number between 0 and 255.
     */

    static override of(...items: Array<number>): Buffer {
        return new Buffer(items);
    }

    /**
     * A static method that checks if the provided encoding string is a valid encoding type supported by the `Buffer` class.
     * This method is used to validate encoding types before attempting to use them in encoding or decoding operations.
     *
     * ## Description:
     * The `isEncoding` method checks whether the given encoding string is one of the supported encodings for the `Buffer` class.
     * It returns a boolean value indicating whether the encoding is valid or not.
     *
     * - **Input**:
     *   - `encoding`: A string representing the encoding type to be validated.
     *
     * - **Output**: Returns a boolean (`true` or `false`) indicating whether the provided encoding is a valid `BufferEncoding`.
     *
     * ## Supported Encodings:
     * - **`'hex'`**: Hexadecimal encoding.
     * - **`'utf8'` / `'utf-8'`**: UTF-8 encoding.
     * - **`'ascii'` / `'latin1'` / `'binary'`**: ASCII or Latin-1 encoding.
     * - **`'base64'`**: Base64 encoding.
     * - **`'ucs2'` / `'ucs-2'` / `'utf16le'` / `'utf-16le'`**: UTF-16 Little Endian encoding.
     *
     * ## Example:
     *
     * ```ts
     * console.log(Buffer.isEncoding('utf8')); // true
     * console.log(Buffer.isEncoding('base64')); // true
     * console.log(Buffer.isEncoding('unsupported')); // false
     * ```
     *
     * ## Error Handling:
     * - This method does not throw any exceptions. It simply returns `true` or `false` based on the validity of the encoding.
     *
     * @static
     * @param encoding - The encoding to check for validity.
     * @returns `true` if the encoding is valid, otherwise `false`.
     */

    static isEncoding(encoding: string): encoding is BufferEncoding {
        return [
            'hex', 'utf8', 'utf-8', 'ascii', 'latin1', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le'
        ].includes(encoding.toLowerCase());
    }

    /**
     * Checks if the given object is an instance of the `Buffer` class.
     *
     * ## Description:
     * This method verifies whether the provided object is an instance of the `Buffer` class.
     * It uses a type-checking utility to ensure that the object matches the expected class type.
     *
     * - **Input**:
     *   - `buffer`: The object to be checked.
     *
     * - **Output**:
     *   - Returns `true` if the object is an instance of `Buffer`, otherwise `false`.
     *
     * ## Example:
     *
     * ```ts
     * const buf = new Buffer();
     * const result1 = Buffer.isBuffer(buf);
     * console.log(result1); // Outputs: true
     *
     * const notBuf = {};
     * const result2 = Buffer.isBuffer(notBuf);
     * console.log(result2); // Outputs: false
     * ```
     *
     * @param buffer - The object to check for being an instance of `Buffer`.
     * @returns `true` if the object is an instance of `Buffer`, otherwise `false`.
     */

    static isBuffer(buffer: Buffer): boolean {
        return isInstance(buffer, Buffer);
    }

    /**
     * A static method that calculates the byte length of a given string, `ArrayBuffer`, or `ArrayBufferView`.
     * This method accounts for the encoding of the string when calculating the byte length.
     * It is useful for determining the memory size of data before or after encoding.
     *
     * ## Description:
     * The `byteLength` method takes an input,
     * which can be a string, an `ArrayBuffer`, a `SharedArrayBuffer`, or a `Uint8Array` (or any `ArrayBufferView`).
     * It returns the number of bytes used by the input data.
     * For strings, the byte length is determined by the specified encoding.
     *
     * - **Input**:
     *   - `string`: A string, `ArrayBuffer`, `SharedArrayBuffer`, `Uint8Array`, or any `ArrayBufferView`
     *   to calculate the byte length.
     *   - `encoding`: (Optional) The encoding format for the string (default: `'utf8'`).
     *   It is only used when the input is a string.
     *
     * - **Output**: Returns a `number` representing the byte length of the input.
     *
     * ## Supported Encodings:
     * - **`'hex'`**: Hexadecimal encoding.
     * - **`'utf8'` / `'utf-8'`**: UTF-8 encoding.
     * - **`'ascii'` / `'latin1'` / `'binary'`**: ASCII or Latin-1 encoding.
     * - **`'base64'`**: Base64 encoding.
     * - **`'ucs2'` / `'ucs-2'` / `'utf16le'` / `'utf-16le'`**: UTF-16 Little Endian encoding.
     *
     * ## Example:
     *
     * ```ts
     * const byteLength1 = Buffer.byteLength("Hello, world!", "utf8"); // 13 bytes
     * const byteLength2 = Buffer.byteLength(new Uint8Array([1, 2, 3])); // 3 bytes
     * const byteLength3 = Buffer.byteLength(new ArrayBuffer(16)); // 16 bytes
     * ```
     *
     * ## Error Handling:
     * - Throws a `TypeError` if the provided input is not a valid string, `ArrayBuffer`, or `ArrayBufferView`.
     * - If the encoding type is invalid, a `TypeError` is thrown when encoding the string.
     *
     * @static
     * @param string - The input data (string, `ArrayBuffer`, or `ArrayBufferView`).
     * @param encoding - The encoding format for the string (default: `'utf-8'`).
     * @returns The byte length of the input data.
     * @throws TypeError if the input type is invalid or an unknown encoding is provided.
     */

    static byteLength(
        string: string | NodeJS.ArrayBufferView | ArrayBuffer | SharedArrayBuffer,
        encoding: BufferEncoding = 'utf8'
    ): number {
        if (typeof string === 'string') {
            return this.byteLengthString(string, encoding);
        } else if (isInstance(string, ArrayBuffer) || isInstance(string, SharedArrayBuffer)) {
            // If ArrayBuffer or SharedArrayBuffer is provided, return byte length
            return string.byteLength;
        } else if (isInstance(string, Uint8Array) || ArrayBuffer.isView(string)) {
            // If Uint8Array or ArrayBufferView is provided, return byte length
            return string.byteLength;
        } else {
            // If the provided value is not a string or ArrayBuffer/View, throw an error
            throw new TypeError('Invalid input type. Expected string, ArrayBuffer, or ArrayBufferView.');
        }
    }

    /**
     * A static method that concatenates multiple `Uint8Array` or `Buffer` objects into a single `Buffer`.
     * This method is useful for combining arrays of binary data into one unified buffer.
     *
     * ## Description:
     * The `concat` method takes an array of `Uint8Array` or `Buffer` objects and combines them into a single `Buffer`.
     * The `totalLength` parameter allows you to specify the final length of the resulting `Buffer`.
     * If not provided, the method calculates the total length based on the sum of the lengths of the items in the list.
     *
     * - **Input**:
     *   - `list`: A readonly array of `Uint8Array` or `Buffer` objects to concatenate.
     *   - `totalLength` (optional): The total length of the resulting `Buffer`.
     *   If not provided, it is calculated from the sum of the lengths of the items in `list`.
     *
     * - **Output**: Returns a new `Buffer` containing all the elements from the input array, concatenated together.
     *
     * ## Example:
     *
     * ```ts
     * const buffer1 = new Buffer([1, 2, 3]);
     * const buffer2 = new Buffer([4, 5, 6]);
     * const concatenatedBuffer = Buffer.concat([buffer1, buffer2]);
     * console.log(concatenatedBuffer); // Output: <Buffer 01 02 03 04 05 06>
     * ```
     *
     * ## Error Handling:
     * - If the `list` is empty or `totalLength` is `0`, the method returns an empty `Buffer`.
     * - If `totalLength` is undefined, the method calculates the length by summing the lengths of all items in `list`.
     *
     * @static
     * @param list - The array of `Uint8Array` or `Buffer` objects to concatenate.
     * @param totalLength - (Optional) The total length of the resulting `Buffer`. If not provided, it is computed from the sum of the input items.
     * @returns A `Buffer` containing the concatenated data.
     */

    static concat(list: ReadonlyArray<Uint8Array | Buffer>, totalLength?: number): Buffer {
        if (list.length === 0 || totalLength === 0) {
            return Buffer.alloc(0); // Use `Buffer.alloc` for compatibility
        }

        // Calculate totalLength if not provided
        if (totalLength === undefined) {
            totalLength = list.reduce((acc, buf) => acc + buf.length, 0);
        }

        let offset = 0;
        const result = Buffer.alloc(totalLength);
        for (const buf of list) {
            const remaining = totalLength - offset; // Remaining space in the result buffer
            if (remaining <= 0) break; // Stop if no space left

            // Copy only as much data as fits in the remaining space
            const lengthToCopy = Math.min(buf.length, remaining);
            result.set(buf.subarray(0, lengthToCopy), offset);
            offset += lengthToCopy;
        }

        return result;
    }

    /**
     * A static method that copies a specified portion of bytes from a `TypedArray` or `ArrayBufferView` into a new `Buffer`.
     * This method allows you to extract a segment of binary data and store it in a new `Buffer`.
     *
     * ## Description:
     * The `copyBytesFrom` method takes a `TypedArray` (such as `Uint8Array`) and copies a section of its bytes starting from
     * the given `offset` for the specified `length`. It then returns a new `Buffer` containing the extracted data.
     * If no `length` is provided, the method will copy the remainder of the array starting from the specified `offset`.
     *
     * - **Input**:
     *   - `view`: The `TypedArray` (e.g., `Uint8Array`) or `ArrayBufferView` from which to copy the data.
     *   - `offset` (optional): The starting point to begin copying from within the `view`. Defaults to `0`.
     *   - `length` (optional): The number of bytes to copy. If not provided, the method will copy the remaining bytes from `offset` to the end of the array.
     *
     * - **Output**: Returns a new `Buffer` containing the copied bytes from the `view`.
     *
     * ## Example:
     *
     * ```ts
     * const source = new Uint8Array([10, 20, 30, 40, 50]);
     * const copiedBuffer = Buffer.copyBytesFrom(source, 1, 3);
     * console.log(copiedBuffer); // Output: <Buffer 14 1e 28>
     * ```
     *
     * ## Error Handling:
     * - Throws a `RangeError` if the `offset` is out of bounds (less than `0` or greater than or equal to the length of the `view`).
     * - Throws a `RangeError` if the `length` is invalid (e.g., it causes the copy operation to exceed the bounds of the `view`).
     *
     * @static
     * @param view - The `TypedArray` or `ArrayBufferView` from which to copy the bytes.
     * @param offset - (Optional) The starting position to copy from. Defaults to `0`.
     * @param length - (Optional) The number of bytes to copy. Defaults to the remainder of the array.
     * @returns A `Buffer` containing the copied data from the `view`.
     * @throws RangeError if the `offset` or `length` is out of bounds.
     */

    static copyBytesFrom(view: NodeJS.TypedArray, offset: number = 0, length: number = view.byteLength - offset): Buffer {
        if (offset < 0 || offset >= view.byteLength) {
            throw new RangeError('Offset is out of bounds');
        }

        if (length < 0 || offset + length > view.byteLength) {
            throw new RangeError('Invalid length');
        }

        const result = new Buffer(length);
        const viewCopy = new Uint8Array(view.buffer, view.byteOffset + offset * view.BYTES_PER_ELEMENT);
        result.set(viewCopy);

        return result;
    }

    /**
     * A static method that compares two `Buffer` instances to determine their relative order.
     * This method returns a value indicating whether the first buffer is less than,
     * equal to, or greater than the second buffer.
     *
     * ## Description:
     * The `compare` method compares two `Buffer` instances (`buffer1` and `buffer2`) byte-by-byte.
     * It returns:
     * - `-1` if `buffer1` is lexicographically less than `buffer2`,
     * - `0` if `buffer1` is equal to `buffer2`,
     * - `1` if `buffer1` is lexicographically greater than `buffer2`.
     *
     * The comparison is performed based on the numeric values of the bytes in the buffers.
     * The method uses the `compare` function of the `Buffer` class to perform the comparison.
     *
     * - **Input**:
     *   - `buffer1`: The first `Buffer` to be compared.
     *   - `buffer2`: The second `Buffer` to be compared.
     *
     * - **Output**: Returns:
     *   - `-1` if `buffer1` is less than `buffer2`,
     *   - `0` if they are equal,
     *   - `1` if `buffer1` is greater than `buffer2`.
     *
     * ## Example:
     *
     * ```ts
     * const buffer1 = Buffer.from([10, 20, 30]);
     * const buffer2 = Buffer.from([10, 20, 30]);
     * const buffer3 = Buffer.from([10, 20, 40]);
     *
     * console.log(Buffer.compare(buffer1, buffer2)); // Output: 0 (equal)
     * console.log(Buffer.compare(buffer1, buffer3)); // Output: -1 (less than)
     * console.log(Buffer.compare(buffer3, buffer1)); // Output: 1 (greater than)
     * ```
     *
     * ## Error Handling:
     * - The method assumes that both inputs are valid `Buffer` instances. If either argument is not a `Buffer`, it will throw a `TypeError`.
     *
     * @static
     * @param buffer1 - The first `Buffer` to compare.
     * @param buffer2 - The second `Buffer` to compare.
     * @returns A number (`-1`, `0`, or `1`) indicating the relative order of the buffers.
     * @throws TypeError if either argument is not a `Buffer`.
     */

    static compare(buffer1: Buffer, buffer2: Buffer): -1 | 0 | 1 {
        return buffer1.compare(buffer2);
    }

    /**
     * A static method that allocates a new `Buffer` of the specified size, optionally filling it with a specified value.
     * The buffer is initialized with a default value,
     * or it can be filled with a custom value, such as a string, `Uint8Array`, or number.
     *
     * ## Description:
     * The `alloc` method creates a new `Buffer` of the specified size, and optionally fills it with a specified value.
     * If the `fill` parameter is provided, the buffer will be filled with that value.
     * By default, the buffer is filled with `0`.
     * The method will throw an error if the specified size is invalid or out of range.
     *
     * - **Input**:
     *   - `size`: The size of the `Buffer` to allocate (in bytes). This must be a number.
     *   - `fill` (optional): The value to fill the buffer with. It can be a string, `Uint8Array`, or a number. Default is `0`.
     *   - `encoding` (optional): The encoding to use if the `fill` value is a string. Default is `'utf-8'`.
     *
     * - **Output**: Returns a new `Buffer` of the specified size, optionally filled with the provided value.
     *
     * ## Example:
     *
     * ```ts
     * const buffer1 = Buffer.alloc(10); // Allocates a buffer of 10 bytes, filled with 0
     * const buffer2 = Buffer.alloc(10, 'A'); // Allocates a buffer of 10 bytes, filled with 'A' (UTF-8 encoded)
     * const buffer3 = Buffer.alloc(10, 255); // Allocates a buffer of 10 bytes, filled with 255 (0xFF)
     * const buffer4 = Buffer.alloc(10, new Uint8Array([1, 2, 3])); // Allocates a buffer of 10 bytes, filled with 1, 2, 3
     * ```
     *
     * ## Error Handling:
     * - Throws a `TypeError` if the `size` argument is not a valid number.
     * - Throws a `RangeError` if the `size` exceeds the maximum allowed buffer size or is negative.
     * - If the `fill` argument is a string, it will be encoded using the provided `encoding` (default: `'utf-8'`).
     * - If the `fill` argument is a `Uint8Array` or number, it will fill the buffer directly.
     *
     * @static
     * @param size - The size of the buffer to allocate, in bytes.
     * @param fill - (Optional) The value to fill the buffer with (string, `Uint8Array`, or number).
     * @param encoding - (Optional) The encoding to use if the `fill` is a string (default: `'utf-8'`).
     * @returns A new `Buffer` of the specified size, filled with the specified value.
     * @throws TypeError if the `size` argument is not a valid number.
     * @throws RangeError if the `size` is out of range.
     */

    static alloc(size: number, fill: string | Uint8Array | number = 0, encoding: BufferEncoding = 'utf-8'): Buffer {
        if (typeof size !== 'number') {
            throw new TypeError('The "size" argument must be of type number.');
        }

        if (size > Buffer.constants.MAX_LENGTH || size < 0) {
            throw new RangeError('ERR_OUT_OF_RANGE');
        }

        const buffer = new Buffer(size);
        if (fill !== 0) {
            buffer.fill(fill, 0, size, encoding);
        }

        return buffer;
    }

    /**
     * A static method that allocates a new `Buffer` of the specified size without initializing it.
     * This method is faster than `alloc`
     * but the resulting buffer may contain old or sensitive data, so it should be used with caution.
     *
     * ## Description:
     * The `allocUnsafe` method allocates a `Buffer` of the specified size without initializing its content.
     * This results in a performance improvement, as no memory is zeroed out,
     * but it means the buffer may contain uninitialized or garbage data from previous allocations.
     * It is recommended to fill or overwrite the buffer with valid data before using it in sensitive operations.
     *
     * - **Input**:
     *   - `size`: The size of the `Buffer` to allocate (in bytes). This must be a number.
     *
     * - **Output**: Returns a new `Buffer` of the specified size, without initializing its content.
     *
     * ## Example:
     *
     * ```ts
     * const buffer = Buffer.allocUnsafe(10); // Allocates a buffer of 10 bytes with uninitialized content
     * ```
     *
     * ## Error Handling:
     * - Throws a `TypeError` if the `size` argument is not a valid number.
     * - The returned buffer will not be zero-filled, and may contain sensitive or old data from previous allocations.
     *
     * @static
     * @param size - The size of the buffer to allocate, in bytes.
     * @returns A new `Buffer` of the specified size, uninitialized.
     * @throws TypeError if the `size` argument is not a valid number.
     */

    static allocUnsafe(size: number): Buffer {
        if (typeof size !== 'number') {
            throw new TypeError('The "size" argument must be of type number.');
        }

        return new Buffer(size);
    }

    /**
     * Fills the buffer with a specified value from a given offset to the end of the buffer.
     * The method supports filling with strings, numbers, or `Uint8Array` data.
     * If the provided value is a string,
     * it will be encoded according to the specified encoding format.
     * This operation is performed in-place and modifies the content of the buffer.
     *
     * ## Description:
     * The `fill` method fills a specified range of the buffer with the provided value.
     * It accepts values of type string,
     * number, or `Uint8Array`.
     * If the value is a string, it will be encoded using the specified encoding format (default is `'utf-8'`).
     * If the value is a number, it is treated as a single byte.
     * If the value is an `Uint8Array`, the buffer will be filled with
     * the values from that array, repeating as necessary to cover the specified range.
     *
     * - **Input**:
     *   - `value`: The value to fill the buffer with. It can be a `string`, `number`, or `Uint8Array`.
     *   - `offset` (optional): The starting index to begin filling (default is `0`).
     *   - `end` (optional): The ending index to stop filling (default is the buffer's length).
     *   - `encoding` (optional): The encoding format to use for strings (default is `'utf-8'`).
     *
     * - **Output**: The method modifies the buffer in-place and returns the buffer (`this`).
     *
     * ## Example:
     *
     * ```ts
     * const buffer = Buffer.alloc(10);
     * buffer.fill('A', 0, 5); // Fills the first 5 bytes with 'A'
     * console.log(buffer); // Output: [65, 65, 65, 65, 65, 0, 0, 0, 0, 0]
     *
     * const buffer2 = Buffer.alloc(10);
     * buffer2.fill(255, 0, 3); // Fills the first 3 bytes with 255
     * console.log(buffer2); // Output: [255, 255, 255, 0, 0, 0, 0, 0, 0, 0]
     *
     * const buffer3 = Buffer.alloc(10);
     * buffer3.fill(new Uint8Array([1, 2]), 0, 6); // Fills the first 6 bytes with alternating 1 and 2
     * console.log(buffer3); // Output: [1, 2, 1, 2, 1, 2, 0, 0, 0, 0]
     * ```
     *
     * ## Error Handling:
     * - Throws a `RangeError` if the `offset` or `end` values are out of bounds.
     * - Throws an `Error` if the `value` argument is neither a string, number, nor `Uint8Array`.
     * - Throws an `Error` if an invalid string encoding is used or if the string cannot be coerced into valid buffer values.
     *
     * @instance
     * @returns `this` (the modified buffer).
     * @throws RangeError if `offset` or `end` are out of bounds.
     * @throws Error if `value` is of an invalid type or encoding is not valid.
     */

    override fill(value: primitiveInputType, offset: number = 0, end?: number, encoding: BufferEncoding = 'utf-8'): this {
        if (end === undefined) {
            end = this.length;
        }

        // Validate offsets
        if (offset < 0 || offset > end || end > this.length) {
            throw new RangeError(`Invalid offset or end values: offset=${ offset }, end=${ end }, length=${ this.length }`);
        }

        // Early exit for empty range
        if (offset === end) {
            return this;
        }

        let coercedValue: Uint8Array;
        if (typeof value === 'string') {
            coercedValue = Buffer.decoding(value, encoding);

            // Validate coercedValue for string case
            if (coercedValue[0] <= 0) {
                throw new Error(`The argument 'value' is invalid. Received '${ value }'`);
            }
        } else if (typeof value === 'number') {
            coercedValue = new Uint8Array([ value & 0xFF ]);
        } else if (isInstance(value, Uint8Array)) {
            coercedValue = value;
        } else {
            throw new Error('Value needs to be of type string, number, or Uint8Array');
        }

        if (coercedValue.length < 2) {
            super.fill(coercedValue[0], offset, end);
        } else {
            for (let i = offset, j = 0; i < end; i++, j = (j + 1) % coercedValue.length) {
                this[i] = coercedValue[j];
            }
        }

        return this;
    }

    /**
     * Searches for the first occurrence of a specified value in the buffer, starting at a given offset.
     * The search is conducted using a byte-by-byte comparison and supports searching for values encoded as strings, numbers, or `Uint8Array`.
     * The method returns the index of the first match or `-1` if the value is not found.
     *
     * ## Description:
     * The `indexOf` method searches for the first occurrence of a value within the buffer starting from the specified offset.
     * The method supports different value types, including strings (which are encoded according to the specified encoding), numbers,
     * and `Uint8Array`. It returns the index of the first match or `-1` if no match is found.
     *
     * - **Input**:
     *   - `value`: The value to search for. It can be a `string`, `number`, or `Uint8Array`.
     *   - `byteOffset` (optional): The index at which to start the search (default is `0`).
     *   - `encoding` (optional): The encoding format to use for strings (default is `'utf-8'`).
     *
     * - **Output**: Returns the index (`the first occurrence`) of the value within the buffer, or `-1` if the value is not found.
     *
     * ## Example:
     *
     * ```ts
     * const buffer = Buffer.from('Hello, world!');
     * const index = buffer.indexOf('world'); // Returns 7
     * console.log(index); // Output: 7
     *
     * const buffer2 = Buffer.from([1, 2, 3, 4, 5]);
     * const index2 = buffer2.indexOf(3); // Returns 2
     * console.log(index2); // Output: 2
     *
     * const buffer3 = Buffer.from('abcdef');
     * const index3 = buffer3.indexOf(new Uint8Array([4, 5])); // Returns 3
     * console.log(index3); // Output: 3
     * ```
     *
     * ## Error Handling:
     * - If the value is an empty string or `Uint8Array`, the method returns the `byteOffset` if it's within the buffer's length.
     * - The method will perform a byte-by-byte comparison and return the index of the first match or `-1` if no match is found.
     * - The method throws a `RangeError` if `byteOffset` is out of bounds.
     *
     * @instance
     * @returns The index (`the first occurrence`) of the value in the buffer, or `-1` if not found.
     * @throws RangeError if `byteOffset` is out of bounds.
     */

    override indexOf(value: primitiveInputType, byteOffset: number = 0, encoding: BufferEncoding = 'utf-8'): number {
        const { preparedOffset, preparedValue } = this.prepareIndexOfParameters(value, byteOffset, encoding);

        if (preparedValue.length === 0) {
            // Empty value case
            return preparedOffset < this.length ? preparedOffset : this.length;
        }

        // Search for the value in the buffer
        for (let i = preparedOffset; i <= this.length - preparedValue.length; i++) {
            let found = true;
            for (let j = 0; j < preparedValue.length; j++) {
                if (this[i + j] !== preparedValue[j]) {
                    found = false;
                    break;
                }
            }
            if (found) {
                return i;
            }
        }

        return -1; // Not found
    }

    /**
     * Searches for the last occurrence of a specified value in the buffer, starting from a given offset.
     * The search is conducted using a byte-by-byte comparison and supports searching for values encoded as strings, numbers, or `Uint8Array`.
     * The method returns the index of the last match or `-1` if the value is not found.
     *
     * ## Description:
     * The `lastIndexOf` method searches for the last occurrence of a value within the buffer, starting from the specified offset and moving backwards.
     * The method supports different value types, including strings (which are encoded according to the specified encoding), numbers,
     * and `Uint8Array`. It returns the index of the last match or `-1` if no match is found.
     *
     * - **Input**:
     *   - `value`: The value to search for. It can be a `string`, `number`, or `Uint8Array`.
     *   - `byteOffset` (optional): The index at which to start the search (default is `0`).
     *   - `encoding` (optional): The encoding format to use for strings (default is `'utf-8'`).
     *
     * - **Output**: Returns the index (`the last occurrence`) of the value within the buffer, or `-1` if the value is not found.
     *
     * ## Example:
     *
     * ```ts
     * const buffer = Buffer.from('Hello, world!');
     * const index = buffer.lastIndexOf('world'); // Returns 7
     * console.log(index); // Output: 7
     *
     * const buffer2 = Buffer.from([1, 2, 3, 4, 5]);
     * const index2 = buffer2.lastIndexOf(3); // Returns 2
     * console.log(index2); // Output: 2
     *
     * const buffer3 = Buffer.from('abcdef');
     * const index3 = buffer3.lastIndexOf(new Uint8Array([4, 5])); // Returns 3
     * console.log(index3); // Output: 3
     * ```
     *
     * ## Error Handling:
     * - If the value is an empty string or `Uint8Array`, the method returns the `byteOffset` if it's within the buffer's length.
     * - The method will perform a byte-by-byte comparison and return the index of the last match or `-1` if no match is found.
     * - The method throws a `RangeError` if `byteOffset` is out of bounds.
     *
     * @instance
     * @returns The index (`the last occurrence`) of the value in the buffer, or `-1` if not found.
     * @throws RangeError if `byteOffset` is out of bounds.
     */

    override lastIndexOf(value: primitiveInputType, byteOffset: number = 0, encoding: BufferEncoding = 'utf-8'): number {
        const { preparedOffset, preparedValue } = this.prepareIndexOfParameters(value, byteOffset, encoding);

        if (preparedValue.length === 0) {
            // Empty value case
            return preparedOffset < this.length ? preparedOffset : this.length;
        }

        // Search for the last occurrence of the value in the buffer
        for (let i = Math.min(preparedOffset, this.length - preparedValue.length); i >= 0; i--) {
            let found = true;
            for (let j = 0; j < preparedValue.length; j++) {
                if (this[i + j] !== preparedValue[j]) {
                    found = false;
                    break;
                }
            }
            if (found) {
                return i;
            }
        }

        return -1; // Not found
    }

    /**
     * Checks if a specified value is present in the buffer, starting from a given offset.
     * The search is conducted using the `indexOf` method, and the method returns `true` if the value is found,
     * or `false` if the value is not present.
     *
     * ## Description:
     * The `includes` method checks if a value exists within the buffer by calling `indexOf`. It searches for the first occurrence of
     * the specified value starting from the given `byteOffset`. The method supports `string`, `number`, and `Buffer` values.
     * It returns `true` if the value is found and `false` if the value is not found.
     *
     * - **Input**:
     *   - `value`: The value to search for. It can be a `string`, `number`, or `Buffer`.
     *   - `byteOffset` (optional): The index at which to start the search (default is `0`).
     *   - `encoding` (optional): The encoding format to use for strings (default is `'utf-8'`).
     *
     * - **Output**: Returns a boolean value indicating whether the value is found (`true`) or not (`false`).
     *
     * ## Example:
     *
     * ```ts
     * const buffer = Buffer.from('Hello, world!');
     * const found1 = buffer.includes('world'); // Returns true
     * const found2 = buffer.includes('hello'); // Returns false
     *
     * const buffer2 = Buffer.from([1, 2, 3, 4, 5]);
     * const found3 = buffer2.includes(3); // Returns true
     * const found4 = buffer2.includes(6); // Returns false
     * ```
     *
     * ## Error Handling:
     * - If the value is an empty string or `Buffer`, the method behaves as if `indexOf` is called with an empty value.
     * - The method will return `false` if the value is not found.
     *
     * @instance
     * @returns `true` if the value is found in the buffer, `false` otherwise.
     */

    override includes(value: string | number | Buffer, byteOffset: number = 0, encoding: BufferEncoding = 'utf-8'): boolean {
        return this.indexOf(value, byteOffset, encoding) !== -1;
    }

    /**
     * Writes a string to the buffer at a specified offset, with optional length and encoding format.
     * The method supports various overloads allowing flexibility in the number of parameters, and ensures that the buffer is filled with the encoded data.
     *
     * ## Description:
     * The `write` method encodes a string and writes it to the buffer, starting from the specified offset.
     * It supports specifying the encoding format (default is `'utf-8'`) and the number of bytes to write (length).
     * The method ensures that the number of bytes written does not exceed the buffer's length.
     *
     * - **Input**:
     *   - `string`: The string to write into the buffer.
     *   - `offset` (optional): The index at which to start writing in the buffer (default is `0`).
     *   - `length` (optional): The number of bytes to write from the string (default is the remaining space in the buffer).
     *   - `encoding` (optional): The encoding format to use for the string (default is `'utf-8'`).
     *
     * - **Output**: Returns the number of bytes written to the buffer.
     *
     * ## Example:
     *
     * ```ts
     * const buffer = Buffer.alloc(20);
     * const bytesWritten1 = buffer.write("Hello, world!"); // Writes with default offset and encoding
     * const bytesWritten2 = buffer.write("Hello", 5, 5); // Writes "Hello" at offset 5 with default encoding
     * const bytesWritten3 = buffer.write("World", 5, 5, "ascii"); // Writes "World" at offset 5 using ASCII encoding
     * ```
     *
     * ## Error Handling:
     * - Throws a `RangeError` if the `offset` or `length` is out of range (i.e., greater than the buffer length or negative).
     * - Throws a `TypeError` if the encoding type is unknown.
     *
     * @instance
     * @param string - The string to write.
     * @param offset - (Optional) The offset at which to start writing (default is `0`).
     * @param length - (Optional) The length (number of bytes) to write (default is the remaining buffer space).
     * @param encoding - (Optional) The encoding format to use (default is `'utf-8'`).
     * @returns The number of bytes written to the buffer.
     */

    write(string: string, encoding?: BufferEncoding): number;
    write(string: string, offset: number, encoding?: BufferEncoding): number;
    write(string: string, offset: number, length: number, encoding?: BufferEncoding): number;
    write(string: string, arg1?: number | BufferEncoding, arg2?: number | BufferEncoding, encoding: BufferEncoding = 'utf-8'): number {
        const offset: number = typeof arg1 === 'number' ? arg1 : 0;
        const remaining = this.length - offset;
        const length: number = typeof arg2 === 'number' ? arg2 : remaining;

        if (typeof arg1 === 'string') {
            encoding = arg1;
        } else if (typeof arg2 === 'string') {
            encoding = arg2;
        }

        // Get the actual length to write
        const fixLength = length > remaining ? remaining : length;
        if (offset < 0 || offset > this.length || length < 0 || length > this.length) {
            throw new RangeError(`The values of "offset" and "length" must be >= 0 && <= ${ this.length }. Received offset: ${ offset }, length: ${ length }`);
        }

        let bytesWrite = undefined;
        bytesWrite = Buffer.decoding(string, encoding, fixLength);
        this.set(bytesWrite, offset);

        return bytesWrite.length;
    }

    /**
     * Creates a new `Buffer` object that is a subarray of the current buffer, from the specified `start` index to the `end` index.
     * The method returns a shallow copy of the specified section of the buffer, allowing you to manipulate the subarray independently.
     *
     * ## Description:
     * The `subarray` method creates a new buffer from the original buffer's data, starting from the `start` index and ending at the `end` index.
     * If `end` is not provided, it defaults to the length of the buffer. The method does not modify the original buffer.
     *
     * - **Input**:
     *   - `start` (optional): The index at which to begin the subarray (default is `0`).
     *   - `end` (optional): The index at which to end the subarray (default is the buffer's length).
     *
     * - **Output**: Returns a new `Buffer` containing the subarray data from the original buffer.
     *
     * ## Example:
     *
     * ```ts
     * const buffer = Buffer.from([1, 2, 3, 4, 5, 6]);
     * const subBuffer1 = buffer.subarray(2, 5); // Returns a buffer with values [3, 4, 5]
     * const subBuffer2 = buffer.subarray(3);    // Returns a buffer with values [4, 5, 6]
     * ```
     *
     * ## Error Handling:
     * - If the `start` or `end` values are out of bounds (negative or beyond the buffer's length), the method will automatically adjust to prevent errors.
     * - If the `end` is less than `start`, the subarray will be empty.
     *
     * @instance
     * @param start - (Optional) The starting index for the subarray (default is `0`).
     * @param end - (Optional) The ending index for the subarray (default is the buffer's length).
     * @returns A new `Buffer` containing the subarray from the original buffer.
     */

    override subarray(start?: number, end?: number): Buffer {
        end = end ? Math.min(end, this.length) : this.length;

        return new Buffer(super.subarray(start, end));
    }

    /**
     * Converts the content of the buffer to a string using the specified encoding.
     * It can optionally slice the buffer from a `start` to `end` index before converting.
     * The method supports a variety of encodings, including UTF-8, ASCII, Base64, and more.
     *
     * ## Description:
     * The `toString` method decodes the buffer content to a string based on the provided encoding.
     * If no slicing is needed, the method uses the entire buffer.
     * Otherwise, it slices the buffer from the `start` to `end` indices and then decodes it.
     *
     * - **Input**:
     *   - `encoding`: The encoding format to use (default is `'utf-8'`).
     *   - `start` (optional): The index at which to start the slice (default is `0`).
     *   - `end` (optional): The index at which to end the slice (default is the buffer's length).
     *
     * - **Output**: Returns a string representation of the buffer's content, decoded using the specified encoding.
     *
     * ## Supported Encodings:
     * - **`'hex'`**: Decodes the buffer to a hexadecimal string.
     * - **`'utf8'` / `'utf-8'`**: Decodes the buffer to a UTF-8 string.
     * - **`'ascii'` / `'latin1'` / `'binary'`**: Decodes the buffer to an ASCII or Latin-1 (ISO-8859-1) string.
     * - **`'base64'`**: Decodes the buffer to a Base64 string.
     * - **`'ucs2'` / `'ucs-2'` / `'utf16le'` / `'utf-16le'`**: Decodes the buffer to a UTF-16 Little Endian string.
     *
     * If the provided encoding is unknown, a `TypeError` is thrown.
     *
     * ## Example:
     *
     * ```ts
     * const buffer = Buffer.from([72, 101, 108, 108, 111]);
     * console.log(buffer.toString('utf8'));    // Output: "Hello"
     * console.log(buffer.toString('hex'));     // Output: "48656c6c6f"
     * console.log(buffer.toString('base64'));  // Output: "SGVsbG8="
     * ```
     *
     * ## Error Handling:
     * - Throws a `TypeError` if an unsupported encoding is provided.
     *
     * @instance
     * @param encoding - The encoding format to use (default: `'utf-8'`).
     * @param start - (Optional) The starting index for slicing (default is `0`).
     * @param end - (Optional) The ending index for slicing (default is the buffer's length).
     * @returns A string representation of the buffer's content, decoded using the specified encoding.
     * @throws TypeError if an unknown encoding is provided.
     */

    override toString(encoding: BufferEncoding = 'utf-8', start?: number, end?: number): string {
        let slicedArray;

        // Check if slicing is needed
        if (start !== 0 || end !== this.length) {
            // Perform slicing with optional defaults for start and end
            slicedArray = this.subarray(start, end);
        } else {
            // Use the original array if no slicing is needed
            slicedArray = <Buffer> this;
        }

        // Handle known encodings
        switch (encoding.toLowerCase()) {
            case 'hex':
                return encodeHEX(slicedArray);
            case 'utf8':
            case 'utf-8':
                return encodeUTF8(slicedArray);
            case 'ascii':
            case 'latin1':
            case 'binary':
                return encodeASCII(slicedArray);
            case 'base64':
                return encodeBase64(slicedArray);
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return encodeUTF16LE(slicedArray);
            default:
                // Unknown encoding
                throw new TypeError('Unknown encoding: ' + encoding);
        }
    }

    /**
     * Converts the buffer to a JSON representation.
     * This method returns an object containing the buffer's type and its data as an array.
     *
     * ## Description:
     * The `toJSON` method provides a way to serialize the buffer into a JSON object.
     * It converts the buffer's internal data into an array of bytes and returns it under the `data` key.
     * The object also includes a `type` key with the value `'Buffer'`,
     * indicating that this JSON representation corresponds to a buffer.
     *
     * - **Input**: None
     * - **Output**: Returns an object with the following structure:
     *   ```ts
     *   {
     *     type: 'Buffer', // A string indicating the type of the object
     *     data: Array<number> // An array of bytes (numbers) representing the buffer's content
     *   }
     *   ```
     *
     * ## Example:
     *
     * ```ts
     * const buffer = Buffer.from([72, 101, 108, 108, 111]);
     * const jsonRepresentation = buffer.toJSON();
     * console.log(jsonRepresentation);
     * // Output: { type: 'Buffer', data: [ 72, 101, 108, 108, 111 ] }
     * ```
     *
     * ## Error Handling:
     * - This method does not throw any errors. It always returns a valid JSON object.
     *
     * @instance
     * @returns An object containing the buffer's type (`'Buffer'`) and its data as an array of bytes.
     */

    toJSON() {
        return {
            type: 'Buffer',
            data: Array.from(this)
        };
    }

    /**
     * Compares the current buffer with another buffer or `Uint8Array` for equality.
     * This method checks if both buffers have the same length and identical content.
     *
     * ## Description:
     * The `equals` method compares the current buffer with another buffer or `Uint8Array` to determine if they are equal.
     * The comparison is performed by first checking if the lengths of the buffers are the same, and then comparing their contents byte by byte.
     *
     * - **Input**:
     *   - `otherBuffer`: The buffer or `Uint8Array` to compare with the current buffer.
     *
     * - **Output**: Returns a boolean value:
     *   - `true`: If both buffers are equal (same length and identical content).
     *   - `false`: If the buffers are not equal.
     *
     * ## Example:
     *
     * ```ts
     * const buffer1 = Buffer.from([72, 101, 108, 108, 111]);
     * const buffer2 = Buffer.from([72, 101, 108, 108, 111]);
     * const buffer3 = Buffer.from([74, 101, 108, 108, 111]);
     *
     * console.log(buffer1.equals(buffer2)); // true
     * console.log(buffer1.equals(buffer3)); // false
     * ```
     *
     * ## Error Handling:
     * - Throws a `TypeError` if the `otherBuffer` argument is not an instance of `Buffer` or `Uint8Array`.
     *
     * @instance
     * @param otherBuffer - The buffer or `Uint8Array` to compare with the current buffer.
     * @returns `true` if both buffers are equal, otherwise `false`.
     * @throws TypeError if the `otherBuffer` is not a `Buffer` or `Uint8Array`.
     */

    equals(otherBuffer: Uint8Array | Buffer): boolean {
        if (!isInstance(otherBuffer, Uint8Array)) {
            throw new TypeError(
                `The "otherBuffer" argument must be an instance of Buffer or Uint8Array. Received an instance of ${ typeof otherBuffer }`
            );
        }

        // Check if the lengths are the same
        if (this.length !== otherBuffer.length) {
            return false;
        }

        return this.every((value, index) => value === otherBuffer[index]);
    }

    /**
     * Compares the current buffer with a target buffer over specified ranges and returns the comparison result.
     * This method allows for comparing a portion of the current buffer with a portion of the target buffer,
     * and determines if one is less than, equal to, or greater than the other.
     *
     * ## Description:
     * The `compare` method compares slices of the current buffer (`this`) with a target buffer, based on the specified
     * offsets and lengths for both buffers. It returns:
     * - `-1`: If the current buffer is lexicographically less than the target buffer.
     * - `0`: If both buffers are equal.
     * - `1`: If the current buffer is lexicographically greater than the target buffer.
     *
     * The comparison is performed byte-by-byte, and if a range exceeds the bounds of the respective buffer, an error is thrown.
     *
     * - **Input**:
     *   - `target`: The buffer to compare against.
     *   - `targetStart` (optional): The starting byte offset in the target buffer (default is 0).
     *   - `targetEnd` (optional): The ending byte offset in the target buffer (default is `target.length`).
     *   - `sourceStart` (optional): The starting byte offset in the current buffer (default is 0).
     *   - `sourceEnd` (optional): The ending byte offset in the current buffer (default is `this.length`).
     *
     * - **Output**: Returns:
     *   - `-1`: If the current buffer is lexicographically less than the target buffer.
     *   - `0`: If both buffers are equal.
     *   - `1`: If the current buffer is lexicographically greater than the target buffer.
     *
     * ## Example:
     *
     * ```ts
     * const buffer1 = Buffer.from([1, 2, 3, 4]);
     * const buffer2 = Buffer.from([1, 2, 3, 5]);
     * const buffer3 = Buffer.from([1, 2, 3, 4]);
     *
     * console.log(buffer1.compare(buffer2)); // -1
     * console.log(buffer2.compare(buffer1)); // 1
     * console.log(buffer1.compare(buffer3)); // 0
     * ```
     *
     * ## Error Handling:
     * - Throws a `TypeError` if the `target` is not an instance of `Buffer` or `Uint8Array`.
     * - Throws a `RangeError` if any of the specified offsets or lengths are out of bounds.
     *
     * @instance
     * @param target - The buffer to compare against.
     * @param targetStart - (Optional) The start offset for the target buffer.
     * @param targetEnd - (Optional) The end offset for the target buffer.
     * @param sourceStart - (Optional) The start offset for the current buffer.
     * @param sourceEnd - (Optional) The end offset for the current buffer.
     * @returns `-1` if the current buffer is less than the target, `0` if they are equal, and `1` if the current buffer is greater.
     * @throws TypeError if `target` is not a `Buffer` or `Uint8Array`.
     * @throws RangeError if any offset or length is out of bounds.
     */

    compare(
        target: Buffer,
        targetStart = 0,
        targetEnd = target.length,
        sourceStart = 0,
        sourceEnd = this.length
    ): -1 | 0 | 1 {
        if (!isInstance(target, Uint8Array)) {
            throw new TypeError('Parameter must be a Uint8Array');
        }

        if (
            targetStart < 0 ||
            sourceStart < 0 ||
            targetEnd > target.length ||
            sourceEnd > this.length ||
            targetStart > targetEnd ||
            sourceStart > sourceEnd
        ) {
            throw new RangeError('Invalid range or offset values');
        }

        const length = Math.min(targetEnd - targetStart, sourceEnd - sourceStart);

        for (let i = 0; i < length; i++) {
            if (this[sourceStart + i] < target[targetStart + i]) {
                return -1;
            } else if (this[sourceStart + i] > target[targetStart + i]) {
                return 1;
            }
        }

        if (length < targetEnd - targetStart) {
            return -1;
        } else if (length < sourceEnd - sourceStart) {
            return 1;
        } else {
            return 0;
        }
    }

    /**
     * Copies a portion of the current buffer into a target buffer starting at a specified position.
     * This method allows for copying data from a slice of the current buffer (`this`) into a target buffer (`target`),
     * with flexibility for setting the starting points and lengths for both source and target buffers.
     *
     * ## Description:
     * The `copy` method copies data from a slice of the current buffer into the specified `target` buffer.
     * The source slice is defined by `sourceStart` and `sourceEnd` (inclusive), while the `targetStart` defines where
     * the data will be written in the target buffer.
     * It returns the number of bytes actually copied, which is the minimum of the length of the target space or the source slice.
     *
     * - **Input**:
     *   - `target`: The buffer into which the data is copied.
     *   - `targetStart` (optional): The starting byte offset in the target buffer (default is 0).
     *   - `sourceStart` (optional): The starting byte offset in the current buffer (default is 0).
     *   - `sourceEnd` (optional): The ending byte offset in the current buffer (default is `this.length`).
     *
     * - **Output**: Returns the number of bytes copied.
     *
     * ## Example:
     *
     * ```ts
     * const buffer1 = Buffer.from([1, 2, 3, 4, 5]);
     * const buffer2 = new Uint8Array(3);
     *
     * const bytesCopied = buffer1.copy(buffer2, 0, 1, 4);
     * console.log(bytesCopied); // 3
     * console.log(buffer2); // Uint8Array(3) [ 2, 3, 4 ]
     * ```
     *
     * ## Error Handling:
     * - Throws a `TypeError` if `target` is not an instance of `Uint8Array`.
     *
     * @instance
     * @param target - The target buffer to copy data into.
     * @param targetStart - (Optional) The start offset for the target buffer.
     * @param sourceStart - (Optional) The start offset for the source buffer.
     * @param sourceEnd - (Optional) The end offset for the source buffer.
     * @returns The number of bytes actually copied.
     * @throws TypeError if `target` is not a `Uint8Array`.
     */

    copy(target: Uint8Array, targetStart: number = 0, sourceStart: number = 0, sourceEnd: number = this.length): number {
        if (targetStart >= sourceEnd) {
            return 0;
        }

        target.set(this.subarray(sourceStart, sourceEnd), targetStart);

        return Math.min(sourceEnd - sourceStart, target.length - targetStart);
    }

    /**
     * Creates a shallow copy of a portion of the buffer and returns a new buffer containing the selected data.
     * The method slices the current buffer (`this`) from the given `start` index to the optional `end` index.
     * The resulting buffer contains a reference to the original data without modifying the original buffer.
     *
     * ## Description:
     * The `slice` method returns a new `Buffer` object that is a shallow copy of the original buffer.
     * The slice is defined by the `start` and `end` indices (inclusive of `start`, exclusive of `end`).
     * If `end` is not provided, it defaults to the end of the buffer.
     *
     * - **Input**:
     *   - `start` (optional): The starting index of the slice (default is `0`).
     *   - `end` (optional): The ending index of the slice (default is the length of the buffer).
     *
     * - **Output**: Returns a new `Buffer` object containing the sliced data.
     *
     * ## Example:
     *
     * ```ts
     * const buffer = Buffer.from([1, 2, 3, 4, 5]);
     * const slicedBuffer = buffer.slice(1, 4);
     * console.log(slicedBuffer); // Buffer [ 2, 3, 4 ]
     * ```
     *
     * ## Error Handling:
     * - No specific error handling is required, as the method works with valid buffer indices.
     *
     * @instance
     * @param start - (Optional) The starting index for the slice (default is `0`).
     * @param end - (Optional) The ending index for the slice (default is the length of the buffer).
     * @returns A new `Buffer` containing the sliced portion of the original buffer.
     */

    override slice(start?: number, end?: number): Buffer {
        return this.subarray(start, end);
    }

    /**
     * Custom inspection method for representing the `Buffer` object in a human-readable format when logged or inspected.
     * This method overrides the default inspection behavior of the `Buffer` and returns a string representation
     * of the buffer in hexadecimal format, making it easier to read and debug.
     *
     * ## Description:
     * The `Symbol.for('nodejs.util.inspect.custom')` method is used to define a custom string representation of
     * the `Buffer` when it is inspected (e.g., in `console.log` or debugging tools).
     * The buffer is represented as a space-separated string of hexadecimal byte values, making it more user-friendly
     * for debugging purposes.
     *
     * - **Input**: This method does not take any parameters.
     *
     * - **Output**: Returns a string representation of the `Buffer` in the following format:
     *   - `<Buffer 01 02 03 ...>`
     *   - Each byte in the buffer is represented as a two-digit hexadecimal value, padded with leading zeros if necessary.
     *
     * ## Example:
     *
     * ```ts
     * const buffer = Buffer.from([1, 2, 3, 4, 5]);
     * console.log(buffer); // <Buffer 01 02 03 04 05>
     * ```
     *
     * ## Error Handling:
     * - No specific error handling is required, as this method only alters the string representation of the `Buffer`.
     *
     * @instance
     * @returns A string representing the `Buffer` in a readable hexadecimal format.
     */

    [Symbol.for('nodejs.util.inspect.custom')]() {
        const value = Array.from(
            this, byte => byte.toString(16).padStart(2, '0')
        ).join(' ');

        return `<Buffer ${ value }>`;
    }

    private static decoding(string: string, decoding: BufferEncoding = 'utf-8', length?: number): Uint8Array {
        // Handle known encodings
        switch (decoding.toLowerCase()) {
            case 'hex':
                return decodeHEX(string, length);
            case 'utf8':
            case 'utf-8':
                return decodeUTF8(string, length);
            case 'ascii':
            case 'latin1':
            case 'binary':
                return decodeASCII(string, length);
            case 'base64':
                return decodeBase64(string, length);
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return decodeUTF16LE(string, length);
            default:
                // Unknown encoding
                throw new TypeError('Unknown encoding: ' + decoding);
        }
    }

    /**
     * Computes the byte length of a given string based on the specified encoding.
     *
     * ## Description:
     * This method calculates the number of bytes required to encode a string in the specified encoding. It handles various
     * encodings such as `ascii`, `utf8`, `hex`, and `ucs2`. For encodings like `ascii`, the length is equivalent to the
     * string length, while for `ucs2` or `utf16le`, it doubles the length. Encodings such as `hex` are halved in length
     * (as each byte is represented by two characters).
     *
     * - **Input**:
     *   - `data`: The input string whose byte length needs to be calculated.
     *   - `encoding`: The encoding to use for the calculation. Supported encodings include `ascii`, `latin1`, `utf8`, `ucs2`, `hex`, and more.
     *
     * - **Output**:
     *   - Returns the byte length of the string when encoded in the specified encoding.
     *
     * ## Supported Encodings:
     * - `ascii`: Each character is byte.
     * - `latin1` or `binary`: Each character is byte.
     * - `utf8` or `utf-8`: The length depends on the character codepoints.
     * - `ucs2`, `ucs-2`, `utf16le`, `utf-16le`: Each character is 2 bytes.
     * - `hex`: Every two characters represent byte (length is halved).
     *
     * ## Example:
     *
     * ```ts
     * console.log(Buffer.byteLengthString('hello', 'ascii')); // 5
     * console.log(Buffer.byteLengthString('你好', 'utf16le')); // 4
     * console.log(Buffer.byteLengthString('48656c6c6f', 'hex')); // 5
     * console.log(Buffer.byteLengthString('hello', 'utf8')); // 5
     * ```
     *
     * ## Error Handling:
     * - For unsupported or invalid encodings, it will call `this.decoding` to process the string and calculate the byte length.
     * - If an unknown encoding is passed, the behavior depends on the implementation of `this.decoding`.
     *
     * @private
     * @param data - The string whose byte length is to be calculated.
     * @param encoding - The encoding used to calculate the byte length.
     * @returns The byte length of the encoded string.
     */

    private static byteLengthString(data: string, encoding: BufferEncoding): number {
        switch (encoding) {
            case 'ascii':
            case 'latin1':
            case 'binary':
                return data.length;
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return data.length * 2;
            case 'hex':
                return data.length >>> 1;
            default:
                return this.decoding(data, encoding).byteLength;
        }
    }

    /**
     * Prepares the `value` and `offset` parameters for performing search operations like `indexOf` or `lastIndexOf`
     * in the buffer. This method coerces the value into a `Uint8Array` representation and adjusts the offset to ensure
     * it is within valid bounds.
     *
     * ## Description:
     * The method processes the `value` argument (which can be a string, number, or `Uint8Array`) and the `preparedOffset`
     * to ensure they are in the correct format and within the bounds of the buffer. The method also handles negative offsets
     * by adjusting them to the appropriate position from the end of the buffer. It returns an object containing the prepared
     * `offset` and the corresponding `Uint8Array` representation of the `value`.
     *
     * - **Input**:
     *   - `value`: The value to search for. It can be a `string`, `number`, or `Uint8Array`. The method converts it into
     *     a `Uint8Array` based on the specified encoding if it is a string or number.
     *   - `preparedOffset`: The offset from which the search will start. It will be coerced into a valid number and adjusted
     *     for negative offsets.
     *   - `encoding`: The encoding used to convert the `value` (if it is a string) into a `Uint8Array`.
     *
     * - **Output**:
     *   - Returns an object with:
     *     - `preparedOffset`: The adjusted offset that will be used in the search.
     *     - `preparedValue`: The `Uint8Array` representation of the search `value`.
     *
     * ## Example:
     *
     * ```ts
     * const { preparedOffset, preparedValue } = buffer.prepareIndexOfParameters('world', 0, 'utf-8');
     * console.log(preparedOffset); // 0
     * console.log(preparedValue); // Uint8Array of UTF-8 encoded "world"
     *
     * const { preparedOffset, preparedValue } = buffer.prepareIndexOfParameters(255, 5, 'hex');
     * console.log(preparedOffset); // 5
     * console.log(preparedValue); // Uint8Array of byte [ 255 ]
     * ```
     *
     * ## Error Handling:
     * - If the `value` is neither a `string`, `number`, nor `Uint8Array`, a `TypeError` will be thrown with the message:
     *   `'Value must be a string, number, or Uint8Array'`.
     *
     * @private
     * @param value - The value to search for, either a `string`, `number`, or `Uint8Array`.
     * @param preparedOffset - The offset from which to start the search. Negative offsets are adjusted accordingly.
     * @param encoding - The encoding to use if the `value` is a string. This determines how the string is converted into
     *                   a `Uint8Array`.
     * @returns An object with `preparedOffset` and `preparedValue` (a `Uint8Array`).
     */

    private prepareIndexOfParameters(value: primitiveInputType, preparedOffset: number, encoding: BufferEncoding): {
        preparedOffset: number,
        preparedValue: Uint8Array
    } {
        // Coerce byteOffset to a number, use the whole buffer if coercion results in NaN or 0
        preparedOffset = +preparedOffset || 0;

        if (preparedOffset < 0) {
            // Calculate offset from the end of the buffer
            preparedOffset += this.length;
            if (preparedOffset < 0) {
                preparedOffset = 0;
            }
        }

        let preparedValue: Uint8Array;

        if (typeof value === 'number') {
            preparedValue = new Uint8Array([ value & 0xFF ]);
        } else if (typeof value === 'string') {
            preparedValue = Buffer.decoding(value, encoding);
        } else if (isInstance(value, Uint8Array)) {
            preparedValue = value;
        } else {
            // Throw an error for unsupported types
            throw new TypeError('Value must be a string, number, or Uint8Array');
        }

        return { preparedOffset, preparedValue };
    }
}
