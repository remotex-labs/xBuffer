/**
 * Import will remove at compile time
 */

import type { BufferEncoding, primitiveInputType } from '@modules/interfaces/buffer.module.interface';

/**
 * Imports
 */

import { decodeUTF8, encodeUTF8 } from '@components/utf8.component';
import {
    decodeHEX,
    decodeASCII,
    decodeBase64,
    decodeUTF16LE,
    encodeHEX,
    encodeASCII,
    encodeBase64,
    encodeUTF16LE
} from '@components/charset.component';

export class Buffer extends Uint8Array {
    /**
     * Limits of buffer
     */

    static readonly constants = {
        MAX_LENGTH: 4294967296,
        MAX_STRING_LENGTH: 536870888
    };

    /**
     * A private `DataView` property providing low-level access to the underlying buffer of the `Uint8Array`.
     */

    private dataView: DataView;

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

        // Create a DataView using the underlying buffer of the Uint8Array.
        this.dataView = new DataView(this.buffer);
    }

    /**
     * The `from` method is a static method that creates a new `Buffer` instance from various input types, including strings, `Uint8Array`,
     * array-like objects, and `ArrayBuffer` or `SharedArrayBuffer`. It allows flexible handling of different data formats with optional encoding
     * or slicing parameters.
     *
     * ## Description:
     * The `from` method supports multiple input types and can initialize a `Buffer` based on the provided value. It can handle strings with
     * specified encoding types, arrays of numbers (e.g., `Uint8Array`), and even raw `ArrayBuffer` or `SharedArrayBuffer` with optional byte
     * offsets and lengths for slicing.
     *
     * The method provides support for the following input formats:
     * - **`string`**: Converts a string into a `Buffer`, optionally using the provided encoding type.
     * - **`Uint8Array`**: Converts an existing `Uint8Array` or array-like object into a `Buffer`.
     * - **`WithImplicitCoercion<string>`**: A string that can be implicitly coerced into a `Buffer` using the specified encoding.
     * - **`ArrayBuffer` / `SharedArrayBuffer`**: Converts a portion of a raw buffer into a `Buffer`, with optional byte offset and length.
     *
     * ## Example:
     *
     * ```ts
     * // From a string with encoding
     * const buffer1 = Buffer.from("Hello, world!", "utf8");
     *
     * // From a Uint8Array
     * const buffer2 = Buffer.from(new Uint8Array([72, 101, 108, 108, 111]));
     *
     * // From an array-like object
     * const buffer3 = Buffer.from([72, 101, 108, 108, 111]);
     *
     * // From an ArrayBuffer with byte offset and length
     * const arrayBuffer = new ArrayBuffer(10);
     * const buffer4 = Buffer.from(arrayBuffer, 2, 5);
     * ```
     *
     * ## Error Handling:
     * - Throws a `TypeError` if the input format is not recognized or is unsupported.
     * - If an `ArrayBuffer` or `SharedArrayBuffer` is passed with an invalid byte offset or length, the method will throw an error.
     * - If the input encoding type is invalid (for example, not matching a supported encoding), a `TypeError` will be thrown.
     *
     * ## How it works:
     * - For `string` inputs, the string is converted using the specified encoding.
     * - For `Uint8Array` or array-like inputs, the method creates a new `Buffer` directly from the array data.
     * - For `ArrayBuffer` or `SharedArrayBuffer`, the method creates a view of the buffer starting at the specified byte offset with the given length.
     * - The method checks for various input types and invokes the appropriate constructor or encoding method accordingly.
     */

    static override from(value: Uint8Array | readonly number[]): Buffer;
    static override from(value: string | Uint8Array | readonly number[]): Buffer;
    static override from(value: WithImplicitCoercion<string>, encoding: BufferEncoding): Buffer;
    static override from(arrayBuffer: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>, byteOffset?: number, length?: number): Buffer;
    static override from(arg1: unknown, arg2?: BufferEncoding | number, length?: number): Buffer {
        if (typeof arg1 === 'string') {
            return new Buffer(this.encoding(arg1, <BufferEncoding> arg2));
        } else if (ArrayBuffer.isView(arg1) || Array.isArray(arg1)) {
            return new Buffer(new Uint8Array(<any> arg1, <number> arg2, length));
        } else {
            // Throw a TypeError if the argument is not supported
            throw new TypeError('The "from" method expects valid input arguments.');
        }
    }

    /**
     * The `of` method is a static method that creates a new `Buffer` instance from a list of numbers (bytes).
     * This method is similar to `Array.of()` but specifically designed for creating a `Buffer` from an array of numeric values.
     * It initializes the `Buffer` with the provided values as its elements.
     *
     * ## Description:
     * The `of` method takes a variable number of numeric arguments and creates a new `Buffer` that contains these values as bytes.
     * This method is useful when you need to quickly create a `Buffer` from a known set of byte values without needing to manually
     * create an array or `Uint8Array`.
     *
     * - **Input**: A list of numbers (`number[]`), where each number is expected to be a valid byte value (0 to 255).
     * - **Output**: A new `Buffer` instance containing the provided byte values.
     *
     * ## Example:
     *
     * ```ts
     * const buffer1 = Buffer.of(65, 66, 67); // Creates a buffer with the byte values [65, 66, 67]
     * console.log(buffer1); // Output: <Buffer 41 42 43> (Hexadecimal representation)
     * ```
     *
     * @static
     * @param items - A variable number of numeric values representing byte values to be added to the `Buffer`.
     * @returns A new `Buffer` instance containing the provided byte values.
     */

    static override of(...items: Array<number>): Buffer {
        return new Buffer(items);
    }

    /**
     * The `isEncoding` method is a static method that checks whether a given string is a valid `BufferEncoding`.
     * It is used to validate whether a specific encoding type is supported by the `Buffer` class.
     *
     * ## Description:
     * This method accepts an encoding string and returns a boolean indicating whether the encoding is one of the predefined
     * valid encodings supported by `Buffer`. It can be used to ensure that an encoding string passed to a method is valid
     * before attempting to encode or decode data.
     *
     * - **Input**: A string representing the encoding type to validate.
     * - **Output**: A boolean (`true` or `false`) indicating whether the provided encoding is supported.
     *
     * ## Example:
     *
     * ```ts
     * console.log(Buffer.isEncoding('utf8')); // Output: true
     * console.log(Buffer.isEncoding('ascii')); // Output: true
     * console.log(Buffer.isEncoding('invalidEncoding')); // Output: false
     * ```
     *
     * @static
     * @param encoding - A string representing the encoding to check.
     * @returns A boolean indicating whether the encoding is valid and supported by `Buffer`.
     */

    static isEncoding(encoding: string): encoding is BufferEncoding {
        return [
            'hex', 'utf8', 'utf-8', 'ascii', 'latin1', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le'
        ].includes(encoding);
    }

    /**
     * The `byteLength` method is a static method that calculates the byte length of a given input.
     * The input can be a string (with a specified encoding), `ArrayBuffer`, `SharedArrayBuffer`, or a `Uint8Array`.
     * It determines the byte length based on the type of the input, ensuring that data is appropriately handled based on its format.
     *
     * ## Description:
     * This method is used to calculate how many bytes a given piece of data would occupy in memory, which is useful for working
     * with buffers and encoding data. It supports strings with a specified encoding (e.g., 'utf8', 'base64'), as well as
     * array-like objects such as `ArrayBuffer` and `Uint8Array`. The method throws an error if the input type is invalid.
     *
     * - **Input**: The method accepts:
     *   - A string (with an optional encoding).
     *   - An `ArrayBuffer`, `SharedArrayBuffer`, or any object that is an instance of `ArrayBufferView` (like `Uint8Array`).
     * - **Output**: A number representing the byte length of the input.
     *
     * ## Example:
     *
     * ```ts
     * console.log(Buffer.byteLength('Hello, World!', 'utf8')); // Output: 13
     * console.log(Buffer.byteLength(new Uint8Array([1, 2, 3]))); // Output: 3
     * console.log(Buffer.byteLength(new ArrayBuffer(1024))); // Output: 1024
     * ```
     *
     * @static
     * @param string - The input data (string, `ArrayBuffer`, `SharedArrayBuffer`, or `ArrayBufferView`).
     * @param encoding - The encoding of the string (default is 'utf8'). Only applies if the input is a string.
     * @returns A number representing the byte length of the input.
     * @throws TypeError if the input is of an unsupported type.
     */

    static byteLength(
        string: string | NodeJS.ArrayBufferView | ArrayBuffer | SharedArrayBuffer,
        encoding: BufferEncoding = 'utf8'
    ): number {
        if (typeof string === 'string') {
            // If string is provided, calculate byte length based on encoding
            const encoder = this.encoding(string, encoding);

            return encoder.byteLength;
        } else if (string instanceof ArrayBuffer || string instanceof SharedArrayBuffer) {
            // If ArrayBuffer or SharedArrayBuffer is provided, return byte length
            return string.byteLength;
        } else if (string instanceof Uint8Array || ArrayBuffer.isView(string)) {
            // If Uint8Array or ArrayBufferView is provided, return byte length
            return string.byteLength;
        } else {
            // If the provided value is not a string or ArrayBuffer/View, throw an error
            throw new TypeError('Invalid input type. Expected string, ArrayBuffer, or ArrayBufferView.');
        }
    }

    /**
     * The `concat` method is a static method that concatenates multiple `Buffer` or `Uint8Array` instances into a single `Buffer`.
     * It allows combining an array of buffers into one large buffer, optionally specifying the total length of the resulting buffer.
     *
     * ## Description:
     * This method takes an array of `Uint8Array` or `Buffer` instances and concatenates them into a single `Buffer`.
     * If the total length of the final buffer is not provided, it calculates the total length by summing the lengths of all input buffers.
     * If any of the input buffers are empty or if `totalLength` is specified as `0`, an empty `Buffer` is returned.
     *
     * - **Input**: A `ReadonlyArray<Uint8Array | Buffer>` containing the buffers to be concatenated,
     * and an optional `totalLength` (number) to specify the total length of the resulting buffer.
     * - **Output**: A new `Buffer` containing the concatenated byte data from all input buffers.
     *
     * ## Example:
     *
     * ```ts
     * const buffer1 = Buffer.from([1, 2, 3]);
     * const buffer2 = Buffer.from([4, 5, 6]);
     * const buffer3 = Buffer.from([7, 8, 9]);
     *
     * const concatenated = Buffer.concat([buffer1, buffer2, buffer3]);
     * console.log(concatenated); // Output: <Buffer 01 02 03 04 05 06 07 08 09>
     * ```
     *
     * @static
     * @param list - A `ReadonlyArray<Uint8Array | Buffer>` containing the buffers to be concatenated.
     * @param totalLength - The total length of the resulting buffer (optional).
     * @returns A new `Buffer` containing the concatenated data from all input buffers.
     */

    static concat(list: ReadonlyArray<Uint8Array | Buffer>, totalLength?: number): Buffer {
        if (list.length === 0 || totalLength === 0) {
            return new Buffer(0);
        }

        if (totalLength === undefined) {
            totalLength = list.reduce((acc, buf) => acc + buf.length, 0);
        }

        const result = new Buffer(totalLength);
        let offset = 0;

        for (const buf of list) {
            result.set(buf, offset);
            offset += buf.length;
        }

        return result;
    }

    /**
     * The `copyBytesFrom` method is a static method that copies bytes from a given `TypedArray` (such as `Uint8Array`, `Int8Array`, etc.)
     * starting at a specified offset and for a given length, into a new `Buffer`.
     * It performs bounds checking and ensures that the specified offset and length are valid before copying the data.
     *
     * ## Description:
     * This method allows extracting a portion of bytes from a `TypedArray` and returning them as a new `Buffer`.
     * It can be useful when working with views of an underlying `ArrayBuffer` and when needing to create a `Buffer`
     * from a segment of that `TypedArray` starting from a specific offset and length.
     * The method ensures that the offset and length are within valid bounds to prevent errors.
     *
     * - **Input**:
     *   - `view`: A `NodeJS.TypedArray` (e.g., `Uint8Array`, `Int8Array`, `Float32Array`) from which to copy bytes.
     *   - `offset`: The starting position (in bytes) from which to begin copying (default is 0).
     *   - `length`: The number of bytes to copy (default is the remaining length starting from the offset).
     * - **Output**: A new `Buffer` containing the copied bytes from the `TypedArray`.
     *
     * ## Example:
     *
     * ```ts
     * const typedArray = new Uint8Array([10, 20, 30, 40, 50]);
     * const buffer = Buffer.copyBytesFrom(typedArray, 1, 3);
     * console.log(buffer); // Output: <Buffer 14 1e 28>
     * ```
     *
     * @static
     * @param view - A `TypedArray` (e.g., `Uint8Array`) from which bytes will be copied.
     * @param offset - The offset (in bytes) from which to start copying (default is 0).
     * @param length - The number of bytes to copy (default is the remaining length from the offset).
     * @returns A new `Buffer` containing the copied bytes.
     * @throws RangeError if the `offset` or `length` are invalid or out of bounds.
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
     * The `compare` method is a static method that compares two `Buffer` instances and determines their relative order.
     * It compares the contents of `buf1` and `buf2` and returns:
     * - `-1` if `buf1` is considered less than `buf2`,
     * - `0` if both buffers are equal,
     * - `1` if `buf1` is considered greater than `buf2`.
     *
     * ## Description:
     * This method provides an easy way to compare two `Buffer` objects, similar to how strings or numbers can be compared.
     * The comparison is done byte by byte in a lexicographical manner, meaning that the buffers are compared from the first byte to the last byte.
     * If the contents are the same, it returns `0`; if they differ, it returns either `-1` or `1` depending on which buffer has the lexicographically smaller or larger value.
     *
     * - **Input**: Two `Buffer` instances (`buf1` and `buf2`) to compare.
     * - **Output**: A number indicating the result of the comparison:
     *   - `-1`: `buf1` is lexicographically less than `buf2`.
     *   - `0`: Both buffers are equal.
     *   - `1`: `buf1` is lexicographically greater than `buf2`.
     *
     * ## Example:
     *
     * ```ts
     * const buffer1 = Buffer.from([1, 2, 3]);
     * const buffer2 = Buffer.from([1, 2, 4]);
     *
     * console.log(Buffer.compare(buffer1, buffer2)); // Output: -1
     * ```
     *
     * @static
     * @param buf1 - The first `Buffer` to compare.
     * @param buf2 - The second `Buffer` to compare.
     * @returns A number (`-1`, `0`, or `1`) indicating the comparison result.
     */

    static compare(buf1: Buffer, buf2: Buffer): -1 | 0 | 1 {
        return buf1.compare(buf2);
    }

    /**
     * The `alloc` method is a static method that creates a new `Buffer` of a specified size and fills it with a specified value.
     * It initializes the buffer with a given size, and optionally fills it with a provided value, using a specified encoding.
     * The method checks that the size is within valid bounds before allocation.
     *
     * ## Description:
     * This method is used to allocate a new `Buffer` of a specific size, which can optionally be pre-filled with a value.
     * The size must be a valid number and within the permissible limits, as defined by `Buffer.constants.MAX_LENGTH`.
     * If the `fill` parameter is provided, the buffer is filled with the specified value, and the buffer is returned ready for use.
     *
     * - **Input**:
     *   - `size`: A `number` indicating the size of the buffer to be allocated (must be within valid limits).
     *   - `fill`: A value to fill the allocated buffer (can be a `string`, `Uint8Array`, or `number`).
     *   - `encoding`: A `BufferEncoding` (default is 'utf-8') to specify how to encode the `fill` string.
     * - **Output**: A new `Buffer` filled with the specified value, or an empty buffer if no fill value is provided.
     *
     * ## Example:
     *
     * ```ts
     * const buffer = Buffer.alloc(10, 'a');
     * console.log(buffer); // Output: <Buffer 61 61 61 61 61 61 61 61 61 61>
     * ```
     *
     * @static
     * @param size - The size of the buffer to be allocated.
     * @param fill - A value to fill the buffer (optional).
     * @param encoding - The encoding to use when filling the buffer (optional, default is 'utf-8').
     * @returns A newly allocated `Buffer`, optionally filled with the specified value.
     * @throws TypeError if the `size` is not a valid number.
     * @throws RangeError if the `size` exceeds the maximum allowable size.
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
     * The `allocUnsafe` method is a static method that creates a new `Buffer` of a specified size without initializing it.
     * This method is faster than `alloc` but the contents of the buffer are not initialized, which can be risky.
     * It is intended for use cases where you want to quickly allocate memory and are going to overwrite the buffer's contents immediately.
     *
     * ## Description:
     * This method allocates a new `Buffer` of the specified size without filling it with any data.
     * The buffer may contain random values, so it should only be used if you are going to populate it with new data immediately after allocation.
     *
     * - **Input**:
     *   - `size`: A `number` indicating the size of the buffer to be allocated.
     * - **Output**: A new `Buffer` of the specified size.
     *
     * ## Example:
     *
     * ```ts
     * const unsafeBuffer = Buffer.allocUnsafe(10);
     * console.log(unsafeBuffer); // Output: <Buffer 45 67 23 ... (random values)>
     * ```
     *
     * @static
     * @param size - The size of the buffer to be allocated.
     * @returns A newly allocated `Buffer` of the specified size with uninitialized contents.
     * @throws TypeError if the `size` is not a valid number.
     */

    static allocUnsafe(size: number): Buffer {
        if (typeof size !== 'number') {
            throw new TypeError('The "size" argument must be of type number.');
        }

        return new Buffer(size);
    }

    swap16(): Buffer {
        const length = this.length;
        if (length % 2 !== 0) {
            throw new RangeError('Buffer length must be even for swap16');
        }

        for (let i = 0; i < length; i += 2) {
            const temp = this.dataView.getUint16(i);
            this.dataView.setUint16(i, this.dataView.getUint16(i + 1), true);
            this.dataView.setUint16(i + 1, temp, true);
        }

        return this;
    }

    swap32(): Buffer {
        const length = this.length;
        if (length % 4 !== 0) {
            throw new RangeError('Buffer length must be divisible by 4 for swap32');
        }

        for (let i = 0; i < length; i += 4) {
            const temp = this.dataView.getUint32(i);
            this.dataView.setUint32(i, this.dataView.getUint32(i + 2), true);
            this.dataView.setUint32(i + 2, temp, true);
        }

        return this;
    }

    swap64(): Buffer {
        const length = this.length;
        if (length % 8 !== 0) {
            throw new RangeError('Buffer length must be divisible by 8 for swap64');
        }

        for (let i = 0; i < length; i += 8) {
            const temp = this.dataView.getBigUint64(i);
            this.dataView.setBigUint64(i, this.dataView.getBigUint64(i + 4), true);
            this.dataView.setBigUint64(i + 4, temp, true);
        }

        return this;
    }

    /**
     * The `fill` method fills the buffer with the specified value from the `offset` to the `end` index,
     * repeating the value as necessary if it's smaller than the specified range.
     * The `fill` method can accept a string, number, or `Uint8Array` as the value to fill, and it also supports
     * specifying an encoding for string values.
     *
     * ## Description:
     * The `fill` method modifies the buffer by setting all the bytes in the specified range (`offset` to `end`)
     * to the provided `value`. If the `value` is smaller than the specified range, it will be repeated.
     *
     * If the `value` is a string, it will be encoded according to the provided encoding (default is `'utf-8'`).
     * If the `value` is a number, it is treated as a byte, and if the `value` is a `Uint8Array`, it is used directly.
     *
     * ## Input:
     * - `value`: The value to fill the buffer with. It can be a string, number, or `Uint8Array`.
     * - `offset`: The start index where the fill operation should begin (defaults to 0).
     * - `end`: The end index (exclusive) where the fill operation should stop (defaults to the buffer's length).
     * - `encoding`: The encoding to use if `value` is a string (defaults to `'utf-8'`).
     *
     * ## Output:
     * - Returns the modified `Buffer` (`this`).
     *
     * ## Example:
     * ```ts
     * const buffer = Buffer.from([1, 2, 3, 4, 5]);
     * buffer.fill(0, 1, 4);
     * console.log(buffer); // Output: <Buffer 01 00 00 00 05>
     *
     * const buffer2 = Buffer.from([1, 2, 3, 4, 5]);
     * buffer2.fill('A', 0, 3);
     * console.log(buffer2); // Output: <Buffer 41 41 41 04 05>
     * ```
     *
     * ## Error Handling:
     * - Throws a `RangeError` if `offset` or `end` are out of bounds or invalid.
     * - Throws an `Error` if `value` is neither a string, number, nor `Uint8Array`.
     * - Throws an `Error` if the `value` string results in an invalid encoding.
     *
     * @param value - The value to fill the buffer with (string, number, or Uint8Array).
     * @param offset - The starting index to begin filling (defaults to 0).
     * @param end - The ending index (exclusive) to stop filling (defaults to the buffer's length).
     * @param encoding - The encoding to use if the `value` is a string (defaults to `'utf-8'`).
     * @returns The modified `Buffer` (`this`).
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
            coercedValue = Buffer.encoding(value, encoding);

            // Validate coercedValue for string case
            if (coercedValue[0] <= 0) {
                throw new Error(`The argument 'value' is invalid. Received '${ value }'`);
            }
        } else if (typeof value === 'number') {
            coercedValue = new Uint8Array([ value & 0xFF ]);
        } else if (value instanceof Uint8Array) {
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
     * The `indexOf` method searches for the first occurrence of a given value in the buffer and returns the index
     * of the first byte of that value. It supports searching for strings, numbers, or `Uint8Array` values,
     * and can handle both direct byte searches and searches for encoded string values, with optional encoding support.
     *
     * ## Description:
     * The method searches for the first occurrence of the specified `value` in the buffer starting from the given
     * `byteOffset` (default is 0). If the `value` is found, it returns the index of the first byte of the match.
     * If not found, it returns -1. The `value` can be a string, number, or `Uint8Array`, and the method can handle
     * encoding the string before searching if necessary.
     *
     * ## Input:
     * - `value`: The value to search for. Can be a string, number, or `Uint8Array`.
     * - `byteOffset`: The position in the buffer to start the search from (default is 0).
     * - `encoding`: The encoding to use if `value` is a string (default is `'utf-8'`).
     *
     * ## Output:
     * - Returns the index of the first occurrence of `value` in the buffer or -1 if not found.
     *
     * ## Example:
     * ```ts
     * const buffer = Buffer.from('hello world');
     * const index = buffer.indexOf('world');
     * console.log(index); // Output: 6
     *
     * const buffer2 = Buffer.from([1, 2, 3, 4, 5]);
     * const index2 = buffer2.indexOf(3);
     * console.log(index2); // Output: 2
     * ```
     *
     * ## Error Handling:
     * - Throws a `RangeError` if the `byteOffset` is out of bounds (negative or greater than buffer length).
     * - Throws an `Error` if the `value` is an invalid type (must be a string, number, or `Uint8Array`).
     *
     * @param value - The value to search for in the buffer (string, number, or `Uint8Array`).
     * @param byteOffset - The position in the buffer to begin the search from (defaults to 0).
     * @param encoding - The encoding to use if the `value` is a string (defaults to `'utf-8'`).
     * @returns The index of the first occurrence of `value` or -1 if not found.
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

    override includes(value: string | number | Buffer, byteOffset: number = 0, encoding: BufferEncoding = 'utf-8'): boolean {
        return this.indexOf(value, byteOffset, encoding) !== -1;
    }

    /**
     * The `write` method writes a string into the buffer, with optional parameters to specify the offset,
     * the length to write, and the encoding format. It allows for writing a string into a specific part of the buffer
     * and handles various encoding formats.
     *
     * ## Description:
     * This method writes a string into the buffer at a specified offset, with an optional encoding.
     * If no offset is specified, the string is written starting from the beginning of the buffer.
     * The method supports different encodings like 'utf-8', 'ascii', and more, and ensures that the correct number of bytes are written
     * based on the provided encoding.
     *
     * - **Input**:
     *   - `string`: A `string` that will be written into the buffer.
     *   - `offset`: An optional `number` that indicates the position in the buffer where writing starts (default is 0).
     *   - `length`: An optional `number` that indicates how many bytes to write from the string (default is the buffer’s remaining length).
     *   - `encoding`: An optional `BufferEncoding` (default is 'utf-8') that specifies the encoding to use when writing the string.
     *
     * - **Output**: The number of bytes actually written to the buffer.
     *
     * ## Example:
     *
     * ```ts
     * const buffer = Buffer.alloc(10);
     * const bytesWritten = buffer.write('hello', 0, 'utf-8');
     * console.log(bytesWritten); // Output: 5
     * console.log(buffer); // Output: <Buffer 68 65 6c 6c 6f 00 00 00 00 00>
     * ```
     *
     * ## Error Handling:
     * - Throws a `RangeError` if the `offset` or `length` is out of bounds (greater than the buffer's length or negative).
     * - If the `encoding` is invalid, a `TypeError` is thrown.
     *
     * @param string - The string to be written to the buffer.
     * @param arg1 - Optional offset or encoding. If `arg1` is a number, it represents the offset in the buffer.
     * @param arg2 - Optional length or encoding. If `arg2` is a number, it represents the length of the bytes to write.
     * @param encoding - The encoding to use when writing the string (default is 'utf-8').
     * @returns The number of bytes written to the buffer.
     * @throws RangeError if the offset or length is out of bounds.
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
        bytesWrite = Buffer.encoding(string, encoding, fixLength);
        this.set(bytesWrite, offset);

        return bytesWrite.length;
    }

    /**
     * The `subarray` method creates a new `Buffer` that is a shallow copy of a portion of the original buffer.
     * It allows extracting a subrange of the buffer, with optional `start` and `end` indices.
     *
     * ## Description:
     * This method overrides the default `subarray` behavior to return a new `Buffer` object instead of a `Uint8Array`.
     * It extracts a section of the buffer starting at the `start` index and ending at the `end` index (exclusive).
     * If `end` is not provided, the method defaults to the buffer’s length. If `end` is specified, it is clamped to the buffer's length.
     *
     * - **Input**:
     *   - `start`: An optional `number` specifying the starting index of the subarray (default is 0).
     *   - `end`: An optional `number` specifying the ending index of the subarray (default is the buffer’s length).
     *
     * - **Output**: A new `Buffer` representing the portion of the original buffer.
     *
     * ## Example:
     *
     * ```ts
     * const buffer = Buffer.from('Hello World');
     * const subBuffer = buffer.subarray(0, 5);
     * console.log(subBuffer.toString()); // Output: 'Hello'
     * ```
     *
     * @param start - The start index (optional, default is 0).
     * @param end - The end index (optional, default is the buffer's length).
     * @returns A new `Buffer` representing the subarray of the original buffer.
     */

    override subarray(start?: number, end?: number): Buffer {
        end = end ? Math.min(end, this.length) : this.length;

        return new Buffer(super.subarray(start, end));
    }

    /**
     * The `subarray` method creates a new `Buffer` that is a shallow copy of a portion of the original buffer.
     * It allows extracting a subrange of the buffer, with optional `start` and `end` indices.
     *
     * ## Description:
     * This method overrides the default `subarray` behavior to return a new `Buffer` object instead of a `Uint8Array`.
     * It extracts a section of the buffer starting at the `start` index and ending at the `end` index (exclusive).
     * If `end` is not provided, the method defaults to the buffer’s length. If `end` is specified, it is clamped to the buffer's length.
     *
     * - **Input**:
     *   - `start`: An optional `number` specifying the starting index of the subarray (default is 0).
     *   - `end`: An optional `number` specifying the ending index of the subarray (default is the buffer’s length).
     *
     * - **Output**: A new `Buffer` representing the portion of the original buffer.
     *
     * ## Example:
     *
     * ```ts
     * const buffer = Buffer.from('Hello World');
     * const subBuffer = buffer.subarray(0, 5);
     * console.log(subBuffer.toString()); // Output: 'Hello'
     * ```
     *
     * @param start - The start index (optional, default is 0).
     * @param end - The end index (optional, default is the buffer's length).
     * @returns A new `Buffer` representing the subarray of the original buffer.
     */

    override toString(encoding: BufferEncoding = 'utf-8', start?: number, end?: number): string {
        let slicedArray;

        // Check if slicing is needed
        if (start !== 0 || end !== this.length) {
            // Perform slicing with optional defaults for start and end
            slicedArray = this.subarray(start, end);
        } else {
            // Use the original array if no slicing is needed
            slicedArray = <Buffer>this;
        }

        // Handle known encodings
        switch (encoding.toLowerCase()) {
            case 'hex':
                return decodeHEX(slicedArray);
            case 'utf8':
            case 'utf-8':
                return decodeUTF8(slicedArray);
            case 'ascii':
            case 'latin1':
            case 'binary':
                return decodeASCII(slicedArray);
            case 'base64':
                return decodeBase64(slicedArray);
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return decodeUTF16LE(slicedArray);
            default:
                // Unknown encoding
                throw new TypeError('Unknown encoding: ' + encoding);
        }
    }

    /**
     * The `toJSON` method serializes the `Buffer` instance into a plain JavaScript object
     * with a `type` field set to 'Buffer' and a `data` field containing an array representation of the buffer’s contents.
     * This is useful for converting a `Buffer` into a format that can be easily serialized into JSON.
     *
     * ## Description:
     * This method overrides the default `toJSON` behavior to ensure that the `Buffer` is properly serialized for JSON representation.
     * The `data` field contains an array of the byte values in the `Buffer`, making it compatible with JSON stringification.
     *
     * - **Output**: An object with two fields:
     *   - `type`: A string with the value `'Buffer'`.
     *   - `data`: An array of the byte values stored in the buffer.
     *
     * ## Example:
     *
     * ```ts
     * const buffer = Buffer.from('Hello World');
     * const jsonString = JSON.stringify(buffer);
     * console.log(jsonString);
     * // Output: '{"type":"Buffer","data":[72,101,108,108,111,32,87,111,114,108,100]}'
     * ```
     *
     * @returns An object with `type` set to `'Buffer'` and `data` containing the buffer’s byte array.
     */

    toJSON() {
        return {
            type: 'Buffer',
            data: Array.from(this)
        };
    }

    /**
     * The `equals` method compares the current `Buffer` instance with another `Buffer` or `Uint8Array` to determine if they are equal.
     * The comparison is done by checking if the byte lengths are the same and then comparing each byte at every index.
     *
     * ## Description:
     * This method performs a byte-by-byte comparison between the current buffer and another provided buffer (`otherBuffer`).
     * It first checks if the lengths of both buffers are equal. If they are, it proceeds to compare each byte.
     * If any byte differs, it returns `false`. Otherwise, it returns `true` if all bytes are equal.
     *
     * - **Input**:
     *   - `otherBuffer`: The buffer to compare with the current buffer. It can be an instance of `Buffer` or `Uint8Array`.
     *
     * - **Output**: A boolean indicating whether the current buffer is equal to the provided `otherBuffer`.
     *   - `true`: If the buffers have the same length and the same byte values at every index.
     *   - `false`: If the buffers are not the same in length or any byte differs.
     *
     * ## Example:
     *
     * ```ts
     * const buffer1 = Buffer.from([1, 2, 3, 4]);
     * const buffer2 = Buffer.from([1, 2, 3, 4]);
     * const buffer3 = Buffer.from([5, 6, 7, 8]);
     *
     * console.log(buffer1.equals(buffer2)); // Output: true
     * console.log(buffer1.equals(buffer3)); // Output: false
     * ```
     *
     * ## Error Handling:
     * - If `otherBuffer` is not an instance of `Buffer` or `Uint8Array`, a `TypeError` will be thrown with a descriptive error message.
     *
     * ## How it works:
     * - The method first verifies that `otherBuffer` is an instance of `Buffer` or `Uint8Array` using `Buffer.isInstance`.
     * - Then it checks if the lengths of the buffers match. If they don’t, it immediately returns `false`.
     * - It proceeds to compare each byte of the two buffers. If any byte is different, the method returns `false`.
     * - If all bytes are the same, the method returns `true`.
     *
     * @param otherBuffer - The buffer to compare with the current buffer.
     * @returns `true` if both buffers are equal, otherwise `false`.
     * @throws {TypeError} If `otherBuffer` is not an instance of `Buffer` or `Uint8Array`.
     */

    equals(otherBuffer: Uint8Array | Buffer): boolean {
        if (!Buffer.isInstance(otherBuffer, Uint8Array)) {
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
     * The `compare` method compares the current `Buffer` instance with another `Buffer` (target) in a specified range of bytes.
     * It compares the content of the buffers starting from specified offsets and within given ranges, and returns a value indicating
     * the relative order of the two buffers.
     *
     * ## Description:
     * This method allows for a detailed comparison between two buffers, considering specific byte ranges. It compares byte-by-byte
     * from the given start to end positions for both the target and source buffers. It can be used to determine if one buffer is
     * lexicographically greater than, equal to, or less than the other.
     *
     * The method returns:
     * - `-1`: If the current buffer (source) is lexicographically smaller than the target buffer.
     * - `0`: If the two buffers are equal in the compared range.
     * - `1`: If the current buffer (source) is lexicographically greater than the target buffer.
     *
     * ## Input:
     * - `target`: The buffer to compare against, which must be an instance of `Buffer` or `Uint8Array`.
     * - `targetStart`: The start index for comparison in the target buffer (defaults to 0).
     * - `targetEnd`: The end index for comparison in the target buffer (defaults to the length of the target buffer).
     * - `sourceStart`: The start index for comparison in the source buffer (defaults to 0).
     * - `sourceEnd`: The end index for comparison in the source buffer (defaults to the length of the source buffer).
     *
     * ## Output:
     * - `-1`: If the current buffer (source) is smaller than the target buffer in the specified range.
     * - `0`: If the current buffer (source) is equal to the target buffer in the specified range.
     * - `1`: If the current buffer (source) is greater than the target buffer in the specified range.
     *
     * ## Example:
     * ```ts
     * const buffer1 = Buffer.from([1, 2, 3]);
     * const buffer2 = Buffer.from([1, 2, 4]);
     * console.log(buffer1.compare(buffer2)); // Output: -1
     * console.log(buffer2.compare(buffer1)); // Output: 1
     * ```
     *
     * ## Error Handling:
     * - A `TypeError` is thrown if the `target` is not an instance of `Uint8Array` or `Buffer`.
     * - A `RangeError` is thrown if any of the offsets or range values are out of bounds or invalid.
     *
     * @param target - The buffer to compare with the current buffer.
     * @param targetStart - The start index for comparison in the target buffer.
     * @param targetEnd - The end index for comparison in the target buffer.
     * @param sourceStart - The start index for comparison in the source buffer.
     * @param sourceEnd - The end index for comparison in the source buffer.
     * @returns A value indicating the result of the comparison: `-1`, `0`, or `1`.
     * @throws {TypeError} If `target` is not an instance of `Buffer` or `Uint8Array`.
     * @throws {RangeError} If any of the offsets or lengths are out of range.
     */

    compare(
        target: Buffer,
        targetStart = 0,
        targetEnd = target.length,
        sourceStart = 0,
        sourceEnd = this.length
    ): -1 | 0 | 1 {
        if (!Buffer.isInstance(target, Uint8Array)) {
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
     * The `copy` method copies a section of the current `Buffer` (source) to a target `Uint8Array`, starting at a specified
     * position in the target array. It allows you to specify the portion of the source buffer to copy and the position in
     * the target array where the data should be placed.
     *
     * ## Description:
     * This method allows you to copy a specified section of the current buffer (`Buffer`) to a target `Uint8Array`,
     * starting at a defined index in the target array. You can specify a source range (start and end) and a target start
     * position. The method returns the number of bytes copied.
     *
     * The copy operation is limited to the size of the target array or the size of the specified range in the source buffer,
     * whichever is smaller. If the target is smaller than the source range, only as much data as can fit in the target is copied.
     *
     * ## Input:
     * - `target`: The `Uint8Array` where the data from the current buffer will be copied to.
     * - `targetStart`: The start index in the target array where the copy should begin (defaults to 0).
     * - `sourceStart`: The start index in the source buffer from which to begin copying (defaults to 0).
     * - `sourceEnd`: The end index in the source buffer up to which data should be copied (defaults to the length of the buffer).

     * ## Output:
     * - The number of bytes copied to the target array.
     *
     * ## Example:
     * ```ts
     * const source = Buffer.from([1, 2, 3, 4, 5]);
     * const target = new Uint8Array(5);
     * const bytesCopied = source.copy(target, 0, 1, 4);
     * console.log(target); // Output: Uint8Array(5) [ 2, 3, 4, 5, 0 ]
     * console.log(bytesCopied); // Output: 3
     * ```
     *
     * ## Error Handling:
     * - No explicit error handling is required since the method ensures that copying does not exceed bounds.
     * - If the `target` is too small to accommodate the requested data, only as much as can fit will be copied.
     * - The method returns the number of bytes copied, which may be less than the specified range if the target array is smaller.
     *
     * @param target - The target `Uint8Array` to copy data into.
     * @param targetStart - The start index in the target array where the data should be copied to.
     * @param sourceStart - The start index in the source buffer from which to copy data.
     * @param sourceEnd - The end index in the source buffer up to which data should be copied.
     * @returns The number of bytes copied from the source buffer to the target array.
     * @throws {RangeError} If the specified range exceeds the bounds of the source buffer.
     */

    copy(target: Uint8Array, targetStart: number = 0, sourceStart: number = 0, sourceEnd: number = this.length): number {
        target.set(this.subarray(sourceStart, sourceEnd), targetStart);

        return Math.min(sourceEnd - sourceStart, target.length - targetStart);
    }

    /**
     * The `slice` method creates a shallow copy of a portion of the current `Buffer` and returns a new `Buffer`
     * containing the selected elements. The `slice` method is similar to `subarray`, but it always creates a new `Buffer`
     * instance rather than returning a view of the original buffer.
     *
     * ## Description:
     * This method returns a new `Buffer` that contains a shallow copy of the portion of the current buffer specified by
     * the `start` and `end` indices. If no `end` is specified, the slice will continue to the end of the buffer.
     * If no `start` is specified, it defaults to 0.
     * Unlike `subarray`, `slice` does not return a view of the original buffer but a new instance with the selected data.
     *
     * ## Input:
     * - `start`: The start index (inclusive) of the portion to extract (defaults to 0).
     * - `end`: The end index (exclusive) of the portion to extract (defaults to the length of the buffer).
     *
     * ## Output:
     * - A new `Buffer` containing the extracted portion of the original buffer.
     *
     * ## Example:
     * ```ts
     * const buffer = Buffer.from([1, 2, 3, 4, 5]);
     * const slicedBuffer = buffer.slice(1, 4);
     * console.log(slicedBuffer); // Output: <Buffer 02 03 04>
     * ```
     *
     * ## Error Handling:
     * - No explicit error handling is needed as the method ensures that valid indices are used within the bounds of the buffer.
     *
     * @param start - The start index (inclusive) of the portion to slice.
     * @param end - The end index (exclusive) of the portion to slice.
     * @returns A new `Buffer` containing the sliced data.
     */

    override slice(start?: number, end?: number): Buffer {
        return this.subarray(start, end);
    }

    readUInt8(offset?: number): number {
        return this.readUint8(offset);
    }

    readUint8(offset: number = 0): number {
        return this.dataView.getUint8(offset);
    }

    readUInt16LE(offset?: number): number {
        return this.readUint16LE(offset);
    }

    readUint16LE(offset: number = 0): number {
        return this.dataView.getUint16(offset, true);
    }

    readUInt16BE(offset?: number): number {
        return this.readUint16BE(offset);
    }

    readUint16BE(offset: number = 0): number {
        return this.dataView.getUint16(offset, false);
    }

    readUInt32LE(offset?: number): number {
        return this.readUint32LE(offset);
    }

    readUint32LE(offset: number = 0): number {
        return this.dataView.getUint32(offset, true);
    }

    readUInt32BE(offset?: number): number {
        return this.readUint32BE(offset);
    }

    readUint32BE(offset: number = 0): number {
        return this.dataView.getUint32(offset, false);
    }

    readBigUInt64LE(offset?: number): bigint {
        return this.readBigUint64LE(offset);
    }

    readBigUint64LE(offset: number = 0): bigint {
        return this.dataView.getBigUint64(offset, true);
    }

    readBigUInt64BE(offset?: number): bigint {
        return this.readBigUint64BE(offset);
    }

    readBigUint64BE(offset: number = 0): bigint {
        return this.dataView.getBigUint64(offset, false);
    }

    readUIntLE(offset: number, byteLength: number): number {
        return this.readUintLE(offset, byteLength);
    }

    readUintLE(offset: number, byteLength: number): number {
        const maxByteLength = this.length - offset;

        if (byteLength <= 0 || byteLength > maxByteLength) {
            throw new RangeError(`byteLength must be between 1 and ${ maxByteLength }`);
        }

        let result = 0;

        for (let i = 0; i < byteLength; i++) {
            result |= this.dataView.getUint8(offset + i) << (8 * i);
        }

        return result;
    }

    readUIntBE(offset: number, byteLength: number): number {
        return this.readUintBE(offset, byteLength);
    }

    readUintBE(offset: number, byteLength: number): number {
        const maxByteLength = this.length - offset;

        if (byteLength <= 0 || byteLength > maxByteLength) {
            throw new RangeError(`byteLength must be between 1 and ${ maxByteLength }`);
        }

        let result = 0;

        for (let i = 0; i < byteLength; i++) {
            result = (result << 8) | this.dataView.getUint8(offset + i);
        }

        return result;
    }

    readInt8(offset: number = 0): number {
        return this.dataView.getInt8(offset);
    }

    readInt16LE(offset: number = 0): number {
        return this.dataView.getInt16(offset, true);
    }

    readInt16BE(offset: number = 0): number {
        return this.dataView.getInt16(offset, false);
    }

    readInt32LE(offset: number = 0): number {
        return this.dataView.getInt32(offset, true);
    }

    readInt32BE(offset: number = 0): number {
        return this.dataView.getInt32(offset, false);
    }

    readBigInt64LE(offset: number = 0): bigint {
        return this.dataView.getBigInt64(offset, true);
    }

    readBigInt64BE(offset: number = 0): bigint {
        return this.dataView.getBigInt64(offset, false);
    }

    readIntLE(offset: number, byteLength: number): number {
        const maxByteLength = this.length - offset;

        if (byteLength <= 0 || byteLength > maxByteLength) {
            throw new RangeError(`byteLength must be between 1 and ${ maxByteLength }`);
        }

        let result = 0;
        let isNegative = false;

        for (let i = 0; i < byteLength; i++) {
            const byteValue = this.dataView.getUint8(offset + i);
            result |= (byteValue << (8 * i));

            // Check if the most significant bit is set (indicating a negative value)
            if (i === byteLength - 1 && (byteValue & 0x80)) {
                isNegative = true;
            }
        }

        // If the value is negative, perform two's complement conversion
        if (isNegative) {
            const mask = (1 << (byteLength * 8)) - 1;
            result = -((result ^ mask) + 1);
        }

        return result;
    }

    readIntBE(offset: number, byteLength: number): number {
        const maxByteLength = this.length - offset;

        if (byteLength <= 0 || byteLength > maxByteLength) {
            throw new RangeError(`byteLength must be between 1 and ${ maxByteLength }`);
        }

        let result = 0;
        let isNegative = false;

        for (let i = byteLength - 1; i >= 0; i--) {
            const byteValue = this.dataView.getUint8(offset + i);
            result |= (byteValue << (8 * (byteLength - 1 - i)));

            // Check if the most significant bit is set (indicating a negative value)
            if (i === 0 && (byteValue & 0x80)) {
                isNegative = true;
            }
        }

        // If the value is negative, perform two's complement conversion
        if (isNegative) {
            const mask = (1 << (byteLength * 8)) - 1;
            result = -((result ^ mask) + 1);
        }

        return result;
    }

    readFloatLE(offset: number = 0): number {
        return this.dataView.getFloat32(offset, true);
    }

    readFloatBE(offset: number = 0): number {
        return this.dataView.getFloat32(offset, false);
    }

    readDoubleLE(offset: number = 0): number {
        return this.dataView.getFloat64(offset, true);
    }

    readDoubleBE(offset: number = 0): number {
        return this.dataView.getFloat64(offset, false);
    }

    writeUInt8(value: number, offset?: number): number {
        return this.writeUint8(value, offset);
    }

    writeUint8(value: number, offset: number = 0): number {
        this.dataView.setUint8(offset, value);

        return 1;
    }

    writeUInt16LE(value: number, offset?: number): number {
        return this.writeUint16LE(value, offset);
    }

    writeUint16LE(value: number, offset: number = 0): number {
        this.dataView.setUint16(offset, value, true);

        return 2;
    }

    writeUInt16BE(value: number, offset?: number): number {
        return this.writeUint16BE(value, offset);
    }

    writeUint16BE(value: number, offset: number = 0): number {
        this.dataView.setUint16(value, offset, false);

        return 2;
    }

    writeUInt32LE(value: number, offset?: number): number {
        return this.writeUint32LE(value, offset);
    }

    writeUint32LE(value: number, offset: number = 0): number {
        this.dataView.setUint32(value, offset, true);

        return 4;
    }

    writeUInt32BE(value: number, offset?: number): number {
        return this.writeUint32BE(value, offset);
    }

    writeUint32BE(value: number, offset: number = 0): number {
        this.dataView.setUint32(value, offset, false);

        return 4;
    }

    writeBigUInt64LE(value: bigint, offset?: number): number {
        return this.writeBigUint64LE(value, offset);
    }

    writeBigUint64LE(value: bigint, offset?: number): number {
        this.dataView.setBigUint64(offset ?? 0, value, true);

        return 8; // Number of bytes written
    }

    writeBigUInt64BE(value: bigint, offset?: number): number {
        return this.writeBigUint64BE(value, offset);
    }

    writeBigUint64BE(value: bigint, offset?: number): number {
        this.dataView.setBigUint64(offset ?? 0, value, false);

        return 8; // Number of bytes written
    }

    writeUIntLE(value: number, offset: number, byteLength: number): number {
        return this.writeUintLE(value, offset, byteLength);
    }

    writeUintLE(value: number, offset: number, byteLength: number): number {
        const maxByteLength = this.length - offset;

        if (byteLength <= 0 || byteLength > maxByteLength) {
            throw new RangeError(`byteLength must be between 1 and ${ maxByteLength }`);
        }

        for (let i = 0; i < byteLength; i++) {
            this.dataView.setUint8(offset + i, value & 0xFF);
            // value >>= 8;
            value /= 256;
        }

        return offset + byteLength;
    }

    writeUIntBE(value: number, offset: number, byteLength: number): number {
        return this.writeUintBE(value, offset, byteLength);
    }

    writeUintBE(value: number, offset: number, byteLength: number): number {
        const maxByteLength = this.length - offset;

        if (byteLength <= 0 || byteLength > maxByteLength) {
            throw new RangeError(`byteLength must be between 1 and ${ maxByteLength }`);
        }

        for (let i = byteLength - 1; i >= 0; i--) {
            this.dataView.setUint8(offset + i, value & 0xFF);
            value /= 256; // equivalent to value >>= 8
        }

        return offset + byteLength;
    }

    writeInt8(value: number, offset: number = 0): number {
        this.dataView.setInt8(offset, value);

        return 1;
    }

    writeInt16LE(value: number, offset: number = 0): number {
        this.dataView.setInt16(offset, value, true);

        return 2;
    }

    writeInt16BE(value: number, offset: number = 0): number {
        this.dataView.setInt16(offset, value, false);

        return 2;
    }

    writeInt32LE(value: number, offset: number = 0): number {
        this.dataView.setInt32(offset, value, true);

        return 4;
    }

    writeInt32BE(value: number, offset: number = 0): number {
        this.dataView.setInt32(offset, value, false);

        return 4;
    }

    writeBigInt64LE(value: bigint, offset?: number): number {
        this.dataView.setBigInt64(offset ?? 0, value, true);

        return 8; // Number of bytes written
    }

    writeBigInt64BE(value: bigint, offset?: number): number {
        this.dataView.setBigInt64(offset ?? 0, value, false);

        return 8; // Number of bytes written
    }

    writeIntLE(value: number, offset: number, byteLength: number): number {
        const maxByteLength = this.length - offset;

        if (byteLength <= 0 || byteLength > maxByteLength) {
            throw new RangeError(`byteLength must be between 1 and ${ maxByteLength }`);
        }

        for (let i = 0; i < byteLength; i++) {
            this.dataView.setUint8(offset + i, value & 0xFF);
            value /= 256;
        }

        return offset + byteLength;
    }

    writeIntBE(value: number, offset: number, byteLength: number): number {
        const maxByteLength = this.length - offset;

        if (byteLength <= 0 || byteLength > maxByteLength) {
            throw new RangeError(`byteLength must be between 1 and ${ maxByteLength }`);
        }

        for (let i = byteLength - 1; i >= 0; i--) {
            this.dataView.setUint8(offset + i, value & 0xFF);
            value /= 256;
        }

        return offset + byteLength;
    }

    writeFloatLE(value: number, offset: number = 0): number {
        this.dataView.setFloat32(offset, value, true);

        return 4;
    }

    writeFloatBE(value: number, offset: number = 0): number {
        this.dataView.setFloat32(offset, value, false);

        return 4;
    }

    writeDoubleLE(value: number, offset: number = 0): number {
        this.dataView.setFloat64(offset, value, true);

        return 8;
    }

    writeDoubleBE(value: number, offset: number = 0): number {
        this.dataView.setFloat64(offset, value, false);

        return 8;
    }

    /**
     * Custom `inspect` function for the `Buffer` class, used for converting a `Buffer` instance into a string representation
     * that is more readable when logging or inspecting the object in Node.js or other environments that use the `util.inspect` method.
     *
     * ## Description:
     * This method is implemented using the `Symbol.for('nodejs.util.inspect.custom')` symbol, which is recognized by
     * Node.js's `util.inspect` for custom object inspection. It converts the buffer's contents into a space-separated string
     * of hexadecimal byte values, with each byte represented by a two-character hexadecimal string.
     *
     * The `inspect` function is useful for debugging and logging, providing a human-readable representation of the `Buffer`
     * instance that shows its raw byte values in a format commonly used for buffers.
     *
     * - **Input**: No input parameters. The method operates directly on the current `Buffer` instance.
     * - **Output**: A string in the format `<Buffer ...>`, where the `...` is a space-separated list of hexadecimal byte values.
     *
     * ## Example:
     *
     * ```ts
     * const buf = Buffer.from([255, 16, 32, 64]);
     * console.log(buf); // Output: <Buffer ff 10 20 40>
     * ```
     *
     * @returns A string representing the buffer, formatted as `<Buffer ...>`, where `...` are the hexadecimal byte values.
     */

    [Symbol.for('nodejs.util.inspect.custom')]() {
        const value = Array.from(
            this, byte => byte.toString(16).padStart(2, '0')
        ).join(' ');

        return `<Buffer ${ value }>`;
    }

    /**
     * The `isInstance` method checks whether a given object is an instance of a specified type.
     * It works by checking both the `instanceof` relationship and by comparing the constructor names,
     * providing a fallback for situations where the `instanceof` operator might not behave as expected (e.g., in certain cross-context scenarios).
     *
     * ## Description:
     * This method checks if the provided `obj` is an instance of the specified `type`. It first tries the `instanceof` operator,
     * and if that fails (e.g., due to objects coming from different execution contexts), it falls back to comparing the names of the constructors
     * to determine if the object is an instance of the specified type.
     *
     * - **Input**:
     *   - `obj`: The object to check against the type.
     *   - `type`: The type (constructor function) to check the object against.
     *
     * - **Output**: A boolean indicating whether `obj` is an instance of `type` (true) or not (false).
     *
     * ## Example:
     *
     * ```ts
     * class MyClass {}
     * const myObj = new MyClass();
     *
     * const result1 = isInstance(myObj, MyClass); // Output: true
     * const result2 = isInstance(myObj, Object); // Output: true
     * const result3 = isInstance(myObj, Array);  // Output: false
     * ```
     *
     * ## Error Handling:
     * - This method does not throw any errors, but it will return `false` if the `obj` is not an instance of the `type`.
     *
     * @param obj - The object to check.
     * @param type - The type (constructor) to compare against.
     * @returns `true` if `obj` is an instance of `type`, otherwise `false`.
     */

    private static isInstance(obj: unknown, type: any): boolean {
        return (
            obj instanceof type ||
            (obj != null && Object.getPrototypeOf(obj).constructor != null &&
                Object.getPrototypeOf(obj).constructor.name != null &&
                Object.getPrototypeOf(obj).constructor.name === type.name)
        );
    }

    /**
     * A private static method that encodes a given string into a `Uint8Array` based on the specified encoding format.
     * This method supports a variety of encodings, such as UTF-8, ASCII, Base64, and more, and allows for optional truncation of the encoded result.
     * It serves as an internal utility for encoding strings into buffers for further processing.
     *
     * ## Description:
     * The `encoding` method takes a string and encodes it into a `Uint8Array` using the specified encoding format. It supports multiple
     * encoding types, including standard text encodings and binary formats.
     *
     * - **Input**:
     *   - `string`: The string to be encoded.
     *   - `encoding`: The encoding format to use. Default is `'utf-8'`.
     *   - `length` (optional): The maximum length of the resulting `Uint8Array`. If provided, it will truncate the encoded result to this length.
     *
     * - **Output**: Returns a `Uint8Array` representing the encoded data.
     *
     * ## Supported Encodings:
     * - **`'hex'`**: Encodes the string as a hexadecimal representation.
     * - **`'utf8'` / `'utf-8'`**: Encodes the string using UTF-8 encoding.
     * - **`'ascii'` / `'latin1'` / `'binary'`**: Encodes the string as ASCII or Latin-1 (ISO-8859-1).
     * - **`'base64'`**: Encodes the string as Base64.
     * - **`'ucs2'` / `'ucs-2'` / `'utf16le'` / `'utf-16le'`**: Encodes the string using UTF-16 Little Endian encoding.
     *
     * - If the encoding type is not recognized, a `TypeError` is thrown.
     *
     * ## Example:
     *
     * ```ts
     * const buffer1 = encoding("Hello, world!", "utf8");
     * const buffer2 = encoding("Hello, world!", "hex");
     * const buffer3 = encoding("Hello, world!", "base64", 10); // Truncates to 10 bytes
     * ```
     *
     * ## Error Handling:
     * - Throws a `TypeError` if an unknown encoding is provided.
     * - The `length` parameter (if provided) will ensure the encoded result does not exceed the specified size.
     * - If the length exceeds the result of the encoding, no truncation is applied.
     *
     * ## How it works:
     * - Based on the provided encoding type, the method delegates the encoding task to different encoding functions (e.g., `encodeUTF8`, `encodeHEX`, etc.).
     * - It handles known encodings and ensures the string is properly transformed into a buffer in the specified format.
     *
     * @private
     * @static
     * @param string - The string to encode.
     * @param encoding - The encoding format to use (default: `'utf-8'`).
     * @param length - (Optional) The maximum length of the encoded result.
     * @returns A `Uint8Array` representing the encoded string.
     * @throws TypeError if an unknown encoding is provided.
     */

    private static encoding(string: string, encoding: BufferEncoding = 'utf-8', length?: number): Uint8Array {
        // Handle known encodings
        switch (encoding.toLowerCase()) {
            case 'hex':
                return encodeHEX(string, length);
            case 'utf8':
            case 'utf-8':
                return encodeUTF8(string, length);
            case 'ascii':
            case 'latin1':
            case 'binary':
                return encodeASCII(string, length);
            case 'base64':
                return encodeBase64(string, length);
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return encodeUTF16LE(string, length);
            default:
                // Unknown encoding
                throw new TypeError('Unknown encoding: ' + encoding);
        }
    }

    /**
     * The `prepareIndexOfParameters` method processes the input `value` and `byteOffset` to prepare them for searching
     * within the buffer. It ensures the `value` is properly coerced to a `Uint8Array` and the `byteOffset` is adjusted
     * correctly (allowing negative offsets for reverse indexing). This is a helper function used internally in the
     * `indexOf` method to perform the actual search.
     *
     * ## Description:
     * This method takes the `value` to search for and a `byteOffset` to start searching from. It converts the `value`
     * to a `Uint8Array` (if it's a string, number, or `Uint8Array`) and calculates the proper `preparedOffset` to ensure
     * correct positioning within the buffer, handling negative offsets as well.
     *
     * ## Input:
     * - `value`: The value to search for in the buffer. It can be a `string`, `number`, or `Uint8Array`.
     * - `preparedOffset`: The position to start searching from, coerced to a valid index within the buffer.
     * - `encoding`: The encoding to use if `value` is a string.
     *
     * ## Output:
     * - Returns an object containing:
     *   - `preparedOffset`: The adjusted index from which to begin the search.
     *   - `preparedValue`: The encoded or converted search value in the form of a `Uint8Array`.
     *
     * ## Example:
     * ```ts
     * const buffer = Buffer.from('hello world');
     * const { preparedOffset, preparedValue } = buffer.prepareIndexOfParameters('world', 0, 'utf-8');
     * console.log(preparedOffset); // Output: 0
     * console.log(preparedValue); // Output: Uint8Array with values for 'world'
     * ```
     *
     * ## Error Handling:
     * - Throws a `TypeError` if `value` is not a `string`, `number`, or `Uint8Array`.
     *
     * @param value - The value to search for, which can be a string, number, or `Uint8Array`.
     * @param preparedOffset - The index to start the search from.
     * @param encoding - The encoding to use if `value` is a string (defaults to `'utf-8'`).
     * @returns An object containing `preparedOffset` (the adjusted starting index) and `preparedValue` (the encoded search value).
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
            // Handle number case
            preparedValue = new Uint8Array([ value & 0xFF ]);
        } else if (typeof value === 'string') {
            // Handle string case with encoding
            preparedValue = Buffer.encoding(value, encoding);
        } else if (value instanceof Uint8Array) {
            preparedValue = value;
        } else {
            // Throw an error for unsupported types
            throw new TypeError('Value must be a string, number, or Uint8Array');
        }

        return { preparedOffset, preparedValue };
    }
}
