const canvas = document.getElementById('main-canvas');
const gpu = new GPU({
  canvas,
  mode: 'gpu'
})

let dim = 1000, // dimensions
  centerX = dim / 2,
  centerY = dim / 2,
  bg = 0, // backgroundColor: 0 to 1(greyscale)
  color = 1, // color of the point: 0 to 1(greyscale)
  speed = 0.01, // Angle Step in radians
  doRender = false,
  rendersPerFrame = 1,
  pi = Math.PI,
  pointSize = 0.1, // Size of the point/brush
  coordScaleFactor = 30;// Coordinates are multiplied by this(makes the graphs bigger or smaller)

document.getElementById('speed').value = speed;
document.getElementById('rend-per-frame').value = rendersPerFrame;
document.getElementById('pt-size').value = pointSize;
document.getElementById('coord-scale-factor').value = coordScaleFactor;

let wave1Params = [0.5, pi, -pi];
let wave2Params = [0.5, pi, pi];

let HTMLWave1Params = [0.5, 'pi', '-pi'];
let HTMLWave2Params = [0.5, 'pi', 'pi'];