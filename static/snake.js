const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElem = document.getElementById('score');
const gameOverElem = document.getElementById('gameOver');
const restartBtn = document.getElementById('restartBtn');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{x: 10, y: 10}];
let velocity = {x: 0, y: 0};
let food = {};
let score = 0;
let gameRunning = true;

function placeFood() {
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
  if (snake.some(s => s.x === food.x && s.y === food.y)) {
    placeFood();
  }
}

function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#4caf50';
  snake.forEach(segment => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize-2, gridSize-2);
  });

  ctx.fillStyle = '#f44336';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize-2, gridSize-2);
}

function update() {
  if (!gameRunning) return;

  for (let i = snake.length - 1; i > 0; i--) {
    snake[i] = {...snake[i-1]};
  }

  snake[0].x += velocity.x;
  snake[0].y += velocity.y;

  if (
    snake[0].x < 0 || snake[0].x >= tileCount ||
    snake[0].y < 0 || snake[0].y >= tileCount
  ) {
    endGame();
    return;
  }

  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      endGame();
      return;
    }
  }

  if (snake[0].x === food.x && snake[0].y === food.y) {
    snake.push({...snake[snake.length - 1]});
    score++;
    scoreElem.textContent = 'Score: ' + score;
    placeFood();
  }
}

function endGame() {
  gameRunning = false;
  gameOverElem.style.display = 'block';
}

function gameLoop() {
  update();
  draw();
}

window.addEventListener('keydown', e => {
  switch(e.key) {
    case 'ArrowUp':
      if (velocity.y === 1) break;
      velocity = {x: 0, y: -1};
      break;
    case 'ArrowDown':
      if (velocity.y === -1) break;
      velocity = {x: 0, y: 1};
      break;
    case 'ArrowLeft':
      if (velocity.x === 1) break;
      velocity = {x: -1, y: 0};
      break;
    case 'ArrowRight':
      if (velocity.x === -1) break;
      velocity = {x: 1, y: 0};
      break;
  }
});

restartBtn.addEventListener('click', () => {
  snake = [{x: 10, y: 10}];
  velocity = {x: 0, y: 0};
  score = 0;
  scoreElem.textContent = 'Score: 0';
  gameRunning = true;
  gameOverElem.style.display = 'none';
  placeFood();
});

placeFood();
setInterval(gameLoop, 200);
