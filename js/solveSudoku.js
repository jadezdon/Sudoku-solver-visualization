let solveVisualization = false;

async function solveSudoku() {
    let row, col;
    for (let i = 0; i < CELL_NUM * CELL_NUM; i++) {
        row = Math.floor(i / CELL_NUM);
        col = i % CELL_NUM;

        if (puzzle[row][col].value === EMPTYVALUE) {
            for (let value = 1; value <= CELL_NUM; value++) {
                if (isValidCell(row, col, value)) {
                    puzzle[row][col].value = value;
                    puzzle[row][col].state = CELL_STATES.FILLED;

                    updateScreen();
                    await sleep(speed);

                    if (!hasEmptyCell()) {
                        isSolved = true;
                        updateScreen();
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

    updateScreen();
    await sleep(speed);

    puzzle[row][col].value = EMPTYVALUE;
    puzzle[row][col].state = CELL_STATES.EMPTY;

    updateScreen();
    await sleep(speed);
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
