const CELL_STATES = {
    FIXED: "FIXED",
    EMPTY: "EMPTY",
    FINAL: "FINAL",
    DONE: "DONE",
    WRONG: "WRONG",
};

const CELL_NUM = 9;
const EMPTYVALUE = 0;

const CELL_SIZE = 70;

let speed = 10;

let puzzle = [...Array(CELL_NUM)].map((x) => Array(CELL_NUM));

class Cell {
    constructor(value_, state_) {
        this._value = value_;
        this._state = state_;
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

        switch (s) {
            case CELL_STATES.FIXED:
                this._color = "#D5D8DC";
                break;
            case CELL_STATES.EMPTY:
                this._color = "#FDFEFE";
                break;
            case CELL_STATES.FINAL:
                this._color = "#82CA9D";
                break;
            case CELL_STATES.DONE:
                this._color = "#FFF79A";
                break;
            case CELL_STATES.WRONG:
                this._color = "#F7977A";
                break;
            default:
                break;
        }
    }

    get color() {
        return this._color;
    }
}

function init() {
    let puzzleValues = [
        [0, 0, 2, 0, 0, 0, 5, 0, 0],
        [0, 1, 0, 7, 0, 5, 0, 2, 0],
        [4, 0, 0, 0, 9, 0, 0, 0, 7],
        [0, 4, 9, 0, 0, 0, 7, 3, 0],
        [8, 0, 1, 0, 3, 0, 4, 0, 9],
        [0, 3, 6, 0, 0, 0, 2, 1, 0],
        [2, 0, 0, 0, 8, 0, 0, 0, 4],
        [0, 8, 0, 9, 0, 2, 0, 6, 0],
        [0, 0, 7, 0, 0, 0, 8, 0, 0],
    ];

    for (let r = 0; r < CELL_NUM; r++) {
        for (let c = 0; c < CELL_NUM; c++) {
            puzzle[r][c] = new Cell(
                puzzleValues[r][c],
                puzzleValues[r][c] === 0 ? CELL_STATES.EMPTY : CELL_STATES.FIXED
            );

            let div = $("<div id=cell" + r + c + "></div>");
            div.addClass("cell");
            div.text(puzzle[r][c].value === 0 ? "" : puzzle[r][c].value);
            $("#game-area").append(div);
        }
    }
}

async function solveSudoku() {
    let row, col;
    for (let i = 0; i < CELL_NUM * CELL_NUM; i++) {
        row = Math.floor(i / CELL_NUM);
        col = i % CELL_NUM;

        if (puzzle[row][col].value === EMPTYVALUE) {
            for (let value = 1; value <= CELL_NUM; value++) {
                if (isValidCell(row, col, value)) {
                    puzzle[row][col].value = value;
                    puzzle[row][col].state = CELL_STATES.DONE;

                    update();
                    await sleep(speed);

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

    puzzle[row][col].state = CELL_STATES.WRONG;

    update();
    await sleep(speed);

    puzzle[row][col].value = EMPTYVALUE;
    puzzle[row][col].state = CELL_STATES.EMPTY;

    update();
    await sleep(speed);
}

function update() {
    $("#game-area").empty();

    for (let r = 0; r < CELL_NUM; r++) {
        for (let c = 0; c < CELL_NUM; c++) {
            let div = $("<div id=cell" + r + c + "></div>");
            div.addClass("cell");
            div.text(puzzle[r][c].value === 0 ? "" : puzzle[r][c].value);
            div.css("background-color", puzzle[r][c].color);
            $("#game-area").append(div);
        }
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function isValidCell(row, col, value) {
    //* check the current row
    for (let c = 0; c < CELL_NUM; c++) {
        if (puzzle[row][c].value === value) return false;
    }

    //* check the current column
    for (let r = 0; r < CELL_NUM; r++) {
        if (puzzle[r][col].value === value) return false;
    }

    //* check the current region (3x3 subgrid)
    let startRow = Math.floor(row / 3) * 3,
        startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            if (puzzle[r][c].value === value) return false;
        }
    }

    return true;
}

function hasEmptyCell() {
    for (let r = 0; r < CELL_NUM; r++) {
        for (let c = 0; c < CELL_NUM; c++) {
            if (puzzle[r][c].value === EMPTYVALUE) return true;
        }
    }

    return false;
}

$(function () {
    init();

    $("#btnSolve").click(function () {
        solveSudoku();
    });
});
