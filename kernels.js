const render = gpu.createKernel(
  function (wave1Params, wave2Params, t, pixels, coordScaleFactor, pointSize) 
  {
    let out = pixels[this.thread.y][this.thread.x];
    const x = (this.thread.x - this.constants.centerX) / coordScaleFactor;

    const v1 = wave1Params[1] / wave1Params[2]; // Propagation velocity
    const v2 = wave2Params[1] / wave2Params[2];
    
    const waveFront1 = v1 < 0 ?
      (this.constants.centerX - Math.abs(v1 * t * coordScaleFactor)) / coordScaleFactor : 
      (~this.constants.centerX + Math.abs(v1 * t * coordScaleFactor)) / coordScaleFactor

    const waveFront2 = v2 < 0 ?
      (this.constants.centerX - Math.abs(v2 * t * coordScaleFactor)) / coordScaleFactor : 
      (~this.constants.centerX + Math.abs(v2 * t * coordScaleFactor)) / coordScaleFactor

    const atWaveFront1 = (v1 > 0 ? x < waveFront1 : x > waveFront1);
    const atWaveFront2 = (v2 > 0 ? x < waveFront2 : x > waveFront2);

    const y1 = atWaveFront1 ? wave1Params[0]*Math.sin(wave1Params[1]*t - wave1Params[2]*x) : 0;
    const y2 = atWaveFront2 ? wave2Params[0]*Math.sin(wave2Params[1]*t - wave2Params[2]*x) : 0;
    const finalY = y1 + y2;
    const vp = Math.abs(
      (
        atWaveFront1 ?
        Math.cos(wave1Params[1]*t - wave1Params[2]*x) :
        0
      ) +
      (
        atWaveFront2 ?
        Math.cos(wave2Params[1]*t - wave2Params[2]*x) :
        0
      )
    ) / 2 // particle velocity
  
    if (
      Math.abs(finalY - (this.thread.y - this.constants.centerY) / coordScaleFactor) < pointSize
      && 
      (
        atWaveFront1 ||
        atWaveFront2
      )
    ) out = [
      this.constants.color,
      this.constants.color - vp,
      this.constants.color - vp
    ];

    return out;
  },
  {
    output: [dim, dim],
    pipeline: true,
    constants: {centerX, centerY, color}
  }
)

// Graphics Kernels
const blankGraph = gpu.createKernel(function() { // Create the starting blank graph with axes
  if ( // Coordinate Axes
    this.thread.x == this.constants.centerX ||
    this.thread.y == this.constants.centerY
  ) return [0.5, 0.5, 0.5];
  else return [this.constants.bg, this.constants.bg, this.constants.bg];
},
{
  output: [dim, dim],
  pipeline: true,
  constants: {centerX, centerY, bg}
})

const getTex = gpu.createKernel(function(tex) { // get a separate texture so that source and destination textures should not match
  return tex[this.thread.y][this.thread.x];
},
{
  output: [dim, dim],
  pipeline: true
})

const display = gpu.createKernel(function(pixels) { // Display the pixels on the canvas
  const color = pixels[this.thread.y][this.thread.x];
  this.color(color[0], color[1], color[2]);
},
{
  output: [dim, dim],
  graphical: true
})