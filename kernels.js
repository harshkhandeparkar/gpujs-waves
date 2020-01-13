const render = gpu.createKernel(
  function (wave1Params, wave2Params, t, pixels, coordScaleFactor, pointSize) 
  {
    let out = pixels[this.thread.y][this.thread.x];
    const x = (this.thread.x - this.constants.centerX) / coordScaleFactor;

    const y1 = wave1Params[0]*Math.sin(wave1Params[1]*t - wave1Params[2]*x);
    const y2 = wave2Params[0]*Math.sin(wave2Params[1]*t - wave2Params[2]*x);
    const finalY = y1 + y2;
    const v = Math.cos(wave1Params[1]*t - wave1Params[2]*x);
  
    if (
      Math.abs(finalY - (this.thread.y - this.constants.centerY) / coordScaleFactor) < pointSize
    ) out = [
      this.constants.color,
      this.constants.color - v,
      this.constants.color - v
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