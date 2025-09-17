const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const timeInput = document.getElementById("timeInput");

let timeLimit = 10;
let clicks = 0;
let score = 0;
let lastClickTime = 0;
let fastClicks = 0;
let timerInterval = null;


// ---------------------------
// Start game
// ---------------------------
startBtn.onclick = () => {
  timeLimit = parseInt(timeInput.value);
  if (!timeLimit || timeLimit <= 0) timeLimit = 10;

  startReadySetGo();
};

// ---------------------------
// Ready…Set…Go animation
// ---------------------------
function startReadySetGo() {
  clicks = 0;
  score = 0;
  lastClickTime = 0;
  fastClicks = 0;

  document.getElementById("setupArea").style.display = "none";
  document.getElementById("descriptionArea").style.display = "none";
  gameArea.style.display = "flex";
  gameArea.style.justifyContent = "center";
  gameArea.style.alignItems = "center";
  gameArea.innerHTML = "";

  const h2 = document.createElement("h2");
  h2.innerText = "3";
  h2.style.fontSize = "72px";
  h2.style.color = "#00ffff";
  h2.style.textShadow = "2px 2px #ff00ff, 0 0 10px #ff00ff";
  gameArea.appendChild(h2);

  let count = 3;
  const countdown = setInterval(() => {
    count--;
    if (count > 0) h2.innerText = count;
    else if (count === 0) h2.innerText = "Go!";
    else {
      clearInterval(countdown);
      gameArea.innerHTML = "";
      startGame();
    }
  }, 1000);
}

// ---------------------------
// Start actual game
// ---------------------------
function startGame() {
  const btn = document.createElement("button");
  btn.className = "game-btn";
  gameArea.appendChild(btn);

  // Center initially
  btn.style.top = gameArea.clientHeight/2 - btn.offsetHeight/2 + "px";
  btn.style.left = gameArea.clientWidth/2 - btn.offsetWidth/2 + "px";

  moveButton(btn);

  // ---------------------------
  // Timer outside game area
  // ---------------------------
  let timerDisplay = document.getElementById("timerDisplay");
  if (!timerDisplay) {
    timerDisplay = document.createElement("div");
    timerDisplay.id = "timerDisplay";
    timerDisplay.style.fontSize = "24px";
    timerDisplay.style.color = "#00ffea";
    timerDisplay.style.textShadow = "1px 1px #ff00ff";
    timerDisplay.style.marginTop = "10px";
    gameArea.parentElement.appendChild(timerDisplay);
  }

  let remainingTime = timeLimit;
  timerDisplay.innerText = `Time: ${remainingTime}s`;
  timerInterval = setInterval(() => {
    remainingTime -= 1;
    timerDisplay.innerText = `Time: ${remainingTime}s`;

    // Turn red if ≤3 seconds
    if (remainingTime <= 3) {
      timerDisplay.style.color = "#ff0000";
    }
  }, 1000);

  // ---------------------------
  // Click logic
  // ---------------------------
  btn.onclick = () => {
    const now = Date.now();
    let delta = lastClickTime ? (now - lastClickTime) / 1000 : 1;
    lastClickTime = now;

    let points = 10;
    if (delta <= 0.5) {
      points = 15;
      fastClicks++;
      showBonusText("+15", btn);
    }

    score += points;
    clicks++;
    moveButton(btn);
  };

  // End game after time limit
  setTimeout(() => {
    endGame();
  }, timeLimit * 1000);
}

// ---------------------------
// Move button randomly
// ---------------------------
function moveButton(btn) {
  const top = Math.random() * (gameArea.clientHeight - btn.offsetHeight);
  const left = Math.random() * (gameArea.clientWidth - btn.offsetWidth);
  btn.style.top = top + "px";
  btn.style.left = left + "px";
  btn.style.transform = "scale(0.8)";
  setTimeout(() => btn.style.transform = "scale(1)", 50);
}

// ---------------------------
// Show floating bonus text
// ---------------------------
function showBonusText(text, btn) {
  const bonus = document.createElement("div");
  bonus.innerText = text;
  bonus.style.position = "absolute";
  bonus.style.left = parseInt(btn.style.left) + 15 + "px";
  bonus.style.top = parseInt(btn.style.top) - 20 + "px";
  bonus.style.color = "#00ffea";
  bonus.style.fontWeight = "bold";
  bonus.style.textShadow = "2px 2px #ff00ff";
  bonus.style.fontSize = "20px";
  bonus.style.transition = "all 0.5s ease-out";
  gameArea.appendChild(bonus);

  setTimeout(() => {
    bonus.style.top = parseInt(bonus.style.top) - 30 + "px";
    bonus.style.opacity = 0;
  }, 10);

  setTimeout(() => gameArea.removeChild(bonus), 600);
}

// ---------------------------
// End game and show results
// ---------------------------
function endGame() {
  clearInterval(timerInterval);

  // Remove timer display
  const timerDisplay = document.getElementById("timerDisplay");
  if (timerDisplay) timerDisplay.remove();

  gameArea.style.display = "flex";
  gameArea.style.justifyContent = "center";
  gameArea.style.alignItems = "center";

  gameArea.innerHTML = `
    <div style="text-align: center; font-size: 24px; color:#00ffea; text-shadow: 2px 2px #ff00ff; line-height:2;">
      Time: ${timeLimit} seconds<br>
      Clicks: ${clicks}<br>
      Score: ${score}<br>
      Fast Clicks: ${fastClicks}<br><br>
      <button id="backBtn" class="arcade-btn">Back to Menu</button>
    </div>
  `;

  document.getElementById("backBtn").onclick = () => {
    gameArea.style.display = "none";
    document.getElementById("setupArea").style.display = "block";
    document.getElementById("descriptionArea").style.display = "block";
    
    // Ensure timer is removed when going back
    const timerDisplay = document.getElementById("timerDisplay");
    if (timerDisplay) timerDisplay.remove();
  };
}

