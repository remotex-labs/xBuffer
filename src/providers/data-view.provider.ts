/**
 * The `DataViewProvider` class extends `Uint8Array` and provides low-level access to its underlying buffer
 * using a `DataView` for efficient manipulation of raw binary data. It allows byte-level operations on the
 * underlying array buffer while exposing the array-like behavior of a `Uint8Array`.
 *
 * - **Input**:
 *   - `arg`: The input data to initialize the `DataViewProvider`. It can be one of the following:
 *     - `number`: The length of the array to be created.
 *     - `ArrayLike<number>`: An array-like structure (e.g., an array or `TypedArray`) containing the initial data.
 *     - `ArrayBufferLike`: An object representing an array buffer or `ArrayBuffer` from which data will be copied.
 *   - `byteOffset` (optional): A byte offset to start reading from within the `ArrayBuffer`.
 *   - `length` (optional): The number of bytes to read from the `ArrayBuffer` starting from the given `byteOffset`.
 *
 * - **Output**:
 *   - A `DataViewProvider` instance that extends `Uint8Array` and provides direct access to the underlying
 *     `ArrayBuffer` through a `DataView` for byte-level operations.
 *
 * ## Example:
 *
 * ```ts
 * const arrayBuffer = new ArrayBuffer(16);
 * const viewProvider = new DataViewProvider(arrayBuffer);
 * console.log(viewProvider instanceof Uint8Array); // true
 * console.log(viewProvider instanceof DataViewProvider); // true
 * console.log(viewProvider.dataView); // DataView for accessing the underlying ArrayBuffer
 * ```
 *
 * ## Error Handling:
 * - The constructor throws a `RangeError` if the `byteOffset` or `length` exceeds the bounds of the `ArrayBuffer`.
 *
 * @param arg - The input data to initialize the `DataViewProvider`, either a length, array-like structure, or `ArrayBufferLike`.
 * @param byteOffset - (Optional) The byte offset within the `ArrayBuffer` to begin reading from.
 * @param length - (Optional) The number of bytes to use from the `ArrayBuffer`.
 * @throws {RangeError} Throws an error if the byteOffset or length exceeds the buffer size.
 */

export class DataViewProvider extends Uint8Array {
    /**
     * A private `DataView` property providing low-level access to the underlying buffer of the `Uint8Array`.
     */

    protected readonly dataView: DataView;

    /**
     * The private constructor for a custom class extending `Uint8Array`.
     * This constructor initializes an instance based on the input type (length, array-like structure, or buffer),
     * and also creates an associated `DataView` for working with the underlying buffer.
     *
     * @param arg - The length of the array, an array-like structure, or an `ArrayBufferLike` object.
     * @param byteOffset - The byte offset within the `ArrayBuffer` to begin using (optional).
     * @param length - The number of bytes to use from the `ArrayBuffer` (optional).
     * @throws {RangeError} Throws an error if the offset or length exceeds the buffer size.
     */

    constructor(arg: number | ArrayLike<number> | ArrayBufferLike, byteOffset?: number, length?: number) {
        super(<any> arg, byteOffset, length);
        this.dataView = new DataView(this.buffer);
    }

    /**
     * Reads an unsigned 8-bit integer (byte) from the buffer at the given offset.
     *
     * @param offset - The byte offset from which to read (default is 0).
     * @returns The 8-bit unsigned integer value.
     */

    readUInt8(offset: number = 0): number {
        return this.dataView.getUint8(offset);
    }

    // alias
    readUint8(offset: number = 0): number {
        return this.readUInt8(offset);
    }

    /**
     * Reads an unsigned 16-bit integer (2-bytes) in little-endian byte order from the buffer at the given offset.
     *
     * @param offset - The byte offset from which to read (default is 0).
     * @returns The 16-bit unsigned integer value in little-endian byte order.
     */

    readUInt16LE(offset: number = 0): number {
        return this.dataView.getUint16(offset, true);
    }

    // alias
    readUint16LE(offset: number = 0): number {
        return this.readUInt16LE(offset);
    }

    /**
     * Reads an unsigned 16-bit integer (2-bytes) in big-endian byte order from the buffer at the given offset.
     *
     * @param offset - The byte offset from which to read (default is 0).
     * @returns The 16-bit unsigned integer value in big-endian byte order.
     */

    readUInt16BE(offset: number = 0): number {
        return this.dataView.getUint16(offset, false);
    }

    // alias
    readUint16BE(offset: number = 0): number {
        return this.readUInt16BE(offset);
    }

    /**
     * Reads an unsigned 32-bit integer (4-bytes) in little-endian byte order from the buffer at the given offset.
     *
     * @param offset - The byte offset from which to read (default is 0).
     * @returns The 32-bit unsigned integer value in little-endian byte order.
     */

    readUInt32LE(offset: number = 0): number {
        return this.dataView.getUint32(offset, true);
    }

    // alias
    readUint32LE(offset: number = 0): number {
        return this.readUInt32LE(offset);
    }

    /**
     * Reads an unsigned 32-bit integer (4-bytes) in big-endian byte order from the buffer at the given offset.
     *
     * @param offset - The byte offset from which to read (default is 0).
     * @returns The 32-bit unsigned integer value in big-endian byte order.
     */

    readUInt32BE(offset: number = 0): number {
        return this.dataView.getUint32(offset, false);
    }

    // alias
    readUint32BE(offset: number = 0): number {
        return this.readUInt32BE(offset);
    }

    /**
     * Reads a 64-bit unsigned integer (8-bytes) in little-endian byte order from the buffer at the given offset.
     *
     * @param offset - The byte offset from which to read (default is 0).
     * @returns The 64-bit unsigned integer value in little-endian byte order.
     */

    readBigUInt64LE(offset: number = 0): bigint {
        return this.dataView.getBigUint64(offset, true);
    }

