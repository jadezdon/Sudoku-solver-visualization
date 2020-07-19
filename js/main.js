let selectedRowIndex = -1,
    selectedColIndex = -1;

function highlight() {
    $("div").removeClass("highlight-area highlight-duplicate");

    for (let row = 0; row < CELL_NUM; row++) {
        $("#" + row + selectedColIndex).addClass("highlight-area");

        if (
            row !== selectedRowIndex &&
            puzzle[row][selectedColIndex].value === puzzle[selectedRowIndex][selectedColIndex].value
        ) {
            $("#" + row + selectedColIndex).addClass("highlight-duplicate");
        }
    }

    for (let col = 0; col < CELL_NUM; col) {
        $("#" + selectedRowIndex + col).addClass("highlight-area");

        if (
            col !== selectedColIndex &&
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
                puzzle[row][col].value === puzzle[selectedRowIndex][selectedColIndex].value
            ) {
                $("#" + row + col).addClass("highlight-duplicate");
            }
        }
    }
}

$(function () {
    init();

    $("#btnSolve").click(function () {
        $("input").prop("disabled", true);
        $("button").prop("disabled", true);

        solveVisualization = true;
        solveSudoku();
    });

    $(".cell").click(function () {
        // console.log($(this).data());

        let row = $(this).data().row,
            col = $(this).data().col;
        if (puzzle[row][col].state !== CELL_STATES.FIXED) {
            if (selectedRowIndex !== -1 && selectedColIndex !== -1) {
                puzzle[selectedRowIndex][selectedColIndex].state =
                    puzzle[selectedRowIndex][selectedColIndex].state === EMPTYVALUE
                        ? CELL_STATES.EMPTY
                        : CELL_STATES.FILLED;
                $("#" + selectedRowIndex + selectedColIndex)
                    .removeClass()
                    .addClass("cell")
                    .addClass(puzzle[selectedRowIndex][selectedColIndex].state.toLowerCase());
            }

            puzzle[row][col].state = CELL_STATES.SELECTED;
            $("#" + row + col)
                .removeClass()
                .addClass("cell")
                .addClass(puzzle[row][col].state.toLowerCase());

            selectedRowIndex = row;
            selectedColIndex = col;

            // highlight();
        }
    });

    $(".btnNumber").click(function () {
        if (selectedRowIndex !== -1 && selectedColIndex !== -1) {
            puzzle[selectedRowIndex][selectedColIndex].value = $(this).data().number;
            // puzzle[selectedRowIndex][selectedColIndex].state = CELL_STATES.FILLED;

            $("#" + selectedRowIndex + selectedColIndex).text(puzzle[selectedRowIndex][selectedColIndex].value);
            $("#" + selectedRowIndex + selectedColIndex)
                .removeClass()
                .addClass("cell")
                .addClass(puzzle[selectedRowIndex][selectedColIndex].state.toLowerCase());

            // selectedRowIndex = -1;
            // selectedColIndex = -1;
        }
    });
});
