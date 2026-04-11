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
  if (!playerHP || !playerBar || !opponentHP || !opponentBar) return;

  const pMax = state.playerMaxHP || 1;
  const oMax = state.opponentMaxHP || 1;

  const playerPct = Math.max(0, (state.playerHP / pMax) * 100);
  const opponentPct = Math.max(0, (state.opponentHP / oMax) * 100);

  playerHP.textContent = `${state.playerHP} / ${state.playerMaxHP}`;
  playerBar.style.width = `${playerPct}%`;
  playerBar.style.background =
    playerPct > 50 ? "#42C97A" : playerPct > 20 ? "#F5C842" : "#E84040";

  opponentHP.textContent = `${state.opponentHP} / ${state.opponentMaxHP}`;
  opponentBar.style.width = `${opponentPct}%`;
  opponentBar.style.background =
    opponentPct > 50 ? "#42C97A" : opponentPct > 20 ? "#F5C842" : "#E84040";

  if (state.playerData) {
    const nameEl = document.getElementById("player-name");
    const spr = document.getElementById("player-sprite");
    if (nameEl) nameEl.textContent = TRAINER.nickname || state.playerData.name;
    if (spr) spr.src = state.playerData.sprites.front_default;
  }

  if (state.opponentData) {
    const nameEl = document.getElementById("opponent-name");
    const spr = document.getElementById("opponent-sprite");
    const raw = state.opponentData.name || "";
    if (nameEl) nameEl.textContent = raw.replace(/^\w/, (c) => c.toUpperCase());
    if (spr) spr.src = state.opponentData.sprites.front_default;
  }
}

function renderArena(state) {
  const arena = document.getElementById("arena");
  if (arena) {
    arena.classList.toggle(
      "arena-locked",
      state.phase === "fighting" && state.locked
    );
  }

  for (let i = 1; i <= 3; i++) {
    const cell = document.getElementById(`cell-${i}`);
    if (!cell) continue;

    cell.className = "cell";
    cell.disabled =
      state.phase !== "fighting" || state.locked;

    if (state.playerPosition === i) cell.classList.add("player-here");

    if (state.incomingAttack === i && !state.locked) cell.classList.add("warning");

    if (state.incomingAttack === i && state.locked) cell.classList.add("strike");
  }
}

function renderControls(state) {
  const btnDefinitive = document.getElementById("btn-definitive");
  const btnAgain = document.getElementById("btn-again");
  const moveDisabled =
    state.attackOnCooldown || state.phase !== "fighting";

  document.querySelectorAll("#move-buttons .btn-move").forEach((btn) => {
    btn.disabled = moveDisabled;
  });

  if (btnDefinitive) {
    btnDefinitive.disabled = state.definitiveUsed || state.phase !== "fighting";
  }
  if (btnAgain) {
    btnAgain.style.display = state.phase === "ended" ? "block" : "none";
  }
}

function renderLog(state) {
  const log = document.getElementById("battle-log");
  if (!log) return;

  log.innerHTML = state.log.map((entry) => `<p>${entry}</p>`).join("");

  log.scrollTop = log.scrollHeight;
}

function renderEndScreen(state) {
  const pSpr = document.getElementById("player-sprite");
  const oSpr = document.getElementById("opponent-sprite");
  if (!pSpr || !oSpr) return;

  pSpr.classList.toggle("defeated", state.phase === "ended" && state.playerHP <= 0);
  oSpr.classList.toggle("defeated", state.phase === "ended" && state.opponentHP <= 0);
}