    // alias
    readBigUint64LE(offset: number = 0): bigint {
        return this.readBigUInt64LE(offset);
    }

    /**
     * Reads a 64-bit unsigned integer (-bytes) in big-endian byte order from the buffer at the given offset.
     *
     * @param offset - The byte offset from which to read (default is 0).
     * @returns The 64-bit unsigned integer value in big-endian byte order.
     */

    readBigUInt64BE(offset: number = 0): bigint {
        return this.dataView.getBigUint64(offset, false);
    }

    // alias
    readBigUint64BE(offset: number = 0): bigint {
        return this.readBigUInt64BE(offset);
    }

    /**
     * Reads a signed 8-bit integer (byte) from the buffer at the given offset.
     *
     * @param offset - The byte offset from which to read (default is 0).
     * @returns The 8-bit signed integer value.
     */

    readInt8(offset: number = 0): number {
        return this.dataView.getInt8(offset);
    }

    /**
     * Reads a signed 16-bit integer (2-bytes) in little-endian byte order from the buffer at the given offset.
     *
     * @param offset - The byte offset from which to read (default is 0).
     * @returns The 16-bit signed integer value in little-endian byte order.
     */

    readInt16LE(offset: number = 0): number {
        return this.dataView.getInt16(offset, true);
    }

    /**
     * Reads a signed 16-bit integer (2-bytes) in big-endian byte order from the buffer at the given offset.
     *
     * @param offset - The byte offset from which to read (default is 0).
     * @returns The 16-bit signed integer value in big-endian byte order.
     */

    readInt16BE(offset: number = 0): number {
        return this.dataView.getInt16(offset, false);
    }

    /**
     * Reads a signed 32-bit integer (4-bytes) in little-endian byte order from the buffer at the given offset.
     *
     * @param offset - The byte offset from which to read (default is 0).
     * @returns The 32-bit signed integer value in little-endian byte order.
     */

    readInt32LE(offset: number = 0): number {
        return this.dataView.getInt32(offset, true);
    }

    /**
     * Reads a signed 32-bit integer (4-bytes) in big-endian byte order from the buffer at the given offset.
     *
     * @param offset - The byte offset from which to read (default is 0).
     * @returns The 32-bit signed integer value in big-endian byte order.
     */

    readInt32BE(offset: number = 0): number {
        return this.dataView.getInt32(offset, false);
    }

    /**
     * Reads a signed 64-bit integer (8-bytes) in little-endian byte order from the buffer at the given offset.
     *
     * @param offset - The byte offset from which to read (default is 0).
     * @returns The 64-bit signed integer value in little-endian byte order.
     */

    readBigInt64LE(offset: number = 0): bigint {
        return this.dataView.getBigInt64(offset, true);
    }

    /**
     * Reads a signed 64-bit integer (8-bytes) in big-endian byte order from the buffer at the given offset.
     *
     * @param offset - The byte offset from which to read (default is 0).
     * @returns The 64-bit signed integer value in big-endian byte order.
     */

    readBigInt64BE(offset: number = 0): bigint {
        return this.dataView.getBigInt64(offset, false);
    }

    /**
     * Reads a 32-bit floating-point number (4-bytes) in little-endian byte order from the buffer at the given offset.
     *
     * @param offset - The byte offset from which to read (default is 0).
     * @returns The 32-bit floating-point number in little-endian byte order.
     */

    readFloatLE(offset: number = 0): number {
        return this.dataView.getFloat32(offset, true);
    }

    /**
     * Reads a 32-bit floating-point number (4-bytes) in big-endian byte order from the buffer at the given offset.
     *
     * @param offset - The byte offset from which to read (default is 0).
     * @returns The 32-bit floating-point number in big-endian byte order.
     */

    readFloatBE(offset: number = 0): number {
        return this.dataView.getFloat32(offset, false);
    }

    /**
     * Reads a 64-bit floating-point number (8-bytes) in little-endian byte order from the buffer at the given offset.
     *
     * @param offset - The byte offset from which to read (default is 0).
     * @returns The 64-bit floating-point number in little-endian byte order.
     */

    readDoubleLE(offset: number = 0): number {
        return this.dataView.getFloat64(offset, true);
    }

    /**
     * Reads a 64-bit floating-point number (8-bytes) in big-endian byte order from the buffer at the given offset.
     *
     * @param offset - The byte offset from which to read (default is 0).
     * @returns The 64-bit floating-point number in big-endian byte order.
     */

    readDoubleBE(offset: number = 0): number {
        return this.dataView.getFloat64(offset, false);
    }

    /**
     * Writes an unsigned 8-bit integer (byte) to the buffer at the given offset.
     *
     * @param value - The 8-bit unsigned integer to write.
     * @param offset - The byte offset at which to write (default is 0).
     * @returns The number of bytes written (1).
     *
     * @throws {TypeError} If the `value` is not a string or number, or if a string cannot be parsed as a valid number.
     * @throws {RangeError} If the `value` is out of range for an unsigned 8-bit integer (0–255).
     * @throws {RangeError} If the `offset` is negative or exceeds the bounds of the buffer.
     */

    writeUInt8(value: number | string, offset: number = 0): number {
        const num = DataViewProvider.ParseAndValidateInRange(value, 1, false);
        this.dataView.setUint8(offset, num);

        return offset + 1;
    }

    // alias
    writeUint8(value: number | string, offset: number = 0): number {
        return this.writeUInt8(value, offset);
    }

    /**
     * Writes an unsigned 16-bit integer (2-bytes) in little-endian byte order to the buffer at the given offset.
     *
     * @param value - The 16-bit unsigned integer to write.
     * @param offset - The byte offset at which to write (default is 0).
     * @returns The number of bytes written (2).
     *
     * @throws {TypeError} If the `value` is not a string or number, or if a string cannot be parsed as a valid number.
     * @throws {RangeError} If the `value` is out of range for an unsigned 16-bit integer.
     * @throws {RangeError} If the `offset` is negative or exceeds the bounds of the buffer.
     */

