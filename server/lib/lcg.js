/*
 * Linear Congruential Generator functions.
 *
 * September 2020
 * Jesús Barrera <jesus.ba015@gmail.com>
 */

/**
 * Precomputed prime numbers.
 */
var primes = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41,
  43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97
];

/**
 * Creates an LCG defined by the recurrence relation:
 *
 * x[i+1] = (a * x[i] + c) % m
 *
 * @param {number} m modulus: 0 < m
 * @param {number} a multiplier: 0 < a < m
 * @param {number} c increment: 0 <= c < m
 * @param {number} s seed: 0 <= s < m
 * @return {function} Linear Congruential Generator
 */
function create(s, m, a, c) {
  var lcg = function () {
    return s = (a * s + c) % m;
  }

  Object.assign(lcg, { s, m, a, c });

  return lcg;
}

/**
 * Checks if an LCG has a period equal to the modulus m.
 *
 * @param {function} lcg
 * @return {bool}
 */
function test(lcg) {
  var count = 0;
  var numbers = {};

  for (count = 0; count < lcg.m; count++) {
    var n = lcg();

    if (numbers[n] === 1) {
      break;
    }

    numbers[n] = 1;
  }

  return count === lcg.m;
}

/**
 * Finds the LCG parameters that produces a period equal to the modulus m.
 *
 * This will occur only if:
 * c and m are relative prime (only 1 divides both)
 * a - 1 is divisible by all prime factors of m
 * a - 1 is divisible by 4 if m is divisible by 4
 *
 * @param {number} m      Modulus
 * @param {number} limitA Max of a's to find (0 for all values)
 * @param {number} limitC Max of c's to find (0 for all values)
 * @return {Object}
 */
function findParams(m, limitA = 0, limitC = 0) {
  var a = findMultiplier(m, limitA);
  var c = findIncrement(m, limitC);

  return { m, a, c };
}

/**
 * Finds all c's such that
 * 0 = c < m
 * c and m are relative prime (only 1 divides both).
 *
 * @param {number} m     Modulus
 * @param {number} limit Max of c's to find (0 for all values)
 * @return {number[]} Posible values of c
 */
function findIncrement(m, limit) {
  var found = [];
  var c = m - 1;

  while (c > 0) {
    let d = c;

    // Find the first common divisor of c and m
    while (c % d !== 0 || m % d !== 0) {
      d -= 1;
    }

    // If only 1 divedes them both, they are relative prime
    if (d === 1) {
      found.push(c);

      if (limit > 0 && found.length === limit) break;
    }

    c -= 1;
  }

  return found;
}

/**
 * Find all a's such that
 * a - 1 is divisible by all prime factors of m.
 * a - 1 is divisible by 4 if m is divisible by 4.
 *
 * @param {number} m     Modulus
 * @param {number} limit Max of a's to find (0 for all posible values)
 * @return {number[]} Posible values of a
 */
function findMultiplier(m, limit) {
  var found = [];
  var a = m - 1;
  var primes = uniquePrimeFactors(m);
  var divisibleByFour = m % 4 === 0;

  while (a > 0) {
    var minus = a - 1;

    // Check divisivility
    if (primes.every((p) => minus % p === 0) && (!divisibleByFour || (divisibleByFour && minus % 4 === 0))) {
      found.push(a);

      if (limit > 0 && found.length === limit) break;
    }

    a--;
  }

  return found;
}

/**
 * Finds al unique prime factors of a number.
 *
 * @param {number} n
 * @return {number[]} Prime factors of n
 */
function uniquePrimeFactors(n) {
  var factors = [];
  var i = 0;
  var p;

  do {
    // Find the first prime that divides the number
    for (; n % (p = getPrimeAt(i)) !== 0; i++);

    // Only add if it is not already
    if (factors.indexOf(p) === -1) {
        factors.push(p);
    }

    n = n / p;
  } while (n > 1);

  return factors;
}

/**
 * Get the prime number at a given position.
 *
 * @param {number} i
 * @return {number} Prime number at i
 */
function getPrimeAt(i) {
  // Check if the prime was already calculated, if not calculate all missing
  // primes.
  while (i >= primes.length) {
    primes.push(findNextPrime(primes[primes.length - 1]));
  }

  return primes[i];
}

/**
 * Finds the first prime number that follows another.
 *
 * @param {number} n
 * @return {number} Prime number
 */
function findNextPrime(n) {
  do {
    var d = 2;
    n++;

    // Find the first divisor
    while (n % d !== 0) d++;

    // If the divisor is the same as the number, it's a prime!, if not check next
  } while (d !== n);

  return n;
}

module.exports = { create, findParams, test };
