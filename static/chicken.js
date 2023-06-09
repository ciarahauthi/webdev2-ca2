let canvas;
let context;
let fpsInterval = 1000 / 30; 
let now;
let then = Date.now();
let request_id;

let scoreText;
let newGameButton;
let saveButton;
let loadButton;

let Obstacles = [10, 11, 12, 13, 14, 15, 16, 27, 28, 29, 30,35, 36, 37, 44, 46, 80, 92, 94,
    97, 97, 98, 113, 114, 115, 130, 131, 132];

let size = 16;

let died = false;
let won = false;

let player = {
    x : 0, 
    y : 0,
    width : 16,
    height : 16,
    xChange : 3,
    yChange: 3,
    frameX : 0,
    frameY : 0,
    size : 16
}

let enemy = {
    x : 0,
    y : 0,
    width : 16,
    height : 16,
    xChange : 1.5,
    yChange : 1.5,
    frameY : 0,
    frameX : 0,
    size : 16
}
let level = "LVL1";

let score = 0;

let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

let backgroundImage = new Image();
let eggImage = new Image();
let whiteChicken = new Image();
let enemyImage = new Image();

let eggOffset = 0;
let eggUp = true;

let tilesPerRow = 17;
let tileSize = 16;

let levels = new Object();
let background;

let data = {
    "LVL" : level, 
    "score" : score,
    "playerX" : player.x,
    "playerY" : player.y,
    "LVL1" : {
        "eggs" : []
    },
    "LVL2" : {
        "eggs" : []
    },
    "LVL3" : {
        "eggs" : []
    }
}



