// Particle Background
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
class Particle {
  constructor(){
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 5 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    this.color = '#00ffea';
  }
  update(){
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.size > 0.2) this.size -= 0.1;
  }
  draw(){
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
function initParticles(){
  particlesArray = [];
  let number = (canvas.width * canvas.height) / 9000;
  for(let i = 0; i < number; i++){
    particlesArray.push(new Particle());
  }
}
function animateParticles(){
  ctx.fillStyle = 'rgba(10,10,31,0.05)';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  for(let i = 0; i < particlesArray.length; i++){
    particlesArray[i].update();
    particlesArray[i].draw();
    if(particlesArray[i].size <= 0.3){
      particlesArray.splice(i,1);
      i--;
      particlesArray.push(new Particle());
    }
  }
  requestAnimationFrame(animateParticles);
}
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
});
initParticles();
animateParticles();

// Music Toggle
const music = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
let isPlaying = false;
musicBtn.addEventListener('click', () => {
  if(isPlaying){
    music.pause();
    musicBtn.textContent = "Music OFF";
    isPlaying = false;
  } else {
    music.play();
    musicBtn.textContent = "Music ON";
    isPlaying = true;
  }
});

// Snake Game
const modal = document.getElementById('snake-modal');
const closeBtn = document.querySelector('.close');
const snakeBtn = document.getElementById('snake-btn');

snakeBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
  startGame();
});
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});
window.addEventListener('click', (e) => {
  if(e.target === modal) modal.style.display = 'none';
});

let canvasSnake = document.getElementById('snake-canvas');
let ctxSnake = canvasSnake.getContext('2d');
let scoreEl = document.getElementById('score');

const grid = 20;
let count = 0;
let score = 0;

let snake = {
  x: 160,
  y: 160,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 4
};
let apple = { x: 320, y: 320 };

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function resetGame() {
  snake.x = 160;
  snake.y = 160;
  snake.cells = [];
  snake.maxCells = 4;
  snake.dx = grid;
  snake.dy = 0;
  score = 0;
  scoreEl.textContent = score;
  apple.x = getRandomInt(0, 20) * grid;
  apple.y = getRandomInt(0, 20) * grid;
}

function startGame() {
  resetGame();
  requestId = requestAnimationFrame(loop);
}

let requestId;
function loop() {
  requestId = requestAnimationFrame(loop);

  if (++count < 8) return; // game speed
  count = 0;

  ctxSnake.clearRect(0,0,canvasSnake.width,canvasSnake.height);

  snake.x += snake.dx;
  snake.y += snake.dy;

  // wall collision = wrap around
  if (snake.x >= canvasSnake.width) snake.x = 0;
  if (snake.x < 0) snake.x = canvasSnake.width;
  if (snake.y >= canvasSnake.height) snake.y = 0;
  if (snake.y < 0) snake.y = canvasSnake.height;

  snake.cells.unshift({ x: snake.x, y: snake.y });
  if (snake.cells.length > snake.maxCells) snake.cells.pop();

  // apple
  ctxSnake.fillStyle = '#ff0055';
  ctxSnake.fillRect(apple.x, apple.y, grid-2, grid-2);

  // snake
  ctxSnake.fillStyle = '#00ffea';
  snake.cells.forEach((cell, index) => {
    ctxSnake.fillRect(cell.x+2, cell.y+2, grid-4, grid-4);
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score += 10;
      scoreEl.textContent = score;
      apple.x = getRandomInt(0, 20) * grid;
      apple.y = getRandomInt(0, 20) * grid;
    }
    // self collision
    for (let i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        resetGame();
      }
    }
  });
}

// Controls
document.addEventListener('keydown', (e) => {
  if ([32,37,38,39,40].indexOf(e.keyCode) > -1) e.preventDefault();

  if (e.key === ' ' && requestId) {
    cancelAnimationFrame(requestId);
    requestId = undefined;
  } else if (e.key === ' ' && !requestId) {
    requestId = requestAnimationFrame(loop);
  }

  if (e.which === 37 || e.key === 'a') { if(snake.dx === 0) { snake.dx = -grid; snake.dy = 0; } }
  if (e.which === 38 || e.key === 'w') { if(snake.dy === 0) { snake.dx = 0; snake.dy = -grid; } }
  if (e.which === 39 || e.key === 'd') { if(snake.dx === 0) { snake.dx = grid; snake.dy = 0; } }
  if (e.which === 40 || e.key === 's') { if(snake.dy === 0) { snake.dx = 0; snake.dy = grid; } }
});
