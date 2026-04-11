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

const TYPE_SYMBOLS = {
  electric: "⚡",
  fire: "🔥",
  water: "💧",
  grass: "🌿",
  ice: "❄️",
  fighting: "👊",
  poison: "☠️",
  ground: "⛰️",
  flying: "🪶",
  psychic: "🔮",
  bug: "🐛",
  rock: "🪨",
  ghost: "👻",
  dragon: "🐉",
  dark: "🌑",
  steel: "⚙️",
  fairy: "✨",
  normal: "⭐",
};

function symbolFromName(name) {
  const n = (name || "").toLowerCase();
  if (/thunder|volt|spark|shock|bolt|zap|charge/.test(n)) return "⚡";
  if (/flame|fire|burn|ember|blaze|inferno|heat/.test(n)) return "🔥";
  if (/water|aqua|hydro|surf|bubble|rain|dive/.test(n)) return "💧";
  if (/leaf|vine|solar|petal|grass|seed|bullet seed/.test(n)) return "🌿";
  if (/ice|blizzard|freeze|hail|frost|icy/.test(n)) return "❄️";
  if (/punch|kick|brick|close combat|focus blast|karate|cross chop/.test(n)) return "👊";
  if (/sludge|toxic|poison|acid|venom/.test(n)) return "☠️";
  if (/earthquake|dig|sand|mud|ground/.test(n)) return "⛰️";
  if (/wing|gust|fly|aerial|sky|air slash|brave bird/.test(n)) return "🪶";
  if (/psychic|psybeam|confusion|zen|future sight/.test(n)) return "🔮";
  if (/bug|string shot|pin|quiver|x-scissor/.test(n)) return "🐛";
  if (/rock slide|stone|rock tomb|rollout|smack down/.test(n)) return "🪨";
  if (/shadow|night shade|hex|phantom|curse|lick/.test(n)) return "👻";
  if (/draco|dragon|outrage|twister/.test(n)) return "🐉";
  if (/dark|bite|crunch|night slash|sucker punch|knock off/.test(n)) return "🌑";
  if (/flash cannon|iron|steel|metal|gear/.test(n)) return "⚙️";
  if (/moonblast|dazzling|play rough|fairy|charm/.test(n)) return "✨";
  return "⚔️";
}

function symbolForMove(move) {
  const typeName = move?.type?.name;
  if (typeName && TYPE_SYMBOLS[typeName]) return TYPE_SYMBOLS[typeName];
  return symbolFromName(move?.name);
}

function buildMoveButtons(moves) {
  const wrap = document.getElementById("move-buttons");
  if (!wrap) return;
  wrap.innerHTML = "";
  (moves || []).forEach((m, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-move";
    btn.dataset.moveIndex = String(i);
    if (m?.type?.name) btn.dataset.moveType = m.type.name;

    const label = (m?.name || `movimiento ${i + 1}`).replace(/-/g, " ");
    const sym = symbolForMove(m);

    const icon = document.createElement("span");
    icon.className = "btn-move-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = sym;

    const text = document.createElement("span");
    text.className = "btn-move-label";
    text.textContent = label;

    btn.appendChild(icon);
    btn.appendChild(text);
    btn.title = `${label} (${m?.type?.name || "?"})`;

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
