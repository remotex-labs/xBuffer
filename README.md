# xBuffer

`xBuffer`
xBuffer is a lightweight JavaScript library that provides buffer-like functionality for browsers, similar to Node.js's `Buffer`. 
It offers efficient manipulation of binary data and supports common encoding and decoding operations, such as base64, hex, and UTF-8.

## Features

- **Binary Data Manipulation**:  Efficiently manipulate binary data in the browser, similar to Node.js `Buffer`.
- **Encoding & Decoding**: Supports a variety of encoding formats including base64, hex, and UTF-8.
- **Buffer-like API**: Follows the `Buffer` API pattern from Node.js, offering familiar methods for developers transitioning between the browser and Node.js environments.
- **Efficient and Lightweight**: Built on top of `Uint8Array`, ensuring high performance and a small footprint in web environments.

## Installation

To install `xBuffer`, use either npm or yarn:
```bash
npm install @remotex-labs/xbuffer
# or
yarn add @remotex-labs/xbuffer

# Usage
## Creating a Buffer
```typescript
import { Buffer } from '@remotex-labs/xbuffer';

// Create a buffer from a string
const buffer = Buffer.from('Hello, world!', 'utf-8');

// Create a buffer from an array of bytes
const byteArray = new Uint8Array([72, 101, 108, 108, 111]);
const bufferFromArray = Buffer.from(byteArray);
```

## Encoding and Decoding
You can use `xBuffer` for common encoding and decoding tasks, such as converting binary data to base64 or hex:
```typescript
// Encode a buffer to base64
const base64String = buffer.toString('base64');

// Decode base64 to a buffer
const decodedBuffer = Buffer.from(base64String, 'base64');

// Encode a buffer to hex
const hexString = buffer.toString('hex');

// Decode hex to a buffer
const decodedHexBuffer = Buffer.from(hexString, 'hex');
```

# Global Functions
## `setGlobalBuffer`
This function sets the global `Buffer` object on `globalThis`, making it available throughout the environment. It is useful when `Buffer` is not natively available, such as in certain browser contexts.
```typescript
import { setGlobalBuffer } from '@remotex-labs/xbuffer';

// Set `Buffer` globally
setGlobalBuffer();

// Now `Buffer` is accessible globally
console.log(Buffer); // Logs the global Buffer object
```

## `supportUtilInspect`
This function modifies the global `console.log` to support custom inspection of objects that implement the `util.inspect.custom` symbol. 
It enables objects with custom inspection methods to be logged with their custom output.
```typescript
import { supportUtilInspect } from '@remotex-labs/xbuffer';

// Enable custom inspect support
supportUtilInspect();

// Example object with custom inspection logic
const myObject = {
  [Symbol.for('nodejs.util.inspect.custom')]: () => 'Custom inspection logic here',
};

// Log the object
console.log(myObject); // Logs: "Custom inspection logic here"
```

# Benchmark
For performance comparisons between xBuffer and other buffer libraries, you can check the libs:
- nBuffer: https://github.com/feross/buffer
- xBuffer: https://github.com/remotex-lab/xBuffer

## build
To build the benchmark project:

```bash
cd ./benchmark
docker build -t benchmark .
```

## run 
To run the benchmark:
```bash
docker run -it benchmark
```

# Contributing
Contributions are welcome! If you'd like to improve `xBuffer`, feel free to open an issue or submit a pull request.
