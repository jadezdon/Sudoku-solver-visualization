let selectedRowIndex = -1,
    selectedColIndex = -1;

function initSudoku() {
    for (let r = 0; r < CELL_NUM; r++) {
        for (let c = 0; c < CELL_NUM; c++) {
            let div = $("<div id=" + r + c + "></div>");
            div.addClass("cell");
            div.addClass(puzzle[r][c].state.toLowerCase());
            div.text(puzzle[r][c].value === 0 ? "" : puzzle[r][c].value);
            div.data("row", r).data("col", c);
            $("#game-area").append(div);
        }
    }
}

function highlight() {
    $("div").removeClass("highlight-area highlight-duplicate");

    for (let row = 0; row < CELL_NUM; row++) {
        $("#" + row + selectedColIndex).addClass("highlight-area");

        if (
            row !== selectedRowIndex &&
            puzzle[row][selectedColIndex].value !== EMPTYVALUE &&
            puzzle[row][selectedColIndex].value === puzzle[selectedRowIndex][selectedColIndex].value
        ) {
            $("#" + row + selectedColIndex).addClass("highlight-duplicate");
        }
    }

    for (let col = 0; col < CELL_NUM; col++) {
        $("#" + selectedRowIndex + col).addClass("highlight-area");

        if (
            col !== selectedColIndex &&
            puzzle[selectedRowIndex][col].value !== EMPTYVALUE &&
            puzzle[selectedRowIndex][col].value === puzzle[selectedRowIndex][selectedColIndex].value
        ) {
            $("#" + selectedRowIndex + col).addClass("highlight-duplicate");
        }
    }

    let startRow = Math.floor(selectedRowIndex / 3) * 3,
        startCol = Math.floor(selectedColIndex / 3) * 3;
    for (let row = startRow; row < startRow + 3; row++) {
        for (let col = startCol; col < startCol + 3; col++) {
            $("#" + row + col).addClass("highlight-area");

            if (
                row !== selectedRowIndex &&
                col !== selectedColIndex &&
                puzzle[row][col].value !== EMPTYVALUE &&
                puzzle[row][col].value === puzzle[selectedRowIndex][selectedColIndex].value
            ) {
                $("#" + row + col).addClass("highlight-duplicate");
            }
        }
    }
}

$(function () {
    generateSudoku(1);
    initSudoku();

    $(".cell").click(function (e) {
        let row = $(this).data().row,
            col = $(this).data().col;
        if (puzzle[row][col].state !== CELL_STATES.FIXED) {
            //* deselect previous cell
            if (selectedRowIndex !== -1 && selectedColIndex !== -1) {
                puzzle[selectedRowIndex][selectedColIndex].state =
                    puzzle[selectedRowIndex][selectedColIndex].value === EMPTYVALUE
                        ? CELL_STATES.EMPTY
                        : CELL_STATES.FILLED;
                $("#" + selectedRowIndex + selectedColIndex)
                    .removeClass()
                    .addClass("cell")
                    .addClass(puzzle[selectedRowIndex][selectedColIndex].state.toLowerCase());
            }

            selectedRowIndex = row;
            selectedColIndex = col;

            puzzle[selectedRowIndex][selectedColIndex].state = CELL_STATES.SELECTED;
            $("#" + selectedRowIndex + selectedColIndex)
                .removeClass()
                .addClass("cell")
                .addClass(puzzle[selectedRowIndex][selectedColIndex].state.toLowerCase());
            highlight();
        }
        // e.preventDefault();
    });

    $("#inputDelay").on("input", function () {
        delay = $(this).val();
        $("#delayValue").text("" + $(this).val() + " ms");
    });

    $("#btnSolve").click(async function (e) {
        $("input").prop("disabled", true);
        $("button").prop("disabled", true);
        initSudoku();

        solveVisualization = true;
        await solveSudokuVisu();

        $("#btnNew").prop("disabled", false);
        // e.preventDefault();
    });

    $("#btnNew").click(function (e) {
        // $("#game-area").empty();
        // generateSudoku(3);
        // initSudoku();

        // $("input").prop("disabled", false);
        // $("button").prop("disabled", false);
        // e.preventDefault();
        location.reload();
    });

    $("#btnErase").click(function () {
        if (selectedRowIndex !== -1 && selectedColIndex !== -1) {
            puzzle[selectedRowIndex][selectedColIndex].value = EMPTYVALUE;
            $("#" + selectedRowIndex + selectedColIndex).text("");
            highlight();
        }
    });

    $(".btnNumber").click(function () {
        if (selectedRowIndex !== -1 && selectedColIndex !== -1) {
            puzzle[selectedRowIndex][selectedColIndex].value = $(this).data().number;

            $("#" + selectedRowIndex + selectedColIndex).text(puzzle[selectedRowIndex][selectedColIndex].value);
            $("#" + selectedRowIndex + selectedColIndex)
                .removeClass()
                .addClass("cell")
                .addClass(puzzle[selectedRowIndex][selectedColIndex].state.toLowerCase());

            highlight();
        }
    });
});
