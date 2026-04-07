import TRAINER from "../trainer.config.js";
import { fetchPokemon, fetchMove } from "./api.js";
import { renderTrainer, renderOpponent, renderError } from "./render.js";

let currentAbortController = null;
let debounceTimer = null;

async function loadFavoritePokemon() {
    try {
        const pokemon = await fetchPokemon(TRAINER.favoritePokemon);
        
        const moveResults = await Promise.allSettled(
            pokemon.moves.slice(0, 4).map(m => fetchMove(m.move.url))
        );

        const moves = moveResults
            .filter(r => r.status === "fulfilled")
            .map(r => r.value);
        
        renderTrainer(pokemon, moves);
    
    } catch (error) {
        renderError("trainer", error.message);
    }
}

async function searchOpponent(name) {
    if (currentAbortController) currentAbortController.abort();
    
    currentAbortController = new AbortController();

    try {
        const pokemon = await fetchPokemon(name, currentAbortController.signal);
        
        const moveResults = await Promise.allSettled(
            pokemon.moves.slice(0, 4).map(m => fetchMove(m.move.url))
        );

        const moves = moveResults
            .filter(r => r.status === "fulfilled")
            .map(r => r.value);
        
        renderOpponent(pokemon, moves);

    } catch (error) {
        if (error.name === "AbortError") return;
        renderError("opponent", error.message);
    }
}

function setupSearchInput() {
    const input = document.getElementById("opponent-search");

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