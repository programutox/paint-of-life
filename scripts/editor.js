function getButtonsInfo() {
    const tags = ["text", /*"mode",*/ "erase", "color", "start"];

    const createInfo = (tag, i) => {
        const size = 32;
        const pos = vec2(10, 10 + (size + 5) * i);
        return {
            tag,
            pos,
            rect: new Rect(pos, size, size), 
        }
    };

    return tags.map(createInfo);
}

function getInstructionsTexts() {
    return [
        "Hold left click to add cells",
        "Hold right click to remove cells",
        "Press E to erase all the cells",
        "Press Enter to start the game",
        "Press Escape in game to go back to editor",
        "Press Space to hide the texts",
        "Press a numeric key to change next cells color",
    ];
}

function initializeCells(numberOfHorizontalLines, numberOfVerticalLines, cellSize) {
    let cells = [];

    for (let i = 0; i <= numberOfVerticalLines; ++i) {
        let row = [];
        for (let j = 0; j <= numberOfHorizontalLines; ++j) {
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

    for (let row of cells) {
        const cell = row.find(value => testRectPoint(cellRect(value), mousePos()));

        if (cell === undefined) {
            continue;
        }

        const cellColor = rgb(cell.r, cell.g, cell.b);

        if (isMouseDown("left") && !(cell.alive && cellColor.eq(selectedColor))) {
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
        pos: vec2(cell.x + 0.5, cell.y - 0.5),
        color: rgb(cell.r, cell.g, cell.b),
    });
    
    for (const row of cells) {
        row.filter(value => value.alive)
           .forEach(drawCell);
    }
}

function editorScene(numberOfHorizontalLines, numberOfVerticalLines, cellSize, initialCells=null, cursorColor=null) {
    let showInfo = true;
    let cells = initialCells === null ? initializeCells(numberOfHorizontalLines, numberOfVerticalLines, cellSize) : initialCells;

    const numericKeys = "1234567890".split("");
    const colors = [RED, GREEN, BLUE, YELLOW, MAGENTA, CYAN, rgb(154, 79, 52), rgb(179, 26, 255), rgb(128, 128, 128), BLACK];
    let selectedColor = cursorColor === null ? BLACK : cursorColor;

    const launchGame = () => go("game", numberOfHorizontalLines, numberOfVerticalLines, cells, selectedColor);

    const updateKeys = () => {
        if (isKeyPressed("space")) {
            showInfo = !showInfo;
        } else if (isKeyPressed("e")) {
            cells = initializeCells(numberOfHorizontalLines, numberOfVerticalLines, cellSize);
        } else if (isKeyPressed("enter")) {
            launchGame();
        }
    };

    const updateCursorColor = () => {
        const keyPressedIndex = numericKeys.findIndex(key => isKeyPressed(key));
        if (keyPressedIndex !== -1) {
            selectedColor = colors[keyPressedIndex];
        }
    }

    onUpdate(() => {
        setCursor("none");

        if (!isTouchScreen()) {
            updateKeys();
            updateCursorColor();
            updateCells(cells, selectedColor);
            return;
        }

        const buttonsToCheck = showInfo ? instructions.buttonsInfo : [instructions.buttonsInfo[0]];

        const button = buttonsToCheck.find(
            buttonInfo => testRectPoint(buttonInfo.rect, mousePos()) && isMousePressed()
        );
        
        if (button === undefined) {
            updateCursorColor();
            updateCells(cells, selectedColor);
            return;
        }

        switch (button.tag) {
            case "text":
                showInfo = !showInfo;
                break;
            
            case "erase":
                cells = initializeCells(numberOfHorizontalLines, numberOfVerticalLines, cellSize);
                break;
            
            case "color":
                let index = colors.findIndex(color => color.eq(selectedColor));
                index = index === colors.length - 1 ? 0 : index + 1;
                selectedColor = colors[index];
                break;
            
            case "start":
                launchGame();
                break;
        
            default:
                throw RangeError(`The button tag "${button.tag}" is not handled.`);
        }

        updateCursorColor();
        updateCells(cells, selectedColor);
    });

    const instructions = {};
    if (isTouchScreen()) {
        instructions["buttonsInfo"] = getButtonsInfo();
    } else {
        instructions["texts"] = getInstructionsTexts();
    }

    const instructionSize = 20;
    const drawCursor = () => { 
        if (!isTouchScreen()) { 
            drawSprite({
                sprite: "cursor",
                pos: mousePos(),
                color: selectedColor,
                scale: 1 / 8,
            });
        }
    };

    const drawButton = (buttonInfo) => drawSprite({
        sprite: buttonInfo.tag,
        pos: buttonInfo.pos,
        scale: 2,
    });

    const instructionsRectWidth = (cellSize + 1) * 28 - 1;
    const instructionsRectHeight = (cellSize + 1) * 9;

    onDraw(() => {
        drawHorizontalLines(numberOfHorizontalLines, cellSize);
        drawVerticalLines(numberOfVerticalLines, cellSize);

        drawCells(cells);

        if (!showInfo) {
            if (isTouchScreen()) {
                const buttonInfo = instructions.buttonsInfo[0];
                drawButton(buttonInfo)
            }
            drawCursor();
            return;
        }

        if (isTouchScreen()) {
            instructions.buttonsInfo.forEach(drawButton);
            drawRect({
                width: 32,
                height: 32,
                pos: vec2(10, 10 + (32 + 5) * 4),
                color: selectedColor,
                outline: { color: BLACK, width: 2 },
            });
            return;
        }

        drawRect({
            width: instructionsRectWidth,
            height: instructionsRectHeight,
            color: Color.fromHex(0x3A4454),
        });

        instructions.texts.forEach((value, i) => {
            drawText({
                text: value,
                size: instructionSize,
                pos: vec2(10, 10 + (instructionSize + 5) * i),
                color: Color.fromHex(0xF5DDDD),
            });
        });

        drawCursor();
    });
}