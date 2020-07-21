let solveVisualization = false;
let delay = 10;

let isSolved = false;

async function solveSudokuVisu() {
    let row, col;
    for (let i = 0; i < CELL_NUM * CELL_NUM; i++) {
        row = Math.floor(i / CELL_NUM);
        col = i % CELL_NUM;

        if (puzzle[row][col].value === EMPTYVALUE) {
            for (let value = 1; value <= CELL_NUM; value++) {
                if (isValidCell(puzzle, row, col, value)) {
                    puzzle[row][col].value = value;
                    puzzle[row][col].state = CELL_STATES.FILLED;

                    updateScreen();
                    await sleep(delay);

                    if (!hasEmptyCell(puzzle)) {
                        isSolved = true;
                        updateScreen();
                        return true;
                    } else {
                        if (await solveSudokuVisu()) {
                            return true;
                        }
                    }
                }
            }

            break;
        }
    }

    puzzle[row][col].state = CELL_STATES.WRONG;

    updateScreen();
    await sleep(delay);

    puzzle[row][col].value = EMPTYVALUE;
    puzzle[row][col].state = CELL_STATES.EMPTY;

    updateScreen();
    await sleep(delay);
}

function updateScreen() {
    $("#game-area").empty();

    for (let r = 0; r < CELL_NUM; r++) {
        for (let c = 0; c < CELL_NUM; c++) {
            if (solveVisualization && isSolved && puzzle[r][c].state !== CELL_STATES.FIXED) {
                puzzle[r][c].state = CELL_STATES.FINAL;
            }

            let div = $("<div id=" + r + c + "></div>");
            div.addClass("cell");
            div.addClass(puzzle[r][c].state.toLowerCase());
            div.text(puzzle[r][c].value === 0 ? "" : puzzle[r][c].value);
            div.data("row", r).data("col", c);
            $("#game-area").append(div);
        }
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
