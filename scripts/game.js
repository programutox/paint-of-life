function countAliveNeighborsWithLastColor(cells, x, y) {
    const between = (left, a, right) => left <= a && a < right;

    let count = 0;
    let lastColor = BLACK;

    for (let i = -1; i <= 1; ++i) {
        for (let j = -1; j <= 1; ++j) {
            if (i === 0 && j === 0) {
                continue;
            }

            const neighborX = x + i;
            const neighborY = y + j;

            if (between(0, neighborX, cells.length) && between(0, neighborY, cells[0].length) && cells[neighborX][neighborY].alive) {
                ++count;

                const neighbor = cells[neighborX][neighborY];
                lastColor = rgb(neighbor.r, neighbor.g, neighbor.b);
            }
        }
    }

    return [count, lastColor];
}

function getNextGenerationAlive(cells) {
    let nextGenerationAlive = [];

    for (let x = 0; x < cells.length; ++x) {
        let row = [];
        for (let y = 0; y < cells[x].length; ++y) {
            const [numberOfAliveNeighbors, color] = countAliveNeighborsWithLastColor(cells, x, y);
            const isAlive = cells[x][y].alive;

            if (!isAlive && numberOfAliveNeighbors === 3) {
                row.push(true);
                cells[x][y].r = color.r;
                cells[x][y].g = color.g;
                cells[x][y].b = color.b;
            } else if (isAlive && (numberOfAliveNeighbors < 2 || numberOfAliveNeighbors > 3)) {
                row.push(false);
            } else {
                row.push(isAlive);
            }
        }
        nextGenerationAlive.push(row);
    }

    return nextGenerationAlive;
}

function gameScene(numberOfHorizontalLines, numberOfVerticalLines, cells) {
    const initialCells = structuredClone(cells);

    const timeStep = 0.15;
    const cellSize = cells[0][0].size;

    let elapsedTime = 0;
    let step = 0;

    onUpdate(() => {
        if (isKeyPressed("escape")) {
            go("editor", numberOfHorizontalLines, numberOfVerticalLines, cellSize, initialCells);
        }

        if (time() - elapsedTime < timeStep) {
            return;
        }
        
        let nextGenerationAlive = getNextGenerationAlive(cells);

        for (let x = 0; x < cells.length; ++x) {
            for (let y = 0; y < cells[x].length; ++y) {
                cells[x][y].alive = nextGenerationAlive[x][y];
            }
        }
        
        ++step;
        elapsedTime = time();
    });

    onDraw(() => {
        drawHorizontalLines(numberOfHorizontalLines, cellSize);
        drawVerticalLines(numberOfVerticalLines, cellSize);

        drawCells(cells);

        drawSprite({
            sprite: "cursor",
            pos: mousePos(),
            color: BLACK,
            scale: 1 / 8,
        })

        drawText({
            text: step.toString(),
            size: 20,
            pos: vec2(10, 10),
            color: RED,
        });
    });
}