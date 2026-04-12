# pokemon-battle-dannyromans13

*** Gracias por consultar este archivo readme ***

Los siguientes son los enlaces para acceder al GitHub y GitHub pages:

https://github.com/dannyromans13/pokemon-battle-dannyromans13

https://dannyromans13.github.io/pokemon-battle-dannyromans13/

Link Loom: https://www.loom.com/share/fa64a10e6c5f47978474f5e20bb7d801


Con respecto a mi Pokémon favorito y por qué?:

Aunque debo de admitir que nunca he sido un fan de los Pókemon, he de admitir que mi favorito en este caso es Pikachu

y lo elegí porque es uno de los más icónicos (creo) de todos los Pokémon en general.


El nombre del movimiento definitivo es "Tormenta Eléctrificante" y el sabor (o flavor) "Cuando el cielo se vuelve de Pikachu no tienes escape." La inspiración no es más que una creatividad pura de asignar el Pikachu con sus poderes y colores o temas.

Los conceptos clave en mi proyecto son:

Stage-1: stage-1/api.js Línea 3 - fetchPokemon usé async/await para hacer fetch desde el PokeAPI.

Stage-1: stage-1/api.js Línea 16 - fetchMove usé también el async/await aqui. 

Stage-1: stage-1/main.js Línea 23 — async function loadFavoritePokemon() → Async/await

Stage-1: stage-1/main.js Línea 31 — Promise.allSettled( → Promises (primer uso, trainer)

Stage-1: stage-1/main.js Línea 52 — async function searchOpponent( → Async/await + AbortController

Stage-1: stage-1/main.js Línea 63 — Promise.allSettled( → Promises (segundo uso, opponent)

Stage-1: stage-1/main.js Línea 54 — currentAbortController.abort() → AbortController/Event Loop

Stage-1: stage-1/main.js Línea 92 — clearTimeout(debounceTimer) → Event Loop/debounce

Stage-1: stage-1/main.js Línea 102 — debounceTimer = setTimeout(() → Event Loop/debounce

Stage-1: stage-1/main.js Línea 128 — document.addEventListener("DOMContentLoaded" → Event Loop

stage-2/battle.js Línea 29 — function wait(ms) → Event Loop / setTimeout como Promise

stage-2/battle.js Línea 90 — requestAnimationFrame(tick) → Event Loop / rAF cooldown bar

stage-2/battle.js Línea 96 — cooldownRaf = requestAnimationFrame(tick) → rAF loop

stage-2/battle.js Línea 114 — document.addEventListener("keydown" → DOM / Event Loop

stage-2/battle.js Línea 123 — export function scheduleNextAttack() → Event Loop / recursive setTimeout

stage-2/battle.js Línea 125 — attackTimeout = setTimeout(async () → recursive setTimeout

stage-2/battle.js Línea 132 — async function resolveEnemyAttack() → Async/await

stage-2/battle.js Línea 140 — await wait(600) → Async/await pause

stage-2/render.js Línea 4 — export function render(state) → DOM Manipulation / single render function

stage-2/render.js Línea 27 — playerBar.style.width → DOM Manipulation

stage-2/render.js Línea 54 — cell.className = "cell" → DOM Manipulation

stage-2/render.js Línea 79 — log.innerHTML = state.log.map( → DOM Manipulation

stage-2/render.js Línea 81 — log.scrollTop = log.scrollHeight → DOM auto-scroll


Para el punto que hace referencia de qué me faltó por realizar: 

Puedo decir que en el stage.css del stage 1 faltaron los type themes, tengo el theme-${type} en el HTML del render pero no olvidé incluir clases en el CSS.

