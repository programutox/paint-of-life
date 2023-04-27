function createCells(numberOfHorizontalLines, numberOfVerticalLines, cellSize) {
    let cells = [];

    for (let i = 0; i <= numberOfVerticalLines; ++i) {
        let row = [];
        for (let j = 0; j <= numberOfHorizontalLines; ++j) {
            row.push({
                alive: false,
                x: i * (cellSize + 1) - 1,
                y: j * (cellSize + 1),
                size: cellSize,
            });
        }
        cells.push(row);
    }

    return cells;
}

function updateCells(cells) {
    const cellRect = cell => new Rect(vec2(cell.x, cell.y), cell.size, cell.size);

    for (let row of cells) {
        const cell = row.find(value => testRectPoint(cellRect(value), mousePos()));

        if (cell === undefined) {
            continue;
        }

        if (isMouseDown("left") && !cell.alive) {
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
        color: BLACK,
    });
    
    for (const row of cells) {
        row.filter(value => value.alive)
           .forEach(drawCell);
    }
}

function editorScene(numberOfHorizontalLines, numberOfVerticalLines, cellSize, initialCells=null) {
    let showText = true;
    let cells = initialCells === null ? createCells(numberOfHorizontalLines, numberOfVerticalLines, cellSize) : initialCells;

    onUpdate(() => {
        if (isKeyPressed("space")) {
            showText = !showText;
        } else if (isKeyPressed("e")) {
            cells = createCells(numberOfHorizontalLines, numberOfVerticalLines, cellSize);
        } else if (isKeyPressed("enter")) {
            go("game", numberOfHorizontalLines, numberOfVerticalLines, cells);
        }

        updateCells(cells);
    });

    const instructions = [
        "Hold left click to add cells",
        "Hold right click to remove cells",
        "Press E to erase all the cells",
        "Press Enter to start the game",
        "Press Escape in game to go back to editor",
        "Press Space to hide the texts",
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