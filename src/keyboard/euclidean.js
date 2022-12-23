export function Euclid(a, b) { // extended Euclidean algorithm
  var a_sign = Sign(a); // keep track of signs for later implementation
  var b_sign = Sign(b);
  if ((a_sign === 1 || a_sign === -1) && (b_sign === 1 || b_sign === -1)) {
    var a = Math.floor(a) * a_sign; // make both numbers positive integers
    var b = Math.floor(b) * b_sign;
    var x = 0, y = 1, u = 1, v = 0, q, r, m, n;
    while (a !== 0) { 
      q = Math.floor(b / a); // subtract smaller from larger as many times as possible 
      r = b % a;             // find remainder
      m = x - u * q;         // find coefficients
      n = y - v * q;
      b = a;                 // swap values
      a = r;
      x = u;
      y = v;
      u = m;
      v = n;
    }
    return [b, x * a_sign, y * b_sign]; // emit GCD and Bézout Coefficients
  } else {
    return "inputs are not both numbers"
  }
}

function Sign(x) {
  if (x < 0) {
    return -1
  } else if (x >= 0) {
    return 1
  } else {
    return "input is not a number"
  }
}

export default Euclid;
