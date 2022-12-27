const XOBlocks = Array.from(document.querySelectorAll("#lines div"));
const disableClick = document.getElementById("disable-click");
let playerXO = "X";
let opponentXO = "O";
let debugOutput = "";
let possibleOpponentPlace = [];
let roundNO = 0;
let hardGameMode = true;
let askXO = true;
let gameMode = "default";
let pageColorChange = true;
let showChallenges = false;
let showDebug = true;
let XOMatrix = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
];

if (localStorage.getItem("XO-Setting")) {
    let localSettingObj = JSON.parse(localStorage.getItem("XO-Setting"));
    hardGameMode = localSettingObj.hardGameModeSave;
    askXO = localSettingObj.askXOSave;
    gameMode = localSettingObj.gameModeSave;
    pageColorChange = localSettingObj.pageColorChangeSave;
    showChallenges = localSettingObj.showChallengesSave;
    showDebug = localSettingObj.showDebugSave;
}

if (hardGameMode) document.getElementById("hard-difficulty").checked = true;
else document.getElementById("easy-difficulty").checked = true;
if (askXO) document.getElementById("ask-xo").checked = true;
else document.getElementById("ask-xo").checked = false;
switch (gameMode) {
    case "only-player":
        document.getElementById("only-player-mode-inp").checked = true;
        break;
    case "unbeatable-mode":
        document.getElementById("Unbeatable-mode-inp").checked = true;
        break;
    case "default":
        document.getElementById("default-mode-inp").checked = true;
        break;
}
if (pageColorChange) document.getElementById("change-color-inp").checked = true;
else document.getElementById("change-color-inp").checked = false;
if (showChallenges) document.getElementById("challenges-inp").checked = true;
else document.getElementById("challenges-inp").checked = false;
if (showDebug) document.getElementById("debug-inp").checked = true;
else document.getElementById("debug-inp").checked = false;

