import {
  initBattle,
  scheduleNextAttack,
  resetBattle,
  playerAttack,
  playerDefinitiveAttack,
  registerBattleInput,
  movePlayerToCell,
  state,
} from "./battle.js";
import { render } from "./render.js";

function buildMoveButtons(moves) {
  const wrap = document.getElementById("move-buttons");
  if (!wrap) return;
  wrap.innerHTML = "";
  (moves || []).forEach((m, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-move";
    btn.dataset.moveIndex = String(i);
    btn.textContent = (m?.name || `movimiento ${i + 1}`).replace(/-/g, " ");
    btn.addEventListener("click", () => {
      playerAttack(m);
    });
    wrap.appendChild(btn);
  });
}

function wireArenaCells() {
  for (let i = 1; i <= 3; i++) {
    document.getElementById(`cell-${i}`)?.addEventListener("click", () => {
      movePlayerToCell(i);
    });
  }
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
  buildMoveButtons(config.player.moves);
  wireArenaCells();

  const btnDef = document.getElementById("btn-definitive");
  const btnAgain = document.getElementById("btn-again");

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