    writeUInt16LE(value: number | string, offset: number = 0): number {
        const num = DataViewProvider.ParseAndValidateInRange(value, 2, false);
        this.dataView.setUint16(offset, num, true);

        return offset + 2;
    }

    // alias
    writeUint16LE(value: number | string, offset: number = 0): number {
        return this.writeUInt16LE(value, offset);
    }

    /**
     * Writes an unsigned 16-bit integer (2-bytes) in big-endian byte order to the buffer at the given offset.
     *
     * @param value - The 16-bit unsigned integer to write.
     * @param offset - The byte offset at which to write (default is 0).
     * @returns The number of bytes written (2).
     *
     *
     * @throws {TypeError} If the `value` is not a string or number, or if a string cannot be parsed as a valid number.
     * @throws {RangeError} If the `value` is out of range for an unsigned 16-bit integer.
     * @throws {RangeError} If the `offset` is negative or exceeds the bounds of the buffer.
     */

    writeUInt16BE(value: number | string, offset: number = 0): number {
        const num = DataViewProvider.ParseAndValidateInRange(value, 2, false);
        this.dataView.setUint16(offset, num, false);

        return offset + 2;
    }

    // alias
    writeUint16BE(value: number | string, offset: number = 0): number {
        return this.writeUInt16BE(value, offset);
    }

    /**
     * Writes an unsigned 32-bit integer (4-bytes) in little-endian byte order to the buffer at the given offset.
     *
     * @param value - The 32-bit unsigned integer to write.
     * @param offset - The byte offset at which to write (default is 0).
     * @returns The number of bytes written (4).
     *
     * @throws {TypeError} If the `value` is not a string or number, or if a string cannot be parsed as a valid number.
     * @throws {RangeError} If the `value` is out of range for an unsigned 32-bit integer.
     * @throws {RangeError} If the `offset` is negative or exceeds the bounds of the buffer.
     */

    writeUInt32LE(value: number | string, offset: number = 0): number {
        const num = DataViewProvider.ParseAndValidateInRange(value, 4, false);
        this.dataView.setUint32(offset, num, true);

        return offset + 4;
    }

    // alias
    writeUint32LE(value: number | string, offset: number = 0): number {
        return this.writeUInt32LE(value, offset);
    }

    /**
     * Writes an unsigned 32-bit integer (4-bytes) in big-endian byte order to the buffer at the given offset.
     *
     * @param value - The 32-bit unsigned integer to write.
     * @param offset - The byte offset at which to write (default is 0).
     * @returns The number of bytes written (4).
     *
     * @throws {TypeError} If the `value` is not a string or number, or if a string cannot be parsed as a valid number.
     * @throws {RangeError} If the `value` is out of range for an unsigned 32-bit integer.
     * @throws {RangeError} If the `offset` is negative or exceeds the bounds of the buffer.
     */

    writeUInt32BE(value: number | string, offset: number = 0): number {
        const num = DataViewProvider.ParseAndValidateInRange(value, 4, false);
        this.dataView.setUint32(offset, num, false);

        return offset + 4;
    }

    // alias
    writeUint32BE(value: number | string, offset: number = 0): number {
        return this.writeUInt32BE(value, offset);
    }

    /**
     * Writes a 64-bit unsigned integer (8-bytes) in little-endian byte order to the buffer at the given offset.
     *
     * @param value - The 64-bit unsigned integer to write.
     * @param offset - The byte offset at which to write (default is 0).
     * @returns The number of bytes written (8).
     *
     * @throws {TypeError} If the `value` is not a string or bigint, or if a string cannot be parsed as a valid bigint.
     * @throws {RangeError} If the `value` is out of range for an unsigned 64-bit integer.
     * @throws {RangeError} If the `offset` is negative or exceeds the bounds of the buffer.
     */

    writeBigUInt64LE(value: bigint | string, offset: number = 0): number {
        const num = DataViewProvider.ParseAndValidateInRange(value, 8, false, true);
        this.dataView.setBigUint64(offset, num, true);

        return offset + 8;
    }

    // alias
    writeBigUint64LE(value: bigint | string, offset: number = 0): number {
        return this.writeBigUInt64LE(value, offset);
    }

    /**
     * Writes a 64-bit unsigned integer (8-bytes) in big-endian byte order to the buffer at the given offset.
     *
     * @param value - The 64-bit unsigned integer to write.
     * @param offset - The byte offset at which to write (default is 0).
     * @returns The number of bytes written (8).
     *
     * @throws {TypeError} If the `value` is not a string or bigint, or if a string cannot be parsed as a valid bigint.
     * @throws {RangeError} If the `value` is out of range for an unsigned 64-bit integer.
     * @throws {RangeError} If the `offset` is negative or exceeds the bounds of the buffer.
     */

    writeBigUInt64BE(value: bigint | string, offset: number = 0): number {
        const num = DataViewProvider.ParseAndValidateInRange(value, 8, false, true);
        this.dataView.setBigUint64(offset, num, false);

        return offset + 8;
    }

    // alias
    writeBigUint64BE(value: bigint | string, offset: number = 0): number {
        return this.writeBigUInt64BE(value, offset);
    }

    /**
     * Writes a signed 8-bit integer (byte) to the buffer at the given offset.
     *
     * @param value - The 8-bit signed integer to write.
     * @param offset - The byte offset at which to write (default is 0).
     * @returns The number of bytes written (1).
     *
     * @throws {TypeError} If the `value` is not a string or number, or if a string cannot be parsed as a valid number.
     * @throws {RangeError} If the `value` is out of range for signed 8-bit integer.
     * @throws {RangeError} If the `offset` is negative or exceeds the bounds of the buffer.
     */

