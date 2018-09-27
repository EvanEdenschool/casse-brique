var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var paddleX = canvas.width / 2;
var live = 3;
var isGameOver = false;
var score = 0;
var hitSound = new Audio(); hitSound.src = './ballsound.wav';
var dxBall = 8;
var dyBall = -8;
var level = 1;
var rightPressed = false;
var leftPressed = false;
var paddleSpeed = 8;
var level = 1;

const blockWidth = 96;
const blockHeight = 30;
const blockSpacing = 5;
const lineSpacing = 5;
const rectWidth = 155;
const rectHeight= 15;

function playHitSound() {
  setTimeout(() => hitSound.play(), 10);
}

function gameOver() {
  if (live === 0) {
    ctx.font="50px Joystix";
    ctx.fillStyle='white';
    ctx.textAlign="center";
    ctx.fillText('GAME OVER', canvas.width / 2 , 400)
    ctx.font='30px Joystix';
    ctx.fillStyle="white";
    ctx.textAlign="center";
    ctx.fillText('Score ' + score, canvas.width / 2, 300);
    ctx.font="25px Arial";
    ctx.fillStyle='white';
    ctx.textAlign="center";
    ctx.fillText('Reload page to restart', canvas.width / 2, 450);
  }
}

function RectCircleColliding(circle,rect){
    var distX = Math.abs(circle.x - rect.x-rect.w/2);
    var distY = Math.abs(circle.y - rect.y-rect.h/2);

    if (distX > (rect.w / 2 + circle.r)) { return false; }
    if (distY > (rect.h / 2 + circle.r)) { return false; }

    if (distX <= (rect.w / 2)) { return true; }
    if (distY <= (rect.h / 2)) { return true; }

    var dx = distX - rect.w / 2;
    var dy = distY - rect.h / 2;

    return (dx * dx + dy * dy <= (circle.r * circle.r)) && [dx, dy];
}

class Parameters {
  constructor (live) {

  }
  draw (ctx) {
    ctx.font = "25px Arial";
    ctx.fillStyle = 'white';
    ctx.fillText('LIVES:' + live, 10, 30);
    ctx.font = "25px Arial";
    ctx.fillStyle = 'white';
    ctx.fillText('LEVEL ' + level, 400,30);
    ctx.font = "25px Arial";
    ctx.fillStyle = 'white';
    ctx.fillText('SCORE :' + score, 770, 30);

  }
}

class Block {
  constructor (x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  checkCollisions (ballX, ballY, radius) {
    return RectCircleColliding({
      x: ballX,
      y: ballY,
      r: radius,
    }, {
      x: this.x,
      y: this.y,
      w: this.width,
      h: this.height,
    });
  }

  draw (ctx) {
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Paddle {
  constructor (x, width, height) {
    this.x = x;
    this.width = width;
    this.height = height;

  }


  move (x) {
    this.x = x;
  }

  draw (ctx) {
    ctx.fillStyle = 'white';
    ctx.fillRect(this.x - this.width / 2, (canvas.height - this.height) ,this.width ,this.height);
  }
}

class Ball {
  constructor (r = 13) {
    this.x = canvas.width / 2;
    this.y = canvas.height - 30;
    this.r = r;
    this.dx = dxBall;
    this.dy = dyBall;
  }

  move () {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x - this.r <= 0 || this.x + this.r >= canvas.width) {
      this.dx = -this.dx;
    } // colision right and left wall

    if (this.y - this.r <= 0) {
      this.dy = -this.dy;
    } // collision top canvas

    if (this.y + this.r >= canvas.height - paddle.height && this.x >= paddle.x - paddle.width / 2  && this.x <= paddle.x + paddle.width / 2) {
      if (this.y - this.r <= canvas.height) {
          this.dy = -this.dy;
      }
    } // collision paddle

    if (this.y + this.r >= canvas.height) {
      this.resetBall(true);

      if (--live === 0) {
        isGameOver = true;
      }

    }


      for (let i = 0; i < blocks.length;i++) {
        let result = blocks[i].checkCollisions(this.x, this.y, this.r);

        if (result) {
          if (result[0] > (blocks[i].width / 2.5)) {
            this.dx = -this.dx;
          } else {
            this.dy = -this.dy;
          }
          blocks[i].x = -1000;
          playHitSound();
          score++;
        }
      }
  }

  resetBall(inverse) {
    const oldDx = this.dx;
    const oldDy = this.dy;

    this.x = canvas.width / 2;
    this.y = canvas.height - 50;
    this.dy = 0;
    this.dx = 0;

    setTimeout(() => {
      if (inverse) {
      this.dy = -oldDy;
      this.dx = -oldDx;
    }else {
    this.dx = dxBall;
    this.dy = dyBall;
    }
  },1000)
  }

  isAllPasLa() {
      for (let j = 0; j < blocks.length;j++) {
        if (blocks[j].x >= 0) {
          return false;
        }
      }
      dyBall = dyBall -= 1;
      dxBall += 1;
      score += 10;
      live += 1;
      level++;
      paddleSpeed++;
      return true;
    }

  draw(ctx) {
    ball.move();

    ctx.fillStyle = "grey";
    ctx.globalAlpha = this.dx || this.dy ? 1 : 0;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, this.r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    ctx.globalAlpha = 1;

  }
}

function createBlocks(count) {
     blocks = (new Array(count)).fill(null).map((v, i) => {
      return new Block((i % 9) * (blockWidth + blockSpacing), 40 + Math.floor(i / 9) * (blockHeight + lineSpacing), blockWidth, blockHeight)
    })
  }

const ball   = new Ball();
const paddle = new Paddle(paddleX, rectWidth, rectHeight);
const parameters = new Parameters();
let blocks;
createBlocks(27);

document.addEventListener("keydown",   function keyDownHandler(e) {
    if(e.keyCode == 39) {
      rightPressed = true;
    }
    else if(e.keyCode == 37) {
      leftPressed = true;
    }
  }, false);
document.addEventListener("keyup",  function keyUpHandler(e) {
    if (e.keyCode == 39) {
      rightPressed = false;
    }
    else if(e.keyCode == 37) {
      leftPressed = false;
    }
  }, false);

canvas.addEventListener('mousemove', function(e) {
    paddle.move(e.pageX - canvas.offsetLeft);
}, false);

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  gameOver();
  if (isGameOver) {
    return;
  }
  if(rightPressed && paddle.x < canvas.width) {
    paddle.x += paddleSpeed;
  }
  else if(leftPressed && paddle.x > 0) {
    paddle.x -= paddleSpeed;
  }

  if (ball.isAllPasLa()) {
    ball.resetBall(false);
    createBlocks(blocks.length + 9);
  }
  parameters.draw(ctx);
  ball.draw(ctx);
  paddle.draw(ctx);
  blocks.forEach((block) => block.draw(ctx));

  window.requestAnimationFrame(redraw);
}

redraw();
