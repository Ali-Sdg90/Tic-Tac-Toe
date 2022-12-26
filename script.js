const XOBlocks = Array.from(document.querySelectorAll("#lines div"));
let playerXO = "X"; //temp
let opponentXO = "O"; //temp
let XOMatrix = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
];
let possibleOpponentPlace = [];
for (let i in XOBlocks) {
    XOBlocks[i].addEventListener("click", function () {
        if (!XOBlocks[i].textContent) {
            XOBlocks[i].textContent = playerXO;
            XOBlocks[i].style.cursor = "default";
            XOMatrix[Math.floor(i / 3)][Math.floor(i % 3)] = playerXO;
            changeColor();
            console.log("----------");
            if (!lineFinder(playerXO, 3, endGame)) {
                // console.log("STEP 2:")
                possibleOpponentPlace = [];
                if (lineFinder(opponentXO, 2, blockFinder)) {
                    console.log("Win Move");
                } else if (lineFinder(playerXO, 2, blockFinder)) {
                    console.log("Counter Move");
                } else {
                    console.log("Random Move");
                    // console.log(XOMatrix.join("\n"));
                    for (let i = 0; i < 3; i++) {
                        for (let j = 0; j < 3; j++) {
                            if (!XOMatrix[i][j]) {
                                possibleOpponentPlace.push([i, j]);
                            }
                        }
                    }
                }
                randomPlace =
                    possibleOpponentPlace[
                        Math.floor(Math.random() * possibleOpponentPlace.length)
                    ];
                // console.log("randomPlace", randomPlace);
                if (randomPlace) {
                    XOMatrix[randomPlace[0]][randomPlace[1]] = opponentXO;
                }
                for (let k in XOBlocks) {
                    XOBlocks[k].textContent =
                        XOMatrix[Math.floor(k / 3)][Math.floor(k % 3)];
                }
                cursorDefaulter();
                if (lineFinder(opponentXO, 3, endGame)) {
                }
            }
            console.log("==========");
        }
    });
}
function cursorDefaulter() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (XOMatrix[i][j]) XOBlocks[3 * i + j].style.cursor = "default";
        }
    }
}
function lineFinder(ckeckFor, countTo, endGameOrCounterMove) {
    // console.log(XOMatrix.join("\n"));
    let inlineCounter;
    let outputFunction;
    for (let i = 0; i < 3; i++) {
        inlineCounter = 0;
        for (let j = 0; j < 3; j++) {
            if (XOMatrix[i][j] == ckeckFor) inlineCounter++;
            else if(XOMatrix[i][j]) inlineCounter--;
        }
        if (inlineCounter == countTo) {
            endGameOrCounterMove(i + 1, false, false);
            outputFunction = true;
        }
    }
    for (let i = 0; i < 3; i++) {
        inlineCounter = 0;
        for (let j = 0; j < 3; j++) {
            if (XOMatrix[j][i] == ckeckFor) inlineCounter++;
            else if(XOMatrix[j][i]) inlineCounter--;
        }
        if (inlineCounter == countTo) {
            endGameOrCounterMove(false, i + 1, false);
            outputFunction = true;
        }
    }
    inlineCounter = 0;
    for (let i = 0; i < 3; i++) {
        if (XOMatrix[i][i] == ckeckFor) inlineCounter++;
        else if(XOMatrix[i][i]) inlineCounter--;
    }
    if (inlineCounter == countTo) {
        endGameOrCounterMove(false, 1, true);
        outputFunction = true;
    }
    inlineCounter = 0;
    let j = 2;
    for (let i = 0; i < 3; i++) {
        if (XOMatrix[i][j--] == ckeckFor) inlineCounter++;
        else if(XOMatrix[i][j+1]) inlineCounter--;
    }
    if (inlineCounter == countTo) {
        endGameOrCounterMove(false, 2, true);
        outputFunction = true;
    }
    if (outputFunction == true) return true;
    return false;
}
function endGame(i, j, diagonal) {
    console.log("Game Over");
    if (!diagonal && i) lineGrider(i);
    if (!diagonal && j) lineGrider(j + 3);
    if (diagonal && j) lineGrider(j + 6);
}
function blockFinder(i, j, diagonal) {
    // console.log(i, j, diagonal);
    if (!diagonal && i) {
        i--;
        for (let j = 0; j < 3; j++) {
            if (!XOMatrix[i][j]) {
                possibleOpponentPlace.push([i, j]);
            }
        }
    }
    if (!diagonal && j) {
        j--;
        for (let i = 0; i < 3; i++) {
            if (!XOMatrix[i][j]) {
                possibleOpponentPlace.push([i, j]);
            }
        }
    }
    if (diagonal && j) {
        switch (j) {
            case 1:
                for (let i = 0; i < 3; i++) {
                    if (!XOMatrix[i][i]) {
                        possibleOpponentPlace.push([i, i]);
                    }
                }
                break;
            case 2:
                let k = 3;
                for (let i = 0; i < 3; i++) {
                    k--;
                    if (!XOMatrix[i][k]) {
                        possibleOpponentPlace.push([i, k]);
                    }
                }
        }
    }
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
