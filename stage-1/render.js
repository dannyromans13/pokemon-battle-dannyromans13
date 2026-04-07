export function render(state){
    renderTrainerCard(state);
    renderOpponentCard(state);
    renderBattleButton(state);
}

function renderTrainerCard(state){  // Esta es la tarjeta del entrenador que en este caso soy yo
    const section = document.getElementById("trainer-card");
    if (!section) return; 

    if (state.loading.trainer) {        
        section.innerHTML = createSkeleton(); // Mostrar skeleton mientras se carga el entrenador
        return;
    }

    if (state.error.trainer) {          // Mostrar mensaje de error si falla la carga del entrenador
        section.innerHTML = `<p class="error">${state.error.trainer}</p>`;
        return;
    }

    if (state.trainer) {
        const p = state.trainer; 
        const type = p.types[0].type.name; // tipo principal del pókemon
    
        section.innerHTML = `
            <div class="card player-side theme-${type}">
                <h2>${TRAINER.name}</h2>
                <p class="hometown">${TRAINER.hometown} &middot; ${TRAINER.catchphrase} </p>
                <div class="sprite-container">
                    <img src="${p.sprites.front_default}" alt="${p.name}" />
                </div>
                <h3>${p.name.toUpperCase()}</h3>
                <p class="type-tag" ${type}>${type}</p>
                <ul class="stats">
                    <li>⚡⚡⚡HP⚡⚡⚡: ${p.stats[0].base_stat}</li>
                    <li>✨✨✨Attaque✨✨✨: ${p.stats[1].base_stat}</li>
                    <li>🌩️🌩️🌩️Defensa 🌩️🌩️🌩️: ${p.stats[2].base_stat}</li>
                    <li>💨💨💨Velocidad 💨💨💨: ${p.stats[5].base_stat}</li>
                </ul>
                <div class="moves-list">
                    <strong>Moves:</strong>
                    <ul>
                        ${state.trainerMoves.map(m => `<li>${m.name}</li>`).join('')}
                    </ul>
                </div>
            </div>`;
        }
    }



function renderOpponentCard(state){ // Esta es la tarjeta del oponente
    const section = document.getElementById("opponent-card");
    if (!section) return; 

    if (state.loading.opponent) {
        section.innerHTML = createSkeleton();
        return;
    }

    if (state.error.opponent) {
        section.innerHTML = `<p class="error">❌ ${state.error.opponent}</p>`;
        return;
    }

    if (state.opponent) {
        const o = state.opponent;
        const type = o.types[0].type.name; // tipo principal del pókemon

        section.innerHTML = `
            <div class="card opponent-side">
                <h2>Oponente</h2>
                <p class="hometown">¿Quién será? 🤔</p>
            <div class="sprite-container">
                <img src="${o.sprites.front_default}" alt="${o.name}" />
            </div>
            <h3>${o.name.toUpperCase()}</h3>
            <p class="type-tag" ${type}>${type}</p>
            <ul class="stats">
                <li>⚡⚡⚡HP⚡⚡⚡: ${o.stats[0].base_stat}</li>
                <li>✨✨✨Attaque✨✨✨: ${o.stats[1].base_stat}</li>
                <li>🌩️🌩️🌩️Defensa 🌩️🌩️🌩️: ${o.stats[2].base_stat}</li>
                <li>💨💨💨Velocidad 💨💨💨: ${o.stats[5].base_stat}</li>
            </ul>
            <div class="moves-list">
                <strong>Moves:</strong>
                <ul>
                    ${state.opponentMoves.map(m => `<li>${m.name}</li>`).join('')}
                </ul>
            </div>
        </div>`;
    } else {
        section.innerHTML = `<div class="empty-state"><p>¡Ven!, busca un oponente para comenzar la batalla o tienes miedo?</p></div>`;
    }
}

function renderBattleButton(state) {   //Este es el botón para iniciar la batalla
    const btn = document.getElementById("start-battle");
    if (!btn) return;

    cont ready = state.trainer && state.opponent && !state.loading.opponent;
    btn.disabled = !ready;

    if (ready) {
        btn.classList.add("ready");
        btn.innerText = "¡Listo para la batalla!";
    } else {
        btn.classList.remove("ready");
        btn.innerText = "¡Esperando al oponente!";
    }
}

function createSkeleton() {
    return `
        <div class="card skeleton">
            <div class="skeleton-title pulse"></div>
            <div class="skeleton-sprite pulse"></div>
            <div class="skeleton-text pulse"></div>
            <div class="skeleton-stats pulse"></div>
        </div>
    `;
}   