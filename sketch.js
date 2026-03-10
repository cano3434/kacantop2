let player;
let balls = [];
let bonusBall;
let menuBalls = [];

let score = 0;
let highScore = Number(localStorage.getItem("highScore")) || 0;

let gameState = "menu"; // menu, playing, gameover
let flashAlpha = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);

  player = {
    x: width / 2,
    y: height - 80,
    size: 60
  };

  createGameBalls();
  bonusBall = makeBonusBall();

  for (let i = 0; i < 20; i++) {
    menuBalls.push(makeMenuBall());
  }

  textAlign(CENTER, CENTER);
}

function draw() {
  background(20);

  if (gameState === "menu") {
    drawMenuBackgroundBalls();
    drawMenuScreen();
    return;
  }

  if (gameState === "playing") {
    updatePlayer();
    drawPlayer();

    updateBalls();
    drawBalls();

    updateBonusBall();
    drawBonusBall();

    checkCollision();
    checkBonusCatch();

    score += 0.05;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }

    fill(255);
    textSize(24);
    text("Skor: " + floor(score), width / 2, 35);
    text("En Yüksek: " + floor(highScore), width / 2, 65);

    drawFlashEffect();
    return;
  }

  if (gameState === "gameover") {
    drawGameOverScreen();
  }
}

function drawMenuScreen() {
  fill(255);
  textSize(46);
  text("Kaçan Top", width / 2, height / 2 - 140);

  textSize(20);
  text("Düşen toplardan kaç", width / 2, height / 2 - 95);

  let bx = width / 2;
  let by = height / 2;
  let bw = 220;
  let bh = 70;

  fill(0, 200, 255);
  rectMode(CENTER);
  rect(bx, by, bw, bh, 18);

  fill(255);
  textSize(28);
  text("START", bx, by - 2);

  textSize(18);
  text("En Yüksek Skor: " + floor(highScore), width / 2, height / 2 + 90);
}

function drawGameOverScreen() {
  fill(255);
  textSize(48);
  text("Game Over", width / 2, height / 2 - 60);

  textSize(26);
  text("Skor: " + floor(score), width / 2, height / 2);
  text("En Yüksek: " + floor(highScore), width / 2, height / 2 + 40);

  let bx = width / 2;
  let by = height / 2 + 120;
  let bw = 240;
  let bh = 70;

  fill(255, 140, 0);
  rectMode(CENTER);
  rect(bx, by, bw, bh, 18);

  fill(255);
  textSize(26);
  text("TEKRAR", bx, by - 2);
}

function drawMenuBackgroundBalls() {
  noStroke();

  for (let b of menuBalls) {
    fill(b.r, b.g, b.bl, 180);
    ellipse(b.x, b.y, b.size);

    b.y += b.speed;

    if (b.y > height + 50) {
      b.y = random(-200, -20);
      b.x = random(width);
      b.size = random(20, 55);
      b.speed = random(1, 4);
    }
  }
}

function updatePlayer() {
  player.x = mouseX;
  player.x = constrain(player.x, player.size / 2, width - player.size / 2);
}

function drawPlayer() {
  rectMode(CENTER);
  noStroke();
  fill(0, 200, 255);
  rect(player.x, player.y, player.size, player.size, 12);
}

function updateBalls() {
  let speedBoost = 1 + score * 0.01;

  for (let b of balls) {
    b.y += b.speed * speedBoost;

    if (b.y > height + 60) {
      b.y = -60;
      b.x = random(width);
      b.size = random(30, 50);
      b.speed = random(3, 7);
    }
  }
}

function drawBalls() {
  noStroke();
  fill(255, 80, 80);

  for (let b of balls) {
    ellipse(b.x, b.y, b.size);
  }
}

function updateBonusBall() {
  bonusBall.y += bonusBall.speed;

  if (bonusBall.y > height + 40) {
    resetBonusBall();
  }
}

function drawBonusBall() {
  noStroke();
  fill(255, 220, 0);
  ellipse(bonusBall.x, bonusBall.y, bonusBall.size);
}

function checkCollision() {
  for (let b of balls) {
    let d = dist(player.x, player.y, b.x, b.y);

    if (d < player.size / 2 + b.size / 2) {
      gameState = "gameover";
    }
  }
}

function checkBonusCatch() {
  let d = dist(player.x, player.y, bonusBall.x, bonusBall.y);

  if (d < player.size / 2 + bonusBall.size / 2) {
    score += 10;
    flashAlpha = 180;
    resetBonusBall();

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }
  }
}

function drawFlashEffect() {
  if (flashAlpha > 0) {
    noStroke();
    fill(255, 255, 180, flashAlpha);
    rectMode(CORNER);
    rect(0, 0, width, height);
    flashAlpha -= 12;
  }
}

function makeBall() {
  return {
    x: random(width),
    y: random(-height),
    size: random(30, 50),
    speed: random(3, 7)
  };
}

function makeBonusBall() {
  return {
    x: random(width),
    y: random(-height * 2, -100),
    size: 25,
    speed: random(4, 6)
  };
}

function makeMenuBall() {
  return {
    x: random(width),
    y: random(-height, height),
    size: random(20, 55),
    speed: random(1, 4),
    r: random(100, 255),
    g: random(80, 220),
    bl: random(80, 255)
  };
}

function resetBonusBall() {
  bonusBall.x = random(width);
  bonusBall.y = random(-height * 2, -100);
  bonusBall.size = 25;
  bonusBall.speed = random(4, 6);
}

function createGameBalls() {
  balls = [];
  for (let i = 0; i < 5; i++) {
    balls.push(makeBall());
  }
}

function startGame() {
  score = 0;
  flashAlpha = 0;
  gameState = "playing";

  player.x = width / 2;
  player.y = height - 80;

  createGameBalls();
  bonusBall = makeBonusBall();
}

function mousePressed() {
  if (gameState === "menu") {
    if (isInsideButton(width / 2, height / 2, 220, 70, mouseX, mouseY)) {
      startGame();
    }
  } else if (gameState === "gameover") {
    if (isInsideButton(width / 2, height / 2 + 120, 240, 70, mouseX, mouseY)) {
      startGame();
    }
  }
}

function touchStarted() {
  if (gameState === "menu") {
    if (isInsideButton(width / 2, height / 2, 220, 70, mouseX, mouseY)) {
      startGame();
    }
  } else if (gameState === "gameover") {
    if (isInsideButton(width / 2, height / 2 + 120, 240, 70, mouseX, mouseY)) {
      startGame();
    }
  }
  return false;
}

function isInsideButton(bx, by, bw, bh, px, py) {
  return (
    px > bx - bw / 2 &&
    px < bx + bw / 2 &&
    py > by - bh / 2 &&
    py < by + bh / 2
  );
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  player.y = height - 80;
}
