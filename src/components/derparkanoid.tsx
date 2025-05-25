import { createEffect } from "solid-js";
import p5 from "p5";
import { uncheckedClamp } from "kdim";

import { Colors } from "../lib/utils";
import "./deparkanoid.css";

const BALL_SIZE = 22;
const BALL_SPEED = 10;

const PADDLE_WIDTH = 99;
const PADDLE_HEIGHT = 22;
const PADDLE_SPEED = 16;

const BRICK_WIDTH = 80;
const BRICK_HEIGHT = 22;
const BRICK_SHADOW_THICKNESS = 3;
const BRICK_SCORE = 50;

export function Deparkanoid() {
  let el: HTMLCanvasElement;
  let font: p5.Font;
  let canv: p5.Renderer;
  let paddle: Paddle;
  let ball: Ball;
  let bricks: Brick[] = [];
  let ui: UI;
  let score = 0;

  let enableGame = false;
  let enableSounds = false;
  let soundBounce: p5.MediaElement;
  let soundBreak: p5.MediaElement;
  let soundDie: p5.MediaElement;
  let ballImage: p5.Image;
  let paddleImage: p5.Image;
  let autoPlay = false;

  function game(p: p5) {
    p.preload = () => {
      font = p.loadFont("/assets/DepartureMono-Regular.otf");
      soundBounce = p.createAudio("/assets/2.mp3");
      soundBreak = p.createAudio("/assets/5.mp3");
      soundDie = p.createAudio("/assets/6.mp3");
      ballImage = p.loadImage("/assets/ball.png");
      paddleImage = p.loadImage("/assets/paddle.png");
    };

    p.setup = () => {
      canv = p.createCanvas(880, 600, p.P2D, el);
      paddle = new Paddle(p);
      ball = new Ball(p);
      ui = new UI(p);

      p.imageMode(p.CENTER);
      p.textFont(font);
      p.background(Colors.carbon);
      p.fill(Colors.pumpkin);
      p.noStroke();

      reset(p);

      canv.mouseClicked(() => {
        enableGame = true;
        ball.reset();
        return false;
      });
      canv.touchStarted(() => {
        enableGame = true;
        return false;
      });
      window.addEventListener("keypress", (e) => {
        if (e.key === " ") {
          enableGame = true;
          ball.reset();
        }
        if (e.key === "≥" && e.altKey) {
          autoPlay = !autoPlay;
        }
        if (e.key === "÷" && e.altKey) {
          enableSounds = !enableSounds
        }
      });
      el.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        enableGame = false;
        ball.reset();
        reset(p);
      });
    };

    p.draw = () => {
      p.background(Colors.carbon);

      if (bricks.length === 0) {
        p.fill(Colors.amber);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(88);
        p.text("YOU WIN", p.width / 2, 244);
        if (performance.now() % 1000 < 500) {
          p.fill(Colors.pumpkin);
          p.textSize(33);
          p.text("RIGHT CLICK TO INSERT COIN", p.width / 2 + 8, 328);
        }
        return;
      }

      paddle.show();

      if (autoPlay) {
        paddle.automove(ball);
      } else {
        paddle.move();
      }

      ball.show();
      if (enableGame) {
        ball.move();
        ball.checkEdges();
        ball.checkPaddle(paddle);
      }

      for (let brick of bricks) {
        brick.show();
      }
      p.noStroke();

      ball.checkBricks(bricks);
      ui.show();
    };
  }

  function reset(p: p5) {
    score = 0;
    bricks = [
      // LEFT ANTENNA
      new Brick(
        p,
        2 * BRICK_WIDTH,
        0 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.dark),
      new Brick(
        p,
        2 * BRICK_WIDTH,
        1 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.dark),
      new Brick(
        p,
        3 * BRICK_WIDTH,
        2 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.dark),
      new Brick(
        p,
        3 * BRICK_WIDTH,
        3 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.dark),

      // RIGHT ANTENNA
      new Brick(
        p,
        8 * BRICK_WIDTH,
        0 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.dark),
      new Brick(
        p,
        8 * BRICK_WIDTH,
        1 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.dark),
      new Brick(
        p,
        7 * BRICK_WIDTH,
        2 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.dark),
      new Brick(
        p,
        7 * BRICK_WIDTH,
        3 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.dark),

      // LEFT EYE
      new Brick(
        p,
        3 * BRICK_WIDTH,
        6 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.dark),
      new Brick(
        p,
        3 * BRICK_WIDTH,
        7 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.dark),

      // RIGHT EYE
      new Brick(
        p,
        7 * BRICK_WIDTH,
        6 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.dark),
      new Brick(
        p,
        7 * BRICK_WIDTH,
        7 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.dark),

      // BODY
      new Brick(
        p,
        2 * BRICK_WIDTH,
        4 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        3 * BRICK_WIDTH,
        4 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        4 * BRICK_WIDTH,
        4 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        5 * BRICK_WIDTH,
        4 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        6 * BRICK_WIDTH,
        4 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        7 * BRICK_WIDTH,
        4 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        8 * BRICK_WIDTH,
        4 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),

      new Brick(
        p,
        2 * BRICK_WIDTH,
        5 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        3 * BRICK_WIDTH,
        5 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        4 * BRICK_WIDTH,
        5 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        5 * BRICK_WIDTH,
        5 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        6 * BRICK_WIDTH,
        5 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        7 * BRICK_WIDTH,
        5 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        8 * BRICK_WIDTH,
        5 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),

      new Brick(
        p,
        1 * BRICK_WIDTH,
        6 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        2 * BRICK_WIDTH,
        6 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        4 * BRICK_WIDTH,
        6 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        5 * BRICK_WIDTH,
        6 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        6 * BRICK_WIDTH,
        6 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        8 * BRICK_WIDTH,
        6 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        9 * BRICK_WIDTH,
        6 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),

      new Brick(
        p,
        1 * BRICK_WIDTH,
        7 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        2 * BRICK_WIDTH,
        7 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        4 * BRICK_WIDTH,
        7 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        5 * BRICK_WIDTH,
        7 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        6 * BRICK_WIDTH,
        7 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        8 * BRICK_WIDTH,
        7 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        9 * BRICK_WIDTH,
        7 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),

      new Brick(
        p,
        0 * BRICK_WIDTH,
        8 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        1 * BRICK_WIDTH,
        8 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        2 * BRICK_WIDTH,
        8 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        3 * BRICK_WIDTH,
        8 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        4 * BRICK_WIDTH,
        8 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        5 * BRICK_WIDTH,
        8 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        6 * BRICK_WIDTH,
        8 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        7 * BRICK_WIDTH,
        8 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        8 * BRICK_WIDTH,
        8 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        9 * BRICK_WIDTH,
        8 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        10 * BRICK_WIDTH,
        8 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),

      new Brick(
        p,
        0 * BRICK_WIDTH,
        9 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        1 * BRICK_WIDTH,
        9 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        2 * BRICK_WIDTH,
        9 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        3 * BRICK_WIDTH,
        9 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        4 * BRICK_WIDTH,
        9 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        5 * BRICK_WIDTH,
        9 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        6 * BRICK_WIDTH,
        9 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        7 * BRICK_WIDTH,
        9 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        8 * BRICK_WIDTH,
        9 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        9 * BRICK_WIDTH,
        9 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        10 * BRICK_WIDTH,
        9 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),

      new Brick(
        p,
        0 * BRICK_WIDTH,
        10 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        1 * BRICK_WIDTH,
        10 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        2 * BRICK_WIDTH,
        10 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        3 * BRICK_WIDTH,
        10 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        4 * BRICK_WIDTH,
        10 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        5 * BRICK_WIDTH,
        10 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        6 * BRICK_WIDTH,
        10 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        7 * BRICK_WIDTH,
        10 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        8 * BRICK_WIDTH,
        10 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        9 * BRICK_WIDTH,
        10 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        10 * BRICK_WIDTH,
        10 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),

      new Brick(
        p,
        0 * BRICK_WIDTH,
        11 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        1 * BRICK_WIDTH,
        11 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        2 * BRICK_WIDTH,
        11 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        3 * BRICK_WIDTH,
        11 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        4 * BRICK_WIDTH,
        11 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        5 * BRICK_WIDTH,
        11 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        6 * BRICK_WIDTH,
        11 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        7 * BRICK_WIDTH,
        11 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        8 * BRICK_WIDTH,
        11 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        9 * BRICK_WIDTH,
        11 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        10 * BRICK_WIDTH,
        11 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),

      new Brick(
        p,
        0 * BRICK_WIDTH,
        12 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        1 * BRICK_WIDTH,
        12 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        2 * BRICK_WIDTH,
        12 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        8 * BRICK_WIDTH,
        12 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        9 * BRICK_WIDTH,
        12 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        10 * BRICK_WIDTH,
        12 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),

      new Brick(
        p,
        0 * BRICK_WIDTH,
        13 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        2 * BRICK_WIDTH,
        13 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        8 * BRICK_WIDTH,
        13 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        10 * BRICK_WIDTH,
        13 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),

      new Brick(
        p,
        3 * BRICK_WIDTH,
        14 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        4 * BRICK_WIDTH,
        14 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        6 * BRICK_WIDTH,
        14 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        7 * BRICK_WIDTH,
        14 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),

      new Brick(
        p,
        3 * BRICK_WIDTH,
        15 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        4 * BRICK_WIDTH,
        15 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        6 * BRICK_WIDTH,
        15 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
      new Brick(
        p,
        7 * BRICK_WIDTH,
        15 * BRICK_HEIGHT,
        BRICK_WIDTH,
        BRICK_HEIGHT,
      ).color(Colors.smoke),
    ];

    window.gtag("event", "deparkanoid_reset", { score });
  }

  class Paddle {
    p: p5;
    width: number;
    height: number;
    x: number;
    y: number;
    isMovingLeft: boolean;
    isMovingRight: boolean;

    constructor(p: p5) {
      this.p = p;
      this.width = PADDLE_WIDTH;
      this.height = PADDLE_HEIGHT;
      this.x = p.width / 2 - this.width / 2;
      this.y = p.height - this.height;
      this.isMovingLeft = false;
      this.isMovingRight = false;

      canv.mouseMoved((e) => {
        this.x = uncheckedClamp(
          PADDLE_HEIGHT / 2,
          p.width - this.width - PADDLE_HEIGHT / 2,
          e.offsetX - PADDLE_WIDTH / 2,
        );
        return false;
      });
      canv.touchMoved((e) => {
        this.x = uncheckedClamp(
          PADDLE_HEIGHT / 2,
          p.width - this.width - PADDLE_HEIGHT / 2,
          e.offsetX - PADDLE_WIDTH / 2,
        );
        return false;
      });
    }

    show() {
      this.p.imageMode(this.p.CORNER);
      this.p.image(paddleImage, this.x, this.y, PADDLE_WIDTH, PADDLE_HEIGHT);
    }

    move() {
      if (this.p.keyIsDown(this.p.LEFT_ARROW) && this.x > PADDLE_HEIGHT / 2) {
        this.x -= PADDLE_SPEED;
      } else if (
        this.p.keyIsDown(this.p.RIGHT_ARROW) &&
        this.x < this.p.width - this.width - PADDLE_HEIGHT / 2
      ) {
        this.x += PADDLE_SPEED;
      }
      this.x = uncheckedClamp(
        PADDLE_HEIGHT / 2,
        this.p.width - this.width - PADDLE_HEIGHT / 2,
        this.x,
      );
    }

    automove(ball: Ball) {
      this.x = uncheckedClamp(
        PADDLE_HEIGHT / 2,
        this.p.width - this.width - PADDLE_HEIGHT / 2,
        ball.x - this.width / 2,
      );
    }
  }

  class Ball {
    p: p5;
    radius: number;
    x: number;
    y: number;
    xSpeed: number;
    ySpeed: number;

    constructor(p: p5) {
      this.p = p;
      this.radius = BALL_SIZE / 2;
      this.x = p.width / 2;
      this.y = p.height / 2;
      this.xSpeed = 5;
      this.ySpeed = 5;
    }

    show() {
      this.p.imageMode(this.p.CENTER);
      this.p.image(ballImage, this.x, this.y, BALL_SIZE, BALL_SIZE);
    }

    move() {
      this.x += this.xSpeed;
      this.y += this.ySpeed;
    }

    checkEdges() {
      if (this.x < this.radius || this.x > this.p.width - this.radius) {
        this.x = uncheckedClamp(
          this.radius,
          this.p.width - this.radius,
          this.x,
        );
        this.xSpeed *= -1;
      }
      if (this.y < this.radius) {
        this.y = uncheckedClamp(
          this.radius,
          this.p.height - this.radius,
          this.y,
        );
        this.ySpeed *= -1;
      }
      if (this.y > this.p.height) {
        enableGame = false;
        if (enableSounds) {
          soundDie.stop();
          soundDie.play();
        }
        this.reset();
      }
    }

    checkPaddle(paddle: Paddle) {
      if (
        this.y + this.radius > paddle.y &&
        this.x > paddle.x &&
        this.x < paddle.x + paddle.width
      ) {
        this.ySpeed *= -1;
        this.y = paddle.y - this.radius;

        if (enableSounds) {
          soundBounce.stop();
          soundBounce.play();
        }
      }
    }

    reset() {
      this.x = this.p.width / 2;
      this.y = (this.p.height * 5) / 9;
      const vector = new p5.Vector(Math.random() * 2 - 1, Math.random())
        .normalize()
        .mult(BALL_SPEED);
      this.xSpeed = vector.x;
      this.ySpeed = vector.y;
      window.gtag("event", "deparkanoid_start", { score });
    }

    checkBricks(bricks: Brick[]) {
      let collision = false;
      for (let i = bricks.length - 1; i >= 0; i--) {
        const brick = bricks[i];
        if (
          this.x + this.radius > brick.x &&
          this.x - this.radius < brick.x + brick.w &&
          this.y - this.radius < brick.y + brick.h &&
          this.y + this.radius > brick.y
        ) {
          collision ||= true;
          score += BRICK_SCORE;
          bricks.splice(i, 1);
          if (enableSounds) {
            soundBreak.stop();
            soundBreak.play();
          }
        }
      }
      if (collision) this.ySpeed *= -1;
    }
  }

  class Brick {
    p: p5;
    c: p5.Color | string = Colors.dark;
    x: number;
    y: number;
    w: number;
    h: number;

    constructor(p: p5, x: number, y: number, w: number, h: number) {
      this.p = p;
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
    }

    color(c: p5.Color | string): this {
      this.c = c;
      return this;
    }

    show() {
      this.p.strokeWeight(4);
      this.p.stroke(Colors.carbon);
      this.p.fill(this.c.toString());
      this.p.rect(this.x, this.y, this.w, this.h);
      this.p.noStroke();
      this.p.fill(255, 255, 255, 80);
      this.p.rect(this.x + 2, this.y + 2, this.w - 4, BRICK_SHADOW_THICKNESS);
      this.p.rect(
        this.x + 2,
        this.y + 2 + BRICK_SHADOW_THICKNESS,
        BRICK_SHADOW_THICKNESS,
        this.h - 4 - BRICK_SHADOW_THICKNESS,
      );
      this.p.fill(51, 51, 51);
      this.p.rect(
        this.x + 2,
        this.y + this.h - 5,
        this.w - 4,
        BRICK_SHADOW_THICKNESS,
      );
      this.p.rect(
        this.x + this.w - 5,
        this.y + 2,
        BRICK_SHADOW_THICKNESS,
        this.h - 4 - BRICK_SHADOW_THICKNESS,
      );
    }
  }

  class UI {
    p: p5;

    constructor(p: p5) {
      this.p = p;
    }

    show() {
      this.p.fill(Colors.pumpkin);
      this.p.textSize(32);
      this.p.textAlign(this.p.CENTER, this.p.CENTER);
      this.p.fill(Colors.cement);
      this.p.textSize(16);
      this.p.textAlign(this.p.LEFT, this.p.TOP);
      this.p.text(`SCORE\n${score.toString().padStart(5, "0")}`, 0, 0);
    }
  }

  createEffect(() => new p5(game));
  return (
    <section id="deparkanoid" tabindex={0}>
      <p class="comment">
        ░{"  "}AND OF COURSE, DEPARTURE MONO IS PERFECT
        <br />░{"  "}FOR YOUR 8-BIT VIDEO GAME OR ASCII ART
      </p>
      <canvas ref={el!}></canvas>
    </section>
  );
}
