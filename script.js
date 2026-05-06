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
    boxMessage.innerText = "Press Start and wait for thec signal";
}

function clearRunningTimer() {
    if (timerId !== null) {
        clearTimeout(timerId);
        timerId = null;
    }
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
    boxMessage.innerText = "Do not click yet. Wait until the box turns green";

    setBoxWaiting();
}

function makeReadyState() {
    waitingForGreen = false;
    canClick = true;
    startTime = Date.now();

    gameStatus.innerText = "Click Now";
    boxTitle.innerText = "CLICK!";
    boxMessage.innerText = "Click the box as fast as possible";

    setBoxReady();
}

function handleEarlyClick() {
    clearRunningTimer();

    gameStarted = false;
    waitingForGreen = false;
    canClick = false;

    gameStatus.innerText = "Too Early";
    boxTitle.innerText = "Too Early!";
    boxMessage.innerText = "You clicked before the signal. Press start to try again";

    setBoxError();
}

function handleValidClick() {
    endTime = Date.now();

    gameStarted = false;
    waitingForGreen = false;
    canClick = false;

    gameStatus.innerText = "Finished";
    boxTitle.innerText = "Done";
    boxMessage.innerText = "Your reaction time will be calculated in the next commit";

    setBoxNormal();
}

function fullReset() {
    clearRunningTimer();

    gameStarted = false;
    waitingForGreen = false;
    canClick = false;
    startTime = 0;
    endTime = 0;

    resetScreenText();
    setBoxNormal();

    latestTime.innerText = "-- ms";
    bestTime.innerText = "-- ms";
    attemptCount.innerText = "0";
    averageTime.innerText = "-- ms";
}

startBtn.onclick = function () {
    prepareGame();

    timerId = setTimeout(function () {
        makeReadyState();
    }, 2500);
};

resetBtn.onclick = function () {
    fullReset();
};

reactionBox.onclick = function () {
    if (gameStarted === false && canClick === false) {
        boxTitle.innerText = "Start first";
        boxMessage.innerText = "Use the start button before clicking the test box";
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