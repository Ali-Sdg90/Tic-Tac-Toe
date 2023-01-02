const XOBlocks = Array.from(document.querySelectorAll("#lines div"));
const disableClick = document.getElementById("disable-click");
const challengeMenu = document.getElementById("challenge-menu");
const runChallengesInp = document.getElementById("run-challenges-inp");
const showChallengesInp = document.getElementById("show-challenges-inp");
let playerXO = "X";
let opponentXO = "O";
let debugOutput = "";
let possibleOpponentPlace = [];
let roundNO = 0;
let hardGameMode = true;
let askXO = true;
let gameMode = "default"; //"default" "only-player" "w-friend" "unbeatable"
let pageColorChange = true;
let challengesCanRun = false;
let showDebug = false;
let canPlay = true;
let XOMatrix = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
];
// localStorage.clear();
//2023/01/01 IRAN AZAD.

const welcomeBlack = document.getElementById("black-welcome");
welcomeBlack.style.display = "block";
welcomeBlack.style.opacity = "1";
setTimeout(() => {
    welcomeBlack.style.opacity = "0";
    setTimeout(() => {
        welcomeBlack.style.display = "none";
    }, 500);
}, 10);

//Add settings if available ⇩
if (localStorage.getItem("XO-Setting")) {
    let localSettingObj = JSON.parse(localStorage.getItem("XO-Setting"));
    hardGameMode = localSettingObj.hardGameModeSave;
    askXO = localSettingObj.askXOSave;
    gameMode = localSettingObj.gameModeSave;
    pageColorChange = localSettingObj.pageColorChangeSave;
    challengesCanRun = localSettingObj.challengesCanRunSave;
    showDebug = localSettingObj.showDebugSave;
}

//Add challenges if available ⇩
if (localStorage.getItem("XO-Challenge")) {
    let localChallengeObj = JSON.parse(localStorage.getItem("XO-Challenge"));
    document.getElementById("win-Default-challenge-inp").checked =
        localChallengeObj.defaultWinSave;
    document.getElementById("draw-Default-challenge-inp").checked =
        localChallengeObj.defaultDrawSave;
    document.getElementById("lose-Default-challenge-inp").checked =
        localChallengeObj.defaultLoseSave;
    document.getElementById("win-3-way-inp").checked =
        localChallengeObj.onlyPlayer3waySave;
    document.getElementById("big-x-challenge-inp").checked =
        localChallengeObj.wFriendBigXSave;
    document.getElementById("draw-ai-challenge-inp").checked =
        localChallengeObj.unbeatableDrawSave;
    document.getElementById("Lose-8-ai-challenge-inp").checked =
        localChallengeObj.unbeatableLose8Save;
    document.getElementById("have-3-x-challenge-inp").checked =
        localChallengeObj.unbeatableEndW3XSave;
    document.getElementById("have-5-x-challenge-inp").checked =
        localChallengeObj.unbeatableEndW5XSave;
}

//Tick the settings ⇩
if (hardGameMode) document.getElementById("hard-difficulty").checked = true;
else document.getElementById("easy-difficulty").checked = true;
if (askXO) document.getElementById("ask-xo").checked = true;
else document.getElementById("ask-xo").checked = false;
switch (gameMode) {
    case "only-player":
        document.getElementById("only-player-mode-inp").checked = true;
        break;
    case "w-friend":
        document.getElementById("w-friend-mode-inp").checked = true;
        break;
    case "unbeatable":
        document.getElementById("Unbeatable-mode-inp").checked = true;
        break;
    case "default":
        document.getElementById("default-mode-inp").checked = true;
        break;
}
if (pageColorChange) document.getElementById("change-color-inp").checked = true;
else document.getElementById("change-color-inp").checked = false;
if (challengesCanRun) {
    runChallengesInp.checked = true;
    showChallengesInp.checked = true;
    challengeMenu.style.display = "grid";
} else {
    runChallengesInp.checked = false;
    showChallengesInp.style.opacity = "0.5";
    document.getElementById("show-challenges-label").style.opacity = "0.5";
}
if (showDebug) document.getElementById("debug-inp").checked = true;
else document.getElementById("debug-inp").checked = false;

