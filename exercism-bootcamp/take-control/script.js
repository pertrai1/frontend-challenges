const ball = document.querySelector(".ball");
const gameArea = document.querySelector(".game-area");
const paddle = document.querySelector(".paddle");

// Ball and paddle dimensions (in percentage)
const ballSize = 4;
const paddleWidth = 15;
const paddleHeight = 2;
const paddleY = 5;

let x = 48;
let y = 7;
let dx = 0.5;
let dy = -0.5;
let paddleX = 50 - paddleWidth / 2; // Center paddle initially
let gameRunning = true;

// Improved collision detection function with angle calculation
function checkPaddleCollision(ballX, ballY, ballDx, ballDy) {
  // Only check collision if ball is moving downward
  if (ballDy >= 0) return null;

  // Calculate ball boundaries
  const ballLeft = ballX;
  const ballRight = ballX + ballSize;
  const ballTop = ballY + ballSize;
  const ballBottom = ballY;

  // Calculate paddle boundaries
  const paddleLeft = paddleX;
  const paddleRight = paddleX + paddleWidth;
  const paddleTop = paddleY + paddleHeight;
  const paddleBottom = paddleY;

  // Check if ball is overlapping with paddle
  const horizontalOverlap = ballRight > paddleLeft && ballLeft < paddleRight;
  const verticalOverlap = ballBottom <= paddleTop && ballTop >= paddleBottom;

  if (horizontalOverlap && verticalOverlap) {
    // Calculate hit position on paddle (0 = left edge, 1 = right edge)
    const ballCenterX = ballX + ballSize / 2;
    const paddleCenterX = paddleX + paddleWidth / 2;
    const relativeHitPos = (ballCenterX - paddleLeft) / paddleWidth;

    return {
      isColliding: true,
      hitPosition: relativeHitPos,
    };
  }

  return null;
}

function gameLoop() {
  if (!gameRunning) return;

  // Write any code you want to happen on every animation frame here
  x += dx;
  y += dy;

  // Wall collision detection (accounting for ball size)
  if (x <= 0 || x >= 100 - ballSize) {
    dx = -dx;
    x = Math.max(0, Math.min(100 - ballSize, x)); // Keep ball within bounds
  }

  if (y >= 100 - ballSize) {
    dy = -dy;
    y = 100 - ballSize; // Keep ball within bounds
  }

  // Improved paddle collision detection with angle-based bouncing
  const paddleCollision = checkPaddleCollision(x, y, dx, dy);
  if (paddleCollision) {
    // Calculate new direction based on hit position
    const hitPos = paddleCollision.hitPosition;

    // Map hit position to angle: center = 0, edges = ±45 degrees
    const maxAngle = 60; // Maximum bounce angle in degrees
    const bounceAngle = (hitPos - 0.5) * maxAngle;

    // Convert angle to radians and calculate new velocity
    const angleRad = (bounceAngle * Math.PI) / 180;
    const speed = Math.sqrt(dx * dx + dy * dy); // Maintain current speed

    // Set new velocity components
    dx = Math.sin(angleRad) * speed;
    dy = Math.abs(Math.cos(angleRad) * speed); // Always bounce upward

    y = paddleY + paddleHeight + 0.5; // Position ball just above paddle
  }

  // Check if ball hits bottom (game over) - only if it's below paddle
  if (y <= 0) {
    gameRunning = false;
    document.body.style.backgroundColor = "#8B0000";
    paddle.style.opacity = "0.2";
    gameArea.style.opacity = "0.2";
    return;
  }

  ball.style.left = x + "%";
  ball.style.bottom = y + "%";
  paddle.style.left = paddleX + "%";

  // Remember to setup the next animation frame before you finish
  requestAnimationFrame(gameLoop);
}

// Mouse movement event listener
gameArea.addEventListener("mousemove", (e) => {
  if (!gameRunning) return;

  const rect = gameArea.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const gameAreaWidth = rect.width;
  const mousePercent = (mouseX / gameAreaWidth) * 100;

  // Keep paddle within bounds (paddle is 15% wide)
  // Center paddle on mouse position, but constrain to game area
  const desiredPaddleX = mousePercent - paddleWidth / 2;
  paddleX = Math.max(0, Math.min(100 - paddleWidth, desiredPaddleX));
});

// This should probably be the final line in your
// program and the one that sets off the gameLoop.
requestAnimationFrame(gameLoop);
