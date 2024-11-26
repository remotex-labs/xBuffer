/**
 * @remarks
 * This import statement is for TypeScript type checking only and will be removed during the build process.
 */

import type { BufferEncoding, primitiveInputType } from './interfaces/buffer.interface';

/**
 * Imports
 */

import {
    asciiDecode,
    asciiEncode, base64Decode,
    base64Encode,
    hexDecode,
    hexEncode, utf16leDecode,
    utf16leEncode,
    utf8Decode,
    utf8Encode
} from './encoding.buffer';

/**
 * Represents a custom buffer class that extends Uint8Array.
 * This class provides additional functionality through a private DataView.
 *
 * @public
 * @class Buffer
 * @extends Uint8Array
 */

export class Buffer extends Uint8Array {

    static readonly constants = {
        /**
         * The maximum length allowed for a Buffer.
         */

        MAX_LENGTH: 4294967296,

        /**
         * The maximum string length allowed for a Buffer.
         */

        MAX_STRING_LENGTH: 536870888,
    };

    /**
     * Private property holding a DataView for additional functionality.
     *
     * @private
     * @type {DataView}
     * @memberof Buffer
     */

    private dataView: DataView;

    constructor(length: number);
    constructor(array: ArrayLike<number> | ArrayBufferLike);
    constructor(buffer: ArrayBufferLike, byteOffset?: number, length?: number);
    constructor(arg: number | ArrayLike<number> | ArrayBufferLike, byteOffset?: number, length?: number) {
        super(<any>arg, byteOffset, length);

        // Create a DataView using the underlying buffer of the Uint8Array.
        this.dataView = new DataView(this.buffer);
    }

    static override from(value: Uint8Array | readonly number[]): Buffer;
    static override from(value: string | Uint8Array | readonly number[]): Buffer;
    static override from(value: WithImplicitCoercion<string>, encoding: BufferEncoding): Buffer;
    static override from(arrayBuffer: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>, byteOffset?: number, length?: number): Buffer;

    static override from(arg1: unknown, arg2?: BufferEncoding | number, length?: number): Buffer {
        if (typeof arg1 === 'string') {
            return new Buffer(this.encoding(arg1, <BufferEncoding>arg2));
        } else if (ArrayBuffer.isView(arg1) || Array.isArray(arg1)) {
            return new Buffer(new Uint8Array(<any>arg1, <number>arg2, length));
        } else {
            // Throw a TypeError if the argument is not supported
            throw new TypeError('The "from" method expects valid input arguments.');
        }
    }

    static override of(...items: number[]): Buffer {
        return new Buffer(items);
    }

    static isEncoding(encoding: string): encoding is BufferEncoding {
        return [
            'hex', 'utf8', 'utf-8', 'ascii', 'latin1', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le'
        ].includes(encoding);
    }

    static byteLength(
        string: string | NodeJS.ArrayBufferView | ArrayBuffer | SharedArrayBuffer,
        encoding: BufferEncoding = 'utf8',
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

    static compare(buf1: Buffer, buf2: Buffer): -1 | 0 | 1 {
        return buf1.compare(buf2);
    }

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

    static allocUnsafe(size: number): Buffer {
        if (typeof size !== 'number') {
            throw new TypeError('The "size" argument must be of type number.');
        }

        return new Buffer(size);
    }

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

        // Check buffer bounds
        if (offset < 0 || offset > this.length || length < 0 || length > this.length) {
            throw new RangeError(`The values of "offset" and "length" must be >= 0 && <= ${ this.length }. Received offset: ${ offset }, length: ${ length }`);
        }

        let bytesWrite = undefined;

        // Handle known encodings
        bytesWrite = Buffer.encoding(string, encoding, fixLength);
        this.set(bytesWrite, offset);

        return bytesWrite.length;
    }

    override subarray(start?: number, end?: number): Buffer {
        end = end ? Math.min(end, this.length) : this.length;

        return new Buffer(super.subarray(start, end));
    }

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
                return hexDecode(slicedArray);
            case 'utf8':
            case 'utf-8':
                return utf8Decode(slicedArray);
            case 'ascii':
            case 'latin1':
            case 'binary':
                return asciiDecode(slicedArray);
            case 'base64':
                return base64Decode(slicedArray);
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return utf16leDecode(slicedArray);
            default:
                // Unknown encoding
                throw new TypeError('Unknown encoding: ' + encoding);
        }
    }

    toJSON() {
        return {
            type: 'Buffer',
            data: Array.from(this),
        };
    }

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

    copy(target: Uint8Array, targetStart: number = 0, sourceStart: number = 0, sourceEnd: number = this.length): number {
        target.set(this.subarray(sourceStart, sourceEnd), targetStart);

        return Math.min(sourceEnd - sourceStart, target.length - targetStart);
    }

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
     * Custom inspection method for Node.js environments.
     * This method is recognized by `util.inspect` in Node.js.
     * @function
     * @name Symbol.for('nodejs.util.inspect.custom')
     * @memberof Password.prototype
     * @returns The custom string representation of the Password object.
     */

    [Symbol.for('nodejs.util.inspect.custom')]() {
        const value = Array.from(
            this, byte => byte.toString(16).padStart(2, '0')
        ).join(' ');

        return `<Buffer ${ value }>`;
    }

    /**
     * Checks if the provided value is an instance of the specified type.
     * ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
     * the `instanceof` check, but they should be treated as of that type.
     * See: https://github.com/feross/buffer/issues/166
     *
     * @private
     * @static
     * @param {any} obj - The value to check.
     * @param {Function} type - The constructor function representing the type.
     * @returns {boolean} - Returns true if the value is an instance of the specified type, otherwise false.
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
     * Encodes a string using the specified encoding and returns the result as a Uint8Array.
     *
     * @private
     * @param {string} string - The input string to be encoded.
     * @param {BufferEncoding} [encoding='utf-8'] - The encoding to use. Defaults to 'utf-8'.
     * @param {number} length - The expected length of the output Uint8Array.
     * @throws {TypeError} If the specified encoding is unknown.
     * @returns {Uint8Array} The Uint8Array containing the encoded values.
     *
     * @example
     * const result = encoding('Hello', 'utf-8', 5);
     * console.log(result); // Uint8Array [ 72, 101, 108, 108, 111 ]
     */

    private static encoding(string: string, encoding: BufferEncoding = 'utf-8', length?: number): Uint8Array {
        // Handle known encodings
        switch (encoding.toLowerCase()) {
            case 'hex':
                return hexEncode(string, length);
            case 'utf8':
            case 'utf-8':
                return utf8Encode(string, length);
            case 'ascii':
            case 'latin1':
            case 'binary':
                return asciiEncode(string, length);
            case 'base64':
                return base64Encode(string, length);
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return utf16leEncode(string, length);
            default:
                // Unknown encoding
                throw new TypeError('Unknown encoding: ' + encoding);
        }
    }

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