//Add a transition to the element after the first page load ⇩
setTimeout(() => {
    document.getElementsByTagName("body")[0].style.transition =
        "background 0.7s";
    chooseXOPage.style.transition = "opacity 0.5s 0.3s";
    XOBlocks.forEach(function (block) {
        block.style.transition = "background 0.7s, color 0.7s";
    });
    document.getElementById("setting-btn").style.transition =
        "transform 0.5s, background 0.7s";
    xBtn.style.transition = "opacity 0.2s, transform 0.2s, boxShadow 0.2s";
    oBtn.style.transition = "opacity 0.2s, transform 0.2s, boxShadow 0.2s";
    challengeMenu.style.transition = "background 0.7s";
    document.getElementById("minimize-challenge-btn").style.transition =
        "background 0.3s, transform 0.5s";
    document.getElementById("close-challenge-btn").style.transition =
        "background 0.3s";
    document.getElementById("nav-challenge-div").style.transition =
        "background 0.7s";
    document.getElementById("complete-challenges").style.transition =
        "background 0.7s";
}, 100);

//main process ⇩
for (let i in XOBlocks) {
    XOBlocks[i].addEventListener("click", function () {
        if (!XOBlocks[i].textContent) {
            //add playerXO to game ⇩
            if (canPlay) {
                XOBlocks[i].textContent = playerXO;
                XOBlocks[i].style.cursor = "default";
                XOMatrix[Math.floor(i / 3)][Math.floor(i % 3)] = playerXO;
                changeColor();
            }
            canPlay = true;
            //if player dosn't win opponent can play ⇩
            if (!lineFinder(playerXO, 3, endGame)) {
                possibleOpponentPlace = [];
                debugOutput = "Round " + ++roundNO + " =>";
                if (fullGame()) {
                    endGame();
                    return;
                }
                if (gameMode == "w-friend") {
                    if (playerXO == "X") {
                        playerXO = "O";
                        opponentXO = "X";
                    } else {
                        playerXO = "X";
                        opponentXO = "O";
                    }
                }
                let timeoutForOpponent = 900;
                if (gameMode != "only-player" && gameMode != "w-friend") {
                    if (hardGameMode) {
                        if (lineFinder(opponentXO, 2, blockFinder)) {
                            debugOutput += " Win Move";
                        } else if (lineFinder(playerXO, 2, blockFinder)) {
                            debugOutput += " Counter Move";
                        } else {
                            if (gameMode == "unbeatable")
                                timeoutForOpponent = randomMoveOpponent();
                            else randomMoveOpponent();
                        }
                    } else {
                        randomMoveOpponent();
                    }
                    if (gameMode != "unbeatable") {
                        //Choose a place from the possible places ⇩
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
                    //The player cannot play multiple time ⇩
                    disableClick.style.display = "block";
                    //add opponentXO to game ⇩
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
                        //endGame if opponent win ⇩
                        if (lineFinder(opponentXO, 3, endGame)) {
                        } else if (fullGame()) {
                            endGame();
                        }
                        changeColor();
                        disableClick.style.display = "none";
                    }, timeoutForOpponent);
                } else {
                    debugOutput += " Zzz";
                }
                if (showDebug) console.log(debugOutput);
            }
        }
    });
}

//unbeatable dosn't have randomMove ⇩
function randomMoveOpponent() {
    if (gameMode == "unbeatable" && hardGameMode) {
        debugOutput += " You can play again :)";
        return 0;
    } else if (gameMode == "unbeatable" && !hardGameMode) {
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

//lineFinder for endGame() or blockFinder() ⇩
//ckeckFor playerXO or opponentXO
//countTo 3 for win player or opponent
//countTo 2 for blockFinder
function lineFinder(ckeckFor, countTo, endGameOrCounterMove) {
    let inlineCounter = 0;
    let outputFunction = false;
    // i
    for (let i = 0; i < 3; i++) {
        inlineCounter = 0;
        for (let j = 0; j < 3; j++) {
            if (XOMatrix[i][j] == ckeckFor) inlineCounter++;
            else if (XOMatrix[i][j]) inlineCounter--;
        }
        if (inlineCounter == countTo) {
            endGameOrCounterMove(i + 1, false, false, ckeckFor);
            outputFunction = true;
        }
    }
    // j
    for (let i = 0; i < 3; i++) {
        inlineCounter = 0;
        for (let j = 0; j < 3; j++) {
            if (XOMatrix[j][i] == ckeckFor) inlineCounter++;
            else if (XOMatrix[j][i]) inlineCounter--;
        }
        if (inlineCounter == countTo) {
            endGameOrCounterMove(false, i + 1, false, ckeckFor);
            outputFunction = true;
        }
    }
    // \
    inlineCounter = 0;
    for (let i = 0; i < 3; i++) {
        if (XOMatrix[i][i] == ckeckFor) inlineCounter++;
        else if (XOMatrix[i][i]) inlineCounter--;
    }
    if (inlineCounter == countTo) {
        endGameOrCounterMove(false, 1, true, ckeckFor);
        outputFunction = true;
    }
    // /
    inlineCounter = 0;
    let j = 2;
    for (let i = 0; i < 3; i++) {
        if (XOMatrix[i][j--] == ckeckFor) inlineCounter++;
        else if (XOMatrix[i][j + 1]) inlineCounter--;
    }
    if (inlineCounter == countTo) {
        endGameOrCounterMove(false, 2, true, ckeckFor);
        outputFunction = true;
    }
    if (outputFunction == true) return true;
    return false;
}

//check if XOMatrix == Checkfor ⇩
function XOMatrixChecker(Checkfor) {
    challengeChecker = true;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (XOMatrix[i][j] != Checkfor[i * 3 + j]) challengeChecker = false;
        }
    }
    return challengeChecker;
}

