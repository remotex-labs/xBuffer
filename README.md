# xBuffer

`xBuffer` is a lightweight JavaScript library designed to provide buffer-like functionality for browsers, similar to Node.js's `Buffer`. It enables efficient manipulation of binary data using `Uint8Array` and supports common encoding and decoding operations, such as base64, hex, and UTF-8.

## Features

- **Binary Data Manipulation**: Provides methods for manipulating binary data in the browser.
- **Encoding & Decoding**: Supports a variety of encoding formats including base64, hex, and UTF-8.
- **Buffer-like API**: Mimics the `Buffer` API found in Node.js, offering familiarity to developers.
- **Efficient and Lightweight**: Built on top of the native `Uint8Array`, making it fast and compact.

## Installation
To install the library, you can use `npm` or `yarn`:

```bash
npm install @remotex-labs/xbuffer
# or
yarn add @remotex-labs/xbuffer
```

# Usage
## Creating a Buffer
```typescript
import { Buffer } from '@remotex-labs/xbuffer';

// Create a buffer from a string
const buffer = xBuffer.from('Hello, world!', 'utf-8');

// Create a buffer from an array of bytes
const byteArray = new Uint8Array([72, 101, 108, 108, 111]);
const bufferFromArray = xBuffer.from(byteArray);
```

# Benchmark
nBuffer: https://github.com/feross/buffer
xBuffer: https://github.com/remotex-lab/xBuffer

## build
```bash
cd ./benchmark
docker build -t benchmark .
```

## run 
```bash
docker run -it benchmark
```
