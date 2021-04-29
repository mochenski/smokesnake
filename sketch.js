const MAX_CANVAS_WIDTH = 500
const MAX_CANVAS_HEIGHT = MAX_CANVAS_WIDTH
const MAX_NUMBER_OF_CELLS = 3

const CELL_SIZE = (MAX_CANVAS_WIDTH / MAX_NUMBER_OF_CELLS)
const ARRAY_TO_SELECT_RANDOM_CELL = [...Array(MAX_NUMBER_OF_CELLS).keys()]

var snake = null;
var keyCodePress = "ArrowRight";
var time = 0;
var food = null;
var state = "";

var speedSlider;

var title;
var instructions;
var createdBy;


function start() {
  title.style('display', 'none')
  instructions.style('display', 'none')
  createdBy.style('display', 'none')
  state = "STARTED";
}

function restart() {
  snake.body = [{ x: 0, y: floor(MAX_NUMBER_OF_CELLS / 2), food: false, new: false },
            { x: - 1 + 0, y: floor(MAX_NUMBER_OF_CELLS / 2), food: false, new: false },
            { x: - 2 + 0, y: floor(MAX_NUMBER_OF_CELLS / 2), food: false, new: false }]
  snake.currentDirection = function () { this.Right() }
  title.style('display', 'none')
  instructions.style('display', 'none')
  createdBy.style('display', 'none')
  snake.moved = false
  state = "STARTED"
};

function startRestart() {
  if(state == "FINISHED") restart()
  if(state == "") start()
}

function gameOver() {
  let head = snake.body[0]
  let element = snake.body.slice(1, snake.body.length).find(element => (element.x == head.x && element.y == head.y && !head.new));
  return element ? true : false;
}

function gameWin() {
  let array_of_slices = snake.body.filter(element => (element.food == false))
  console.log((array_of_slices.length) , (MAX_NUMBER_OF_CELLS * MAX_NUMBER_OF_CELLS) - 3, array_of_slices)
  if ((array_of_slices.length) >= (MAX_NUMBER_OF_CELLS * MAX_NUMBER_OF_CELLS) - 1) {
    end("Parabéns!!! Você ganhou")
  }
}

function end(message = "GameOver") {
  state = "FINISHED"
  showEndGameMessage(message)
}

function createGameStructure() {
  snake = createSnake();
  snake.draw();
  document.addEventListener('keydown', (event) => {
    allowedKeys = ['ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowRight']
    if (allowedKeys.includes(event.key)) {
      snake[event.key]()
    }
  })  
}

function createSnake() {
  return {
    body: [{ x: 0, y: floor(MAX_NUMBER_OF_CELLS / 2), food: false, new: false },
            { x: - 1 + 0, y: floor(MAX_NUMBER_OF_CELLS / 2), food: false, new: false },
            { x: - 2 + 0, y: floor(MAX_NUMBER_OF_CELLS / 2), food: false, new: false }],
    
    ArrowUp: function() { if(this.moved) {this.currentDirection = (this.currentDirection == this.Down? this.Down :this.Up); this.moved = false}},
    ArrowDown: function() { if(this.moved) {this.currentDirection = (this.currentDirection == this.Up? this.Up :this.Down); this.moved = false}},
    ArrowRight: function() { if(this.moved) {this.currentDirection = (this.currentDirection == this.Left? this.Left :this.Right); this.moved = false}},
    ArrowLeft: function() { if(this.moved) {this.currentDirection = (this.currentDirection == this.Right? this.Right :this.Left); this.moved = false}},
    
    Up: function() { if(!this.isNextStepAllowed(this.body[0].x,this.body[0].y-1)) return; this.body.unshift({x:this.body[0].x ,y: this.body[0].y-1, food: false}); this.body.pop(); this.moved && (this.currentDirection = (this.Up)); this.draw()},
    Down: function() { if(!this.isNextStepAllowed(this.body[0].x,this.body[0].y+1)) return; this.body.unshift({x:this.body[0].x ,y: this.body[0].y+1, food: false}); this.body.pop(); this.moved && (this.currentDirection = (this.Down)); this.draw()},
    Right: function() { if(!this.isNextStepAllowed(this.body[0].x+1,this.body[0].y)) return; this.body.unshift({x:this.body[0].x+1 ,y: this.body[0].y, food: false}); this.body.pop(); this.moved && (this.currentDirection = (this.Right)); this.draw()},
    Left: function () { if(!this.isNextStepAllowed(this.body[0].x - 1,this.body[0].y)) return; this.body.unshift({ x: this.body[0].x - 1, y: this.body[0].y, food: false}); this.body.pop(); this.moved && (this.currentDirection = (this.Left)); this.draw()},
    currentDirection: function () { this.Right() },

    isNextStepAllowed: function(x, y) { return (x>=0 && y>=0) && (x<MAX_NUMBER_OF_CELLS && y<MAX_NUMBER_OF_CELLS)},

    isEatingAllowed: function () { return (this.body[0].x == food.x && this.body[0].y == food.y) },

    moved: false,
    move: function () { this.currentDirection(); this.moved = true },

    eat: function () { this.body.unshift({ ...this.body[0], food: true }); this.body[0].new = true; food = null; this.draw()},

    draw: function () {
      background(144)
      let sliceWithFood = this.body.filter(value => value.food)
      let sliceWithNoFood = this.body.filter(value => !value.food)
      
      noFill()
      strokeWeight(10)
      strokeJoin(ROUND)
      beginShape(LINES)
      sliceWithNoFood.slice(1, sliceWithNoFood.length).forEach((slice, index) => {
        stroke(floor(map(index, 0, sliceWithNoFood.length, 0, 255)))
        vertex(slice.x * CELL_SIZE + CELL_SIZE / 2 , slice.y * CELL_SIZE + CELL_SIZE / 2 );
      })
      endShape()

      beginShape(LINES)
      sliceWithNoFood.forEach((slice, index) => {
        stroke(floor(map(index, 0, sliceWithNoFood.length, 0, 255)))
        vertex(slice.x * CELL_SIZE + CELL_SIZE / 2 , slice.y * CELL_SIZE + CELL_SIZE / 2 );
      })
      stroke(255)
      endShape()

      noStroke(0)
      fill(0)
      ellipse(sliceWithNoFood[0].x * CELL_SIZE + CELL_SIZE / 2, sliceWithNoFood[0].y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 1.5)

      fill(180)
      sliceWithFood.forEach(slice => {
        ellipse(slice.x * CELL_SIZE + CELL_SIZE / 2, slice.y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 2)
      })
    }
  }
}