    writeInt8(value: number | string, offset: number = 0): number {
        const num = DataViewProvider.ParseAndValidateInRange(value, 1, true);
        this.dataView.setInt8(offset, num);

        return offset + 1;
    }

    /**
     * Writes a signed 16-bit integer (2-bytes) in little-endian byte order to the buffer at the given offset.
     *
     * @param value - The 16-bit signed integer to write.
     * @param offset - The byte offset at which to write (default is 0).
     * @returns The number of bytes written (2).
     *
     * @throws {TypeError} If the `value` is not a string or number, or if a string cannot be parsed as a valid number.
     * @throws {RangeError} If the `value` is out of range for signed 16-bit integer.
     * @throws {RangeError} If the `offset` is negative or exceeds the bounds of the buffer.
     */

    writeInt16LE(value: number | string, offset: number = 0): number {
        const num = DataViewProvider.ParseAndValidateInRange(value, 2, true);
        this.dataView.setInt16(offset, num, true);

        return offset + 2;
    }

    /**
     * Writes a signed 16-bit integer (2-bytes) in big-endian byte order to the buffer at the given offset.
     *
     * @param value - The 16-bit signed integer to write.
     * @param offset - The byte offset at which to write (default is 0).
     * @returns The number of bytes written (2).
     *
     * @throws {TypeError} If the `value` is not a string or number, or if a string cannot be parsed as a valid number.
     * @throws {RangeError} If the `value` is out of range for signed 16-bit integer.
     * @throws {RangeError} If the `offset` is negative or exceeds the bounds of the buffer.
     */

    writeInt16BE(value: number | string, offset: number = 0): number {
        const num = DataViewProvider.ParseAndValidateInRange(value, 2, true);
        this.dataView.setInt16(offset, num, false);

        return offset + 2;
    }

    /**
     * Writes a signed 32-bit integer (4-bytes) in little-endian byte order to the buffer at the given offset.
     *
     * @param value - The 32-bit signed integer to write.
     * @param offset - The byte offset at which to write (default is 0).
     * @returns The number of bytes written (4).
     *
     * @throws {TypeError} If the `value` is not a string or number, or if a string cannot be parsed as a valid number.
     * @throws {RangeError} If the `value` is out of range for signed 32-bit integer.
     * @throws {RangeError} If the `offset` is negative or exceeds the bounds of the buffer.
     */

    writeInt32LE(value: number | string, offset: number = 0): number {
        const num = DataViewProvider.ParseAndValidateInRange(value, 4, true);
        this.dataView.setInt32(offset, num, true);

        return offset + 4;
    }

    /**
     * Writes a signed 32-bit integer (4-bytes) in big-endian byte order to the buffer at the given offset.
     *
     * @param value - The 32-bit signed integer to write.
     * @param offset - The byte offset at which to write (default is 0).
     * @returns The number of bytes written (4).
     *
     * @throws {TypeError} If the `value` is not a string or number, or if a string cannot be parsed as a valid number.
     * @throws {RangeError} If the `value` is out of range for signed 32-bit integer.
     * @throws {RangeError} If the `offset` is negative or exceeds the bounds of the buffer.
     */

    writeInt32BE(value: number | string, offset: number = 0): number {
        const num = DataViewProvider.ParseAndValidateInRange(value, 4, true);
        this.dataView.setInt32(offset, num, false);

        return offset + 4;
    }

    /**
     * Writes a signed 64-bit integer (8-bytes) in little-endian byte order to the buffer at the given offset.
     *
     * @param value - The 64-bit signed integer to write.
     * @param offset - The byte offset at which to write (default is 0).
     * @returns The number of bytes written (8).
     *
     * @throws {TypeError} If the `value` is not a string or bigint, or if a string cannot be parsed as a valid bigint.
     * @throws {RangeError} If the `value` is out of range for signed 64-bit integer.
     * @throws {RangeError} If the `offset` is negative or exceeds the bounds of the buffer.
     */

    writeBigInt64LE(value: bigint | string, offset: number = 0): number {
        const num = DataViewProvider.ParseAndValidateInRange(value, 8, true, true);
        this.dataView.setBigInt64(offset, num, true);

        return offset + 8;
    }

    /**
     * Writes a signed 64-bit integer (8-bytes) in big-endian byte order to the buffer at the given offset.
     *
     * @param value - The 64-bit signed integer to write.
     * @param offset - The byte offset at which to write (default is 0).
     * @returns The number of bytes written (8).
     *
     * @throws {TypeError} If the `value` is not a string or bigint, or if a string cannot be parsed as a valid bigint.
     * @throws {RangeError} If the `value` is out of range for signed 64-bit integer.
     * @throws {RangeError} If the `offset` is negative or exceeds the bounds of the buffer.
     */

    writeBigInt64BE(value: bigint | string, offset: number = 0): number {
        const num = DataViewProvider.ParseAndValidateInRange(value, 8, true, true);
        this.dataView.setBigInt64(offset, num, false);

        return offset + 8;
    }

    /**
     * Writes a 32-bit floating-point number (4-bytes) in little-endian byte order to the buffer at the given offset.
     *
     * @param value - The 32-bit floating-point number to write.
     * @param offset - The byte offset at which to write (default is 0).
     * @returns The number of bytes written (4).
     */

    writeFloatLE(value: number | string, offset: number = 0): number {
        this.dataView.setFloat32(offset, parseFloat(<string> value), true);

        return offset + 4;
    }

    /**
     * Writes a 32-bit floating-point number (4-bytes) in big-endian byte order to the buffer at the given offset.
     *
     * @param value - The 32-bit floating-point number to write.
     * @param offset - The byte offset at which to write (default is 0).
     * @returns The number of bytes written (4).
     */

