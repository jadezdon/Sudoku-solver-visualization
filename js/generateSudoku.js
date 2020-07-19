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

let speed = 5;
let isSolved = false;
let puzzle = [...Array(CELL_NUM)].map((x) => Array(CELL_NUM));

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

            let div = $("<div id=" + r + c + "></div>");
            div.addClass("cell");
            div.addClass(puzzle[r][c].state.toLowerCase());
            div.text(puzzle[r][c].value === 0 ? "" : puzzle[r][c].value);
            div.data("row", r).data("col", c);
            $("#game-area").append(div);
        }
    }
}
