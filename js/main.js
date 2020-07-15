const CELL_NUM = 9;
const CELL_SIZE = 80;
const EMPTYVALUE = 0;

let canvas;
let btnSolve;

let puzzle = [
    [0, 0, 2, 0, 0, 0, 5, 0, 0],
    [0, 1, 0, 7, 0, 5, 0, 2, 0],
    [4, 0, 0, 0, 9, 0, 0, 0, 7],
    [0, 4, 9, 0, 0, 0, 7, 3, 0],
    [8, 0, 1, 0, 3, 0, 4, 0, 9],
    [0, 3, 6, 0, 0, 0, 2, 1, 0],
    [2, 0, 0, 0, 8, 0, 0, 0, 4],
    [0, 8, 0, 9, 0, 2, 0, 6, 0],
    [0, 0, 7, 0, 0, 0, 8, 0, 0]
];

function setup() {
    canvas = createCanvas(800, 800);
    canvas.parent('game-area');

    textSize(30);
    textAlign(CENTER, CENTER);

    btnSolve = createButton('Solve');
    btnSolve.parent('controls-area');
    btnSolve.mousePressed(solveSudoku);

    noLoop();
}

function draw() {
    // background(220);
    for (let row = 0; row < CELL_NUM; row++) {
        for (let col = 0; col < CELL_NUM; col++) {
            rect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            if (puzzle[row][col] !== EMPTYVALUE) {
                text(puzzle[row][col], col * CELL_SIZE + CELL_SIZE / 2, row * CELL_SIZE + CELL_SIZE / 2);
            }
        }
    }
}

async function solveSudoku() {
    let row, col;
    for (let i = 0; i < CELL_NUM * CELL_NUM; i++) {
        row = Math.floor(i / CELL_NUM);
        col = i % CELL_NUM;
        
        if (puzzle[row][col] === EMPTYVALUE) {
            for (let value = 1; value <= CELL_NUM; value++) {
                if (isValidCell(row, col, value)) {
                    puzzle[row][col] = value;

                    await sleep(50);
                    redraw();

                    if (!hasEmptyCell()) {
                        return true;
                    } else {
                        if (await solveSudoku()) {
                            return true;
                        }
                    }
                }
            }

            break;
        }
    }
    puzzle[row][col] = EMPTYVALUE;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function isValidCell(row, col, value) {

    //* check the current row
    for (let c = 0; c < CELL_NUM; c++) {
        if (puzzle[row][c] === value) return false;
    }

    //* check the current column
    for (let r = 0; r < CELL_NUM; r++) {
        if (puzzle[r][col] === value) return false;
    }

    //* check the current region (3x3 subgrid)
    let startRow = Math.floor(row / 3) * 3, startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            if (puzzle[r][c] === value) return false;
        }
    }

    return true;
}

function hasEmptyCell() {
    for (let r = 0; r < CELL_NUM; r++) {
        for (let c = 0; c < CELL_NUM; c++) {
            if (puzzle[r][c] === EMPTYVALUE) return true;
        }
    }

    return false;
}