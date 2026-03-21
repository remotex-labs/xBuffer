---
outline: deep
---

# Guide

`xBuffer` is a lightweight JavaScript library that provides a Node.js-style `Buffer` API for browsers. It is built on top of `Uint8Array` and includes helpers for common encoding and decoding workflows.

## Features

- **Buffer-like API**: `Buffer.from`, `Buffer.alloc`, `Buffer.concat`, `Buffer.isBuffer`, and many familiar instance methods.
- **Encoding and Decoding**: Convert between bytes and strings with `base64`, `hex`, `utf-8`, `ascii`, `utf16le`, and more.
- **Browser-friendly**: Designed for environments that do not have Node's built-in `Buffer`.

## Installation

::: code-group

```bash [npm]
npm install @remotex-labs/xbuffer
```

```bash [yarn]
yarn add @remotex-labs/xbuffer
```

```bash [pnpm]
pnpm add @remotex-labs/xbuffer
```

:::

## Quick Start

Create buffers from strings or bytes:

```typescript
import { Buffer } from '@remotex-labs/xbuffer';

const a = Buffer.from('Hello, world!', 'utf-8');
const b = Buffer.from(new Uint8Array([72, 101, 108, 108, 111]));
const c = Buffer.alloc(8, 0);

console.log(a.toString('utf-8')); // "Hello, world!"
console.log(b.toString('utf-8')); // "Hello"
console.log(c.length); // 8
```

## Encodings

Use `toString(encoding)` to encode bytes into strings, and `Buffer.from(string, encoding)` to decode strings back into bytes.

```ts
import { Buffer } from '@remotex-labs/xbuffer';

const raw = Buffer.from('Hello', 'utf-8');

const hex = raw.toString('hex');       // "48656c6c6f"
const base64 = raw.toString('base64'); // "SGVsbG8="

const fromHex = Buffer.from(hex, 'hex');
const fromBase64 = Buffer.from(base64, 'base64');

console.log(fromHex.toString('utf-8'));    // "Hello"
console.log(fromBase64.toString('utf-8')); // "Hello"
```

## ArrayBuffer and Uint8Array Interop

`xBuffer` works naturally with `Uint8Array` and `ArrayBuffer`.

```ts
import { Buffer } from '@remotex-labs/xbuffer';

const ab = new ArrayBuffer(16);
const view = new Uint8Array(ab);
view[0] = 0x48; // 'H'
view[1] = 0x69; // 'i'

const buf = Buffer.from(ab, 0, 2);
console.log(buf.toString('ascii')); // "Hi"

// Buffer is a Uint8Array view, so these are available:
console.log(buf.buffer === ab); // true
```

## Allocation, Concat, and Length

```ts
import { Buffer } from '@remotex-labs/xbuffer';

const a = Buffer.alloc(3, 0x01);
const b = Buffer.from([0x02, 0x03]);
const c = Buffer.concat([a, b]); // [1, 1, 1, 2, 3]

console.log(Buffer.isBuffer(c)); // true
console.log(Buffer.byteLength('Hello', 'utf-8')); // 5
```

::: warning
`Buffer.allocUnsafe(size)` is intended to skip initialization for speed. Treat it as uninitialized and overwrite it before reading.
:::

## Global `Buffer`

If you're targeting an environment without a global `Buffer`, you can attach `xBuffer` to `globalThis`:

```ts
import { setGlobalBuffer } from '@remotex-labs/xbuffer';

setGlobalBuffer();
// globalThis.Buffer is now available
```

## `console.log` Custom Inspect Support

`supportUtilInspect()` patches `console.log` so objects that implement `Symbol.for('nodejs.util.inspect.custom')` can render custom output.

```ts
import { supportUtilInspect } from '@remotex-labs/xbuffer';

supportUtilInspect();

const obj = {
  [Symbol.for('nodejs.util.inspect.custom')]: () => 'Custom inspection output',
};

console.log(obj); // "Custom inspection output"
```
