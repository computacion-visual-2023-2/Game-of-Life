//import {data1} from './camiloConfig'
let grid;
let cols;
let rows;
let resolution = 10;
let playing = false;



function setup() {
    createCanvas(400, 400);
    cols = width / resolution;
    rows = height / resolution;

    grid = createRandomGrid(cols, rows);
    frameRate(10);

    // Create buttons
    let clearButton = createButton('Clear');
    clearButton.position(10, height + 10);
    clearButton.mousePressed(clearGrid);

    let randomButton = createButton('Randomize');
    randomButton.position(70, height + 10);
    randomButton.mousePressed(randomizeGrid);

    let playButton = createButton('Play');
    playButton.position(150, height + 10);
    playButton.mousePressed(togglePlay);

    let stepButton = createButton('Step');
    stepButton.position(200, height + 10);
    stepButton.mousePressed(step);

    let stopButton = createButton('Stop');
    stopButton.position(260, height + 10);
    stopButton.mousePressed(stop);

    //Example of configurations
    /*
    5678/35678 (caótico) diamantes, catástrofes
    1357/1357 (crece) «Breeder», crecen rápidamente
    1358/357 (caótico) un reino equilibrado de amebas
    23/3 (complejo) «Juego de la Vida de Conway»
    23/36 (caótico) «HighLife» (tiene replicante)
    2/7 (caótico) «Diffusion Rule» (gliders, guns, puffer trains)
    235678/3678 (estable) mancha de tinta que se seca rápidamente
    245/368 (estable) muerte, locomotoras y naves
    34/34 (crece) «Vida 34»
    4/2 (crece) generador de patrones de alfombras
    51/346 (estable) Larga vida casi
     */
    //configPrueba = newconfigInicial('23/36')
    configPrueba = new configInicial();

}

function draw() {
    background(255);

    if (playing) {
        grid = computeNextGeneration(grid);
    }

    // Draw grid
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let x = i * resolution;
            let y = j * resolution;
            if (grid[i][j] == 1) {
                fill(0);
                stroke(255);
                rect(x, y, resolution - 1, resolution - 1);
            }
        }
    }

    // Draw grid lines
    stroke(0);
    for (let i = 0; i < cols; i++) {
        line(i * resolution, 0, i * resolution, height);
    }
    for (let j = 0; j < rows; j++) {
        line(0, j * resolution, width, j * resolution);
    }
}

function mousePressed() {
    let i = floor(mouseX / resolution);
    let j = floor(mouseY / resolution);
    if (i >= 0 && i < cols && j >= 0 && j < rows) {
        grid[i][j] = 1 - grid[i][j]; // Toggle cell state
    }
}

function createRandomGrid(cols, rows) {
    let grid = new Array(cols);
    for (let i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
        for (let j = 0; j < rows; j++) {
            grid[i][j] = floor(random(2));
        }
    }
    return grid;
}
function createEmptyGrid(cols, rows) {
    let grid = new Array(cols);
    for (let i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
        for (let j = 0; j < rows; j++) {
            grid[i][j] = "";
        }
    }
    return grid;
}

function computeNextGeneration(grid) {
    let nextGrid = new Array(cols);
    for (let i = 0; i < cols; i++) {
        nextGrid[i] = new Array(rows);
        for (let j = 0; j < rows; j++) {
            let state = grid[i][j];
            let neighbors = countNeighbors(grid, i, j);
            /*
            if (state == 0 && neighbors == 3) {
                nextGrid[i][j] = 1;
            } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
                nextGrid[i][j] = 0;
            } else {
                nextGrid[i][j] = state;
            }

             */
            if (state==0 && configPrueba.bornConstraints.includes(neighbors)){
                nextGrid[i][j]=1;
            } else if (state==1 && (!configPrueba.lifeConstraints.includes(neighbors))){
                nextGrid[i][j]=0;
            }else{
                nextGrid[i][j]=state;
            }
        }
    }
    return nextGrid;
}

function countNeighbors(grid, x, y) {
    let sum = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let col = (x + i + cols) % cols;
            let row = (y + j + rows) % rows;
            sum += grid[col][row];
        }
    }
    sum -= grid[x][y];
    return sum;
}

