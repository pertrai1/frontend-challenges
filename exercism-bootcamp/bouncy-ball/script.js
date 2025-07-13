const ball = document.querySelector('.ball');
const gameArea = document.querySelector('.game-area');

let x = 48;
let y = 96;
let dx = 0.5;
let dy = -0.5;

function gameLoop() {
  // Write any code you want to happen on every animation frame here
  x += dx;
  y += dy;

  if (x <= 0 || x >= 96) {
    dx = -dx;
  }

  if (y <= 0 || y >= 96) {
    dy = -dy;
  }

  ball.style.left = x + '%';
  ball.style.bottom = y + '%';


  // Remember to setup the next animation frame before you finish
  requestAnimationFrame(gameLoop);
}

// This should probably be the final line in your
// program and the one that sets off the gameLoop.
requestAnimationFrame(gameLoop);
