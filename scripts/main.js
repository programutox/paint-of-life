function main() {
    const numberOfVerticalLines = 40 - 1;
    const numberOfHorizontalLines = 20 - 1;
    const cellSize = 20;

    kaboom({
        width: cellSize * (numberOfVerticalLines + 1) + numberOfVerticalLines,
        height: cellSize * (numberOfHorizontalLines + 1) + numberOfHorizontalLines,
        background: [245, 245, 245],
        debug: false,
    });

    const tags = ["color", "cursor", "erase", "mode", "start", "text"];
    tags.forEach(tag => loadSprite(tag, `./assets/${tag}.png`));

    scene("editor", editorScene);
    scene("game", gameScene);

    go("editor", numberOfHorizontalLines, numberOfVerticalLines, cellSize);
}

main();
