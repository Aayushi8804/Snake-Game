const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let speed = 7;

let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
let headX = 10;
let headY = 10;

const snakeParts = [];
let tailLength = 1;

let appleX = 5;
let appleY = 5;

let xVelocity = 0;
let yVelocity = 0;

let score = 0;

const gulpSound = new Audio("../assets/gulp.mp3");
const outroSound = new Audio("../assets/Outro.mp3");

//Game Loop
function drawGame() {
  changeSnakePosition();
  let result = isGameOver();
  if (result) {
    return;
  }
  clearScreen();

  checkAppleCollison();
  drawApple();
  drawSnake();

  drawScore();
  if (score > 5) {
    speed = 9;
  }
  if (score > 10) {
    speed = 11;
  }
  setTimeout(drawGame, 1000 / speed);
}
function isGameOver() {
  let gameOver = false;

  if (yVelocity === 0 && xVelocity === 0) {
    return false;
  }
  //Walls
  if (headX < 0) {
    gameOver = true;
  } else if (headX === tileCount) {
    gameOver = true;
  } else if (headY < 0) {
    gameOver = true;
  } else if (headY === tileCount) {
    gameOver = true;
  }

  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    if (part.x === headX && part.y === headY) {
      gameOver = true;
      break;
    }
  }

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "50px Verdana";

    if (gameOver) {
      ctx.fillStyle = "white";
      ctx.font = "50px Verdana";

      var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);

      gradient.addColorStop("0", "orange");
      gradient.addColorStop("0.5", "orangered");
      gradient.addColorStop("1.0", "red");
      //Fill with gradient
      ctx.fillStyle = gradient;

      ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);

    }
    outroSound.play();

    ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
    alert("Game Over. Press any key to play again!");
  }
  return gameOver;
}
function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "10px Verdana";
  ctx.fillText("Score " + score, canvas.width - 50, 10);
}
function clearScreen() {
  ctx.fillStyle = "black";
  // ctx.fillStyle = createLinearGradient(rgb(102, 148, 102), rgb(192, 192, 170));
  var gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "rgb(102, 148, 102)");
  gradient.addColorStop(1, "rgb(192, 192, 170)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function drawSnake() {

  ctx.fillStyle = '#568203';
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }

  snakeParts.push(new SnakePart(headX, headY)); //Put an item at the end of the list next to the head
  while (snakeParts.length > tailLength) {
    snakeParts.shift(); //Remove the further item from the snake parts if have more than our tail size
  }
  ctx.fillStyle = '#7FFF00';
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);

}

function changeSnakePosition() {
  headX = headX + xVelocity;
  headY = headY + yVelocity;
}

function drawApple() {
  ctx.fillStyle = "red";
  const radius = tileSize / 2; // Assuming tileSize is the diameter of the apple
  const centerX = (appleX * tileCount + radius); // Calculate center X
  const centerY = (appleY * tileCount + radius); // Calculate center Y

  // Draw apple body (circle)
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  // Draw apple stem
  const stemWidth = 2;
  const stemHeight = 6;
  const stemX = centerX;
  const stemY = centerY - radius - stemHeight;
  ctx.fillStyle = "green"; // Assuming the stem color is green
  ctx.fillRect(stemX - stemWidth / 2, stemY, stemWidth, stemHeight);
}

function checkAppleCollison() {
  if (appleX == headX && appleY == headY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    score++;
    gulpSound.play();
  }
}
document.body.addEventListener('keydown', keyDown);

function keyDown(event) {
  //UP arrow
  if (event.keyCode == 38) {
    if (yVelocity == 1)
      return;
    yVelocity = -1;
    xVelocity = 0;
  }
  //DOWN arrow
  if (event.keyCode == 40) {
    if (yVelocity == -1)
      return;
    yVelocity = 1;
    xVelocity = 0;
  }
  //LEFT arrow
  if (event.keyCode == 37) {
    if (xVelocity == 1)
      return;
    yVelocity = 0;
    xVelocity = -1;
  }
  //RIGHT arrow
  if (event.keyCode == 39) {
    if (xVelocity == -1)
      return;
    yVelocity = 0;
    xVelocity = 1;
  }

}
drawGame();