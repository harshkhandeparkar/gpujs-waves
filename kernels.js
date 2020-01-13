const render = gpu.createKernel(
  function (wave1Params, wave2Params, t, pixels, coordScaleFactor, pointSize) 
  {
    let out = pixels[this.thread.y][this.thread.x];
    const x = (this.thread.x - this.constants.centerX) / coordScaleFactor;

    const y1 = wave1Params[0]*Math.sin(wave1Params[1]*t - wave1Params[2]*x);
    const y2 = wave2Params[0]*Math.sin(wave2Params[1]*t - wave2Params[2]*x);
    const finalY = y1 + y2;
  
    if (
      Math.abs(finalY - (this.thread.y - this.constants.centerY) / coordScaleFactor) < pointSize
    ) out = Math.cos(wave1Params[1]*t - wave1Params[2]*x);

    return out;
  },
  {
    output: [dim, dim],
    pipeline: true,
    constants: {centerX, centerY, color}
  }
)
// |z1 - 1| = |z2 - 1| = |z3 - 1| = r (variable)
// arg((z3 - z1) / (z2 - z1)) = pi / 6
const renderComplex = gpu.createKernel(
  function(r) {
    let out;
    const radius = Math.sqrt(Math.pow(this.thread.x - 1, 2) + Math.pow(this.thread.y, 2));

    if (Math.abs(radius - r) <= 0.1) out = 1;
    else out = 1;

    return out;
  },
  {
    output: [dim, dim],
    pipeline: true,
    constants: {centerX, centerY}
  }
)

// Graphics Kernels
const blankGraph = gpu.createKernel(function() { // Create the starting blank graph with axes
  if ( // Coordinate Axes
    this.thread.x == this.constants.centerX ||
    this.thread.y == this.constants.centerY
  ) return 0.5;
  else return this.constants.bg;
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
  this.color(color, 1, 1);
},
{
  output: [dim, dim],
  graphical: true
})

// // Complex Calc Kernels
// const positiveTimePeriodMult = gpu.createKernel(function(complexes, speed) { // complexes is a 2d array with 1st dimension being the index of the no and the second being [Re, Im, Modulus]
//   const x = this.thread.x,
//     y = this.thread.y;

//   const r = Math.sqrt(Math.pow(complexes[y][0], 2) + Math.pow(complexes[y][1], 2));

//   if (x == 0) return Math.cos(complexes[y][2] + speed*y)*r;
//   if (x == 1) return Math.sin(complexes[y][2] + speed*y)*r;
//   if (x == 2) return complexes[y][2] + speed*y;
// }, 
// {
//   output: [3, clist.length],
//   pipeline: true
// })

// const negativeTimePeriodMult = gpu.createKernel(function(complexes, speed) { // complexes is a 2d array with 1st dimension being the index of the no and the second being [Re, Im, Modulus]
//   const x = this.thread.x,
//     y = this.thread.y;

//   const r = Math.sqrt(Math.pow(complexes[y][0], 2) + Math.pow(complexes[y][1], 2));

//   if (x == 0) return Math.cos(complexes[y][2] - speed*y)*r;
//   if (x == 1) return Math.sin(complexes[y][2] - speed*y)*r;
//   if (x == 2) return complexes[y][2] - speed*y;

// },
// {
//   output: [3, clistnegative.length],
//   pipeline: true
// })

// const getFinalComplex = gpu.createKernel(function(complexes, complexesNegative) {
//   const x = this.thread.x;
//   let sum = 0;
  
//   if (x == 0) {
//     for (let i = 0; i < this.constants.positive; i++) sum += complexes[i][0];
//     for (let i = 0; i < this.constants.negative; i++) sum += complexesNegative[i][0];
//   }
//   if (x == 1) {
//     for (let i = 0; i < this.constants.positive; i++) sum += complexes[i][1];
//     for (let i = 0; i < this.constants.negative; i++) sum += complexesNegative[i][1];
//   }

//   return sum;
// },
// {
//   output: [2],
//   constants: {
//     positive: clist.length,
//     negative: clistnegative.length
//   },
//   pipeline: true
// })
