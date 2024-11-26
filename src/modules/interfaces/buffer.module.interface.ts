/**
 * ## Description:
 * The `primitiveInputType` represents a union of:
 * - **`string`**: Useful for textual input or encoded data.
 * - **`number`**: Suitable for numeric values like indexes, sizes, or single-byte representations.
 * - **`Uint8Array`**: Represents raw binary data or arrays of byte values, often used for buffer manipulations.
 */

export type primitiveInputType = string | number | Uint8Array;

/**
 * A TypeScript type alias that represents a value of type `T` or an object that can be implicitly coerced into type `T`.
 * This type is particularly useful for handling inputs that may either be a direct value or an object with a `valueOf` method
 * that returns the equivalent value of type `T`.
 *
 * ## Description:
 * The `WithImplicitCoercion` type is a union of:
 * - **`T`**: The direct value of the type `T`.
 * - **`{ valueOf(): T; }`**: An object with a `valueOf` method that returns a value of type `T`.
 *
 * This allows functions to flexibly accept both raw values and objects capable of converting themselves into the required type.
 *
 * ## Example:
 *
 * ```ts
 * function processValue<T>(input: WithImplicitCoercion<T>): T {
 *   if (typeof input === "object" && input !== null && "valueOf" in input) {
 *     return input.valueOf();
 *   }
 *   return input as T;
 * }
 *
 * // Direct value of type `string`
 * const result1 = processValue("hello"); // Output: "hello"
 *
 * // Object with a valueOf method returning a string
 * const result2 = processValue({ valueOf: () => "world" }); // Output: "world"
 * ```
 *
 * @template T - The base type that the input or coercible object must conform to.
 */

export type WithImplicitCoercion<T> = T | { valueOf(): T; };

/**
 * A TypeScript type alias that defines the supported encoding formats for converting data to and from buffers.
 * These encodings are commonly used for string-to-buffer and buffer-to-string transformations.
 */

export type BufferEncoding =
    | 'hex'
    | 'utf8'
    | 'utf-8'
    | 'ascii'
    | 'latin1'
    | 'binary'
    | 'base64'
    | 'ucs2'
    | 'ucs-2'
    | 'utf16le'
    | 'utf-16le';

