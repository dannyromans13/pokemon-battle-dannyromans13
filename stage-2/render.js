import TRAINER from "../trainer.config.js";

export function render(state) {
  renderHP(state);
  renderArena(state);
  renderControls(state);
  renderLog(state);
  renderEndScreen(state);
}

function renderHP(state) {
  const playerHP = document.getElementById("player-hp-value");
  const playerBar = document.getElementById("player-hp-bar");
  const opponentHP = document.getElementById("opponent-hp-value");
  const opponentBar = document.getElementById("opponent-hp-bar");

  const playerPct = Math.max(0, (state.playerHP / state.playerMaxHP) * 100);
  const opponentPct = Math.max(0, (state.opponentHP / state.opponentMaxHP) * 100);

  playerHP.textContent = `${state.playerHP} / ${state.playerMaxHP}`;
  playerBar.style.width = `${playerPct}%`;
  playerBar.style.background = playerPct > 50 ? "#42C97A" : playerPct > 20 ? "#F5C842" : "#E84040";

  opponentHP.textContent = `${state.opponentHP} / ${state.opponentMaxHP}`;
  opponentBar.style.width = `${opponentPct}%`;
  opponentBar.style.background = opponentPct > 50 ? "#42C97A" : playerPct > 20 ? "#F5C842" : "#E84040";

  // Set names and sprites if data is available
  if (state.playerData) {
    document.getElementById("player-name").textContent = TRAINER.nickname;
    document.getElementById("player-sprite").src = state.playerData.sprites.front_default;
  }

  if (state.opponentData) {
    document.getElementById("opponent-name").textContent = state.opponentData.name;
    document.getElementById("opponent-sprite").src = state.opponentData.sprites.front_default;
  }
}

function renderArena(state) {
  for (let i = 1; i <= 3; i++) {
    const cell = document.getElementById(`cell-${i}`);
    
    // Reset classes first
    cell.className = "cell";

    // Player is in this cell
    if (state.playerPosition === i) cell.classList.add("player-here");

    // Enemy is targeting this cell — warning
    if (state.incomingAttack === i && !state.locked) cell.classList.add("warning");

    // Enemy attacked this cell — strike
    if (state.incomingAttack === i && state.locked) cell.classList.add("strike");
  }
}

function renderControls(state) {
  const btnAttack = document.getElementById("btn-attack");
  const btnDefinitive = document.getElementById("btn-definitive");
  const btnAgain = document.getElementById("btn-again");

  // Disable attack button during cooldown or when battle ended
  btnAttack.disabled = state.attackOnCooldown || state.phase !== "fighting";

  // Disable definitive button if already used or battle ended
  btnDefinitive.disabled = state.definitiveUsed || state.phase !== "fighting";

  // Show Battle Again only when battle ended
  btnAgain.style.display = state.phase === "ended" ? "block" : "none";
}

function renderLog(state) {
  const log = document.getElementById("battle-log");

  // Render all log entries
  log.innerHTML = state.log
    .map(entry => `<p>${entry}</p>`)
    .join("");

  // Auto-scroll to bottom
  log.scrollTop = log.scrollHeight;
}

function renderEndScreen(state) {
  if (state.phase !== "ended") return;

  const won = state.opponentHP <= 0;

  // Add end message to log if not already there
  const endMsg = won
    ? `🏆 ¡Ganaste! ${TRAINER.winMessage}`
    : `💀 ¡Perdiste! ${TRAINER.loseMessage}`;

  if (!state.log.includes(endMsg)) {
    state.log.push(endMsg);
    renderLog(state);
  }
}

