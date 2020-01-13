/**
 * 
 * @param {Number} f Angular Frequency
 * @param {Number} k Angular Wave Number
 */
function generateWaveFunction(A, f, k) {
  return function(x, t) {
    return A*Math.sin(k*x - f*t);
  }
}