const gridSize = 80;
const gridCanvas = document.querySelector('#gridCanvas');
const indicatorCanvas = document.querySelector('#indicatorCanvas');
const gridCtx = gridCanvas.getContext('2d');
const indicatorCtx = indicatorCanvas.getContext('2d');

let gridPos = {
  x: -1,
  y: -1,
};
let gridFirstPos = {
  x: -1,
  y: -1,
};
let mouseDown = false;
let touchDown = false;

function retrieveGridCoord(mouseX, mouseY) {
  const gridX = Math.floor(mouseX / gridSize);
  const gridY = Math.floor(mouseY / gridSize);

  return { x: gridX, y: gridY };
}

function retrieveMouseCoord(gridX, gridY) {
  const mouseX = gridX * gridSize;
  const mouseY = gridY * gridSize;

  return { x: mouseX, y: mouseY };
}

function drawSquare(gridX, gridY, width, height, color) {
  indicatorCtx.fillStyle = color;

  const { x, y } = retrieveMouseCoord(gridX, gridY);

  indicatorCtx.fillRect(x, y, gridSize * width, gridSize * height);
}

function drawIndicators() {
  indicatorCtx.clearRect(0, 0, indicatorCanvas.width, indicatorCanvas.height);

  if (mouseDown || touchDown) {
    const drawStartX = gridPos.x >= gridFirstPos.x ? gridFirstPos.x : gridPos.x;
    const drawStartY = gridPos.y >= gridFirstPos.y ? gridFirstPos.y : gridPos.y;

    const diffX = Math.abs(gridPos.x - gridFirstPos.x) + 1;
    const diffY = Math.abs(gridPos.y - gridFirstPos.y) + 1;

    drawSquare(drawStartX, drawStartY, diffX, diffY, 'yellow');
  } else {
    drawSquare(gridPos.x, gridPos.y, 1, 1, 'blue');
  }
}

function touchStart(e) {
  e.preventDefault();

  touchDown = true;

  const relativeX = e.touches[0].pageX - gridCanvas.offsetLeft - 5;
  const relativeY = e.touches[0].pageY - gridCanvas.offsetTop - 5;

  const { x: gridX, y: gridY } = retrieveGridCoord(relativeX, relativeY);

  gridPos = {
    x: gridX,
    y: gridY,
  };

  gridFirstPos = {
    x: gridX,
    y: gridY,
  };

  requestAnimationFrame(drawIndicators);
}

function touchMove(e) {
  e.preventDefault();

  const relativeX = e.touches[0].pageX - gridCanvas.offsetLeft - 5;
  const relativeY = e.touches[0].pageY - gridCanvas.offsetTop - 5;

  const { x: gridX, y: gridY } = retrieveGridCoord(relativeX, relativeY);

  gridPos = {
    x: gridX,
    y: gridY,
  };

  requestAnimationFrame(drawIndicators);
}

function touchEnd(e) {
  e.preventDefault();

  touchDown = false;
  requestAnimationFrame(drawIndicators);
}

gridCanvas.addEventListener('touchstart', touchStart, false);
gridCanvas.addEventListener('touchend', touchEnd, false);
gridCanvas.addEventListener('touchmove', touchMove, false);

gridCanvas.addEventListener('mousemove', (e) => {
  const relativeX = e.clientX - gridCanvas.offsetLeft - 5;
  const relativeY = e.clientY - gridCanvas.offsetTop - 5;

  const { x: gridX, y: gridY } = retrieveGridCoord(relativeX, relativeY);

  gridPos = {
    x: gridX,
    y: gridY,
  };

  requestAnimationFrame(drawIndicators);
});

gridCanvas.addEventListener('mousedown', () => {
  mouseDown = true;

  gridFirstPos = {
    x: gridPos.x,
    y: gridPos.y,
  };

  requestAnimationFrame(drawIndicators);
});

gridCanvas.addEventListener('mouseup', () => {
  mouseDown = false;
  requestAnimationFrame(drawIndicators);
});

gridCtx.lineWidth = 1.5;

for (let x = gridSize; x < gridCanvas.width; x += gridSize) {
  gridCtx.beginPath();
  gridCtx.moveTo(x, 0);
  gridCtx.lineTo(x, gridCanvas.height);
  gridCtx.stroke();
}

for (let y = gridSize; y < gridCanvas.height; y += gridSize) {
  gridCtx.beginPath();
  gridCtx.moveTo(0, y);
  gridCtx.lineTo(gridCanvas.width, y);
  gridCtx.stroke();
}

drawIndicators();
