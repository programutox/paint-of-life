function createCells(numberOfHorizontalLines, numberOfVerticalLines, cellSize) {
    let cells = [];

    for (let i = 0; i <= numberOfVerticalLines; ++i) {
        let row = [];
        for (let j = 0; j <= numberOfHorizontalLines; ++j) {
            // vec2 and rgb functions cannot be used. Because of serialization, structured behaves strangely.
            row.push({
                alive: false,
                x: i * (cellSize + 1) - 1,
                y: j * (cellSize + 1),
                size: cellSize,
                r: 0,
                g: 0,
                b: 0
            });
        }
        cells.push(row);
    }

    return cells;
}

function updateCells(cells, selectedColor) {
    const cellRect = cell => new Rect(vec2(cell.x, cell.y), cell.size, cell.size);
    const colorsEqual = (c1, c2) => c1.r === c2.r && c1.g === c2.g && c1.b === c2.b;

    for (let row of cells) {
        const cell = row.find(value => testRectPoint(cellRect(value), mousePos()));

        if (cell === undefined) {
            continue;
        }

        const cellColor = rgb(cell.r, cell.g, cell.b);

        if (isMouseDown("left") && !(cell.alive && colorsEqual(cellColor, selectedColor))) {
            cell.r = selectedColor.r;
            cell.g = selectedColor.g;
            cell.b = selectedColor.b;
            cell.alive = true;
        } else if (isMouseDown("right") && cell.alive) {
            cell.alive = false;
        }
    }
}

function drawGrayLine(p1, p2) {
    drawLine({
        p1,
        p2,
        width: 1,
        color: rgb(128, 128, 128),
    });
}

function drawHorizontalLines(numberOfHorizontalLines, cellSize) {
    for (let i = 0; i < numberOfHorizontalLines; ++i) {
        const y = cellSize * (i + 1) + i;

        drawGrayLine(
            vec2(0, y),
            vec2(width(), y)
        );
    }
}

function drawVerticalLines(numberOfVerticalLines, cellSize) {
    for (let i = 0; i < numberOfVerticalLines; ++i) {
        const x = cellSize * (i + 1) + i;
        
        drawGrayLine(
            vec2(x, 0),
            vec2(x, height())
        );
    }
}

function drawCells(cells) {
    const drawCell = cell => drawRect({
        width: cell.size,
        height: cell.size,
        pos: vec2(cell.x, cell.y),
        color: rgb(cell.r, cell.g, cell.b),
    });
    
    for (const row of cells) {
        row.filter(value => value.alive)
           .forEach(drawCell);
    }
}

function editorScene(numberOfHorizontalLines, numberOfVerticalLines, cellSize, initialCells=null) {
    let showText = true;
    let cells = initialCells === null ? createCells(numberOfHorizontalLines, numberOfVerticalLines, cellSize) : initialCells;

    const numericKeys = "1234567890".split("");
    const colors = [RED, GREEN, BLUE, YELLOW, MAGENTA, CYAN, rgb(154, 79, 52), rgb(179, 26, 255), rgb(128, 128, 128), BLACK];
    let selectedColor = BLACK;

    const getColorFromKey = (key) => {
        const index = numericKeys.findIndex(value => value === key);
        return colors[index];
    };

    onUpdate(() => {
        if (isKeyPressed("space")) {
            showText = !showText;
        } else if (isKeyPressed("e")) {
            cells = createCells(numberOfHorizontalLines, numberOfVerticalLines, cellSize);
        } else if (isKeyPressed("enter")) {
            go("game", numberOfHorizontalLines, numberOfVerticalLines, cells);
        }

        for (const key of numericKeys) {
            if (isKeyPressed(key)) {
                selectedColor = getColorFromKey(key);
            }
        }

        updateCells(cells, selectedColor);
    });

    const instructions = [
        "Hold left click to add cells",
        "Hold right click to remove cells",
        "Press E to erase all the cells",
        "Press Enter to start the game",
        "Press Escape in game to go back to editor",
        "Press Space to hide the texts",
        "Press a numeric key to change next cells color",
    ];

    const instruction_size = 20;

    onDraw(() => {
        drawHorizontalLines(numberOfHorizontalLines, cellSize);
        drawVerticalLines(numberOfVerticalLines, cellSize);

        drawCells(cells);

        if (!showText) {
            return;
        }

        instructions.forEach((value, i) => {
            drawText({
                text: value,
                size: instruction_size,
                pos: vec2(10, 10 + (instruction_size + 5) * i),
                color: BLACK,
            });
        });
    });
}