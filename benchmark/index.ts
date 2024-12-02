/**
 * Imports
 */

import Benchmark from 'benchmark';
import { Buffer as npmBuffer } from 'buffer/';
import { Buffer as xBuffer } from '@remotex-labs/xbuffer';

/**
 * Imports libs
 */

const nodeBuffer = Buffer;

/**
 * Create suite
 */

const suite = new Benchmark.Suite();

/**
 * Define categories
 */

const categories: { [key: string]: string[] } = {};

/**
 * Helper to add benchmarks and assign to categories
 */

function addBenchmark(category: string, name: string, fn: () => void) {
    if (!(category in categories)) {
        categories[category] = [];
    }

    categories[category].push(name);
    suite.add(`[${ name }] ${ category }`, fn);
}


/**
 * Buffer from large string
 */

addBenchmark('From large Strings - HEX', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(100000), 'hex');
});

addBenchmark('From large Strings - HEX', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(100000), 'hex');
});

addBenchmark('From large Strings - UTF-8', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(100000));
});

addBenchmark('From large Strings - UTF-8', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(100000));
});

addBenchmark('From large Strings - ASCII', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(100000), 'ascii');
});

addBenchmark('From large Strings - ASCII', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(100000), 'ascii');
});

addBenchmark('From large Strings - UTF-16LE', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(100000), 'utf16le');
});

addBenchmark('From large Strings - UTF-16LE', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(100000), 'utf16le');
});
// todo fux buffer speed
addBenchmark('From large Strings - BASE64', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(100000), 'base64');
});

addBenchmark('From large Strings - BASE64', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(100000), 'base64');
});

/**
 * Buffer from large string to-string (encoding)
 */

addBenchmark('From Large Strings to - HEX', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(100000)).toString('hex');
});

addBenchmark('From Large Strings to - HEX', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(100000)).toString('hex');
});

addBenchmark('From Large Strings to - UTF-8', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(100000)).toString();
});

addBenchmark('From Large Strings to - UTF-8', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(100000)).toString();
});

addBenchmark('From Large Strings to - ASCII', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(100000)).toString('ascii');
});

addBenchmark('From Large Strings to - ASCII', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(100000)).toString('ascii');
});

addBenchmark('From Large Strings to - UTF-16LE', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(100000)).toString('utf16le');
});

addBenchmark('From Large Strings to - UTF-16LE', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(100000)).toString('utf16le');
});

addBenchmark('From Large Strings to - BASE64', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(100000)).toString('base64');
});

addBenchmark('From Large Strings to - BASE64', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(100000)).toString('base64');
});

/**
 * Slice && SubArray && concat
 */

addBenchmark('Slice', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(100000)).slice(0, 5000);
});

addBenchmark('Slice', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(100000)).slice(0, 5000);
});

addBenchmark('SubArray', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(100000)).subarray(0, 5000);
});

addBenchmark('SubArray', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(100000)).subarray(0, 5000);
});

addBenchmark('Concat', 'xBuffer', () => {
    xBuffer.concat([
        xBuffer.from('acd'.repeat(100)),
        xBuffer.from('acd'.repeat(100))
    ]);
});

addBenchmark('Concat', 'nBuffer', () => {
    npmBuffer.concat([
        npmBuffer.from('acd'.repeat(100)),
        npmBuffer.from('acd'.repeat(100))
    ]);
});

/**
 * Read Uint
 */

addBenchmark('Read UInt8', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(400)).readUInt8(50);
});

addBenchmark('Read UInt8', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(400)).readUInt8(50);
});

addBenchmark('Read UInt16LE', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(400)).readUInt16LE(50);
});

addBenchmark('Read UInt16LE', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(400)).readUInt16LE(50);
});

addBenchmark('Read UInt16BE', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(400)).readUInt16BE(50);
});

addBenchmark('Read UInt16BE', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(400)).readUInt16BE(50);
});

addBenchmark('Read UInt32LE', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(400)).readUInt32LE(50);
});

addBenchmark('Read UInt32LE', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(400)).readUInt32LE(50);
});

addBenchmark('Read UInt32BE', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(400)).readUInt32BE(50);
});

addBenchmark('Read UInt32BE', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(400)).readUInt32BE(50);
});

addBenchmark('Read BigUInt64LE', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(400)).readBigUInt64LE(50);
});

addBenchmark('Read BigUInt64LE', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(400)).readBigUInt64LE(50);
});

addBenchmark('Read BigUInt64BE', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(400)).readBigUInt64BE(50);
});

addBenchmark('Read BigUInt64BE', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(400)).readBigUInt64BE(50);
});

/**
 * Read Int
 */

addBenchmark('Read Int8', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(400)).readInt8(50);
});

addBenchmark('Read Int8', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(400)).readInt8(50);
});

addBenchmark('Read Int16LE', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(400)).readInt16LE(50);
});

addBenchmark('Read Int16LE', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(400)).readInt16LE(50);
});

addBenchmark('Read Int16BE', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(400)).readInt16BE(50);
});

addBenchmark('Read Int16BE', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(400)).readInt16BE(50);
});

addBenchmark('Read Int32LE', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(400)).readInt32LE(50);
});

addBenchmark('Read Int32LE', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(400)).readInt32LE(50);
});

addBenchmark('Read Int32BE', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(400)).readInt32BE(50);
});