    writeFloatBE(value: number | string, offset: number = 0): number {
        this.dataView.setFloat32(offset, parseFloat(<string> value), false);

        return offset + 4;
    }

    /**
     * Writes a 64-bit floating-point number (8-bytes) in little-endian byte order to the buffer at the given offset.
     *
     * @param value - The 64-bit floating-point number to write.
     * @param offset - The byte offset at which to write (default is 0).
     * @returns The number of bytes written (8).
     */

    writeDoubleLE(value: number | string, offset: number = 0): number {
        this.dataView.setFloat64(offset, parseFloat(<string> value), true);

        return offset + 8;
    }

    /**
     * Writes a 64-bit floating-point number (8-bytes) in big-endian byte order to the buffer at the given offset.
     *
     * @param value - The 64-bit floating-point number to write.
     * @param offset - The byte offset at which to write (default is 0).
     * @returns The number of bytes written (8).
     */

    writeDoubleBE(value: number | string, offset: number = 0): number {
        this.dataView.setFloat64(offset, parseFloat(<string> value), false);

        return offset + 8;
    }

    /**
     * Reads an unsigned integer in little-endian byte order from the buffer.
     *
     * @param offset - The starting byte offset within the buffer.
     * @param byteLength - The number of bytes to read (byte to 6-bytes).
     * @returns The unsigned integer read from the buffer.
     *
     * @throws RangeError - If `byteLength` is outside the valid range (byte to 6-bytes)
     *                      to safely return a number.
     * @throws RangeError - If `offset` or `offset + byteLength` exceeds the buffer's boundaries.
     */

    readUIntLE(offset: number, byteLength: number): number {
        DataViewProvider.validateSafeByteLength(byteLength);
        DataViewProvider.validateByteLength(offset, byteLength, this.length);

        let result = 0;
        let multiplier = 1;
        for (let i = 0; i < byteLength; i++) {
            result += this.dataView.getUint8(offset + i) * multiplier;
            multiplier *= 256; // Equivalent to shifting left by 8 bits
        }

        return result;
    }

    // alias
    readUintLE(offset: number, byteLength: number): number {
        return this.readUIntLE(offset, byteLength);
    }

    /**
     * Reads an unsigned integer in big-endian byte order from the buffer.
     *
     * @param offset - The starting byte offset within the buffer.
     * @param byteLength - The number of bytes to read (byte to 6-bytes).
     * @returns The unsigned integer read from the buffer.
     * @throws RangeError - If `byteLength` is outside the valid range (byte to 6-bytes)
     *                      to safely return a number.
     * @throws RangeError - If `offset` or `offset + byteLength` exceeds the buffer's boundaries.
     */

    readUIntBE(offset: number, byteLength: number): number {
        DataViewProvider.validateSafeByteLength(byteLength);
        DataViewProvider.validateByteLength(offset, byteLength, this.length);

        let result = 0;
        for (let i = 0; i < byteLength; i++) {
            result = (result * 256) + this.dataView.getUint8(offset + i);
        }

        return result;
    }

    // alias
    readUintBE(offset: number, byteLength: number): number {
        return this.readUIntBE(offset, byteLength);
    }

    /**
     * Reads a signed integer in little-endian byte order from the buffer.
     *
     * @param offset The starting byte offset within the buffer.
     * @param byteLength The number of bytes to read (byte to 6-bytes).
     * @returns The signed integer read from the buffer.
     * @throws RangeError - If `byteLength` is outside the valid range (byte to 6-bytes)
     *                      to safely return a number.
     * @throws RangeError - If `offset` or `offset + byteLength` exceeds the buffer's boundaries.
     */

    readIntLE(offset: number, byteLength: number): number {
        DataViewProvider.validateSafeByteLength(byteLength);
        DataViewProvider.validateByteLength(offset, byteLength, this.length);

        let result = 0;
        let multiplier = 1;
        for (let i = 0; i < byteLength; i++) {
            result += this.dataView.getUint8(offset + i) * multiplier;
            multiplier *= 256; // Equivalent to shifting left by 8 bits
        }

        const isSignBitSet = result & (1 << (byteLength * 8 - 1));
        if (isSignBitSet) {
            const mask = (1 << (byteLength * 8)) - 1;
            result = -((result ^ mask) + 1); // Two's complement conversion for negative values
        }

        return result;
    }

    /**
     * Reads a signed integer in big-endian byte order from the buffer.
     *
     * @param offset The starting byte offset within the buffer.
     * @param byteLength The number of bytes to read (byte to 6-bytes).
     * @returns The signed integer read from the buffer.
     * @throws RangeError - If `byteLength` is outside the valid range (byte to 6-bytes)
     *                      to safely return a number.
     * @throws RangeError - If `offset` or `offset + byteLength` exceeds the buffer's boundaries.
     */

    readIntBE(offset: number, byteLength: number): number {
        DataViewProvider.validateSafeByteLength(byteLength);
        DataViewProvider.validateByteLength(offset, byteLength, this.length);

        let result = 0;
        for (let i = 0; i < byteLength; i++) {
            result = (result * 256) + this.dataView.getUint8(offset + i);
        }

        const isSignBitSet = result & (1 << ((byteLength * 8) - 1));
        if (isSignBitSet) {
            const mask = (1 << (byteLength * 8)) - 1;
            result = -((result ^ mask) + 1); // Two's complement conversion for negative values
        }

        return result;
    }

    /**
     * Writes an unsigned integer in little-endian byte order to the buffer.
     *
     * @param value The unsigned integer value to write.
     * @param offset The starting byte offset where the value should be written.
     * @param byteLength The number of bytes to write (byte to n bytes).
     * @returns The new byte offset after writing.
     * @throws RangeError - If `byteLength` is outside the valid range (byte to 6-bytes)
     *                      to safely return a number.
     * @throws RangeError - If `offset` or `offset + byteLength` exceeds the buffer's boundaries.
     * @throws RangeError - If the `value` is out of range for the specified `byteLength`
     */

