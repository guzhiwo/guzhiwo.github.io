var GAME = {
  pause: false,
  bool: 0,
  loss: false,
  win: false,
  width: 900,
  height: 600,
  fps: 1000 / 60,
  canvasContext: null,
  bg: new Image(),
  audio: false
}
var CAT = {
  x: 600,
  y: GAME.height - 220,
  width: 158,
  height: 185, 
  dy: 0,
  yMax: 50,
  yStep: 10,
  dx: 20,
  player: new Image(),
  audio: new Audio()
}
var SCORE = {
  color: "#778494",
  win: 0,
  loss: 0,
} 
var BUMPS = {
  array: [],
  bump: new Image(),
  hit: false,
  bool: false,
}
var MENU = {
  run: true,
  main: new Image(),
  win: new Image(),
  bool: true,
} 
var RAIN = {
  array: [],
  drop: new Image(),
  audio: new Audio(),
  bool: true,
};
var TIMER = {
  time: 0,
  bump: 35,
};
var RESULT = {
  array: [],
  bool: false,
  }
var BUTTON = new Audio();

var CLEVER = {
  bool: false,
  x: -70,
  y: 280,
  image: new Image(),
}


function draw() { // отрисовка

  context.drawImage(GAME.bg, 0, 0, GAME.width, GAME.height); // фон игры
  for (i in RAIN.array) context.drawImage(RAIN.drop, RAIN.array[i].x, RAIN.array[i].y, 12, 16); // дождь
  context.drawImage(CAT.player, CAT.x, CAT.y, CAT.width, CAT.height);
  
  if (MENU.bool) context.drawImage(MENU.main, 0, 0, GAME.width, GAME.height); // меню  

  if (GAME.pause) { // пауза
    context.fillStyle = 'white';
    context.font = '38px "caveat"';
    context.fillText('Нажмите enter, чтобы продолжить игру.', 120, 320);
    context.fillText('Нажмите escape, чтобы', 120, 80);
    context.fillText('выйти в главное меню.', 120, 140);
  }
  if (GAME.bool && !GAME.loss && !GAME.win) { // игра

    RAIN.audio.play();

    for (i in BUMPS.array) context.drawImage(BUMPS.bump, BUMPS.array[i].x, BUMPS.array[i].y, 30, 40);
    
    context.drawImage(CLEVER.image, CLEVER.x, CLEVER.y); 

    //очки loss, win
    context.font = '20px Verdana';
    context.fillStyle = '#1A1C29';
    context.fillStyle = 'white';
    context.fillText(SCORE.loss, 20, 580);
    context.fillText("/5", 50, 580);
    context.drawImage(BUMPS.bump, 100, 550, 30, 40); 
    context.fillText(Math.floor(SCORE.win), 750, 580);
    context.fillText("/410", 795, 580);
  } 

  if (SCORE.loss >= 5) { // проигрыш
    
    RAIN.audio.pause()
    GAME.loss = true;
    GAME.bool = false;
    BUMPS.bool = false;
    
    CAT.x = 600;

    if (!GAME.bool && GAME.loss && !GAME.win) { 

      context.fillStyle = "#191F2D"
      context.drawImage(MENU.win, 200, 100, 500, 400);
      context.font = '44px "Goblin One"';
      context.fillText('GAME OVER', 260, 170);
      context.fillText(Math.floor(SCORE.win), 490, 360);
      context.font = '40px "caveat"';
      context.fillText('не отчаивайся, ведь Териус всё', 225, 230);
      context.fillText('ещё нуждается в твоей помощи..', 225, 290);
      context.fillText('повторить', 380, 450);
      context.font = '32px "caveat"';
      context.fillText('результат:', 360, 360);
    }
  }

  if (SCORE.win >= 410) { //победа !!!
    win() ;
    if (!GAME.bool && !GAME.loss && GAME.win && !RAIN.bool && RAIN.array.length == 0) { //

      context.fillStyle = "#191F2D"
      context.drawImage(MENU.win, 200, 100, 500, 400);
      context.font = '44px "Goblin One"';
      context.fillText('YOU WON', 300, 170);
      context.font = '32px "Goblin One"';
      context.fillText(Math.floor(SCORE.win), 350, 350);
      context.fillText(Math.floor(SCORE.loss), 630, 350);
      context.font = '32px "caveat"';
      context.fillText('Поздравляю, ты справился с основной ', 220, 222);
      context.fillText('задачей - уберечь Териуса от опасности,', 223, 260);
      context.fillText('возникшей в лесу.', 220, 298);
      context.fillText('новая игра', 390, 450);
      context.font = '32px "caveat"';
      context.fillText('результат:', 220, 350);
      context.fillText('столкновений:', 460, 350);
      context.font = '38px "caveat"';

    }
  }
}

