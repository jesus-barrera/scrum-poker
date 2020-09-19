/**
 * Random PIN generator.
 *
 * Generates a random string of a given length using a given set of characters.
 *
 * Jesús Barrera <jesus.ba015@gmail.com>
 * March, 2020
 */

const { create: createLCG } = require('./lcg');

const PIN_LENGTH = 4;
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Number of permutations of CHARS
let total = Math.pow(CHARS.length, PIN_LENGTH);

// Create a LGC to produce a sequence of pseudo random numbers. The parameters
// are chosen so the period is equal to the total, this means the LCG will produce
// all values from 0 to total - 1 before it repeats.
let lcg = createLCG(Math.floor(Math.random() * total), total, 456925, 456975);

/**
 * Generates a random PIN. Each PIN will be different until all combinations
 * are exhausted.
 *
 * @return {string} PIN
 */
function generate() {
  let n = lcg();
  let pin = '';

  // Use the LCG value as the number of permutation in the sequence
  // AAAA,AAAB,AAAC...ZZZZ
  for (let i = 0; i < PIN_LENGTH; i++) {
    let p = n % CHARS.length;
    n = Math.floor(n / CHARS.length);

    pin = CHARS[p] + pin;
  }

  return pin;
}

module.exports = generate;