    writeUIntLE(value: number | string, offset: number, byteLength: number): number {
        DataViewProvider.validateSafeByteLength(byteLength);
        DataViewProvider.validateByteLength(offset, byteLength, this.length);
        let data = DataViewProvider.ParseAndValidateInRange(value, byteLength, false);

        // Write the value in little-endian order
        for (let i = 0; i < byteLength; i++) {
            this.dataView.setUint8(offset + i, data & 0xFF);
            data /= 256;
        }

        return offset + byteLength;
    }

    // alias
    writeUintLE(value: number | string, offset: number, byteLength: number): number {
        return this.writeUIntLE(value, offset, byteLength);
    }

    /**
     * Writes an unsigned integer in big-endian byte order to the buffer.
     *
     * @param value The unsigned integer value to write.
     * @param offset The starting byte offset where the value should be written.
     * @param byteLength The number of bytes to write (1 to n bytes).
     * @returns The new byte offset after writing.
     * @throws RangeError - If `byteLength` is outside the valid range (byte to 6-bytes)
     *                      to safely return a number.
     * @throws RangeError - If `offset` or `offset + byteLength` exceeds the buffer's boundaries.
     */

    writeUIntBE(value: number | string, offset: number, byteLength: number): number {
        DataViewProvider.validateSafeByteLength(byteLength);
        DataViewProvider.validateByteLength(offset, byteLength, this.length);
        let data = DataViewProvider.ParseAndValidateInRange(value, byteLength, false);

        for (let i = byteLength - 1; i >= 0; i--) {
            this.dataView.setUint8(offset + i, data & 0xFF);
            data /= 256; // equivalent to value >>= 8
        }

        return offset + byteLength;
    }

    // alias
    writeUintBE(value: number | string, offset: number, byteLength: number): number {
        return this.writeUIntBE(value, offset, byteLength);
    }

    /**
     * Writes a signed integer in little-endian byte order to the buffer.
     *
     * @param value The signed integer value to write.
     * @param offset The starting byte offset where the value should be written.
     * @param byteLength The number of bytes to write (byte to n bytes).
     * @returns The new byte offset after writing.
     * @throws RangeError - If `byteLength` is outside the valid range (byte to 6-bytes)
     *                      to safely return a number.
     * @throws RangeError - If `offset` or `offset + byteLength` exceeds the buffer's boundaries.
     * @throws RangeError - If the `value` is out of range for the specified `byteLength`
     */

    writeIntLE(value: number | string, offset: number, byteLength: number): number {
        DataViewProvider.validateSafeByteLength(byteLength);
        DataViewProvider.validateByteLength(offset, byteLength, this.length);
        let data = DataViewProvider.ParseAndValidateInRange(value, byteLength, false);

        for (let i = 0; i < byteLength; i++) {
            this.dataView.setUint8(offset + i, data & 0xFF);
            data /= 256;
        }

        return offset + byteLength;
    }

    /**
     * Writes a signed integer in big-endian byte order to the buffer.
     *
     * @param value The signed integer value to write.
     * @param offset The starting byte offset where the value should be written.
     * @param byteLength The number of bytes to write (1 to n bytes).
     * @returns The new byte offset after writing.
     * @throws RangeError - If `byteLength` is outside the valid range (byte to 6-bytes)
     *                      to safely return a number.
     * @throws RangeError - If `offset` or `offset + byteLength` exceeds the buffer's boundaries.
     */

    writeIntBE(value: number | string, offset: number, byteLength: number): number {
        DataViewProvider.validateSafeByteLength(byteLength);
        DataViewProvider.validateByteLength(offset, byteLength, this.length);
        let data = DataViewProvider.ParseAndValidateInRange(value, byteLength, false);

        for (let i = byteLength - 1; i >= 0; i--) {
            this.dataView.setInt8(offset + i, data & 0xFF);
            data /= 256;
        }

        return offset + byteLength;
    }

    /**
     * Swaps the byte order (endianness) of every 16-bit element (2 bytes) in the `Buffer`.
     * This method modifies the buffer in place
     * and is useful for converting data between little-endian and big-endian formats.
     *
     * ## Description:
     * The `swap16` method swaps the byte order of each 16-bit (2-byte) segment in the `Buffer`.
     * If the buffer length is not divisible by 2, a `RangeError` is thrown.
     * This operation is commonly used
     * when dealing with binary data from different systems with varying endianness conventions.
     *
     * - **Input**:
     *   - No input parameters are required.
     *
     * - **Output**: The method modifies the buffer in place, swapping the byte order for each 16-bit element.
     *
     * ## Example:
     *
     * ```ts
     * const buffer = Buffer.from([0x01, 0x02, 0x03, 0x04]);
     * buffer.swap16();
     * console.log(buffer); // The buffer will now contain [0x02, 0x01, 0x04, 0x03]
     * ```
     *
     * ## Error Handling:
     * - Throws a `RangeError` if the buffer length is not divisible by 2, as swapping 16-bit values requires an even number of bytes.
     *
     * @instance
     * @returns `void` (modifies the buffer in place).
     * @throws RangeError if the buffer length is not divisible by 2.
     */

    swap16(): void {
        const length = this.length;
        if (length % 2 !== 0) {
            throw new RangeError('Buffer length must be divisible by 2 for swap16');
        }

        for (let i = 0; i < length; i += 2) {
            const first = this.dataView.getUint8(i);
            this.dataView.setUint8(i, this.dataView.getUint8(i + 1));
            this.dataView.setUint8(i + 1, first);
        }
    }

