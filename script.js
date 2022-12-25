const XOBlocks = Array.from(document.querySelectorAll("#lines div"));
let playerXO = "X"; //temp
let opponentXO = "O"; //temp
let XOMatrix = [
    ["-", "-", "-"],
    ["-", "-", "-"],
    ["-", "-", "-"],
];
for (let i in XOBlocks) {
    XOBlocks[i].addEventListener("click", function () {
        if (!XOBlocks[i].textContent) {
            XOBlocks[i].textContent = playerXO;
            XOBlocks[i].style.cursor = "default";
            console.log(i, Math.floor(i / 3), Math.floor(i % 3));
            XOMatrix[Math.floor(i / 3)][Math.floor(i % 3)] = playerXO;
            changeColor();
            if (!lineChecker(playerXO, 3, endGame)) {
                if (lineChecker(playerXO, 2, opponentCounterMove)) {
                }
            }
        }
    });
}
function lineChecker(ckeckFor, countTo, endGameOrCounterMove) {
    let inlineCounter;
    let outputFunction;
    for (let i = 0; i < 3; i++) {
        inlineCounter = 0;
        for (let j = 0; j < 3; j++) {
            if (XOMatrix[i][j] == ckeckFor) inlineCounter++;
        }
        if (inlineCounter == countTo) {
            endGameOrCounterMove(++i, false, false);
            outputFunction = true;
        }
    }
    for (let i = 0; i < 3; i++) {
        inlineCounter = 0;
        for (let j = 0; j < 3; j++) {
            if (XOMatrix[j][i] == ckeckFor) inlineCounter++;
        }
        if (inlineCounter == countTo) {
            endGameOrCounterMove(false, ++i, false);
            outputFunction = true;
        }
    }
    inlineCounter = 0;
    if (XOMatrix[0][0] == ckeckFor) inlineCounter++;
    if (XOMatrix[1][1] == ckeckFor) inlineCounter++;
    if (XOMatrix[2][2] == ckeckFor) inlineCounter++;
    if (inlineCounter == countTo) {
        endGameOrCounterMove(false, 1, true);
        outputFunction = true;
    }
    inlineCounter = 0;
    if (XOMatrix[0][2] == ckeckFor) inlineCounter++;
    if (XOMatrix[1][1] == ckeckFor) inlineCounter++;
    if (XOMatrix[2][0] == ckeckFor) inlineCounter++;
    if (inlineCounter == countTo) {
        endGameOrCounterMove(false, 2, true);
        outputFunction = true;
    }
    if (outputFunction == true) return true;
    return false;
}
function endGame(i, j, diagonal) {
    console.log("Game Over");
    console.log(i, j, diagonal);
    if (!diagonal && i) lineGrider(i);
    if (!diagonal && j) lineGrider(j + 3);
    if (diagonal && j) lineGrider(j + 6);
}
function opponentCounterMove(i, j, diagonal) {
    console.log("Counter Move");
    console.log(i, j, diagonal);
    if (!diagonal && i) {
        i--;
        for (let j = 0; j < 3; j++) {
            // console.log(i, j);
            // console.log(XOMatrix[i][j]);
            if (XOMatrix[i][j] == "-") XOMatrix[i][j] = opponentXO;
            return;
        }
    }
    if (!diagonal && j) {
        j--;
        for (let i = 0; i < 3; i++) {
            // console.log(i, j);
            // console.log(XOMatrix[i][j]);
            if (XOMatrix[i][j] == "-") XOMatrix[i][j] = opponentXO;
            return;
        }
    }
    if (diagonal && j) {
        let k = 0;
        for (let i = 0; i < 3; i++) {
            if (XOMatrix[i][i] == "-") XOMatrix[i][i] = opponentXO;
            return;
        }
        //HERE!
        if (XOMatrix[1][1] == "-") XOMatrix[1][1] = opponentXO;
        if (XOMatrix[2][2] == "-") XOMatrix[2][2] = opponentXO;
    }
    if (diagonal && j) {
        if (XOMatrix[0][2] == "-") XOMatrix[0][2] = opponentXO;
        if (XOMatrix[1][1] == "-") XOMatrix[1][1] = opponentXO;
        if (XOMatrix[2][0] == "-") XOMatrix[2][0] = opponentXO;
    }
    for (let k in XOBlocks)
        XOBlocks[k].textContent =
            XOMatrix[Math.floor(k / 3)][Math.floor(k % 3)];
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
    // console.log(rgbSaver);
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
// const xBtn = document.getElementById("x-btn");
// xBtn.addEventListener("click", function () {
//     playerXO = "X";
//     opponentXO = "O";
//     xoChoose(xBtn);
// });
// const oBtn = document.getElementById("o-btn");
// oBtn.addEventListener("click", function () {
//     playerXO = "O";
//     opponentXO = "X";
//     xoChoose(oBtn);
// });
// const chooseXOPage = document.getElementById("choose-xo");
// function xoChoose(XO) {
//     XO.style.opacity = 0.5;
//     XO.style.transform = "translate(0, 4px)";
//     XO.style.boxShadow = "0px 1px 5px var(--lineColor)";
//     chooseXOPage.style.opacity = "1";

//     chooseXOPage.style.opacity = "0";
//     setTimeout(() => {
//         chooseXOPage.style.display = "none";
//     }, 650);
// }
// setTimeout(() => {
//     document.getElementsByTagName("body")[0].style.transition = "0.7s";
//     chooseXOPage.style.transition = "0.5s 0.3s";
//     xBtn.style.transition = "0.2s";
//     oBtn.style.transition = "0.2s";
// }, 100);
