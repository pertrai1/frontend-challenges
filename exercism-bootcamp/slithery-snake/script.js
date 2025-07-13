const gameArea = document.getElementById('game-area');
const segmentSize = 5;
const edgeMargin = 5;

let snake = [];
let direction = 'right';
let position = { x: 47.5, y: 47.5 };
let lastTime = 0;
const moveInterval = 100;

function createSegment(x, y) {
  const segment = document.createElement('div');
  segment.className = 'snake-segment';
  segment.style.left = `${x}%`;
  segment.style.top = `${y}%`;
  gameArea.appendChild(segment);
  return segment;
}

function initializeSnake() {
  for (let i = 0; i < 5; i++) {
    const segmentX = position.x - (i * segmentSize);
    const segment = createSegment(segmentX, position.y);
    snake.push({ element: segment, x: segmentX, y: position.y });
  }
}

function moveSnake() {
  const head = snake[0];
  let newX = head.x;
  let newY = head.y;

  switch (direction) {
    case 'right':
      newX += segmentSize;
      if (newX >= 100 - edgeMargin - segmentSize) {
        direction = 'down';
        newX = 100 - edgeMargin - segmentSize;
      }
      break;
    case 'down':
      newY += segmentSize;
      if (newY >= 100 - edgeMargin - segmentSize) {
        direction = 'left';
        newY = 100 - edgeMargin - segmentSize;
      }
      break;
    case 'left':
      newX -= segmentSize;
      if (newX <= edgeMargin) {
        direction = 'up';
        newX = edgeMargin;
      }
      break;
    case 'up':
      newY -= segmentSize;
      if (newY <= edgeMargin) {
        direction = 'right';
        newY = edgeMargin;
      }
      break;
  }

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
}

function gameLoop(currentTime) {
  if (currentTime - lastTime >= moveInterval) {
    moveSnake();
    lastTime = currentTime;
  }

  requestAnimationFrame(gameLoop);
}

initializeSnake();
requestAnimationFrame(gameLoop);
