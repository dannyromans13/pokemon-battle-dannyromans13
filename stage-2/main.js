import {
  initBattle,
  scheduleNextAttack,
  resetBattle,
  playerAttack,
  playerDefinitiveAttack,
  registerBattleInput,
  state,
} from "./battle.js";
import { render } from "./render.js";

function getSelectedMove() {
  const select = document.getElementById("move-select");
  if (!select || !state.playerMoves?.length) return null;
  const idx = Math.min(Math.max(parseInt(select.value, 10) || 0, 0), state.playerMoves.length - 1);
  return state.playerMoves[idx];
}

function populateMoveSelect(moves) {
  const select = document.getElementById("move-select");
  if (!select) return;
  select.innerHTML = "";
  (moves || []).forEach((m, i) => {
    const opt = document.createElement("option");
    opt.value = String(i);
    opt.textContent = (m?.name || `movimiento-${i + 1}`).replace(/-/g, " ");
    select.appendChild(opt);
  });
  select.disabled = !moves?.length;
}

document.addEventListener("DOMContentLoaded", () => {
  const raw = localStorage.getItem("battleConfig");
  if (!raw) {
    window.location.href = "../stage-1/index.html";
    return;
  }

  let config;
  try {
    config = JSON.parse(raw);
  } catch {
    window.location.href = "../stage-1/index.html";
    return;
  }

  if (!config?.player?.data || !config?.opponent?.data) {
    window.location.href = "../stage-1/index.html";
    return;
  }

  initBattle(config);
  populateMoveSelect(config.player.moves);

  const btnAttack = document.getElementById("btn-attack");
  const btnDef = document.getElementById("btn-definitive");
  const btnAgain = document.getElementById("btn-again");

  btnAttack?.addEventListener("click", () => {
    playerAttack(getSelectedMove());
  });

  btnDef?.addEventListener("click", () => {
    playerDefinitiveAttack();
  });

  btnAgain?.addEventListener("click", () => {
    resetBattle();
    registerBattleInput();
  });

  registerBattleInput();
  scheduleNextAttack();
  render(state);
});
