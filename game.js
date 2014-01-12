window.addEventListener('load', function () {
  var canvas;
  var ctx;
  var WIDTH = 600;
  var HEIGHT = 400;
  var lostBalls = 0;
  var collide = function(o1, o2) {
    return o1.x < o2.x + o2.width  && o1.x + o1.width  > o2.x &&
      o1.y < o2.y + o2.height && o1.y + o1.height > o2.y
  }

  /*
   * the ball object can run and draw itself
   */
  var ball = {
    x : 350,
    y : 350,
    r : 10,
    dx : 2,
    dy : 2,
    width: 20,
    height: 20,
    run: function() {
      if (this.x + this.dx > WIDTH || this.x + this.dx < 0) {
        this.dx = -this.dx;
      }
      this.x += this.dx;
      this.y += this.dy;
    },
    draw: function() {
      ctx.fillStyle = "blue";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, true);
      ctx.fill();
    },
    bounce: function() {
      this.dy = -this.dy;
    },
    escaped: function() {
      return this.y > HEIGHT;
    },
    reset: function() {
      this.x = 350;
      this.y = 350;
    }
  };

  /*
   * bricks of the game, they explode when the ball hits
   */
  var Brick = function(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 20;
  }

  Brick.WIDTH = 50;
  Brick.HEIGHT = 20;

  Brick.prototype.draw = function() {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.rect(this.x, this.y, Brick.WIDTH, Brick.HEIGHT);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "black"
    ctx.beginPath();
    ctx.rect(this.x, this.y, Brick.WIDTH, Brick.HEIGHT);
    ctx.closePath();
    ctx.stroke();

  }

  var ROWS = 4;
  var COLUMNS = WIDTH / Brick.WIDTH;

  /*
   * the game has a collection of bricks in the beginning
   */
  var bricks = []
  for (var i=0; i<ROWS; i++) {
    for (var j=0; j<COLUMNS; j++) {
      bricks.push(new Brick(j*Brick.WIDTH, i*Brick.HEIGHT));
    }
  }

  /*
   * the paddle and his methods
   */
  var paddle = {
    width: 100,
    height: 20,
    x: 0,
    y: HEIGHT - 20,
    dx: 10,
    draw: function() {
      ctx.fillStyle = "green";
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.closePath();
      ctx.fill();
    },
    move: function(mousepos) {
      if (mousepos > this.x) {
        this.x = this.x + this.dx;
      } else {
        this.x = this.x - this.dx;
      }
      if (this.x < 0) {
        this.x = 0;
      } else if (this.x + this.width > WIDTH) {
        this.x = WIDTH - this.width;
      }
    }
  }

  function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    }
  }

  function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
  }

  function update () {
    clear();
    ball.draw();
    ball.run();
    if (ball.escaped()) {
      lostBalls++;
      var lost = document.getElementById("lost");
      lost.innerHTML = lostBalls;
      ball.reset();
    }

    for (var i = 0; i < bricks.length; i++) {
      if (collide(bricks[i], ball)) {
        bricks.splice(i, 1);
        ball.bounce();
      } else {
        bricks[i].draw();
      }
    }
    paddle.draw();
    if (collide(paddle, ball)) {
      ball.bounce();
    }

  }

  canvas = document.getElementById("game");
  canvas.addEventListener("mousemove", function(evt) {
    var mouse = getMousePos(evt);
    paddle.move(mouse.x);
  });
  ctx = canvas.getContext("2d");
  return setInterval(update, 10);
}, false);