function update() { // физика
  
  TIMER.time++;
  TIMER.time = (TIMER.time >= 60) ? 0 : TIMER.time;

  rain();
  catMove();
  cleverMove();
  bumps();
  score();
}

function play() {
  draw();
  update();
}

function init() { // файлы, запуск
  MENU.main.src = "images/main_menu.png";
  CAT.player.src = "images/cat1.png";
  RAIN.drop.src = "images/rain.png";
  BUMPS.bump.src = "images/bump.png";
  MENU.win.src = "images/menu.png";
  GAME.bg.src = "images/bg.png";

  CAT.audio.src = "audio/meow.mp3";
  RAIN.audio.src = "audio/fon.mp3";
  BUTTON.src = "audio/button.mp3";

  var canvas = document.getElementById("canvas");
  _initCanvas(canvas);
  _initEventsListeners(canvas);
  
  GAME.bg.onload = function(){
    setInterval(play, GAME.fps); 
  }    
}

function _initCanvas(canvas) {
  canvas.width = GAME.width;
  canvas.height = GAME.height;
  context = canvas.getContext("2d");
}

function _initEventsListeners(canvas) { // обработка событий
  document.addEventListener("keydown", _onDocumentKeyDown);
  canvas.addEventListener("mousemove", _onCanvasMouseMove);
  canvas.addEventListener("click", _onCanvasMouseClick);
}

function _onCanvasMouseClick(event) { // клик
  var x = event.x - event.target.offsetLeft;
  var y = event.y - event.target.offsetTop
  if ((GAME.win || GAME.loss) && ( 362 < x && x < 537 && 413 < y && y < 470 ))  {
    BUTTON.play();
    GAME.win = false;
    GAME.loss = false;
    GAME.bool = true; 
    BUMPS.bool = true;
    RAIN.bool = true;  
    SCORE.loss = 0;
    SCORE.win = 0;
  }
  if ((!GAME.bool && !GAME.loss && !GAME.win) && ( 182 < x && x < 415 && 236 < y && y < 302)) {
    BUTTON.play();
    GAME.bool = true;
    MENU.bool = false;
    BUMPS.bool = true;
    RAIN.bool = true;
  }
  if ((!GAME.bool && !GAME.loss && !GAME.win) && ( 182 < x && x < 415 && 337 < y && y < 403)) {
    BUTTON.play();
    MENU.main.src = "images/menu_oper.png";
    MENU.run = false;
  }
  if ((!GAME.bool && !GAME.loss && !GAME.win) && ( 182 < x && x < 415 && 438 < y && y < 504)) {
    BUTTON.play();
    MENU.main.src = "images/menu_about.png";
    MENU.run = false;
  }
}

function _onCanvasMouseMove(event) {  // движение мыши
  if (GAME.bool && !GAME.loss && !GAME.win) {
    CAT.x = event.clientX - event.target.offsetLeft - 85;
  }
}

function _onDocumentKeyDown(event) { // нажатие клавиш

  if (GAME.bool && !GAME.loss && !GAME.win) {
    if (event.key == "ArrowUp") {
      if (CAT.y == 380) {
        CAT.y -= CAT.yMax;
      }
    }
  } 
  if (event.key == "Escape" && !GAME.bool) {
    BUTTON.play();
    MENU.main.src = "images/main_menu.png";
    MENU.run = true;
    CAT.x = 600;
    GAME.bool = false;
    GAME.win = false;
    GAME.loss = false;
    BUMPS.bool = false;
    MENU.bool = true;
    RAIN.bool = true;
    SCORE.loss = 0;
    SCORE.win = 0;
    GAME.pause = false;
  } 
  else if (event.key == "Escape" && GAME.bool) {
    GAME.bool = false;
    RAIN.audio.pause();
    GAME.pause = true;
  }
  if(event.key == "Enter") {
    BUTTON.play();
    if (!GAME.bool && !GAME.loss && !GAME.win && MENU.run) {
      GAME.bool = true;
      BUMPS.bool = true;
      MENU.bool = false;
      RAIN.bool= true;
      GAME.pause = false;
    } 
    else if (!GAME.bool && ((GAME.loss && !GAME.win )||(!GAME.loss && GAME.win && RAIN.array.length == 0))) {
      RAIN.bool= true;
      GAME.loss = false;
      GAME.win = false;
      GAME.bool = true;
      SCORE.loss = 0;
      SCORE.win = 0;
      BUMPS.bool = true;
    } 
  }  
}

