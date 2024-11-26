// import { Buffer } from './buffer/buffer.modules';
// //
// // const buf = new Buffer('this is a buffer'.length);
// // buf.write('this is a buffer');
// //
// // console.log(buf.indexOf('this'));
// // // Prints: 0
// // console.log(buf.indexOf('is'));
// // // Prints: 2
// // console.log(buf.indexOf('a buffer'));
// // // Prints: 8
// // console.log(buf.indexOf(97));
// // // Prints: 8 (97 is the decimal ASCII value for 'a')
// // console.log(buf.indexOf('a buffer example'));
// // // Prints: -1
// //
// // buf.write('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');
// // const utf16Buffer = buf;
// //
// // console.log(utf16Buffer.indexOf('\u03a3', 0, 'utf16le'));
// // // Prints: 4
// // console.log(utf16Buffer.indexOf('\u03a3', -4, 'utf16le'));
// // // Prints: 6
//
//
// const buf = Buffer.from('627566666572');
// console.log(Buffer.from(buf).toString());

import { decodeBase64, encodeASCII } from '@components/charset.component';

export * from '@modules/buffer.module';

import { Buffer } from '@modules/buffer.module';

console.log(Buffer.from('abc').toString('base64'));

console.log(Buffer.from('test').toString('base64'));
console.log(decodeBase64(encodeASCII('dGVzdA==')));
