export type primitiveInputType = string | number | Uint8Array;
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

export type WithImplicitCoercion<T> = T | { valueOf(): T; };