    /**
     * Swaps the byte order (endianness) of every 32-bit element (4 bytes) in the `Buffer`.
     * This method modifies the buffer in place
     * and is useful for converting data between little-endian and big-endian formats.
     *
     * ## Description:
     * The `swap32` method swaps the byte order of each 32-bit (4-byte) segment in the `Buffer`.
     * If the buffer length is not divisible by 4, a `RangeError` is thrown.
     * This operation is typically used when working with binary data from systems with different endianness conventions.
     *
     * - **Input**:
     *   - No input parameters are required.
     *
     * - **Output**: The method modifies the buffer in place, swapping the byte order for each 32-bit element.
     *
     * ## Example:
     *
     * ```ts
     * const buffer = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]);
     * buffer.swap32();
     * console.log(buffer); // The buffer will now contain [0x04, 0x03, 0x02, 0x01, 0x08, 0x07, 0x06, 0x05]
     * ```
     *
     * ## Error Handling:
     * - Throws a `RangeError`
     * if the buffer length is not divisible by 4,
     * as swapping 32-bit values requires an even number of 4-byte elements.
     *
     * @instance
     * @returns `void` (modifies the buffer in place).
     * @throws RangeError if the buffer length is not divisible by 4.
     */

    swap32(): void {
        const length = this.length;
        if (length % 4 !== 0) {
            throw new RangeError('Buffer length must be divisible by 4 for swap32');
        }

        for (let i = 0; i < length; i += 4) {
            const first = this.dataView.getUint16(i);
            this.dataView.setUint16(i, this.dataView.getUint16(i + 2), true);
            this.dataView.setUint16(i + 2, first, true);
        }
    }

    /**
     * Swaps the byte order (endianness) of every 64-bit element (8 bytes) in the `Buffer`.
     * This method modifies the buffer in place and is useful for converting data between little-endian and big-endian formats.
     *
     * ## Description:
     * The `swap64` method swaps the byte order of each 64-bit (8-byte) segment in the `Buffer`.
     * If the buffer length is not divisible by 8, a `RangeError` is thrown.
     * This operation is typically used when working with binary data from systems with different endianness conventions.
     *
     * - **Input**:
     *   - No input parameters are required.
     *
     * - **Output**: The method modifies the buffer in place, swapping the byte order for each 64-bit element.
     *
     * ## Example:
     *
     * ```ts
     * const buffer = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10]);
     * buffer.swap64();
     * console.log(buffer); // The buffer will now contain [0x08, 0x07, 0x06, 0x05, 0x04, 0x03, 0x02, 0x01, 0x10, 0x0f, 0x0e, 0x0d, 0x0c, 0x0b, 0x0a, 0x09]
     * ```
     *
     * ## Error Handling:
     * - Throws a `RangeError` if the buffer length is not divisible by 8, as swapping 64-bit values requires an even number of 8-byte elements.
     *
     * @instance
     * @returns `void` (modifies the buffer in place).
     * @throws RangeError if the buffer length is not divisible by 8.
     */

    swap64(): void {
        const length = this.length;
        if (length % 8 !== 0) {
            throw new RangeError('Buffer length must be divisible by 8 for swap64');
        }

        for (let i = 0; i < length; i += 8) {
            const temp = this.dataView.getUint32(i);
            this.dataView.setUint32(i, this.dataView.getUint32(i + 4), true);
            this.dataView.setUint32(i + 4, temp, true);
        }
    }

    /**
     * Helper function to validate the byte length for reading and writing data from/to a buffer.
     *
     * @param offset The starting byte offset within the buffer.
     * @param byteLength The number of bytes to read or write.
     * @param maxLength The maximum length of the buffer.
     * @throws RangeError - If `byteLength` is outside the valid range (byte to 6-bytes)
     *                      to safely return a number.
     * @throws RangeError - If `offset` or `offset + byteLength` exceeds the buffer's boundaries.
     */

    private static validateByteLength(offset: number, byteLength: number, maxLength: number) {
        const maxByteLength = maxLength - offset;
        if (byteLength <= 0 || byteLength > maxByteLength) {
            throw new RangeError(`byteLength must be between 1 and ${ maxByteLength }`);
        }
    }

    /**
     * Validates that the byte length is within a safe range for JavaScript's number type.
     *
     * @param byteLength - The number of bytes to read (byte to 6-bytes).
     * @throws RangeError - If the byteLength is outside the valid range.
     */

    private static validateSafeByteLength(byteLength: number): void {
        if (byteLength < 1 || byteLength > 6) {
            throw new RangeError(`The value of "byteLength" is out of range. It must be >= 1 and <= 6. Received ${ byteLength }`);
        }
    }

    /**
     * Validates whether a given numeric value (either `number` or `BigInt`) falls within the valid range
     * based on the specified `byteLength` and whether the value is signed or unsigned.
     *
     * ## Description:
     * This method checks if a value is within the range that can be represented by a given number of bytes (`byteLength`).
     * It handles both signed and unsigned ranges. If the value is outside the valid range, a `RangeError` is thrown.
     * The value is first converted into a `BigInt` for accurate comparison, even if the value is a `number`.
     *
     * - For signed values, the range is from `-(2^(bits - 1))` to `(2^(bits - 1)) - 1`, where `bits = byteLength * 8`.
     * - For unsigned values, the range is from `0` to `(2^(bits)) - 1`.
     *
     * ## Input:
     * - `value` (`number | bigint`): The numeric value to be validated. It can be a `number` or `BigInt`.
     * - `byteLength` (`number`): The number of bytes that determine the range of the value.
     * - `isSigned` (`boolean`): Whether the value is signed (`true`) or unsigned (`false`).
     *
     * ## Output:
     * - This method does not return a value. It either successfully completes or throws a `RangeError` if the value is out of range.
     *
     * ## Errors:
     * - Throws a `RangeError` if the value is out of the valid range determined by `byteLength` and `isSigned`.
     *
     * ## Example:
     * ```ts
     * // Valid examples:
     * Buffer.validateValueInRange(127, 1, true);  // Passes: valid signed 1-byte value
     * Buffer.validateValueInRange(255, 1, false); // Passes: valid unsigned 1-byte value
     *
     * // Invalid examples:
     * Buffer.validateValueInRange(128, 1, true);  // Throws RangeError: exceeds signed 1-byte range
     * Buffer.validateValueInRange(256, 1, false); // Throws RangeError: exceeds unsigned 1-byte range
     * ```
     *
     * @param value - The value to be validated, either a `number` or `BigInt`.
     * @param byteLength - The number of bytes representing the range of the value.
     * @param isSigned - Whether the value is signed (`true`) or unsigned (`false`).
     * @throws {RangeError} If the value is out of the valid range.
     */

