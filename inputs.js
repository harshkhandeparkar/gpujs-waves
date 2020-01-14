const canvas = document.getElementById('main-canvas');
const gpu = new GPU({
  canvas,
  mode: 'gpu'
})

let dim = 800, // dimensions
  centerX = dim / 2,
  centerY = dim / 2,
  bg = 0, // backgroundColor: 0 to 1(greyscale)
  color = 1, // color of the point: 0 to 1(greyscale)
  speed = 0.01, // Time Step
  doRender = false,
  rendersPerFrame = 1,
  pi = Math.PI,
  pointSize = 0.05, // Size of the point/brush
  coordScaleFactor = 100;// Coordinates are multiplied by this(makes the graphs bigger or smaller)

document.getElementById('speed').value = speed;
document.getElementById('rend-per-frame').value = rendersPerFrame;
document.getElementById('pt-size').value = pointSize;
document.getElementById('coord-scale-factor').value = coordScaleFactor;

// [Amplitude, Ang Freq, Ang Wave No]
let HTMLWave1Params = ['0.5', 'pi', '-pi']; // String values for pi which will finally be evaluated
let HTMLWave2Params = ['1', 'pi', 'pi/2'];

let wave1Params = [
  Number(eval(HTMLWave1Params[0].replace('pi', pi))),
  Number(eval(HTMLWave1Params[1].replace('pi', pi))), // Evaluate mathematical expressions
  Number(eval(HTMLWave1Params[2].replace('pi', pi)))
]
let wave2Params = [
  Number(eval(HTMLWave2Params[0].replace('pi', pi))),
  Number(eval(HTMLWave2Params[1].replace('pi', pi))),
  Number(eval(HTMLWave2Params[2].replace('pi', pi)))
]
