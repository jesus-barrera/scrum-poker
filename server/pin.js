/**
 * Random PIN generator
 *
 * Jesús Barrera <jesus.ba015@gmail.com>
 * March, 2020
 */

const NUM_OF_DIGITS = 3;
const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];


// Total of available pins
let permutations = Math.pow(DIGITS.length, NUM_OF_DIGITS);

// Positions of the pins used inside the permutations
let available = [];

let next = 1;

export default generatePin() {
  let pin = [];

  for (let i = 0; i < NUM_OF_DIGITS; i++) {
    pins.forEach((used, i) => {
      available
    });
  }
}
