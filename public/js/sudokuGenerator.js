const CELL_STATES = {
    //* common
    FIXED: "FIXED",
    EMPTY: "EMPTY",
    FILLED: "FILLED",

    //* for solveSudoku visualization
    FINAL: "FINAL",
    WRONG: "WRONG",

    //* for game styling
    SELECTED: "SELECTED",
};

const CELL_NUM = 9;
const EMPTYVALUE = 0;
const CELL_SIZE = 70;

let puzzle = [...Array(CELL_NUM)].map((x) => Array(CELL_NUM));
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

class Cell {
    constructor(value_, state_) {
        this.value = value_;
        this.state = state_;
    }

    get value() {
        return this._value;
    }

    set value(v) {
        this._value = v;
    }

    get state() {
        return this._state;
    }

    set state(s) {
        this._state = s;
    }
}

let counter = 1;

function solveSudoku(grid) {
    let row, col;
    for (let i = 0; i < CELL_NUM * CELL_NUM; i++) {
        row = Math.floor(i / CELL_NUM);
        col = i % CELL_NUM;

        if (grid[row][col].value === EMPTYVALUE) {
            for (let value = 1; value <= CELL_NUM; value++) {
                if (isValidCell(grid, row, col, value)) {
                    grid[row][col].value = value;

                    if (!hasEmptyCell(grid)) {
                        counter++;
                        break;
                    } else {
                        if (solveSudoku(grid)) {
                            return true;
                        }
                    }
                }
            }

            break;
        }
    }

    grid[row][col].value = EMPTYVALUE;
}

function fillSudoku(grid) {
    let row, col;
    for (let i = 0; i < CELL_NUM * CELL_NUM; i++) {
        row = Math.floor(i / CELL_NUM);
        col = i % CELL_NUM;

        if (grid[row][col].value === EMPTYVALUE) {
            shuffleArray(numbers);

            for (let value of numbers) {
                if (isValidCell(grid, row, col, value)) {
                    grid[row][col].value = value;

                    if (!hasEmptyCell(grid)) {
                        return true;
                    } else {
                        if (fillSudoku(grid)) {
                            return true;
                        }
                    }
                }
            }

            break;
        }
    }

    grid[row][col].value = EMPTYVALUE;
}

function generateSudoku(difficulty) {
    for (let r = 0; r < CELL_NUM; r++) {
        for (let c = 0; c < CELL_NUM; c++) {
            puzzle[r][c] = new Cell(EMPTYVALUE, CELL_STATES.EMPTY);
        }
    }

    fillSudoku(puzzle);

    let attempt = difficulty;

    while (attempt > 0) {
        let row = Math.floor(Math.random() * CELL_NUM);
        let col = Math.floor(Math.random() * CELL_NUM);

        while (puzzle[row][col].value === EMPTYVALUE) {
            row = Math.floor(Math.random() * CELL_NUM);
            col = Math.floor(Math.random() * CELL_NUM);
        }

        backupValue = puzzle[row][col].value;
        puzzle[row][col].value = EMPTYVALUE;

        let copyPuzzle = puzzle.map(function (array) {
            return array.slice();
        });

        counter = 0;
        solveSudoku(copyPuzzle);

        if (counter !== 1) {
            puzzle[row][col].value = backupValue;
            attempt--;
        }
    }

    for (let r = 0; r < CELL_NUM; r++) {
        for (let c = 0; c < CELL_NUM; c++) {
            puzzle[r][c].state = puzzle[r][c].value === EMPTYVALUE ? CELL_STATES.EMPTY : CELL_STATES.FIXED;
        }
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function isValidCell(grid, row, col, value) {
    //* check the current row
    for (let c = 0; c < CELL_NUM; c++) {
        if (grid[row][c].value === value) return false;
    }

    //* check the current column
    for (let r = 0; r < CELL_NUM; r++) {
        if (grid[r][col].value === value) return false;
    }

    //* check the current region (3x3 subgrid)
    let startRow = Math.floor(row / 3) * 3,
        startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            if (grid[r][c].value === value) return false;
        }
    }

    return true;
}

function hasEmptyCell(grid) {
    for (let r = 0; r < CELL_NUM; r++) {
        for (let c = 0; c < CELL_NUM; c++) {
            if (grid[r][c].value === EMPTYVALUE) return true;
        }
    }
    return false;
}
