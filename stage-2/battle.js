import TRAINER from "../trainer.config.js";
//import { render } from "./render.js";

export const state = {
  phase: "fighting",
  playerHP: 100,
  opponentHP: 100,
  playerPosition: 2,
  locked: false,
  definitiveUsed: false,
  attackOnCooldown: false,
  incomingAttack: null,
  log: []
};

let attackTimeout = null;

// Pausa X milisegundos — necesario para await dentro de async functions
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function scheduleNextAttack() {
  const delay = (3 + Math.random() * 7) * 1000; // 3 a 10 segundos

  attackTimeout = setTimeout(async () => {
    await resolveEnemyAttack();

    if (state.phase === "fighting") scheduleNextAttack(); // recursión
  }, delay);
}

async function resolveEnemyAttack() {
  state.incomingAttack = Math.floor(Math.random() * 3) + 1; // celda 1, 2 o 3
  state.locked = false;
  render(state); // muestra la advertencia

  await wait(600); // ventana para esquivar

  state.locked = true;
  render(state);

  if (state.playerPosition === state.incomingAttack) {
    const damage = calcEnemyDamage();
    state.playerHP = Math.max(0, state.playerHP - damage);
    state.log.push(`¡Te golpearon en la celda ${state.incomingAttack}! -${damage} HP`);
  } else {
    state.log.push(`¡Esquivaste el ataque en la celda ${state.incomingAttack}!`);
  }

  state.incomingAttack = null;
  state.locked = false;
  checkBattleEnd();
  render(state);
}

function calcEnemyDamage() {
  return Math.floor(Math.random() * 20) + 10; // 10 a 30
}

function calcPlayerDamage(move) {
  const power = move?.power || 50;
  return Math.floor(power / 5) + Math.floor(Math.random() * 10);
}

function calcDefinitiveDamage() {
  return Math.floor(Math.random() * 30) + 40; // 40 a 70
}

export function playerAttack(move) {
  if (state.attackOnCooldown || state.phase !== "fighting") return;

  const damage = calcPlayerDamage(move);
  state.opponentHP = Math.max(0, state.opponentHP - damage);
  state.log.push(`Atacaste con ${move?.name || "ataque normal"} — -${damage} HP`);

  checkBattleEnd();
  render(state);
}

export function playerDefinitiveAttack() {
  if (state.definitiveUsed || state.phase !== "fighting") return;

  const damage = calcDefinitiveDamage();
  state.opponentHP = Math.max(0, state.opponentHP - damage);
  state.definitiveUsed = true;
  state.log.push(`¡MOVIMIENTO DEFINITIVO! ${TRAINER.definitiveMoveName} — -${damage} HP!`);

  checkBattleEnd();
  render(state);
}

function checkBattleEnd() {
  if (state.playerHP <= 0) {
    state.phase = "ended";
    state.log.push(TRAINER.loseMessage);
    clearAttackTimeout();
  } else if (state.opponentHP <= 0) {
    state.phase = "ended";
    state.log.push(TRAINER.winMessage);
    clearAttackTimeout();
  }
}

export function clearAttackTimeout() {
  if (attackTimeout) clearTimeout(attackTimeout);
}

export function resetBattle() {
  state.phase = "fighting";
  state.playerHP = 100;
  state.opponentHP = 100;
  state.playerPosition = 2;
  state.locked = false;
  state.definitiveUsed = false;
  state.attackOnCooldown = false;
  state.incomingAttack = null;
  state.log = [];
  clearAttackTimeout();
  scheduleNextAttack();
  render(state);
}