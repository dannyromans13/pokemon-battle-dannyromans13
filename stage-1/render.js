import TRAINER from "../trainer.config.js";

/**
 * Función principal que orquestra el renderizado de toda la página
 */
export function render(state) {
    renderTrainerCard(state);
    renderOpponentCard(state);
    renderBattleButton(state);
}

/**
 * Renderiza la tarjeta de tu Pokémon (Pikachu)
 */
function renderTrainerCard(state) {
    const container = document.getElementById("trainer-card");
    if (!container) return;

    if (state.loading.trainer) {
        container.innerHTML = createSkeleton("PREPARANDO ENTRENADOR...");
        return;
    }

    if (state.error.trainer) {
        container.innerHTML = `<div class="card error"><p>⚠️ Error: ${state.error.trainer}</p></div>`;
        return;
    }

    if (state.trainer) {
        const p = state.trainer;
        const type = p.types[0].type.name;

        container.innerHTML = `
            <div class="card theme-${type}">
                <h2>${TRAINER.name.toUpperCase()}</h2>
                                
                
                <ul class="stats">
                    <li><span>⚡⚡⚡HP⚡⚡⚡</span> <span>${p.stats[0].base_stat}</span></li>
                    <li><span>✨✨✨Attaque✨✨✨</span> <span>${p.stats[1].base_stat}</span></li>
                    <li><span>🌩️🌩️🌩️Defensa 🌩️🌩️🌩️</span> <span>${p.stats[2].base_stat}</span></li>
                    <li><span>💨💨💨Velocidad 💨💨💨</span> <span>${p.stats[5].base_stat}</span></li>
                </ul>

                <div class="moves-list">
                    <small>MOVIMIENTOS:</small>
                    <p>${state.trainerMoves.map(m => m.name.replace('-', ' ')).join(', ')}</p>
                </div>

                <div class="sprite-container">
                    <img src="${p.sprites.front_default}" alt="${p.name}" />
                </div>

                <h3>${TRAINER.nickname ? TRAINER.nickname.toUpperCase() : p.name.toUpperCase()}</h3>
                <span class="type-tag ${type}">${type}</span>

                <p class="hometown">${TRAINER.catchphrase}</p>
                <p class="hometown">${TRAINER.hometown}</p>
            </div>
        `;
    }
}

/**
 * Renderiza la tarjeta del oponente buscado
 */
function renderOpponentCard(state) {
    const container = document.getElementById("opponent-card");
    if (!container) return;

    if (state.loading.opponent) {
        container.innerHTML = createSkeleton("BUSCANDO RIVAL...");
        return;
    }

    if (state.error.opponent) {
        container.innerHTML = `
            <div class="card" style="border-color: #E84040;">
                <h3 style="color: #E84040;">¡ERROR!</h3>
                <p>${state.error.opponent}</p>
                <p><small>Intenta con otro nombre o ID</small></p>
            </div>
        `;
        return;
    }

    if (state.opponent) {
        const o = state.opponent;
        const type = o.types[0].type.name;

        container.innerHTML = `
            <div class="card theme-${type}">
                <h2>OPONENTE</h2>
                <p class="hometown">Encuentro Salvaje</p>
                
                <div class="sprite-container">
                    <img src="${o.sprites.front_default}" alt="${o.name}" />
                </div>

                <h3>${o.name.toUpperCase()}</h3>
                <span class="type-tag ${type}">${type}</span>

                <ul class="stats">
                    <li><span>⚡⚡⚡HP⚡⚡⚡</span> <span>${o.stats[0].base_stat}</span></li>
                    <li><span>✨✨✨Attaque✨✨✨</span> <span>${o.stats[1].base_stat}</span></li>
                    <li><span>🌩️🌩️🌩️Defensa 🌩️🌩️🌩️</span> <span>${o.stats[2].base_stat}</span></li>
                    <li><span>💨💨💨Velocidad 💨💨💨</span> <span>${o.stats[5].base_stat}</span></li>
                </ul>

                <div class="moves-list">
                    <small>MOVIMIENTOS:</small>
                    <p>${state.opponentMoves.map(m => m.name.replace('-', ' ')).join(', ')}</p>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="card" style="opacity: 0.5; border-style: dashed;">
                <div style="height: 300px; display: flex; align-items: center; justify-content: center;">
                    <p>? ? ?</p>
                </div>
                <p><small>Esperando Rival...</small></p>
            </div>
        `;
    }
}

/**
 * Actualiza el estado del botón de batalla central
 */
function renderBattleButton(state) {
    const btn = document.getElementById("start-battle");
    if (!btn) return;

    const isReady = state.trainer && state.opponent && !state.loading.opponent;

    if (isReady) {
        btn.disabled = false;
        btn.innerText = "¡A COMBATIR!";
    } else {
        btn.disabled = true;
        btn.innerText = state.loading.opponent ? "Cargando..." : " ↑ Introduce un nombre...";
    }
}

/**
 * Genera el HTML para el efecto de carga (Skeleton)
 */
function createSkeleton(message) {
    return `
        <div class="card skeleton">
            <div class="skeleton-title pulse"></div>
            <p><small>${message}</small></p>
            <div class="sprite-container">
                <div class="skeleton-sprite pulse"></div>
            </div>
            <div class="skeleton-text pulse"></div>
            <div class="skeleton-text pulse" style="width: 50%;"></div>
            <div class="skeleton-text pulse"></div>
        </div>
    `;
}