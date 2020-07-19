let selectedRowIndex = -1,
    selectedColIndex = -1;

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
    init();

    $(".cell").click(function () {
        // console.log($(this).data());

        let row = $(this).data().row,
            col = $(this).data().col;
        if (puzzle[row][col].state !== CELL_STATES.FIXED) {
            //* deselect previouse cell
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
    });

    $("input[type=range]").on("input", function () {
        // console.log($(this).val());
        speed = 1000 - $(this).val();
        $("#speedValue").text($(this).val());
    });

    $("#btnSolve").click(async function () {
        $("input").prop("disabled", true);
        $("button").prop("disabled", true);
        init();

        solveVisualization = true;
        await solveSudoku();
        $("input").prop("disabled", false);
        $("button").prop("disabled", false);
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
            // puzzle[selectedRowIndex][selectedColIndex].state = CELL_STATES.FILLED;

            $("#" + selectedRowIndex + selectedColIndex).text(puzzle[selectedRowIndex][selectedColIndex].value);
            $("#" + selectedRowIndex + selectedColIndex)
                .removeClass()
                .addClass("cell")
                .addClass(puzzle[selectedRowIndex][selectedColIndex].state.toLowerCase());

            highlight();

            // selectedRowIndex = -1;
            // selectedColIndex = -1;
        }
    });
});
