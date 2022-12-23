const XOBlocks = Array.from(document.querySelectorAll("#lines div"));
let playerXO;
let XOMatrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
];
for (let i in XOBlocks) {
    XOBlocks[i].addEventListener("click", function () {
        if (!XOBlocks[i].textContent) {
            XOBlocks[i].textContent = playerXO;
            XOBlocks[i].style.cursor = "default";
            console.log(i, Math.floor(i / 3), Math.floor(i % 3));
            XOMatrix[Math.floor(i / 3)][Math.floor(i % 3)] = playerXO;
            endGameChecker(playerXO);
            changeColor();
        }
    });
}
function endGameChecker(ckeckFor) {
    let inlineCounter;
    for (let i = 0; i < 3; i++) {
        inlineCounter = 0;
        for (let j = 0; j < 3; j++) {
            if (XOMatrix[i][j] == ckeckFor) inlineCounter++;
        }
        if (inlineCounter == 3) endGame(++i, false, false);
    }
    for (let i = 0; i < 3; i++) {
        inlineCounter = 0;
        for (let j = 0; j < 3; j++) {
            if (XOMatrix[j][i] == ckeckFor) inlineCounter++;
        }
        if (inlineCounter == 3) endGame(false, ++i, false);
    }
    if (
        XOMatrix[0][0] == ckeckFor &&
        XOMatrix[1][1] == ckeckFor &&
        XOMatrix[2][2] == ckeckFor
    )
        endGame(false, 1, true);
    if (
        XOMatrix[0][2] == ckeckFor &&
        XOMatrix[1][1] == ckeckFor &&
        XOMatrix[2][0] == ckeckFor
    )
        endGame(false, 2, true);
}
function endGame(i, j, diagonal) {
    console.log("Game Over");
    console.log(i, j, diagonal);
    if (!diagonal && i) lineGrider(i);
    if (!diagonal && j) lineGrider(j + 3);
    if (diagonal && j) lineGrider(j + 6);
}
function lineGrider(num) {
    document.getElementById("win-horizontal-lines").style.display = "grid";
    document.getElementById("win-vertical-lines").style.display = "grid";
    document.getElementById("win-diagonal-lines").style.display = "grid";
    document.getElementById(`win-line${num}`).style.opacity = "1";
}
let rgbSaver = [];
const root = document.querySelector(":root");
function changeColor() {
    for (let i = 0; i < 3; i++)
        rgbSaver.push(Math.floor(Math.random() * 226 + 30));
    console.log(rgbSaver);
    root.style.cssText = `
    --background-color: rgb(${rgbSaver[0]}, ${rgbSaver[1]}, ${rgbSaver[2]});
    --game-color: rgb(${rgbSaver[0] / 2}, ${rgbSaver[1] / 2}, ${
        rgbSaver[2] / 2
    });
    --lineColor: rgb(${rgbSaver[0] / 3}, ${rgbSaver[1] / 3}, ${
        rgbSaver[2] / 3
    });
    `;
    for (let i = 0; i < 3; i++) rgbSaver.pop();
}
const xBtn = document.getElementById("x-btn");
xBtn.addEventListener("click", function () {
    playerXO = "X";
    xoChoose(xBtn);
});
const oBtn = document.getElementById("o-btn");
oBtn.addEventListener("click", function () {
    playerXO = "O";
    xoChoose(oBtn);
});
const chooseXOPage = document.getElementById("choose-xo");
function xoChoose(XO) {
    XO.style.opacity = 0.5;
    XO.style.transform = "translate(0, 4px)";
    XO.style.boxShadow = "0px 1px 5px var(--lineColor)";
    chooseXOPage.style.opacity = "1";

    chooseXOPage.style.opacity = "0";
    setTimeout(() => {
        chooseXOPage.style.display = "none";
    }, 650);
}
setTimeout(() => {
    document.getElementsByTagName("body")[0].style.transition = "0.7s";
    chooseXOPage.style.transition = "0.5s 0.3s";
    xBtn.style.transition = "0.2s";
    oBtn.style.transition = "0.2s";
}, 100);
