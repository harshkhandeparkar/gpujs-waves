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

  speed = Number(document.getElementById('speed').value);
  rendersPerFrame = Number(document.getElementById('rend-per-frame').value);
  pointSize = Number(document.getElementById('pt-size').value);
  coordScaleFactor = Number(document.getElementById('coord-scale-factor').value);

  HTMLWave1Params = [
    Number(document.getElementById('amp-1').value),
    document.getElementById('freq-1').value,
    document.getElementById('wave-no-1').value
  ]
  HTMLWave2Params = [
    Number(document.getElementById('amp-2').value),
    document.getElementById('freq-2').value,
    document.getElementById('wave-no-2').value
  ]

  wave1Params = [
    HTMLWave1Params[0],
    Number(eval(HTMLWave1Params[1].replace('pi', pi))),
    Number(eval(HTMLWave1Params[2].replace('pi', pi)))
  ]
  wave2Params = [
    HTMLWave2Params[0],
    Number(eval(HTMLWave2Params[1].replace('pi', pi))),
    Number(eval(HTMLWave2Params[2].replace('pi', pi)))
  ]
}

document.getElementById('blank').onclick = e => {
  e.preventDefault();

  doRender = false;
  document.getElementById('start-stop').innerText = 'Start';
  document.getElementById('change').disabled = false;
  renderPixelsTex = blankGraph();
  display(renderPixelsTex);
}

// Initialize Waves Data (in HTML)
document.getElementById('amp-1').value = HTMLWave1Params[0];
document.getElementById('freq-1').value = HTMLWave1Params[1];
document.getElementById('wave-no-1').value = HTMLWave1Params[2];
document.getElementById('amp-2').value = HTMLWave2Params[0];
document.getElementById('freq-2').value = HTMLWave2Params[1];
document.getElementById('wave-no-2').value = HTMLWave2Params[2];

display(renderPixelsTex);
window.requestAnimationFrame(doDraw);

setInterval(() => {
  document.getElementById('frames').innerHTML = `
  ${renders} renders per second <br>
  ${frames} fps <br>
  dimensions: ${dim} x ${dim} <br>
`;
  frames = 0;
  renders = 0;
}, 1000)