addBenchmark('Read Int32BE', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(400)).readInt32BE(50);
});

addBenchmark('Read BigInt64LE', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(400)).readBigInt64LE(50);
});

addBenchmark('Read BigInt64LE', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(400)).readBigInt64LE(50);
});

addBenchmark('Read BigInt64BE', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(400)).readBigInt64BE(50);
});

addBenchmark('Read BigInt64BE', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(400)).readBigInt64BE(50);
});

/**
 * Write UInt
 */

addBenchmark('Write UInt8', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(400)).writeUInt8(30, 50);
});

addBenchmark('Write UInt8', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(400)).writeUInt8(30, 50);
});

addBenchmark('Write UInt16LE', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(400)).writeUInt16LE(30, 50);
});

addBenchmark('Write UInt16LE', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(400)).writeUInt16LE(30, 50);
});

addBenchmark('Write UInt16BE', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(400)).writeUInt16BE(30, 50);
});

addBenchmark('Write UInt16BE', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(400)).writeUInt16BE(30, 50);
});

addBenchmark('Write UInt32LE', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(400)).writeUInt32LE(30, 50);
});

addBenchmark('Write UInt32LE', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(400)).writeUInt32LE(30, 50);
});

addBenchmark('Write UInt32BE', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(400)).writeUInt32BE(30, 50);
});

addBenchmark('Write UInt32BE', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(400)).writeUInt32BE(30, 50);
});

addBenchmark('Write BigUInt64LE', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(400)).writeBigUInt64LE(30n, 50);
});

addBenchmark('Write BigUInt64LE', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(400)).writeBigUInt64LE(30, 50);
});

addBenchmark('Write BigUInt64BE', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(400)).writeBigUInt64BE(30n, 50);
});

addBenchmark('Write BigUInt64BE', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(400)).writeBigUInt64BE(30, 50);
});

/**
 * Write Int
 */

addBenchmark('Write Int8', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(400)).writeInt8(30, 50);
});

addBenchmark('Write Int8', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(400)).writeInt8(30, 50);
});

addBenchmark('Write Int16LE', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(400)).writeInt16LE(30, 50);
});

addBenchmark('Write Int16LE', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(400)).writeInt16LE(30, 50);
});

addBenchmark('Write Int16BE', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(400)).writeInt16BE(30, 50);
});

addBenchmark('Write Int16BE', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(400)).writeInt16BE(30, 50);
});

addBenchmark('Write Int32LE', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(400)).writeInt32LE(30, 50);
});

addBenchmark('Write Int32LE', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(400)).writeInt32LE(30, 50);
});

addBenchmark('Write Int32BE', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(400)).writeInt32BE(30, 50);
});

addBenchmark('Write Int32BE', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(400)).writeInt32BE(30, 50);
});

addBenchmark('Write BigInt64LE', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(400)).writeBigInt64LE(30n, 50);
});

addBenchmark('Write BigInt64LE', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(400)).writeBigInt64LE(30, 50);
});

addBenchmark('Write BigInt64BE', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(400)).writeBigInt64BE(30n, 50);
});

addBenchmark('Write BigInt64BE', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(400)).writeBigInt64BE(30, 50);
});


/**
 * Bracket notation
 */

addBenchmark('Bracket notation', 'xBuffer', () => {
    xBuffer.from('acd'.repeat(400))[100];
});

addBenchmark('Bracket notation', 'nBuffer', () => {
    npmBuffer.from('acd'.repeat(400))[100];
});

/**
 * End
 */

suite.on('cycle', (event: any) => {
    // Extract name, ops/sec, margin and runs sampled
    // console.log(event);
    const name = event.target.name;
    const ops = event.target.hz.toFixed(2);  // operations per second
    const margin = event.target.stats.mean.toFixed(6);  // Mean time per operation
    const runsSampled = event.target.stats.sample.length;  // Number of runs sampled

    // Define color for each part of the output (using ANSI codes)
    const nameColor = '\x1b[38;5;166m';  // Blue for benchmark name
    const marginColor = '\x1b[33m';  // Yellow for margin
    const runsColor = '\x1b[36m';  // Cyan for runs sampled
    const resetColor = '\x1b[39m';  // Reset color
    const opsColor =
        parseFloat(ops) < 9000 ? '\u001B[38;5;203m' : '\x1b[32m';

    // Construct the table-like output with color and padding
    console.log(
        `${ nameColor }${ name.padEnd(45) }${ resetColor } | ` +
        `${ opsColor }${ ops.padStart(15) } ops/sec${ resetColor } | ` +
        `${ marginColor }${ margin.padStart(15) } mean time${ resetColor } | ` +
        `${ runsColor }${ '(' + runsSampled + ' runs sampled)'.padEnd(20) }${ resetColor }`
    );
}).on('complete', function () {
    console.log('\nFastest results by category:\n');

    for (const [ category, tests ] of Object.entries(categories)) {
        // @ts-ignore
        const fastest = this.filter((test: any) =>
            test.name.includes(category)
        ).filter('fastest')[0];


        const name = fastest.name;
        const packageName =
            fastest.toString().includes('xBuffer') ? `\u001B[38;5;203m${ name }\x1b[39m` : `\x1b[32m${ name }\x1b[39m`;

        console.log(`${ packageName } - ${ fastest.hz.toFixed(2) } ops/sec`);
    }
});

suite.run({ async: false });
