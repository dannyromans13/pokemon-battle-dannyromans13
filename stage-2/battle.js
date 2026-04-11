import TRAINER from "../trainer.config.js";
import { render } from "./render.js";

let savedConfig = null;

export const state = {
  phase: "fighting",
  playerHP: 0,
  opponentHP: 0,
  playerMaxHP: 0,
  opponentMaxHP: 0,
  playerPosition: 2,
  locked: false,
  definitiveUsed: false,
  attackOnCooldown: false,
  incomingAttack: null,
  log: [],
  playerData: null,
  opponentData: null,
  playerMoves: [],
  opponentMoves: [],
  opponentAttackStat: 50,
};

let attackTimeout = null;
let cooldownRaf = null;
let keydownHandler = null;

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getBaseStat(pokemon, statName) {
  const s = pokemon?.stats?.find((x) => x.stat.name === statName);
  return s ? s.base_stat : 50;
}

function applyConfig(config) {
  const pData = config.player.data;
  const oData = config.opponent.data;
  const pHp = Math.floor(getBaseStat(pData, "hp") * 2.5);
  const oHp = Math.floor(getBaseStat(oData, "hp") * 2.5);

  state.phase = "fighting";
  state.playerHP = pHp;
  state.opponentHP = oHp;
  state.playerMaxHP = pHp;
  state.opponentMaxHP = oHp;
  state.playerPosition = 2;
  state.locked = false;
  state.definitiveUsed = false;
  state.attackOnCooldown = false;
  state.incomingAttack = null;
  state.log = [];
  state.playerData = pData;
  state.opponentData = oData;
  state.playerMoves = config.player.moves || [];
  state.opponentMoves = config.opponent.moves || [];
  state.opponentAttackStat = getBaseStat(oData, "attack");
}

export function initBattle(config) {
  savedConfig = config;
  applyConfig(config);
}

function cancelCooldownAnim() {
  if (cooldownRaf != null) {
    cancelAnimationFrame(cooldownRaf);
    cooldownRaf = null;
  }
  const bar = document.getElementById("cooldown-bar");
  if (bar) bar.style.width = "100%";
}

function startCooldown() {
  cancelCooldownAnim();
  const durationMs = (2 + Math.random() * 2) * 1000;
  state.attackOnCooldown = true;
  render(state);

  const bar = document.getElementById("cooldown-bar");
  if (bar) bar.style.width = "100%";

  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const pct = Math.min(elapsed / durationMs, 1);
    if (bar) bar.style.width = `${(1 - pct) * 100}%`;

    if (pct < 1) {
      cooldownRaf = requestAnimationFrame(tick);
    } else {
      cooldownRaf = null;
      state.attackOnCooldown = false;
      if (bar) bar.style.width = "100%";
      render(state);
    }
  }

  cooldownRaf = requestAnimationFrame(tick);
}

export function movePlayerToCell(index) {
  if (state.phase !== "fighting" || state.locked) return;
  if (index < 1 || index > 3) return;
  state.playerPosition = index;
  render(state);
}

export function registerBattleInput() {
  if (keydownHandler) return;
  keydownHandler = (e) => {
    if (state.phase !== "fighting") return;
    if (state.locked) return;

    if (e.key === "ArrowLeft" && state.playerPosition > 1) state.playerPosition--;
    if (e.key === "ArrowRight" && state.playerPosition < 3) state.playerPosition++;

    render(state);
  };
  document.addEventListener("keydown", keydownHandler);
}

export function unregisterBattleInput() {
  if (!keydownHandler) return;
  document.removeEventListener("keydown", keydownHandler);
  keydownHandler = null;
}

export function scheduleNextAttack() {
  const delay = (3 + Math.random() * 7) * 1000;

  attackTimeout = setTimeout(async () => {
    await resolveEnemyAttack();

    if (state.phase === "fighting") scheduleNextAttack();
  }, delay);
}

async function resolveEnemyAttack() {
  const targetCell = Math.floor(Math.random() * 3) + 1;
  state.incomingAttack = targetCell;
  state.locked = false;
  state.log.push(`¡Telegrafiado! Ataque enemigo hacia la celda ${targetCell}.`);
  render(state);

  await wait(600);

  state.locked = true;
  render(state);

  if (state.playerPosition === targetCell) {
    const damage = calcEnemyDamage();
    state.playerHP = Math.max(0, state.playerHP - damage);
    state.log.push(`Impacto en celda ${targetCell}: -${damage} HP.`);
  } else {
    state.log.push(`¡Esquivaste! La celda ${targetCell} fue objetivo.`);
  }

  state.incomingAttack = null;
  state.locked = false;
  checkBattleEnd();
  render(state);
}

function calcEnemyDamage() {
  return (
    Math.floor(state.opponentAttackStat * 0.4) + Math.floor(Math.random() * 20)
  );
}

function calcPlayerDamage(move) {
  const power = move?.power != null ? move.power : 60;
  return (
    Math.floor(power * 0.3) + Math.floor(Math.random() * power * 0.4)
  );
}

export function playerAttack(move) {
  if (state.attackOnCooldown || state.phase !== "fighting") return;

  const damage = calcPlayerDamage(move);
  state.opponentHP = Math.max(0, state.opponentHP - damage);
  const moveName = (move?.name || "ataque").replace(/-/g, " ");
  state.log.push(`Atacaste con ${moveName}: -${damage} HP al rival.`);

  checkBattleEnd();
  if (state.phase === "fighting") startCooldown();
  render(state);
}

export function playerDefinitiveAttack() {
  if (state.definitiveUsed || state.phase !== "fighting") return;

  const dmg = state.opponentHP;
  state.opponentHP = 0;
  state.definitiveUsed = true;
  state.log.push(
    `¡MOVIMIENTO DEFINITIVO! ${TRAINER.definitiveMoveName} — -${dmg} HP (KO).`
  );

  checkBattleEnd();
  render(state);
}

function checkBattleEnd() {
  if (state.playerHP <= 0) {
    state.phase = "ended";
    state.log.push(TRAINER.loseMessage);
    clearAttackTimeout();
    cancelCooldownAnim();
    unregisterBattleInput();
  } else if (state.opponentHP <= 0) {
    state.phase = "ended";
    state.log.push(TRAINER.winMessage);
    clearAttackTimeout();
    cancelCooldownAnim();
    unregisterBattleInput();
  }
}

export function clearAttackTimeout() {
  if (attackTimeout) {
    clearTimeout(attackTimeout);
    attackTimeout = null;
  }
}

export function resetBattle() {
  if (!savedConfig) return;
  clearAttackTimeout();
  cancelCooldownAnim();
  unregisterBattleInput();
  applyConfig(savedConfig);
  scheduleNextAttack();
  render(state);
}
