let reactionBox = document.getElementById("reactionBox");
let boxTitle = document.getElementById("boxTitle");
let boxMessage = document.getElementById("boxMessage");
let startBtn = document.getElementById("startBtn");
let resetBtn = document.getElementById("resetBtn");
let gameStatus = document.getElementById("gameStatus");

let latestTime = document.getElementById("latestTime");
let bestTime = document.getElementById("bestTime");
let attemptCount = document.getElementById("attemptCount");
let averageTime = document.getElementById("averageTime");

let gameStarted = false;
let waitingForGreen = false;
let canClick = false;
let timerId = null;
let startTime = 0;
let endTime = 0;

let totalAttempts = 0;
let bestScore = null;
let allScores = [];

function setBoxNormal() {
    reactionBox.style.background = "#dbe4f0";
    reactionBox.style.borderColor = "#c9d4e5";
}

function setBoxWaiting() {
    reactionBox.style.background = "#facc15";
    reactionBox.style.borderColor = "#eab308";
}

function setBoxReady() {
    reactionBox.style.background = "#22c55e";
    reactionBox.style.borderColor = "#16a34a";
}

function setBoxError() {
    reactionBox.style.background = "#ef4444";
    reactionBox.style.borderColor = "#dc2626";
}

function resetScreenText() {
    gameStatus.innerText = "Not Started";
    boxTitle.innerText = "Ready?";
    boxMessage.innerText = "Press start and wait for the signal.";
}

function clearRunningTimer() {
    if (timerId !== null) {
        clearTimeout(timerId);
        timerId = null;
    }
}

function getRandomDelay() {
    let min = 2000;
    let max = 5000;

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calculateAverageScore() {
    if (allScores.length === 0) {
        return 0;
    }

    let total = 0;

    for (let i = 0; i < allScores.length; i++) {
        total += allScores[i];
    }

    return Math.floor(total / allScores.length);
}

function updateScoreBoard(reactionTime) {
    totalAttempts++;

    allScores.push(reactionTime);

    latestTime.innerText = reactionTime + " ms";

    attemptCount.innerText = totalAttempts;

    if (bestScore === null || reactionTime < bestScore) {
        bestScore = reactionTime;
    }

    bestTime.innerText = bestScore + " ms";

    let average = calculateAverageScore();

    averageTime.innerText = average + " ms";
}

function prepareGame() {
    clearRunningTimer();

    gameStarted = true;
    waitingForGreen = true;
    canClick = false;

    startTime = 0;
    endTime = 0;

    gameStatus.innerText = "Waiting";

    boxTitle.innerText = "Wait...";

    boxMessage.innerText = "Do not click yet. Wait until the box turns green.";

    setBoxWaiting();

    let delay = getRandomDelay();

    timerId = setTimeout(function () {
        makeReadyState();
    }, delay);
}

function makeReadyState() {
    waitingForGreen = false;

    canClick = true;

    startTime = Date.now();

    gameStatus.innerText = "Click Now";

    boxTitle.innerText = "CLICK!";

    boxMessage.innerText = "Click the box as fast as possible.";

    setBoxReady();
}

function handleEarlyClick() {
    clearRunningTimer();

    gameStarted = false;
    waitingForGreen = false;
    canClick = false;

    gameStatus.innerText = "Too Early";

    boxTitle.innerText = "Too Early!";

    boxMessage.innerText = "You clicked before the signal. Press start to try again.";

    setBoxError();
}

function handleValidClick() {
    endTime = Date.now();

    let reactionTime = endTime - startTime;

    gameStarted = false;
    waitingForGreen = false;
    canClick = false;

    gameStatus.innerText = "Finished";

    boxTitle.innerText = "Result";

    boxMessage.innerText = reactionTime + " ms";

    updateScoreBoard(reactionTime);

    setBoxNormal();
}

function fullReset() {
    clearRunningTimer();

    gameStarted = false;
    waitingForGreen = false;
    canClick = false;

    startTime = 0;
    endTime = 0;

    totalAttempts = 0;
    bestScore = null;
    allScores = [];

    resetScreenText();

    setBoxNormal();

    latestTime.innerText = "-- ms";

    bestTime.innerText = "-- ms";

    attemptCount.innerText = "0";

    averageTime.innerText = "-- ms";
}

startBtn.onclick = function () {
    prepareGame();
};

resetBtn.onclick = function () {
    fullReset();
};

reactionBox.onclick = function () {
    if (gameStarted === false && canClick === false) {
        boxTitle.innerText = "Start first";

        boxMessage.innerText = "Use the start button before clicking the test box.";

        return;
    }

    if (waitingForGreen === true) {
        handleEarlyClick();

        return;
    }

    if (canClick === true) {
        handleValidClick();

        return;
    }
};