// update

function catMove() {

  if (CAT.x < -85) {
    CAT.x = -85;
  } else if(CAT.x + CAT.width > GAME.width + 73) {
    CAT.x = GAME.width - CAT.width -73;
  } 

  CAT.dy = 0;
  CAT.dy += CAT.yStep;
  if (CAT.y + CAT.height >= 565) {
    CAT.dy = 0;
  }
  CAT.y += CAT.dy;
}

function cleverMove() {
  var random = Math.floor(Math.random()*380);
  if (GAME.bool && !GAME.loss && !GAME.win) {
    if (SCORE.win == random && !CLEVER.bool && TIMER.time > 20) {
      CLEVER.bool = true;
    }
    if (CLEVER.bool) CLEVER.x +=2;
    if (GAME.bool && !GAME.loss && !GAME.win ) {
      
      if (TIMER.time >= 30) {
        CLEVER.image.src = "images/clever2.png";
      } else {
        CLEVER.image.src = "images/clever1.png";
      }
      
      if (CLEVER.y + 50 >= CAT.y && CLEVER.x >= CAT.x + 50 && CLEVER.x + 62 < CAT.x + CAT.width) {
        SCORE.win += 10;
        if (SCORE.loss > 0) SCORE.loss--;
        CLEVER.x = -71;
        
        CAT.player.src = "images/cat3.png";
        CAT.audio.play();
        setTimeout(function(){
          CAT.player.src = "images/cat1.png";
        }, 500)  
      }
      if (CLEVER.x > GAME.width) {
        CLEVER.x = -71;
      }
      if (CLEVER.x == -71) {CLEVER.bool = false}
    }
  } else {
    CLEVER.x = -71;
    CLEVER.bool = false;
  }
}

function bumps() {
  if (GAME.bool && !GAME.loss && !GAME.win && BUMPS.bool) { //шишки   
    if (SCORE.win == 100) TIMER.bump = 25;
    if (SCORE.win == (200||300)) TIMER.bump = 19;
    if (SCORE.win == 400) TIMER.bump = 12;

    if (TIMER.time % TIMER.bump*(1||2||3) == 0) { //пополнеение массива
        if(BUMPS.bool){
          BUMPS.array.push({
            x: -200 + Math.random()*1100,
            y:-150,
            dx:Math.random()+1,
            dy:Math.random()*3+5}); 
        }     
      }
    for(i in BUMPS.array) {
      BUMPS.array[i].x = BUMPS.array[i].x + BUMPS.array[i].dx;
      BUMPS.array[i].y = BUMPS.array[i].y + BUMPS.array[i].dy;
      
      if (BUMPS.array[i].y >= 486) {
        BUMPS.array.splice(i,1);
      } 
      if ((BUMPS.array[i].y >= CAT.y) && (BUMPS.array[i].x >= CAT.x + 50) && (BUMPS.array[i].x + 15 < CAT.x + CAT.width)) {

        CAT.player.src = "images/cat2.png";
        BUMPS.hit = true;
        BUMPS.array.splice(i,1);
        CAT.audio.play();

        setTimeout(function(){
          CAT.player.src = "images/cat1.png";
        }, 300)


        SCORE.loss++; 
      }
    
    }
  }
  if (!BUMPS.bool) {
    BUMPS.array = []
  }  
}

function rain() {
  if (RAIN.bool) {
    RAIN.array. push({
      x: -200 + Math.random()*1100,
      y:-20,
      dx:Math.random()+1,
      dy:Math.random()*3+5}); 
    }  
    for(i in RAIN.array) {
      RAIN.array[i].x = RAIN.array[i].x + RAIN.array[i].dx;
      RAIN.array[i].y = RAIN.array[i].y + RAIN.array[i].dy;
      if (RAIN.array[i].y >= 510) RAIN.array.splice(i,1);
    }
}

function score() {
  if (TIMER.time % (20||40) == 0 && (GAME.bool && !GAME.loss && !GAME.win)) { //очки score.win
    SCORE.win += 0.5;
    if (BUMPS.hit) {
      if (SCORE.win > 10) {
        SCORE.win -= 10;
      } else {
        SCORE.win = 0;
      }
      BUMPS.hit = false;
    }
  }
}

function win() {
  RAIN.bool = false;
  BUMPS.bool = false;
  GAME.win = true;
  GAME.bool = false;
}