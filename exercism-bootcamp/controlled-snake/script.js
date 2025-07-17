const gameArea = document.getElementById("game-area");
const segmentSize = 5;
const edgeMargin = 5;

let snake = [];
let direction = "right";
let nextDirection = "right";
let position = { x: 47.5, y: 47.5 };
let lastTime = 0;
const moveInterval = 100;
let gameOver = false;

function createSegment(x, y) {
  const segment = document.createElement("div");
  segment.className = "snake-segment";
  segment.style.left = `${x}%`;
  segment.style.top = `${y}%`;
  gameArea.appendChild(segment);
  return segment;
}

function initializeSnake() {
  for (let i = 0; i < 5; i++) {
    const segmentX = position.x - i * segmentSize;
    const segment = createSegment(segmentX, position.y);
    snake.push({ element: segment, x: segmentX, y: position.y });
  }
}

function isValidDirection(currentDir, newDir) {
  const opposites = {
    up: "down",
    down: "up",
    left: "right",
    right: "left",
  };
  return opposites[currentDir] !== newDir;
}

function handleKeyPress(event) {
  if (gameOver) return;

  const keyDirections = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
  };

  const newDirection = keyDirections[event.key];
  if (newDirection && isValidDirection(direction, newDirection)) {
    nextDirection = newDirection;
  } else if (newDirection && !isValidDirection(direction, newDirection)) {
    endGame();
  }
}

document.addEventListener("keydown", handleKeyPress);

function moveSnake() {
  if (gameOver) return;

  direction = nextDirection;
  const head = snake[0];
  let newX = head.x;
  let newY = head.y;

  switch (direction) {
    case "right":
      newX += segmentSize;
      break;
    case "down":
      newY += segmentSize;
      break;
    case "left":
      newX -= segmentSize;
      break;
    case "up":
      newY -= segmentSize;
      break;
  }

  // Move the snake first
  for (let i = snake.length - 1; i > 0; i--) {
    snake[i].x = snake[i - 1].x;
    snake[i].y = snake[i - 1].y;
    snake[i].element.style.left = `${snake[i].x}%`;
    snake[i].element.style.top = `${snake[i].y}%`;
  }

  head.x = newX;
  head.y = newY;
  head.element.style.left = `${newX}%`;
  head.element.style.top = `${newY}%`;

  // Check for collisions after moving
  if (checkWallCollision(newX, newY) || checkSelfCollision(newX, newY)) {
    endGame();
    return;
  }
}

function checkWallCollision(x, y) {
  return x < 0 || x > 100 - segmentSize || y < 0 || y > 100 - segmentSize;
}

function checkSelfCollision(x, y) {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === x && snake[i].y === y) {
      return true;
    }
  }
  return false;
}

function endGame() {
  gameOver = true;
  gameArea.style.backgroundColor = "darkred";
}

function gameLoop(currentTime) {
  if (!gameOver && currentTime - lastTime >= moveInterval) {
    moveSnake();
    lastTime = currentTime;
  }

  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  }
}

initializeSnake();
requestAnimationFrame(gameLoop);
