import TRAINER from "../trainer.config.js";
import { fetchPokemon, fetchMove } from "./api.js";
import { render } from "./render.js";

// Estado central — toda la UI se deriva de este objeto
const state = {
  trainer: null,
  trainerMoves: [],
  opponent: null,
  opponentMoves: [],
  loading: {
    trainer: false,
    opponent: false
  },
  error: {
    trainer: null,
    opponent: null
  }
};

let currentAbortController = null;
let debounceTimer = null;

async function loadFavoritePokemon() {
  // Indicamos que está cargando y renderizamos
  state.loading.trainer = true;
  state.error.trainer = null;
  render(state);

  try {
    const pokemon = await fetchPokemon(TRAINER.favoritePokemon);

    const moveResults = await Promise.allSettled(
      pokemon.moves.slice(0, 4).map(m => fetchMove(m.move.url))
    );

    const moves = moveResults
      .filter(r => r.status === "fulfilled")
      .map(r => r.value);

    // Guardamos en el estado y renderizamos
    state.trainer = pokemon;
    state.trainerMoves = moves;

  } catch (error) {
    state.error.trainer = error.message;
  } finally {
    // finally siempre se ejecuta, haya error o no
    // Es el lugar correcto para apagar el loading
    state.loading.trainer = false;
    render(state);
  }
}

async function searchOpponent(name) {
  if (currentAbortController) currentAbortController.abort();
  currentAbortController = new AbortController();

  state.loading.opponent = true;
  state.error.opponent = null;
  state.opponent = null;
  state.opponentMoves = [];
  render(state);

  try {
    const pokemon = await fetchPokemon(name, currentAbortController.signal);

    const moveResults = await Promise.allSettled(
      pokemon.moves.slice(0, 4).map(m => fetchMove(m.move.url))
    );

    const moves = moveResults
      .filter(r => r.status === "fulfilled")
      .map(r => r.value);

    state.opponent = pokemon;
    state.opponentMoves = moves;

    // Guardamos el último oponente buscado en localStorage
    localStorage.setItem("lastOpponent", name);

  } catch (error) {
    if (error.name === "AbortError") return;
    state.error.opponent = error.message;
  } finally {
    state.loading.opponent = false;
    render(state);
  }
}

function setupSearchInput() {
  const input = document.getElementById("opponent-search");

  // Pre-llenamos el input si hay un oponente guardado
  const lastOpponent = localStorage.getItem("lastOpponent");
  if (lastOpponent) {
    input.value = lastOpponent;
    searchOpponent(lastOpponent);
  }

  input.addEventListener("input", () => {
    clearTimeout(debounceTimer);

    if (!input.value.trim()) return;

    debounceTimer = setTimeout(() => {
      searchOpponent(input.value.trim());
    }, 500);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadFavoritePokemon();
  setupSearchInput();
});

