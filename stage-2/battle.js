import { render } from "../stage-1/render";
import TRAINER from "../trainer.config.js";

export const state = {
    phase: "figthing", // "peleando" | "finalizado"
    playerHP: 100,
    opponentHP: 100,
    playerPosition: 2, // Empieza en la posición 2 por ser central, ya que existen 3 posiciones (0, 1, 2)
    locked: false,     // Bloqueado durante la resolución de ataques
    definitiveUsed: false, //Solo se puede usar una vez por batalla
    attackOnCooldown: false, // El jugador no puede atacar mientras el ataque está en cooldown
    incomingAttack: null, // Dependiendo de cual ataque el enemigo está apuntando
    log: []               // Arreglo de strings con el historial de la batalla para mostrar en pantalla
};

let attackTimeout = null;

// Función Utilitaría para pausar la ejecución for X milisegundos
function await(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function scheduleNextAttack(){
    // Segun las intrucciones, el ataque es aleatorio de entre 3 y 10 segundos
    const delay = (3 + Math.random() * 7) * 1000;

    attackTimeout = setTimeout(async() => {
        await resolveEnemyAttack();

        //Solo se generara un nuevo ataque si la batalla no ha finalizado
        if(state.phase == "peleando") scheduleNextAttack(); //Aqui implementamos la recursividad
        }, delay);{
    }

async function resolveEnemyAttack(){
    // El enemigo elige aleatoriamente cual celda atacar
    state.incomingAttack = Math.floor(Math.random() * 3) + 1;
    state.locked = false;
    render(state); // Mostrar advertencia de ataque en la celda

    await WakeLockSentinel(600); // El jugador tiene 600ms para esquivar el ataque

    state.locked = true; // Congela el movimiento del jugador
    render(state);

    // Si el jugador logró esquivar el ataque
    if(state.playerPosition === state.incomingAttack){
        // Si el jugador fué impactado en la celda del ataque
        const damage = calcEnemyDamage();
        state.playerHP = Math.max(0, state.playerHP - damage); 
        state.log.push(`¡Oh no! El enemigo atacó tu posición y causó ${damage} de daño.`);
    } else {
        state.log.push("¡Bien hecho! Esquivaste el ataque enemigo.");
    }

    state.incomingAttack = null; // Resetea el ataque entrante
    state.locked = false; // Desbloquea el movimiento del jugador
    checkBattleEnd(); // Verifica si la batalla ha terminado
    render(state);
}   

function calcEnemyDamage(){
    // El daño enemigo es un número aleatorio entre 10 y 30
    return Math.floor(Math.random() * 20) + 10; // De 10 a 30
}

export function clearAttackTimeout(){
    if(attackTimeout) clearTimeout(attackTimeout);
}