async function createFood() {  
  while (!food && state != "FINISHED") {
    let x = random([...Array(MAX_NUMBER_OF_CELLS).keys()]);
    let y = random([...Array(MAX_NUMBER_OF_CELLS).keys()]);
    let possibleFood = { x, y }
    if (!snake.body.some(item => (item.x == possibleFood.x && item.y == possibleFood.y))) 
      food = possibleFood;
    gameWin()
    gameOver() && end()
  }
}

function drawFood() {
  fill(255, 0, 0)
  ellipse(food.x * CELL_SIZE + CELL_SIZE / 2, food.y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 1.5)
}

function showStartGameMessage() {

  title = createDiv('Smoke Snake');
  title.style('font-size', '40px');
  title.style('text-align', 'center');
  title.style('width', `${MAX_CANVAS_WIDTH}px`);
  title.position(0, MAX_CANVAS_HEIGHT / 2.5);

  instructions = createDiv('Use as setas para movimentar');
  instructions.style('font-size', '20px');
  instructions.style('text-align', 'center');
  instructions.style('width', `${MAX_CANVAS_WIDTH}px`);
  instructions.position(0, MAX_CANVAS_HEIGHT / 2);

  createdBy = createDiv('Criado por: Luis Eduardo Mochenski Floriano');
  createdBy.style('font-size', '16px');
  createdBy.style('text-align', 'center');
  createdBy.style('width', `${MAX_CANVAS_WIDTH}px`);
  createdBy.position(0, MAX_CANVAS_HEIGHT / 1.8);
}

function showEndGameMessage(message) {
  title = createDiv(message);
  title.style('font-size', '40px');
  title.style('text-align', 'center');
  title.style('width', `${MAX_CANVAS_WIDTH}px`);
  title.position(0, MAX_CANVAS_HEIGHT / 2.5);

  instructions = createDiv('Clique em start para jogar novamente');
  instructions.style('font-size', '20px');
  instructions.style('text-align', 'center');
  instructions.style('width', `${MAX_CANVAS_WIDTH}px`);
  instructions.position(0, MAX_CANVAS_HEIGHT / 2);

  createdBy = createDiv('Criado por: Luis Eduardo Mochenski Floriano');
  createdBy.style('font-size', '16px');
  createdBy.style('text-align', 'center');
  createdBy.style('width', `${MAX_CANVAS_WIDTH}px`);
  createdBy.position(0, MAX_CANVAS_HEIGHT / 1.8);
}

function setup() {
  createGameStructure();
  createCanvas(MAX_CANVAS_WIDTH, MAX_CANVAS_HEIGHT);
  background(144);
  noStroke();
  speedSlider = createSlider(1, 50, 20);
  button = createButton('Start / Restart');
  button.mousePressed(startRestart);
  showStartGameMessage()
}

function draw() {
  if(state == "STARTED"){
    if (time >= 1) {
      snake.move();
      console.log(snake.body.length)
      if (food === null) {
        createFood();
      }
      drawFood()
      snake.isEatingAllowed() && snake.eat()
      time = 0;
    }
    time += speedSlider.value() / 100;
    gameOver() && end()
    gameWin()
  }
}