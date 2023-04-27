function main() {
    const numberOfVerticalLines = 40 - 1;
    const numberOfHorizontalLines = 20 - 1;
    const cellSize = 20;

    kaboom({
        width: cellSize * (numberOfVerticalLines + 1) + numberOfVerticalLines,
        height: cellSize * (numberOfHorizontalLines + 1) + numberOfHorizontalLines,
        background: [245, 245, 245],
    });

    scene("editor", editorScene);
    scene("game", gameScene);

    go("editor", numberOfHorizontalLines, numberOfVerticalLines, cellSize);
}

main();