//return all challenges in one obj ⇩
function saveChallenge() {
    let saveObj = {
        defaultWinSave: document.getElementById("win-Default-challenge-inp")
            .checked,
        defaultDrawSave: document.getElementById("draw-Default-challenge-inp")
            .checked,
        defaultLoseSave: document.getElementById("lose-Default-challenge-inp")
            .checked,
        onlyPlayer3waySave: document.getElementById("win-3-way-inp").checked,
        wFriendBigXSave: document.getElementById("big-x-challenge-inp").checked,
        unbeatableDrawSave: document.getElementById("draw-ai-challenge-inp")
            .checked,
        unbeatableLose8Save: document.getElementById("Lose-8-ai-challenge-inp")
            .checked,
        unbeatableEndW3XSave: document.getElementById("have-3-x-challenge-inp")
            .checked,
        unbeatableEndW5XSave: document.getElementById("have-5-x-challenge-inp")
            .checked,
    };
    return JSON.stringify(saveObj);
}

//add saveChallenge to localStorage and mark a complete challenge ⇩
function challengeCompleter(inpId) {
    if (!document.getElementById(inpId).checked) {
        if (showDebug) console.log("-- challenge complete --");
        document.getElementById(inpId).checked = true;
        localStorage.setItem("XO-Challenge", saveChallenge());
        allChallengeCompleteChecker(1000);
    }
}

//if all challenge complete show "complete-challenges" ⇩
allChallengeCompleteChecker(0);
function allChallengeCompleteChecker(delay) {
    let allInpChallenge = document.querySelectorAll("#challenges input");
    let allChallengeComplete = true;
    for (let i of allInpChallenge) {
        if (!i.checked) allChallengeComplete = false;
    }
    if (allChallengeComplete) {
        setTimeout(() => {
            document.getElementById("complete-challenges").style.display =
                "block";
            document.getElementById("challenges-hint").style.display = "none";
        }, delay);
    }
}