levels = {
    "LVL1" : {
        "name" : "LVL1",
        "player" : [744, 440],
        "eggs" : [[368, 464],[704, 80], [48, 368]],
        // "enemies" : [[656, 208], [180, 304]],
        "enemies" : [
            {
                x : 656,
                y : 208,
                maxY : 240,
                minY : 176,
                reverse : false,
                frameY : 0
                
            },
            {
                x : 180,
                y: 304,
                maxY : 385,
                minY : 176,
                reverse : false,
                frameY : 0
            }],
        "background" : [
                [30,11,30,14,0,45,11,11,28,30,0,0,0,55,0,0,0,0,0,30,30,10,12,27,28,29,27,28,29,0,30,13,30,27,28,29,45,0,13,30,27,28,29,30,0,13,27,28,29,11],
                [27,28,29,14,30,27,28,28,45,0,0,0,0,55,0,0,0,0,0,0,0,44,46,27,28,29,13,45,13,13,30,30,0,11,45,15,30,30,0,13,0,45,10,12,13,13,0,45,27,28],
                [14,45,0,0,14,11,45,45,0,0,0,0,0,55,0,0,0,0,0,0,0,0,0,0,45,0,13,0,0,30,30,13,27,28,29,15,13,11,30,0,11,30,44,46,0,13,0,13,0,45],
                [0,30,14,30,27,28,29,0,0,0,0,0,0,55,0,0,0,68,0,0,0,0,0,0,0,0,0,0,0,0,0,0,30,45,15,15,27,28,29,27,28,29,0,68,0,0,30,13,0,11],
                [15,0,14,15,0,45,0,15,0,0,0,0,0,55,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,15,0,45,30,30,45,11,0,85,89,86,0,13,27,28],
                [30,0,11,0,30,15,0,0,0,0,0,0,0,55,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,68,0,0,0,0,0,11,30,15,15,11,27,28,29,90,91,105,0,0,30,45],
                [15,27,28,29,15,0,0,0,0,0,0,0,0,73,72,72,72,72,72,72,72,72,72,72,57,0,0,0,0,0,0,0,0,0,27,28,29,15,27,28,29,45,0,102,106,103,0,30,0,13],
                [0,30,45,0,14,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,55,0,0,0,0,0,0,68,0,0,0,45,0,11,0,45,30,11,13,0,0,0,13,0,30,11],
                [14,0,30,0,11,15,0,0,0,0,0,0,0,0,0,0,0,0,0,68,0,0,11,0,55,0,0,0,0,68,0,0,0,0,0,0,27,28,29,30,27,28,29,30,68,0,30,30,27,28],
                [0,11,0,27,28,29,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,27,28,29,55,0,0,0,0,0,0,0,0,0,0,0,0,45,15,11,30,45,30,14,0,30,68,30,0,45]   ,
                [27,28,29,0,45,0,0,0,0,27,28,29,0,0,0,0,0,0,0,0,0,0,45,0,55,0,0,0,0,0,0,0,0,0,0,0,0,0,27,28,30,15,14,0,0,0,14,0,11,30],
                [30,45,0,14,0,30,0,0,0,0,45,0,0,0,0,0,0,0,0,0,0,0,0,0,55,0,0,0,0,0,0,0,0,0,0,0,0,0,0,45,0,0,0,0,0,30,14,27,28,29],
                [0,0,15,0,0,0,0,0,0,0,0,0,0,0,0,68,0,0,0,0,0,0,0,0,55,0,68,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,45,0],
                [14,14,0,0,30,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,55,0,0,0,0,0,4,5,6,0,0,0,0,0,0,0,0,68,0,68,0,27,28,29,30,11],
                [30,0,30,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,73,72,72,72,72,72,22,22,23,0,0,0,0,0,0,0,0,0,0,0,0,0,45,30,27,28],
                [0,14,0,0,0,0,0,0,0,0,0,0,0,0,0,0,68,0,0,0,0,0,0,0,11,0,0,0,0,0,21,22,23,0,0,0,68,0,0,0,0,0,0,0,0,0,0,30,0,45],
                [14,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,27,28,29,11,14,0,0,38,22,40,0,0,0,0,0,0,0,0,14,14,11,0,0,0,14,14,0],
                [27,28,29,19,0,0,0,30,0,11,0,0,0,0,0,0,0,0,0,0,0,0,11,14,45,27,28,29,0,14,0,55,0,0,0,0,0,0,0,13,14,15,27,28,29,30,0,0,11,14],
                [19,45,19,13,30,13,0,37,27,28,29,0,0,68,0,0,0,0,0,30,0,27,28,29,14,0,45,0,14,0,0,55,0,35,36,36,36,36,36,36,19,19,19,45,19,14,30,27,28,29],
                [35,36,36,36,36,36,37,0,0,45,0,0,0,0,0,0,0,0,0,11,14,0,45,0,85,0,0,87,0,87,87,55,0,0,0,0,0,68,0,0,35,36,36,36,19,19,14,19,45,20],
                [30,68,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,27,28,29,14,11,0,0,14,11,0,0,0,0,55,0,0,11,0,0,0,0,0,0,0,0,0,35,36,36,36,36,37],
                [11,0,0,0,0,0,0,30,0,0,0,0,0,0,0,0,0,0,0,45,14,27,28,29,0,27,28,29,14,0,14,55,0,27,28,29,0,68,0,68,0,0,0,11,0,0,0,11,0,0],
                [28,29,85,89,86,0,0,0,0,30,0,0,0,0,0,0,0,0,30,0,14,0,45,0,68,0,45,0,0,14,0,55,0,0,45,0,0,0,0,0,0,0,27,28,29,13,27,28,29,0],
                [45,0,88,91,105,0,0,0,0,15,15,0,0,0,0,0,0,11,30,14,0,14,0,104,0,0,11,0,30,11,0,55,0,11,13,0,0,0,13,0,11,13,0,45,0,13,11,45,15,14],
                [30,14,102,106,103,0,0,15,0,0,0,0,0,0,0,0,27,28,29,0,14,11,0,0,0,27,28,29,27,28,29,55,27,28,29,13,11,13,0,27,28,29,13,0,0,27,28,29,68,30],
                [30,0,0,0,0,11,0,0,15,30,0,15,0,0,0,0,0,45,11,30,27,28,29,104,0,0,45,14,0,45,0,55,0,45,0,27,28,29,13,0,45,0,68,0,0,0,45,0,0,0],
                [0,30,0,30,27,28,29,14,11,0,15,0,0,0,15,0,68,27,28,29,30,45,68,104,0,68,0,30,0,4,5,22,6,0,68,0,45,0,0,0,0,0,0,0,4,5,5,5,5,6],
                [13,0,15,14,0,45,0,27,28,29,0,15,0,0,0,11,30,14,45,15,14,0,0,104,0,0,30,11,13,21,22,22,22,5,5,5,5,5,5,5,5,5,5,5,22,22,22,22,22,23],
                [14,15,15,0,30,0,15,0,45,13,0,11,15,15,27,28,29,30,30,11,0,0,85,90,86,0,27,28,29,21,22,22,22,39,39,39,39,39,39,39,39,39,39,39,22,22,22,22,22,23],
                [0,13,13,0,30,14,0,13,30,30,27,28,29,15,30,45,14,15,27,28,29,0,88,91,105,0,0,45,13,38,39,39,40,0,0,0,0,0,0,0,0,0,68,0,38,39,39,39,39,40],
                [13,11,13,15,0,15,30,0,13,30,0,45,0,13,0,15,0,30,14,45,0,0,102,106,103,11,30,13,13,0,68,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [27,28,29,30,14,15,13,30,13,11,13,0,15,0,13,14,15,0,30,14,14,0,11,0,27,28,29,10,12,0,68,0,0,68,0,11,0,0,0,0,0,0,0,0,0,0,0,68,0,16],
                [13,45,13,11,0,30,13,15,27,28,29,15,30,30,15,0,30,13,15,0,0,27,28,29,30,45,13,44,46,0,0,0,0,0,27,28,29,15,13,30,0,13,14,0,0,0,0,13,16,30],
                [14,30,13,28,29,13,13,11,13,45,0,14,13,13,13,30,0,14,0,30,14,0,45,30,15,13,13,15,0,0,30,0,0,30,0,45,15,14,0,15,30,13,15,11,14,15,30,11,16,14],
                [28,13,30,45,14,15,27,28,29,15,13,0,14,13,0,30,13,0,30,0,15,14,14,0,0,0,30,0,15,0,0,15,30,0,14,14,0,30,14,0,15,11,27,28,29,30,27,28,29,11]
                ]},
  "LVL2" : {
        "name" : "LVL2",
        "player" : [704, 544],
        "eggs" : [[624, 64],[304, 496], [96, 48]],
        "enemies" : [
            {
                x : 448,
                y : 160,
                maxX : 512,
                minX : 384,
                reverse : false,
                frameY : 0
            },
            {
                x : 240,
                y: 416,
                maxX : 300,
                minX : 200,
                reverse : false,
                frameY : 0
            }],
        "background" :[
                [27,28,29,30,30,14,30,27,28,29,30,17,14,11,30,13,11,27,28,29,15,45,15,15,13,11,17,15,17,17,15,11,17,27,28,29,15,13,17,11,14,17,17,30,17,11,17,30,11,30],
                [30,45,14,15,34,17,17,17,45,14,17,15,27,28,29,27,28,29,45,17,13,30,17,13,27,28,29,15,13,17,27,28,29,13,45,17,13,15,27,28,29,14,14,17,27,28,29,27,28,29],
                [14,30,14,11,34,85,89,86,34,17,30,30,17,45,15,17,45,17,15,15,17,15,30,17,17,45,17,17,13,13,17,45,17,17,17,17,17,17,17,45,17,15,14,17,30,45,17,30,45,17],
                [13,30,27,28,29,88,91,105,34,34,15,11,15,15,17,17,17,17,68,17,17,13,17,14,17,17,17,17,17,17,13,17,17,17,17,17,17,17,85,89,86,17,17,13,17,17,14,17,11,17],
                [17,13,17,45,34,102,106,103,34,17,27,28,29,17,17,17,17,17,17,17,17,17,17,14,17,17,17,17,17,17,17,17,17,17,17,17,17,17,88,91,105,17,17,14,17,30,17,27,28,29],
                [30,17,14,11,14,34,17,17,17,17,11,45,17,15,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,11,17,17,17,17,17,17,17,102,106,103,17,17,17,13,17,17,17,45,14],
                [17,30,27,28,29,17,17,17,68,27,28,29,15,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,27,28,29,17,17,17,17,17,17,17,17,17,17,17,17,15,30,17,14,17,17],
                [13,17,15,45,11,30,17,17,17,17,45,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,45,17,17,11,17,17,17,17,17,17,17,17,17,15,68,17,15,17,17,30],
                [17,30,13,27,28,29,17,15,17,17,17,17,17,17,17,17,17,11,17,17,17,17,17,17,17,17,17,17,17,17,14,15,27,28,29,30,17,17,17,17,17,30,17,30,17,13,17,17,15,17],
                [11,13,17,15,45,13,13,17,17,17,17,17,17,17,17,15,27,28,29,17,17,17,17,17,17,17,17,17,17,17,17,17,17,45,17,11,35,36,36,36,36,36,36,36,36,36,36,36,36,37],
                [28,29,68,17,15,17,34,15,30,15,13,17,30,17,17,17,17,45,17,17,36,36,36,37,17,17,17,68,17,17,68,17,17,30,27,28,29,30,17,17,17,17,68,17,17,17,17,17,30,17],
                [45,17,17,30,17,34,30,17,34,34,36,36,36,36,36,36,36,36,36,37,17,17,17,17,17,17,17,17,17,17,17,68,17,17,17,45,17,17,17,17,17,17,17,17,17,17,17,17,17,15],
                [35,36,36,36,36,36,36,36,36,37,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,68,17,17,30,17,17,17,17,17,17,17,17,17,17,17,17,30],
                [17,13,17,17,34,34,17,17,34,34,34,34,17,17,17,17,17,17,17,17,17,68,17,17,17,17,17,17,17,17,17,17,17,17,17,68,17,17,17,17,17,17,11,17,17,17,17,17,17,17],
                [30,30,30,17,34,15,34,34,17,17,34,34,34,17,17,17,17,17,17,17,68,17,17,17,17,17,17,17,17,17,17,17,17,17,17,13,30,17,17,13,17,27,28,29,17,17,17,17,17,14],
                [17,13,17,30,14,34,34,15,17,17,17,34,17,17,17,17,17,17,17,17,68,17,56,72,72,72,72,72,72,57,17,17,17,17,17,17,30,11,17,30,17,17,45,17,17,17,17,17,30,17],
                [72,72,72,57,17,14,30,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,55,17,17,17,17,17,17,73,72,72,72,72,57,17,27,28,29,17,35,36,36,36,17,17,17,17,17,17],
                [13,13,17,55,17,17,13,14,17,17,15,17,17,17,17,17,17,17,17,11,30,17,55,17,17,17,17,17,17,17,17,17,17,17,55,17,17,45,17,17,17,17,17,30,35,36,36,36,36,37],
                [17,13,17,55,17,17,17,14,17,17,17,17,17,17,17,17,17,17,27,28,29,17,55,17,17,17,17,17,17,17,17,17,17,17,55,17,17,15,17,17,17,17,17,17,17,17,15,17,30,17],
                [30,17,13,55,17,17,17,17,17,15,17,17,17,17,17,17,17,17,17,45,17,17,55,17,17,17,17,17,11,17,17,17,17,17,55,17,17,17,17,17,17,17,17,17,17,17,30,17,17,27],
                [17,13,17,73,72,72,72,72,57,17,17,17,17,17,17,56,72,72,72,72,72,72,74,17,17,17,17,27,28,29,17,17,17,17,55,17,17,17,11,17,17,17,17,17,17,17,17,15,11,17],
                [17,11,17,30,17,17,17,17,55,17,34,34,17,17,17,55,17,17,17,11,17,17,17,17,17,17,17,17,45,17,17,17,17,17,55,17,17,27,28,29,17,17,17,17,17,17,17,27,28,29],
                [30,28,29,17,17,11,17,14,55,17,34,34,34,17,17,55,17,17,27,28,29,17,17,17,17,17,17,17,17,17,17,17,17,17,55,17,17,17,45,17,17,17,17,17,17,17,17,17,45,17],
                [17,45,17,30,27,28,29,17,55,68,17,34,17,17,17,55,17,17,15,45,17,30,17,17,17,17,17,17,17,17,17,17,17,17,55,34,17,17,17,17,17,17,17,17,17,17,17,17,30,30],
                [14,17,13,30,17,45,30,17,73,72,72,72,72,72,72,74,17,30,17,17,30,17,17,11,17,17,17,17,17,17,17,17,17,17,55,17,17,17,17,17,17,17,17,17,17,17,17,17,15,17],
                [17,30,17,17,14,17,17,30,17,17,13,17,17,17,17,17,17,17,17,17,17,17,27,28,29,17,17,17,17,17,17,17,17,17,73,72,72,72,57,17,17,17,17,17,17,17,17,17,17,14],
                [30,17,14,17,17,17,17,17,17,30,17,17,17,17,17,17,17,17,17,17,17,30,17,45,30,17,17,17,17,17,17,17,17,17,17,17,17,17,55,17,17,17,17,17,68,17,17,17,17,14],
                [30,17,30,17,17,17,17,17,68,17,17,17,17,17,17,68,68,17,17,17,17,17,11,13,17,17,30,17,17,17,17,17,17,17,17,17,17,17,55,17,17,17,17,17,17,17,17,17,17,11],
                [17,17,11,17,30,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,27,28,29,17,30,17,17,17,17,17,17,17,17,17,17,17,17,55,17,17,17,17,17,17,17,17,17,27,28],
                [14,27,28,29,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,45,17,17,17,27,28,29,17,17,17,17,17,17,17,17,17,55,17,17,17,17,17,17,17,17,17,17,45],
                [17,17,45,17,14,17,17,17,17,17,17,17,17,17,17,17,17,17,85,89,86,17,17,17,17,13,17,17,17,17,17,17,17,17,17,17,17,17,73,72,72,72,72,72,57,17,17,17,30,14],
                [17,30,30,17,17,17,11,17,17,17,17,11,17,17,17,17,17,17,88,91,105,17,17,17,17,17,17,30,17,17,17,17,13,17,17,17,17,17,17,17,17,17,17,17,55,17,17,14,17,11],
                [14,17,11,17,30,27,28,29,15,17,27,28,29,17,17,17,17,17,102,106,103,17,17,17,17,13,17,17,11,17,17,13,11,17,68,17,17,17,17,13,17,17,17,17,55,17,17,17,27,28],
                [30,27,28,29,30,17,45,17,14,15,11,45,13,17,11,17,17,30,17,34,17,17,17,17,17,17,30,27,28,29,13,27,28,29,13,17,13,17,13,13,17,17,68,17,55,17,17,30,11,45],
                [30,17,45,17,14,17,30,17,30,27,28,29,14,27,28,29,15,17,15,13,17,30,17,15,17,30,17,30,45,17,30,17,45,17,15,15,17,30,17,30,13,17,17,17,55,17,14,27,28,29]
                ]},
    "LVL3" : {
        "name" : "LVL3",
        "player" : [784, 336],
        "eggs" : [[608, 224],[112, 384], [160, 128]],
        // "enemies" : [[496, 128], [192, 272]],
        "enemies" : [
            {
                x : 469,
                y : 128,
                maxY : 288,
                minY : 112,
                reverse : false,
                frameY : 0
            },
            {
                x : 192,
                y: 272,
                maxY : 320,
                minY : 224,
                reverse : false,
                frameY : 0
            }],
        "background" :[
                [27,28,29,14,30,14,30,45,0,30,30,30,13,13,11,0,30,0,13,13,30,15,13,13,30,27,28,29,30,30,11,30,0,13,30,30,27,28,29,30,14,30,15,30,13,13,30,0,14,27],
                [14,45,30,14,0,80,0,14,14,30,11,13,30,27,28,29,15,30,0,0,13,0,13,0,13,0,45,0,30,27,28,29,13,30,14,0,15,45,0,30,0,15,14,0,15,14,0,13,0,27],
                [11,14,30,0,96,97,98,0,30,27,28,29,30,0,45,0,13,0,0,0,0,15,0,0,0,13,30,30,30,0,45,0,0,13,11,0,0,0,13,0,0,0,0,30,13,0,30,0,30,0],
                [28,29,0,4,113,114,115,6,0,0,45,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,13,13,0,13,0,30,0,27,28,29,0,0,0,0,0,0,0,0,0,14,11,13,0,13],
                [45,0,0,21,130,131,132,23,15,0,30,27,28,29,0,0,0,0,0,0,0,0,0,0,0,0,0,15,0,0,0,0,0,0,45,0,0,0,0,0,0,0,0,13,0,27,28,29,0,13],
                [13,0,0,21,92,109,94,23,0,0,0,0,45,0,0,0,0,56,72,72,72,72,72,72,72,57,17,30,15,13,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,45,0,30,0],
                [30,0,0,38,39,22,39,40,0,0,0,0,0,0,0,0,0,55,0,0,11,0,0,0,0,55,0,11,30,30,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,13,13,30],
                [15,13,0,0,17,55,17,0,0,85,89,86,0,0,0,0,0,55,0,27,28,29,30,0,0,55,27,28,29,0,0,0,0,0,0,0,0,0,27,28,29,0,0,0,0,0,0,0,14,11],
                [13,15,0,0,17,55,17,0,0,88,91,105,0,0,68,0,0,55,0,13,45,0,15,13,0,55,0,45,13,0,0,0,0,0,0,0,0,0,0,45,0,0,0,0,0,0,0,0,27,28],
                [0,30,0,0,17,55,17,68,0,102,106,103,0,0,0,0,0,55,0,0,13,13,0,0,0,55,0,15,30,17,17,0,0,0,0,0,0,0,0,0,0,0,0,15,0,0,0,0,0,45],
                [29,15,15,0,17,55,17,0,0,0,0,0,0,0,0,30,0,55,0,0,15,0,13,15,0,55,17,13,17,17,0,0,0,56,72,72,72,72,72,72,72,72,72,57,0,0,0,0,0,14],
                [0,30,68,17,17,55,17,0,0,0,0,11,0,0,10,12,0,55,0,0,13,0,30,15,0,55,17,11,30,17,0,11,0,55,17,17,11,14,14,17,14,17,17,55,0,0,0,0,11,0],
                [30,0,14,17,17,55,0,0,30,0,27,28,29,0,45,45,0,55,0,0,30,0,11,0,0,55,27,28,29,0,27,28,29,55,0,27,28,29,14,30,15,11,15,55,0,0,0,27,28,29],
                [13,15,0,0,0,55,0,10,12,30,0,45,0,30,0,0,0,55,0,68,0,27,28,29,0,55,0,45,30,0,0,45,30,55,51,14,45,85,89,86,27,28,29,55,0,0,0,0,45,0],
                [11,14,15,0,0,55,0,45,45,0,0,0,0,0,0,0,0,55,0,0,0,0,45,0,0,55,0,14,17,0,0,30,0,55,17,51,30,88,91,105,0,45,13,55,0,0,0,0,0,11],
                [28,29,0,0,0,73,72,72,72,72,72,72,72,72,72,72,72,74,0,0,13,0,30,0,0,55,0,30,0,0,0,0,30,55,17,30,0,102,106,103,0,13,30,55,0,0,0,0,27,28],
                [45,15,13,14,13,11,0,0,0,0,0,0,0,0,11,0,0,0,0,30,11,0,13,14,0,55,14,14,0,0,0,14,0,55,0,11,30,0,0,0,0,14,0,55,0,0,0,0,14,45],
                [15,0,11,14,27,28,29,30,13,0,30,0,0,27,28,29,13,13,0,27,28,29,0,0,0,55,15,0,0,0,0,30,0,55,27,28,29,0,0,0,0,30,13,55,0,0,0,0,0,0],
                [15,27,28,29,0,45,0,0,0,0,0,0,0,0,45,0,0,0,0,0,45,0,0,0,0,55,13,0,0,0,0,14,0,55,0,45,13,68,0,0,30,0,14,55,0,0,0,0,68,0],
                [11,0,45,56,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,74,0,15,0,0,11,30,0,55,13,30,0,0,0,0,0,11,30,55,0,0,0,0,0,0],
                [28,29,0,55,0,11,15,0,15,11,30,15,0,0,14,0,15,10,12,0,14,0,13,11,15,15,14,0,0,27,28,29,30,55,13,0,13,0,0,0,27,28,29,55,0,0,0,0,0,0],
                [45,30,0,55,27,28,29,30,27,28,29,0,15,30,0,13,0,45,45,0,14,15,27,28,29,14,0,0,0,0,45,14,0,55,30,15,11,0,0,0,0,45,0,73,72,72,72,72,72,72],
                [15,0,0,55,0,45,13,0,0,45,15,30,0,0,68,0,30,0,0,15,0,0,0,45,0,0,0,0,0,0,30,15,17,55,0,27,28,29,68,0,0,0,0,0,0,0,0,0,0,0],
                [30,0,0,55,15,13,85,89,86,0,0,30,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,55,14,15,45,0,0,11,0,0,0,0,0,0,0,0,0,0],
                [0,11,0,55,0,30,88,91,105,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,15,27,28,29,55,0,0,14,15,27,28,29,0,0,0,0,0,0,0,0,10],
                [27,28,29,55,15,11,102,106,103,0,0,0,0,0,0,0,0,0,0,0,0,0,0,68,0,0,0,10,12,0,15,45,0,55,0,13,0,11,30,45,0,30,11,0,0,0,0,0,15,44],
                [30,45,0,55,27,28,29,0,11,0,0,17,0,30,0,0,11,0,0,68,0,0,0,0,0,11,0,45,45,30,0,0,17,55,0,0,27,28,29,15,13,27,28,29,30,0,0,0,0,0],
                [0,0,0,55,30,45,15,27,28,29,13,30,13,0,13,27,28,29,13,0,0,30,13,30,27,28,29,30,13,17,17,17,17,55,0,0,0,45,0,13,11,0,45,13,11,0,0,17,15,14],
                [30,0,0,55,0,0,13,13,45,0,30,13,0,13,30,13,45,30,0,13,13,0,0,30,0,45,0,0,17,0,0,17,0,55,0,0,0,13,30,27,28,29,30,27,28,29,15,15,17,0],
                [0,0,0,73,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,72,74,0,0,0,0,11,0,45,13,0,0,45,0,14,11,0,14],
                [29,14,0,34,34,34,34,34,11,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,34,0,0,0,27,28,29,30,0,0,13,0,13,27,28,29,0],
                [0,11,0,14,11,0,15,27,28,29,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,14,0,45,0,11,0,15,30,14,15,13,45,0,15],
                [27,28,29,27,28,29,0,27,28,29,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,27,28,29,0,0,0,0,13,0,13,11,0,0,14,27,28,29,14,30,0,30,0,15,0,14],
                [0,45,0,0,45,0,15,30,0,15,68,15,0,27,28,29,15,0,30,0,13,0,0,13,0,0,45,0,13,0,0,14,0,13,27,28,29,14,0,13,45,30,30,0,30,30,0,11,15,0],
                [30,0,0,30,0,14,0,15,0,15,0,11,0,15,45,13,10,12,0,0,11,0,13,14,0,13,30,0,14,30,0,14,0,0,13,45,15,0,14,0,14,0,13,14,0,15,27,28,29,15]
        ]}
}



document.addEventListener("DOMContentLoaded", init, false);

function init() {
    saveButton = document.querySelector("#save");
    saveButton.addEventListener("click", saveClicked);

    newGameButton = document.querySelector("#new");
    newGameButton.addEventListener("click", newClicked);

    loadButton = document.querySelector("#load");
    loadButton.addEventListener("click", loadClicked);

    scoreText = document.querySelector("#score");
    // https://reqbin.com/code/javascript/rftjizcl/javascript-get-request-example
    fetch('getData', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then((response) => response.json())
    .then((receivedData) => {
        data = receivedData;
        player.x = data.playerX;
        player.y = data.playerY;
        level = data.LVL;
        score = data.score;
        scoreText.innerHTML = score;
    });

    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");

    window.addEventListener("keydown", activate, false);
    window.addEventListener("keyup", deactivate, false);
    
    background = levels[level]["background"]
    player.x = levels["LVL1"]["player"][0]
    player.y = levels["LVL1"]["player"][1]

    load_assets(
        [
            {"var" : backgroundImage, "url" : "static/tilemap.png"},
            {"var" : eggImage, "url" : "static/egg.png"},
            {"var" : whiteChicken, "url" : "static/whitechicken.png"},
            {"var" : enemyImage, "url" : "static/enemy.png"}
        ], draw);
}

function draw() {
    request_id = window.requestAnimationFrame(draw);
    background = levels[level]["background"];

    player.yChange = 3;
    player.xChange = 3

    let now = Date.now();
    let elapsed = now - then;
    if (elapsed <= fpsInterval) {
        return;
    }
    then = now - (elapsed % fpsInterval);

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "yellow";

    for (let r = 0; r < 35; r += 1) {
        for (let c = 0; c < 50; c += 1) {
            let tile = background[r][c];
            if(tile >= 0) {
                let tileRow = Math.floor(tile / tilesPerRow);
                let tileCol = Math.floor(tile % tilesPerRow);
                
                let backgroundX = tileCol * tileSize;
                let backgroundY = tileRow * tileSize;
                // Move the starting point of the tile as there is spacing between the tiles
                if (tileRow != 0) {
                    backgroundY += tileRow;
                }
                if (tileCol != 0) {
                    backgroundX += tileCol;
                }

                context.drawImage(backgroundImage, backgroundX, backgroundY, tileSize, tileSize,
                    c * tileSize, r * tileSize, tileSize, tileSize);
            }
        }
    }
 


    //egg stuff
    if (eggUp){
        eggOffset += .15;
    }
    else {
        eggOffset -= .15;
    }

    for (let eggpos of levels[level]["eggs"]){
        let eggFound = false;
        context.fillStyle = "red";
        for(let eggFromData of data[level]["eggs"]) {
            if(eggpos[0] === eggFromData[0] && eggpos[1] === eggFromData[1]) {
                eggFound = true;
                continue;
            }
        }
        if(eggFound) {
            continue;
        }
        context.drawImage(eggImage, 0, 0, tileSize, tileSize, eggpos[0], eggpos[1] - eggOffset, tileSize, tileSize);
    }

    if (eggOffset >= 4) {
        eggUp = false;
    }
    else if (eggOffset <= 0) {
        eggUp = true;
    }

    for(let i = 0; i < levels[level]["eggs"].length; i += 1) {
        let egg = levels[level]["eggs"][i];
        let eggX = egg[0];
        let eggY = egg[1];

        if(player.x + player.size > eggX &&
            player.x < eggX + 16 &&
            player.y + player.size > eggY &&
            player.y < eggY + 16) {
                let eggRemoved = levels[level]["eggs"].splice(i, 1);
                capturedEgg(eggRemoved[0]);
            }
    }

    

    // context.fillStyle = "yellow";
    context.drawImage(whiteChicken,
        player.width * player.frameX, player.height * player.frameY, player.width, player.height,
        player.x, player.y, player.width, player.height);

    // context.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
    // context.fillStyle = "red";
    for (let enemyPos of levels[level]["enemies"]){
        // context.fillRect(enemyPos.x, enemyPos.y, enemy.size, enemy.size);
        // context.fillStyle = "red"
        context.drawImage(enemyImage, 
            enemy.width * enemy.frameX, enemy.height * enemyPos.frameY, enemy.width, enemy.height,
            enemyPos.x, enemyPos.y, enemy.width, enemy.height)
        if ("maxX" in enemyPos){
            if (enemyPos.x >= enemyPos.maxX) {
                enemyPos.reverse = true;
            }
            else if (enemyPos.x <= enemyPos.minX) {
                enemyPos.reverse = false;
            }

            if (enemyPos.reverse) {
                enemyPos.x -= enemy.xChange;
            }
            else {
                enemyPos.x += enemy.xChange;
            }
        }

        if ("maxY" in enemyPos){
            if (enemyPos.y >= enemyPos.maxY) {
                enemyPos.reverse = true;
                enemyPos.frameY = 1;
            }
            else if (enemyPos.y <= enemyPos.minY) {
                enemyPos.reverse = false;
                enemyPos.frameY = 0;
            }

            if (enemyPos.reverse) {
                enemyPos.y -= enemy.yChange;
            }
            else {
                enemyPos.y += enemy.yChange;
            }
        }
    }

    for (let enemy of levels[level]["enemies"]) {
        if (collide(enemy)) {
            console.log("You died!");
            died = true;
            stop()
        }
    }


    if (moveRight) {
        checkObstacle(player.x + player.xChange, player.y, true);
        // checkObstacle("moveRight");
        player.x = player.x + player.xChange;
        player.frameY = 1
        player.frameX = (player.frameX + 1) % 3;
        }
    if (moveLeft) {
        checkObstacle(player.x - player.xChange, player.y, true);
        // checkObstacle("moveLeft");
        player.x = player.x - player.xChange;
        player.frameY = 0;
        player.frameX = (player.frameX + 1) % 3;
        }
    if (moveUp) {
        checkObstacle(player.x, player.y - player.yChange, false);
        // checkObstacle("moveUp");
        player.y = player.y - player.yChange;
        player.frameY = 2;
        player.frameX = (player.frameX + 1) % 3;
        }
    if (moveDown) {
        checkObstacle(player.x, player.y + player.yChange, false);
        // checkObstacle("moveDown");
        player.y = player.y + player.yChange;
        player.frameY = 3;
        player.frameX = (player.frameX + 1) % 3;
    }

    if (level === "LVL1") {
        if (player.y < -16){
            level = "LVL2";
            data.LVL = level;
            player.x = levels[level]["player"][0];
            player.y = levels[level]["player"][1];
        }
    }
    if (level === "LVL2") {
        if (player.x < -16){
            level = "LVL3";
            data.LVL = level;
            player.x = levels[level]["player"][0];
            player.y = levels[level]["player"][1];
        }
    }
    if (level === "LVL3"){
        if (player.x >= 80 &&
            player.x <= 100 &&
            player.y <= 90 &&
            player.y >= 80) {
            console.log("Winner winner chicken dinner!");
            won = true;
            stop();
        }
    }  
    
    if (died) {
        context.font = "90px Arial";
        context.fillText("You Died", (canvas.width / 2) - 150, canvas.height / 2);
        stop();
    }

    if (won) {
        context.font = "90px Arial";
        context.fillStyle = "green";
        context.fillText("You Won!", (canvas.width / 2) - 175, canvas.height / 2);
    }
}

function checkObstacle(xChanging, yChanging, xChanged){

    if(xChanging <= 0 || yChanging <= 0) {
        return;
    }

    // Push down hitbox
    yChanging += 6;
    let nextPlayercoordinate = [Math.floor(xChanging / size), Math.floor(yChanging / size)];
    let nextBlock = background[nextPlayercoordinate[1]][nextPlayercoordinate[0]];
    //console.log(nextBlock);
    
    let blockX = nextPlayercoordinate[0] * 16;
    let blockY = nextPlayercoordinate[1] * 16;

    // context.strokeStyle = 'green';
    // context.rect(blockX, blockY, 16, 16);
    // context.stroke();

    //console.log([blockX, blockY]);
    if (Obstacles.includes(nextBlock)) {
        if (xChanging + size >= blockX && 
            xChanging < blockX + size &&
            yChanging + size >= blockY &&
            yChanging < blockY + size
            ){
            //console.log("collide");
        
            if(xChanged) {
                player.xChange = 0;
            } else {
                player.yChange = 0;
            }
        }

    }
}
    
function activate(event) {
    let key = event.key;
    if (key === "ArrowLeft") {
        moveLeft = true;
    } else if (key === "ArrowRight") {
        moveRight = true;
    } else if (key === "ArrowUp") {
        moveUp = true;
    } else if (key === "ArrowDown") {
        moveDown = true;
    }
}

function deactivate(event) {
    let key = event.key;
    if (key === "ArrowLeft") {
        moveLeft = false;
    } else if (key === "ArrowRight") {
        moveRight = false;
    } else if (key === "ArrowUp") {
        moveUp = false;
    } else if (key === "ArrowDown") {
        moveDown = false;
    }
}

function load_assets(assets, callback) {
    let num_assets = assets.length;
    let loaded = function() {
        console.log("loaded");
        num_assets = num_assets - 1;
        if (num_assets === 0) {
            callback();
        }
    };
    for (let asset of assets) {
        let element = asset.var;
        if (element instanceof HTMLImageElement){
            console.log("img")
            element.addEventListener("load", loaded, false);
        }
        else if (element instanceof HTMLAudioElement){
            console.log("audio");
            element.addEventListener("canplaythrough", loaded, false);
        }
        console.log(element);
        element.src = asset.url;
        }
}

function gameEnd(outcome){
    window.cancelAnimationFrame(request_id);
    let outcome_element = document.querySelector("#outcome");
    outcome_element.innerHTML = outcome;
}

function capturedEgg(egg) {
    data[level]["eggs"].push(egg);
    data.score += 1;
    scoreText.innerHTML = data.score
}

function newClicked() {
    died = false;
    level = "LVL1"
    scoreText.innerHTML = 0;
    score = 0;
    player.x = levels[level]["player"][0];
    player.y = levels[level]["player"][1];
    data = {
        "LVL" : level, 
        "score" : score,
        "playerX" : player.x,
        "playerY" : player.y,
        "LVL1" : {
            "eggs" : []
        },
        "LVL2" : {
            "eggs" : []
        },
        "LVL3" : {
            "eggs" : []
        }
    }
    request_id = window.requestAnimationFrame(draw);
}

function saveClicked() {
    console.log("saved");
    data.playerX = player.x;
    data.playerY = player.y;
    data.level = level;
    console.log(data);
    // https://reqbin.com/code/javascript/wzp2hxwh/javascript-post-request-example
    fetch('saveData', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then((response) => response.text())
    .then((text) => {
      console.log(text)
    });
}
function loadClicked() {
    console.log("loaded");
    location.reload();
}
function collide(enemy){
    if (player.x + player.size > enemy.x &&
        player.x < enemy.x + 16 &&
        player.y + player.size > enemy.y &&
        player.y < enemy.y + 16){
            return true;
        }
        else{
            return false;
        }

}

function stop() {
    window.cancelAnimationFrame(request_id);
}