    private static validateValueInRange(value: number | bigint, byteLength: number, isSigned: boolean): void {
        let minValue: bigint;
        let maxValue: bigint;

        const bits = BigInt(byteLength * 8); // Total number of bits
        if (isSigned) {
            // Signed: range from -(2^((byteLength * 8) - 1)) to (2^((byteLength * 8) - 1)) - 1
            minValue = -(BigInt(1) << (bits - BigInt(1))); // Minimum signed value
            maxValue = (BigInt(1) << (bits - BigInt(1))) - BigInt(1); // Maximum signed value
        } else {
            // Unsigned: range from 0 to (2^(byteLength * 8)) - 1
            minValue = BigInt(0);
            maxValue = (BigInt(1) << bits) - BigInt(1); // Maximum unsigned value
        }

        let valueBigInt: bigint;
        if (typeof value === 'number') {
            if (value !== Math.floor(value)) {
                value = Math.floor(value);
            }
            valueBigInt = BigInt(value);
        } else {
            valueBigInt = value;
        }

        if (valueBigInt < minValue || valueBigInt > maxValue) {
            throw new RangeError(
                `The value of "value" is out of range. It must be >= ${ minValue } and <= ${ maxValue }. Received ${ value }`
            );
        }
    }

    /**
     * Parses and validates a numeric value (either from a string or directly as a number/BigInt)
     * to ensure it falls within the valid range based on the specified `byteLength` and whether
     * the value is signed or unsigned.
     *
     * ## Description:
     * This method parses the given `value` (which could be a `string`, `number`, or `BigInt`) and validates that
     * it falls within the allowed range for a number or `BigInt` of the specified `byteLength`. It supports both
     * signed and unsigned values. If the value is a string, it is first converted into a number or `BigInt` (depending
     * on the `isBigInt` flag), and then the value is validated against the valid range.
     *
     * - For signed values, the valid range is from `-(2^(bits - 1))` to `(2^(bits - 1)) - 1`, where `bits = byteLength * 8`.
     * - For unsigned values, the valid range is from `0` to `(2^(bits)) - 1`.
     *
     * If the value is out of range or invalid (e.g., a non-numeric string), a `TypeError` or `RangeError` is thrown.
     *
     * ## Input:
     * - `value` (`string | T`): The numeric value to be parsed and validated. This can be a `string` representing a number
     *   or a `number`/`BigInt` directly.
     * - `byteLength` (`number`): The number of bytes that determine the range of the value.
     * - `isSigned` (`boolean`): Whether the value is signed (`true`) or unsigned (`false`).
     * - `isBigInt` (`boolean`, optional): A flag that determines whether to parse the value as a `BigInt` (`true`) or `number` (`false`).
     *
     * ## Output:
     * - The method returns the parsed and validated value, either as a `number` or `BigInt`.
     *
     * ## Errors:
     * - Throws a `TypeError` if the value is not a valid number or `BigInt` (e.g., invalid string input).
     * - Throws a `RangeError` if the value is out of the valid range based on `byteLength` and `isSigned`.
     *
     * ## Example:
     * ```ts
     * // Valid examples:
     * Buffer.ParseAndValidateInRange('127', 1, true);  // Passes: valid signed 1-byte value
     * Buffer.ParseAndValidateInRange(255, 1, false);   // Passes: valid unsigned 1-byte value
     *
     * // Invalid examples:
     * Buffer.ParseAndValidateInRange('128', 1, true);  // Throws RangeError: exceeds signed 1-byte range
     * Buffer.ParseAndValidateInRange('256', 1, false); // Throws RangeError: exceeds unsigned 1-byte range
     * ```
     *
     * @param value - The value to be parsed and validated, either a `string`, `number`, or `BigInt`.
     * @param byteLength - The number of bytes that determine the valid range of the value.
     * @param isSigned - Whether the value is signed (`true`) or unsigned (`false`).
     * @param isBigInt - A flag to specify whether to parse the value as a `BigInt` (`true`) or `number` (`false`).
     * @throws {TypeError} If the value is not a valid number or `BigInt`.
     * @throws {RangeError} If the value is out of the valid range.
     */

    private static ParseAndValidateInRange<T extends number | bigint>(value: string | T, byteLength: number, isSigned: boolean, isBigInt = false): T {
        let parsedValue: T = <T> value;
        if (typeof value === 'string') {
            parsedValue = (isBigInt) ? <T> BigInt(value) : <T> parseInt(value, 10);
        }

        if (
            (typeof value === 'string' && isNaN(Number(parsedValue))) || // Handle invalid string inputs
            (typeof value !== 'string' && typeof parsedValue !== typeof value)
        ) {
            throw new TypeError(`The value "${ value }" is not a valid ${ isBigInt ? 'BigInt' : 'number' }.`);
        }

        this.validateValueInRange(parsedValue, byteLength, isSigned);

        return parsedValue;
    }
}