for (let i in XOBlocks) {
    XOBlocks[i].addEventListener("click", function () {
        if (!XOBlocks[i].textContent) {
            XOBlocks[i].textContent = playerXO;
            XOBlocks[i].style.cursor = "default";
            XOMatrix[Math.floor(i / 3)][Math.floor(i % 3)] = playerXO;
            changeColor();
            if (!lineFinder(playerXO, 3, endGame)) {
                possibleOpponentPlace = [];
                debugOutput = "Round " + ++roundNO + " =>";
                if (gameMode != "only-player") {
                    if (hardGameMode) {
                        if (lineFinder(opponentXO, 2, blockFinder)) {
                            debugOutput += " Win Move";
                        } else if (lineFinder(playerXO, 2, blockFinder)) {
                            debugOutput += " Counter Move";
                        } else {
                            randomMoveOpponent();
                        }
                    } else {
                        randomMoveOpponent();
                    }
                    if (gameMode != "unbeatable-mode") {
                        randomPlace =
                            possibleOpponentPlace[
                                Math.floor(
                                    Math.random() * possibleOpponentPlace.length
                                )
                            ];
                        if (randomPlace) {
                            XOMatrix[randomPlace[0]][randomPlace[1]] =
                                opponentXO;
                        }
                    } else {
                        for (let i of possibleOpponentPlace) {
                            XOMatrix[i[0]][i[1]] = opponentXO;
                        }
                    }
                    disableClick.style.display = "block";
                    setTimeout(() => {
                        for (let k in XOBlocks) {
                            XOBlocks[k].textContent =
                                XOMatrix[Math.floor(k / 3)][Math.floor(k % 3)];
                        }
                        for (let i = 0; i < 3; i++) {
                            for (let j = 0; j < 3; j++) {
                                if (XOMatrix[i][j])
                                    XOBlocks[3 * i + j].style.cursor =
                                        "default";
                            }
                        }
                        if (lineFinder(opponentXO, 3, endGame)) {
                        }
                        changeColor();
                        disableClick.style.display = "none";
                    }, 900);
                } else {
                    debugOutput += " Zzz";
                }
                if (showDebug) console.log(debugOutput);
            }
        }
    });
}
function randomMoveOpponent() {
    if (gameMode == "unbeatable-mode" && hardGameMode) {
        debugOutput += " You can play again :)";
        return;
    } else if (gameMode == "unbeatable-mode" && !hardGameMode) {
        debugOutput += " EZ :)";
    } else debugOutput += " Random Move";
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (!XOMatrix[i][j]) {
                possibleOpponentPlace.push([i, j]);
            }
        }
    }
}
function lineFinder(ckeckFor, countTo, endGameOrCounterMove) {
    let inlineCounter = 0;
    let outputFunction = false;
    for (let i = 0; i < 3; i++) {
        inlineCounter = 0;
        for (let j = 0; j < 3; j++) {
            if (XOMatrix[i][j] == ckeckFor) inlineCounter++;
            else if (XOMatrix[i][j]) inlineCounter--;
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
            else if (XOMatrix[j][i]) inlineCounter--;
        }
        if (inlineCounter == countTo) {
            endGameOrCounterMove(false, i + 1, false);
            outputFunction = true;
        }
    }
    inlineCounter = 0;
    for (let i = 0; i < 3; i++) {
        if (XOMatrix[i][i] == ckeckFor) inlineCounter++;
        else if (XOMatrix[i][i]) inlineCounter--;
    }
    if (inlineCounter == countTo) {
        endGameOrCounterMove(false, 1, true);
        outputFunction = true;
    }
    inlineCounter = 0;
    let j = 2;
    for (let i = 0; i < 3; i++) {
        if (XOMatrix[i][j--] == ckeckFor) inlineCounter++;
        else if (XOMatrix[i][j + 1]) inlineCounter--;
    }
    if (inlineCounter == countTo) {
        endGameOrCounterMove(false, 2, true);
        outputFunction = true;
    }
    if (outputFunction == true) return true;
    return false;
}
function endGame(i, j, diagonal) {
    console.log("-- Game Over --");
    if (!diagonal && i) lineGrider(i);
    if (!diagonal && j) lineGrider(j + 3);
    if (diagonal && j) lineGrider(j + 6);
}
function blockFinder(i, j, diagonal) {
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
changeColor();
function changeColor() {
    if (!pageColorChange) return;
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
    rgbSaver = [];
}
const chooseXOPage = document.getElementById("choose-xo");
const xBtn = document.getElementById("x-btn");
const oBtn = document.getElementById("o-btn");
if (askXO) {
    chooseXOPage.style.display = "flex";
    xBtn.addEventListener("click", function () {
        playerXO = "X";
        opponentXO = "O";
        xoChoose(xBtn);
    });
    oBtn.addEventListener("click", function () {
        playerXO = "O";
        opponentXO = "X";
        xoChoose(oBtn);
    });

    function xoChoose(XO) {
        XO.style.opacity = 0.5;
        XO.style.transform = "translate(0, 4px)";
        XO.style.boxShadow = "0px 1px 5px var(--lineColor)";
        chooseXOPage.style.opacity = "0";
        setTimeout(() => {
            chooseXOPage.style.display = "none";
        }, 650);
    }
} else {
    chooseXOPage.style.display = "none";
}

setTimeout(() => {
    document.getElementsByTagName("body")[0].style.transition = "0.7s";
    chooseXOPage.style.transition = "0.5s 0.3s";
    XOBlocks.forEach(function (block) {
        block.style.transition = "background 0.7s, color 0.7s";
    });
    document.getElementById("setting-btn").style.transition = "500ms";
    xBtn.style.transition = "0.2s";
    oBtn.style.transition = "0.2s";
}, 100);

let settingClicked = 0;
settingMenu = document.getElementById("setting-menu");
document.getElementById("setting-btn").addEventListener("click", function () {
    if (settingClicked++ % 2 == 0) {
        settingMenu.style.transition = "0.3s";
        settingMenu.style.display = "grid";
        setTimeout(() => {
            settingMenu.style.opacity = "1";
        }, 0);
    } else {
        setTimeout(() => {
            settingMenu.style.display = "none";
        }, 300);
        settingMenu.style.opacity = "0";
    }
    document.getElementById("setting-btn").style.transform = `rotate(${
        settingClicked * -90
    }deg)`;
});
document
    .getElementById("easy-difficulty")
    .addEventListener("click", function () {
        hardGameMode = false;
        localStorage.setItem("XO-Setting", saveSetting());
    });
document
    .getElementById("hard-difficulty")
    .addEventListener("click", function () {
        hardGameMode = true;
        localStorage.setItem("XO-Setting", saveSetting());
    });
document.getElementById("ask-xo").addEventListener("click", function () {
    if (document.getElementById("ask-xo").checked) {
        askXO = true;
    } else askXO = false;
    localStorage.setItem("XO-Setting", saveSetting());
});
document
    .getElementById("only-player-mode-inp")
    .addEventListener("click", function () {
        gameMode = "only-player";
        localStorage.setItem("XO-Setting", saveSetting());
    });
document
    .getElementById("Unbeatable-mode-inp")
    .addEventListener("click", function () {
        gameMode = "unbeatable-mode";
        localStorage.setItem("XO-Setting", saveSetting());
    });
document
    .getElementById("default-mode-inp")
    .addEventListener("click", function () {
        gameMode = "default";
        localStorage.setItem("XO-Setting", saveSetting());
    });
document
    .getElementById("change-color-inp")
    .addEventListener("click", function () {
        if (document.getElementById("change-color-inp").checked) {
            pageColorChange = true;
        } else pageColorChange = false;
        localStorage.setItem("XO-Setting", saveSetting());
    });
document.getElementById("debug-inp").addEventListener("click", function () {
    if (document.getElementById("debug-inp").checked) {
        showDebug = true;
    } else showDebug = false;
    localStorage.setItem("XO-Setting", saveSetting());
});
// localStorage.clear();

function saveSetting() {
    let saveObj = {
        hardGameModeSave: hardGameMode,
        askXOSave: askXO,
        gameModeSave: gameMode,
        pageColorChangeSave: pageColorChange,
        showChallengesSave: showChallenges,
        showDebugSave: showDebug,
    };
    return JSON.stringify(saveObj);
}