//show WinLine and check if challenge complete ⇩
//winner can be player or opponent or empty as draw
function endGame(i, j, diagonal, winner) {
    if (showDebug) console.log("-- Game Over --");
    if (!diagonal && i) showWinLine(i);
    if (!diagonal && j) showWinLine(j + 3);
    if (diagonal && j) showWinLine(j + 6);
    if (challengesCanRun) {
        if (gameMode == "default") {
            if (winner == playerXO) {
                challengeCompleter("win-Default-challenge-inp");
            }
            if (!winner) {
                challengeCompleter("draw-Default-challenge-inp");
            }
            if (winner == opponentXO) {
                challengeCompleter("lose-Default-challenge-inp");
            }
        }
        if (gameMode == "only-player") {
            if (
                XOMatrixChecker([
                    playerXO,
                    playerXO,
                    "",
                    playerXO,
                    playerXO,
                    playerXO,
                    "",
                    playerXO,
                    playerXO,
                ]) ||
                XOMatrixChecker([
                    "",
                    playerXO,
                    playerXO,
                    playerXO,
                    playerXO,
                    playerXO,
                    playerXO,
                    playerXO,
                    "",
                ])
            ) {
                challengeCompleter("win-3-way-inp");
            }
        }
        if (gameMode == "w-friend") {
            if (
                XOMatrixChecker(["X", "O", "X", "O", "X", "O", "X", "O", "X"])
            ) {
                challengeCompleter("big-x-challenge-inp");
            }
        }
        if (gameMode == "unbeatable") {
            if (!winner) {
                challengeCompleter("draw-ai-challenge-inp");
            }
            if (!hardGameMode) {
                challengeCompleter("Lose-8-ai-challenge-inp");
            }
            function xCounter(countTo) {
                amountOfX = 0;
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (XOMatrix[i][j] == "X") amountOfX++;
                    }
                }
                if (amountOfX == countTo) return true;
                else return false;
            }
            if (xCounter(3)) {
                challengeCompleter("have-3-x-challenge-inp");
            }
            if (xCounter(5)) {
                challengeCompleter("have-5-x-challenge-inp");
            }
        }
    }
    //fades everywhere except the winning blocks ⇩
    XOBlocks.forEach(function (block) {
        if (block.textContent != winner) {
            setTimeout(() => {
                block.style.transition = "opacity 600ms";
                block.style.opacity = "0.5";
            }, 700);
        }
    });
    if (winner) {
        document.getElementById("win-txt").textContent = `${winner} won !`;
    } else {
        document.getElementById("win-txt").textContent = "DRAW !";
    }
    //endGame animations and elements ⇩
    const xoGame = document.getElementById("xo-game");
    setTimeout(() => {
        xoGame.style.transition = "transform 0.7s";
        xoGame.style.transform = "translate(0,-14vh) scale(0.7)";
    }, 300);
    setTimeout(() => {
        xoGame.style.transition = "none";
    }, 1000);
    document.getElementById("end-screen").style.display = "flex";
    setTimeout(() => {
        document.getElementById("win-txt").style.opacity = "1";
        document.getElementById("end-game-btns").style.transform =
            "translate(0, 0)";
        document.getElementById("end-game-btns").style.opacity = "1";
    }, 500);
}

//add possible Places for opponent to win or counter move ⇩
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

//make win line visible on screen ⇩
function showWinLine(num) {
    document.getElementById("win-horizontal-lines").style.display = "grid";
    document.getElementById("win-vertical-lines").style.display = "grid";
    document.getElementById("win-diagonal-lines").style.display = "grid";
    document.getElementById(`win-line${num}`).style.opacity = "1";
}

