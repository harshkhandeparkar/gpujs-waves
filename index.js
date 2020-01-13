const scaleCoords = coord => Math.floor(coord * coordScaleFactor) / coordScaleFactor;

let renders = 0; // renders count.
let frames = 0; // frame count
let t = 0; // time
let blank = blankGraph(); // initial black graph rendered pixels texture
let renderPixelsTex = blankGraph();

const doDraw = () => {
  if(doRender) {
    for (let i = 0; i < rendersPerFrame; i++) {
      renderPixelsTex = render(wave1Params, wave2Params, t, getTex(blank), coordScaleFactor, pointSize);
      
      t += speed;
      renders++; // count the rendered frame
    }
    display(renderPixelsTex);
    frames++;
  }
  window.requestAnimationFrame(doDraw);
}

//  Rendering--------------------------------------

document.getElementById('start-stop').onclick = e => {
  e.preventDefault();

  doRender = !doRender;
  e.target.innerText = e.target.innerText === 'Start' ? 'Stop' : 'Start';
  document.getElementById('change').disabled = !document.getElementById('change').disabled;
}

document.getElementById('restart').onclick = e => {
  e.preventDefault();

  doRender = false;
  renderPixelsTex = blankGraph();
  doRender = true;
  document.getElementById('start-stop').innerText = 'Stop';
  document.getElementById('change').disabled = true;
}

document.getElementById('change').onclick = e => {
  e.preventDefault();

  speed = document.getElementById('speed').value;
  rendersPerFrame = document.getElementById('rend-per-frame').value;
  pointSize = document.getElementById('pt-size').value;
  coordScaleFactor = document.getElementById('coord-scale-factor').value;
}

document.getElementById('blank').onclick = e => {
  e.preventDefault();

  doRender = false;
  document.getElementById('start-stop').innerText = 'Start';
  document.getElementById('change').disabled = false;
  renderPixelsTex = blankGraph();
  display(renderPixelsTex);
}

display(renderPixelsTex);
window.requestAnimationFrame(doDraw);

setInterval(() => {
  document.getElementById('frames').innerHTML = `
  ${renders} renders per second <br>
  ${frames} fps <br>
  time step per render: ${speed} <br>
  rendersPerFrame: ${rendersPerFrame} <br>
  dimensions: ${dim} x ${dim} <br>
  coordScaleFactor: ${coordScaleFactor} <br>
  pointSize: ${pointSize} <br>
`;
  frames = 0;
  renders = 0;
}, 1000)