function clearGrid() {
    grid = createEmptyGrid(cols, rows);
    playing = false;
}

function randomizeGrid() {
    grid = createRandomGrid(cols, rows);
}

function togglePlay() {
    playing = !playing;
}

function step() {
    if (!playing) {
        grid = computeNextGeneration(grid);
    }
}

function stop() {
    playing = false;
}

function keyPressed() {
    if (keyCode === 97 || keyCode===49) {
        configCamilo = new initialConfigImg(config1);
        preloadConfig(configCamilo.markedCells);
    }
}


function preloadConfig(configImg){
    clearGrid();
    for(let k = 0;k<configImg.length;k++){
        grid[configImg[k][0]][configImg[k][1]]=1;
    }
}
class configInicial{

    constructor(cadena='23/3') {

        let firstHalf = cadena.substring(0,cadena.indexOf('/'));
        let secondHalf = cadena.substring(cadena.indexOf('/')+1,cadena.length);
        this.lifeConstraints = firstHalf.split('').map(Number);
        this.bornConstraints = secondHalf.split('').map(Number);
    }
}

class initialConfigImg{
    constructor(markedCells = [[10,10],[10,11]]){
        this.markedCells = markedCells;
    }
}

config1 = [[
        7,
        2
    ],
    [
        6,
        2
    ],
    [
        4,
        2
    ],
    [
        5,
        2
    ],
    [
        4,
        3
    ],
    [
        4,
        4
    ],
    [
        4,
        5
    ],
    [
        4,
        6
    ],
    [
        4,
        7
    ],
    [
        5,
        7
    ],
    [
        6,
        7
    ],
    [
        7,
        7
    ],
    [
        9,
        7
    ],
    [
        9,
        6
    ],
    [
        9,
        5
    ],
    [
        9,
        4
    ],
    [
        9,
        3
    ],
    [
        9,
        2
    ],
    [
        10,
        2
    ],
    [
        11,
        2
    ],
    [
        12,
        2
    ],
    [
        13,
        2
    ],
    [
        13,
        3
    ],
    [
        13,
        4
    ],
    [
        13,
        4
    ],
    [
        13,
        4
    ],
    [
        13,
        5
    ],
    [
        13,
        6
    ],
    [
        13,
        7
    ],
    [
        12,
        5
    ],
    [
        11,
        5
    ],
    [
        10,
        5
    ],
    [
        15,
        7
    ],
    [
        15,
        6
    ],
    [
        15,
        5
    ],
    [
        15,
        4
    ],
    [
        15,
        3
    ],
    [
        15,
        2
    ],
    [
        16,
        2
    ],
    [
        17,
        2
    ],
    [
        17,
        3
    ],
    [
        17,
        4
    ],
    [
        17,
        5
    ],
    [
        18,
        2
    ],
    [
        19,
        2
    ],
    [
        19,
        3
    ],
    [
        19,
        4
    ],
    [
        19,
        5
    ],
    [
        19,
        6
    ],
    [
        19,
        7
    ],
    [
        21,
        2
    ],
    [
        21,
        3
    ],
    [
        21,
        4
    ],
    [
        21,
        5
    ],
    [
        21,
        6
    ],
    [
        21,
        7
    ],
    [
        23,
        2
    ],
    [
        23,
        3
    ],
    [
        23,
        4
    ],
    [
        23,
        5
    ],
    [
        23,
        7
    ],
    [
        23,
        6
    ],
    [
        24,
        7
    ],
    [
        25,
        7
    ],
    [
        26,
        7
    ],
    [
        27,
        7
    ],
    [
        29,
        2
    ],
    [
        29,
        3
    ],
    [
        29,
        4
    ],
    [
        29,
        5
    ],
    [
        29,
        6
    ],
    [
        29,
        6
    ],
    [
        29,
        7
    ],
    [
        29,
        6
    ],
    [
        30,
        7
    ],
    [
        31,
        7
    ],
    [
        32,
        7
    ],
    [
        33,
        7
    ],
    [
        33,
        6
    ],
    [
        33,
        5
    ],
    [
        33,
        4
    ],
    [
        33,
        3
    ],
    [
        33,
        2
    ],
    [
        32,
        2
    ],
    [
        30,
        2
    ],
    [
        31,
        2
    ],
    [
        31,
        4
    ],
    [
        31,
        5
    ],
    [
        17,
        18
    ],
    [
        16,
        19
    ],
    [
        15,
        20
    ],
    [
        14,
        21
    ],
    [
        15,
        22
    ],
    [
        16,
        23
    ],
    [
        17,
        24
    ],
    [
        18,
        23
    ],
    [
        19,
        22
    ],
    [
        20,
        21
    ],
    [
        19,
        20
    ],
    [
        18,
        19
    ],
    [
        17,
        21
    ],
    [
        15,
        18
    ],
    [
        14,
        19
    ],
    [
        14,
        18
    ],
    [
        13,
        18
    ],
    [
        14,
        17
    ],
    [
        20,
        19
    ],
    [
        19,
        18
    ],
    [
        21,
        18
    ],
    [
        20,
        18
    ],
    [
        20,
        17
    ],
    [
        11,
        15
    ],
    [
        12,
        15
    ],
    [
        13,
        15
    ],
    [
        14,
        15
    ],
    [
        15,
        15
    ],
    [
        16,
        15
    ],
    [
        17,
        15
    ],
    [
        18,
        15
    ],
    [
        19,
        15
    ],
    [
        20,
        15
    ],
    [
        21,
        15
    ],
    [
        22,
        15
    ],
    [
        23,
        15
    ],
    [
        23,
        16
    ],
    [
        23,
        17
    ],
    [
        23,
        18
    ],
    [
        23,
        19
    ],
    [
        23,
        20
    ],
    [
        23,
        21
    ],
    [
        23,
        22
    ],
    [
        23,
        23
    ],
    [
        23,
        24
    ],
    [
        23,
        25
    ],
    [
        23,
        26
    ],
    [
        23,
        27
    ],
    [
        22,
        27
    ],
    [
        21,
        27
    ],
    [
        20,
        27
    ],
    [
        19,
        27
    ],
    [
        18,
        27
    ],
    [
        17,
        27
    ],
    [
        16,
        27
    ],
    [
        15,
        27
    ],
    [
        14,
        27
    ],
    [
        13,
        27
    ],
    [
        12,
        27
    ],
    [
        11,
        27
    ],
    [
        11,
        16
    ],
    [
        11,
        17
    ],
    [
        11,
        18
    ],
    [
        11,
        19
    ],
    [
        11,
        20
    ],
    [
        11,
        21
    ],
    [
        11,
        22
    ],
    [
        11,
        23
    ],
    [
        11,
        24
    ],
    [
        11,
        25
    ],
    [
        11,
        26
    ],
    [
        21,
        25
    ],
    [
        20,
        24
    ],
    [
        21,
        24
    ],
    [
        20,
        25
    ],
    [
        14,
        25
    ],
    [
        13,
        24
    ],
    [
        14,
        24
    ],
    [
        13,
        25
    ],
    [
        24,
        12
    ],
    [
        25,
        13
    ],
    [
        26,
        14
    ],
    [
        27,
        15
    ],
    [
        28,
        16
    ],
    [
        29,
        17
    ],
    [
        30,
        18
    ],
    [
        31,
        19
    ],
    [
        32,
        20
    ],
    [
        33,
        21
    ],
    [
        34,
        22
    ],
    [
        33,
        22
    ],
    [
        32,
        22
    ],
    [
        31,
        22
    ],
    [
        29,
        22
    ],
    [
        28,
        22
    ],
    [
        27,
        22
    ],
    [
        26,
        22
    ],
    [
        26,
        20
    ],
    [
        26,
        20
    ],
    [
        26,
        19
    ],
    [
        26,
        17
    ],
    [
        26,
        15
    ],
    [
        26,
        16
    ],
    [
        26,
        18
    ],
    [
        26,
        20
    ],
    [
        26,
        21
    ],
    [
        30,
        22
    ],
    [
        27,
        21
    ],
    [
        28,
        20
    ],
    [
        29,
        19
    ],
    [
        30,
        19
    ],
    [
        30,
        20
    ],
    [
        30,
        21
    ],
    [
        29,
        18
    ],
    [
        28,
        18
    ],
    [
        27,
        18
    ],
    [
        6,
        14
    ],
    [
        6,
        15
    ],
    [
        6,
        16
    ],
    [
        6,
        17
    ],
    [
        6,
        18
    ],
    [
        6,
        19
    ],
    [
        6,
        19
    ],
    [
        6,
        20
    ],
    [
        6,
        21
    ],
    [
        6,
        19
    ],
    [
        5,
        19
    ],
    [
        4,
        19
    ],
    [
        4,
        19
    ],
    [
        3,
        19
    ],
    [
        2,
        19
    ],
    [
        2,
        19
    ],
    [
        2,
        19
    ],
    [
        0,
        19
    ],
    [
        4,
        19
    ],
    [
        1,
        19
    ],
    [
        5,
        16
    ],
    [
        4,
        16
    ],
    [
        3,
        16
    ],
    [
        2,
        16
    ],
    [
        1,
        16
    ],
    [
        0,
        16
    ],
    [
        26,
        35
    ],
    [
        27,
        34
    ],
    [
        28,
        33
    ],
    [
        29,
        32
    ],
    [
        30,
        31
    ],
    [
        31,
        30
    ],
    [
        32,
        29
    ],
    [
        31,
        29
    ],
    [
        30,
        29
    ],
    [
        28,
        29
    ],
    [
        29,
        30
    ],
    [
        29,
        29
    ],
    [
        27,
        29
    ],
    [
        26,
        29
    ],
    [
        24,
        29
    ],
    [
        25,
        29
    ],
    [
        24,
        30
    ],
    [
        25,
        31
    ],
    [
        26,
        32
    ],
    [
        27,
        33
    ],
    [
        28,
        34
    ],
    [
        29,
        35
    ],
    [
        30,
        36
    ],
    [
        30,
        35
    ],
    [
        30,
        33
    ],
    [
        30,
        32
    ],
    [
        30,
        30
    ],
    [
        30,
        34
    ],
    [
        30,
        28
    ],
    [
        30,
        26
    ],
    [
        29,
        26
    ],
    [
        30,
        27
    ],
    [
        27,
        27
    ],
    [
        28,
        26
    ],
    [
        26,
        28
    ],
    [
        24,
        31
    ],
    [
        4,
        32
    ],
    [
        4,
        34
    ],
    [
        4,
        33
    ],
    [
        5,
        34
    ],
    [
        6,
        34
    ],
    [
        6,
        33
    ],
    [
        6,
        32
    ],
    [
        5,
        32
    ],
    [
        8,
        32
    ],
    [
        8,
        33
    ],
    [
        8,
        34
    ],
    [
        9,
        34
    ],
    [
        10,
        34
    ],
    [
        10,
        33
    ],
    [
        10,
        32
    ],
    [
        9,
        32
    ],
    [
        7,
        33
    ],
    [
        6,
        35
    ],
    [
        7,
        35
    ],
    [
        8,
        35
    ],
    [
        10,
        35
    ],
    [
        10,
        35
    ],
    [
        10,
        35
    ],
    [
        10,
        36
    ],
    [
        9,
        36
    ],
    [
        8,
        36
    ],
    [
        8,
        37
    ],
    [
        7,
        37
    ],
    [
        6,
        37
    ],
    [
        6,
        36
    ],
    [
        5,
        36
    ],
    [
        4,
        36
    ],
    [
        4,
        35
    ],
    [
        5,
        35
    ],
    [
        9,
        35
    ],
    [
        9,
        31
    ],
    [
        5,
        31
    ],
    [
        30,
        13
    ],
    [
        31,
        14
    ],
    [
        32,
        15
    ],
    [
        33,
        16
    ],
    [
        33,
        15
    ],
    [
        33,
        14
    ],
    [
        33,
        14
    ],
    [
        32,
        14
    ],
    [
        33,
        14
    ],
    [
        33,
        13
    ],
    [
        32,
        13
    ],
    [
        30,
        13
    ],
    [
        31,
        13
    ],
    [
        30,
        13
    ]
]

