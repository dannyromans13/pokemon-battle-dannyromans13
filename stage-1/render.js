export function render(state){
    renderTrainerCard(state);
    renderOpponentCard(state);
    renderBattleButton(state);
}

function renderTrainerCard(state){
    const section = document.getElementById("trainer-card");

    if (state.loading.trainer) {        // Mostrar skeleton mientras se carga el entrenador
        section.innerHTML = '<div class="skeleton"></div>';
        return;
    }

    if (state.error.trainer) {          // Mostrar mensaje de error si falla la carga del entrenador
        section.innerHTML = `<p class="error">${state.error.trainer}</p>`;
        return;
    }

    if (!state.trainer) {        // Si no hay datos, aún no hay mostramos nada
        section.innerHTML = '';
        return;
    }   

    //Al llegar a esta parte es porque tenemos datos y dibujamos o renderizamos la tarjeta del entrenador
    const p = state.trainer; 
    const type = p.types[0].type.name; // tipo principal del pókemon

    section.innerHTML = `
        <div class="card-type ${type}">
            <h2>${TRAINER.name}</h2>
            <p>${TRAINER.hometown} &middot; ${TRAINER.catchphrase} </p>
            <img src="${p.sprites.front_default}" alt="${p.name}" />
            <h3>${p.name}</h3>
            <p class="type">${type}</p>
            <ul class="stats">
                <li >HP⚡: ${p.stats[0].base_stat}</li>
                <li>Attaque✨: ${p.stats[1].base_stat}</li>
                <li>Defensa 🌩️: ${p.stats[2].base_stat}</li>
                <li>Velocidad 💨: ${p.stats[5].base_stat}</li>
            </ul>
            <ul class="moves">
                ${state.trainerMoves.map(m => `<li>${m.name}</li>`).join('')}
            </ul>
        </div>;
    `;
}