//changeColor after player or opponent move ⇩
//background-color = game-color * 2 = lineColor * 3
changeColor();
function changeColor() {
    if (!pageColorChange) return;
    let rgbSaver = [];
    for (let i = 0; i < 3; i++)
        rgbSaver.push(Math.floor(Math.random() * 226 + 70));
    document.querySelector(":root").style.cssText = `
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

//change playerXO and opponentXO ⇩
const chooseXOPage = document.getElementById("choose-xo");
const xBtn = document.getElementById("x-btn");
const oBtn = document.getElementById("o-btn");
if (askXO) {
    chooseXOPage.style.display = "flex";
    xBtn.addEventListener("click", function () {
        playerXO = "X";
        opponentXO = "O";
        canPlay = true;
        xoChoose(xBtn);
    });
    oBtn.addEventListener("click", function () {
        playerXO = "O";
        opponentXO = "X";
        canPlay = false;
        document.querySelector("#automatic-click").click();
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

//show setting-menu and rotate setting-btn ⇩
let settingClicked = 0;
settingMenu = document.getElementById("setting-menu");
document.getElementById("setting-btn").addEventListener("click", function () {
    if (settingClicked++ % 2 == 0) {
        settingMenu.style.transition = "opacity 0.3s";
        settingMenu.style.display = "grid";
        challengeMenu.style.zIndex = "0";
        setTimeout(() => {
            settingMenu.style.opacity = "1";
        }, 0);
    } else {
        setTimeout(() => {
            settingMenu.style.display = "none";
            challengeMenu.style.zIndex = "3";
        }, 300);
        settingMenu.style.opacity = "0";
    }
    document.getElementById("setting-btn").style.transform = `rotate(${
        settingClicked * 90
    }deg)`;
});

//dblclick setting-btn to reset game ⇩
document
    .getElementById("setting-btn")
    .addEventListener("dblclick", function () {
        localStorage.clear();
        location.reload();
    });

//reload page btn and btn animation ⇩
let rotateDeg = 0;
document
    .getElementById("reload-page-btn")
    .addEventListener("click", function () {
        document.getElementById(
            "reload-page-btn"
        ).style.transform = `rotate(${(rotateDeg += 360)}deg)`;
        setTimeout(() => {
            location.reload();
        }, 500);
    });

//setting checkboxes or radios ⇩
//difficulty - ask-xo - gameMode - changeColor - challengesCanRun - showDebug
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
        challengesCantRun();
    });
document
    .getElementById("w-friend-mode-inp")
    .addEventListener("click", function () {
        gameMode = "w-friend";
        challengesCantRun();
    });
document
    .getElementById("Unbeatable-mode-inp")
    .addEventListener("click", function () {
        gameMode = "unbeatable";
        challengesCantRun();
    });
document
    .getElementById("default-mode-inp")
    .addEventListener("click", function () {
        gameMode = "default";
        challengesCantRun();
    });
document
    .getElementById("change-color-inp")
    .addEventListener("click", function () {
        if (document.getElementById("change-color-inp").checked) {
            pageColorChange = true;
        } else pageColorChange = false;
        localStorage.setItem("XO-Setting", saveSetting());
    });

//show-challenges can't be true while run-challenges isn't ⇩
document
    .getElementById("run-challenges-inp")
    .addEventListener("click", function () {
        if (runChallengesInp.checked) {
            challengesCanRun = true;
            challengeMenu.style.display = "grid";
            showChallengesInp.style.opacity = "1";
            document.getElementById("show-challenges-label").style.opacity =
                "1";
            showChallengesInp.checked = true;
        } else {
            challengesCanRun = false;
            challengeMenu.style.display = "none";
            showChallengesInp.style.opacity = "0.5";
            document.getElementById("show-challenges-label").style.opacity =
                "0.5";
            showChallengesInp.checked = false;
        }
        localStorage.setItem("XO-Setting", saveSetting());
    });
document
    .getElementById("show-challenges-inp")
    .addEventListener("click", function () {
        if (challengesCanRun) {
            if (showChallengesInp.checked) {
                challengeMenu.style.display = "grid";
            } else {
                challengeMenu.style.display = "none";
            }
        } else {
            showChallengesInp.checked = false;
        }
    });
document.getElementById("debug-inp").addEventListener("click", function () {
    if (document.getElementById("debug-inp").checked) {
        showDebug = true;
    } else showDebug = false;
    localStorage.setItem("XO-Setting", saveSetting());
});

//challengesCantRun by change gameMode or disable it ⇩
function challengesCantRun() {
    runChallengesInp.checked = false;
    showChallengesInp.checked = false;
    showChallengesInp.style.opacity = "0.5";
    document.getElementById("show-challenges-label").style.opacity = "0.5";
    challengeMenu.style.display = "none";
    challengesCanRun = false;
    localStorage.setItem("XO-Setting", saveSetting());
}

//return all setting in one obj ⇩
function saveSetting() {
    let saveObj = {
        hardGameModeSave: hardGameMode,
        askXOSave: askXO,
        gameModeSave: gameMode,
        pageColorChangeSave: pageColorChange,
        challengesCanRunSave: challengesCanRun,
        showDebugSave: showDebug,
    };
    return JSON.stringify(saveObj);
}

//endGame btn ⇩
//github - reloud - jsfiddle
document
    .getElementById("endGame-reload-page-btn")
    .addEventListener("click", function () {
        location.reload();
    });

//check for empty block exist in game ⇩
function fullGame() {
    let fullBlockCounter = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (!XOMatrix[i][j]) fullBlockCounter++;
        }
    }
    if (fullBlockCounter) return false;
    else return true;
}

//Make the DIV element draggagle (W3) ⇩
dragElement(challengeMenu);

function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown =
            dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = elmnt.offsetTop - pos2 + "px";
        elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

//minimize challenge menu ⇩
const minimizeChallenge = document.getElementById("minimize-challenge-btn");
let minimizeClick = 0;
minimizeChallenge.addEventListener("click", function () {
    if (minimizeClick % 2) {
        challengeMenu.style.transition = "background 0.7s, height 0.6s";
        challengeMenu.style.height = "58.5vh";
        setTimeout(() => {
            challengeMenu.style.transition = "background 0.7s";
        }, 600);
    } else {
        challengeMenu.style.transition = "background 0.7s, height 0.6s";
        challengeMenu.style.height = "4.5vh";
        setTimeout(() => {
            challengeMenu.style.transition = "background 0.7s";
        }, 600);
    }
    minimizeChallenge.style.transform = `rotate(${++minimizeClick * 180}deg)`;
});

//close challenge menu and showChallengesInp uncheck ⇩
const closeChallenge = document.getElementById("close-challenge-btn");
closeChallenge.addEventListener("click", function () {
    challengeMenu.style.display = "none";
    showChallengesInp.checked = false;
});
