/**
 * Imports
 */

import { Buffer } from '@providers/buffer.provider';

/**
 * Sets the global `Buffer` object on `globalThis`, making it available throughout the environment.
 * This is useful in scenarios where `Buffer` is not natively available, such as in certain browser contexts.
 *
 * ## Description:
 * The function assigns the `Buffer` object to `globalThis`, ensuring that the global environment
 * can access it. This is especially useful in environments where `Buffer` is not natively available,
 * like in some browsers or isolated JavaScript environments. By calling this function, the global
 * scope will have access to `Buffer`, similar to how it's available in Node.js.
 *
 * - **Input**:
 *   - None
 *
 * - **Output**:
 *   - None. This function does not return a value, but instead modifies the global environment by
 *     assigning `Buffer` to `globalThis`.
 *
 * ## Example:
 *
 * ```ts
 * setGlobalBuffer();
 * console.log(Buffer); // Logs the global Buffer object, now accessible
 * ```
 *
 * ## Error Handling:
 * - This function does not contain explicit error handling. If an error occurs, it will be a runtime error
 *   based on the state of the environment.
 *
 * @private
 * @returns {void}
 */

export function setGlobalBuffer() {
    globalThis.Buffer = <any> Buffer;
}

/**
 * Modifies the global `console.log` function to support custom inspection of objects that implement
 * the `util.inspect.custom` symbol. This enables custom inspection logic for objects when logged,
 * allowing for more detailed or formatted logging.
 *
 * ## Description:
 * The function overrides the `console.log` method globally to intercept the arguments passed to it.
 * If an argument has a custom inspection method (i.e., implements the `Symbol.for('nodejs.util.inspect.custom')` symbol),
 * the method is invoked and its result is logged instead. This allows objects with custom inspection methods
 * to display their custom output when logged to the console, instead of showing the default object representation.
 *
 * - **Input**:
 *   - The arguments passed to `console.log`, which can be any values, including objects with a custom inspect symbol.
 *
 * - **Output**:
 *   - None. The function modifies the global behavior of `console.log` but does not return any value.
 *
 * ## Example:
 *
 * ```ts
 * const myObject = {
 *   [Symbol.for('nodejs.util.inspect.custom')]: () => 'Custom inspection logic here'
 * };
 *
 * supportUtilInspect();
 * console.log(myObject); // Logs: "Custom inspection logic here"
 * ```
 *
 * ## Error Handling:
 * - No explicit error handling is provided. If an error occurs in the process, it will likely be a runtime error
 *   related to the custom inspection logic or the `console.log` override.
 *
 * @private
 * @returns {void}
 */

export function supportUtilInspect(): void {
    const originalLog = console.log;

    console.log = (...args) => {
        // Map arguments, replacing those with the custom inspect symbol
        const processedArgs = args.map(arg =>
            arg && typeof arg === 'object' && Symbol.for('nodejs.util.inspect.custom') in arg
                ? arg[Symbol.for('nodejs.util.inspect.custom')]()
                : arg
        );

        // Call the original log function with the processed arguments
        originalLog(...processedArgs);
    };
}
