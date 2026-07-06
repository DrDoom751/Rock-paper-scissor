"use strict";

(function () {
const CONFIG = {
MOVES: {
ROCK: 'rock',
PAPER: 'paper',
SCISSORS: 'scissors'
},
OUTCOMES: {
WIN: 'win',
LOSE: 'lose',
DRAW: 'draw'
},
ICONS: {
rock: '✊',
paper: '✋',
scissors: '✌️',
defaultPlayer: '✊',
defaultOpponent: '?'
},
AURAS: {
rock: 'aura-rock',
paper: 'aura-paper',
scissors: 'aura-scissors'
},
OPPONENTS: [
'Hisoka',
'Killua',
'Illumi',
'Chrollo',
'Kite',
'Razor'
],
TIMING: {
COUNTDOWN_STEP: 500,
GO_STEP: 400,
SCORE_BUMP_DURATION: 450
}
};

const DOM = {
    countdownOverlay: document.getElementById('countdown-overlay'),
    countdownText: document.getElementById('countdown-text'),
    
    playerScore: document.getElementById('player-score'),
    opponentScore: document.getElementById('opponent-score'),
    
    playerSlot: document.getElementById('player-slot'),
    opponentSlot: document.getElementById('opponent-slot'),
    
    playerStatus: document.getElementById('player-status'),
    opponentStatus: document.getElementById('opponent-status'),
    
    playerHandDisplay: document.getElementById('player-hand-display'),
    opponentHandDisplay: document.getElementById('opponent-hand-display'),
    
    playerSlotLabel: document.getElementById('player-slot-label'),
    opponentSlotLabel: document.getElementById('opponent-slot-label'),
    
    resultPanel: document.getElementById('result-panel'),
    resultMessage: document.getElementById('result-message'),
    resultDetails: document.getElementById('result-details'),
    
    moveButtons: document.querySelectorAll('.btn-jajanken'),
    moveButtonsContainer: document.getElementById('move-buttons'),
    btnReset: document.getElementById('btn-reset'),
    
    opponentName: document.getElementById('opponent-name')
};

let state = {
    playerScore: 0,
    opponentScore: 0,
    isAnimating: false,
    currentOpponent: ''
};

function playClick() {
    // Audio will be added later
}

function playCountdown() {
    // Audio will be added later
}

function playWin() {
    // Audio will be added later
}

function playLose() {
    // Audio will be added later
}

function playDraw() {
    // Audio will be added later
}

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function getRandomOpponent() {
    const randomIndex = Math.floor(Math.random() * CONFIG.OPPONENTS.length);
    return CONFIG.OPPONENTS[randomIndex];
}

function getComputerMove() {
    const moves = Object.values(CONFIG.MOVES);
    const randomIndex = Math.floor(Math.random() * moves.length);
    return moves[randomIndex];
}

function determineOutcome(playerMove, computerMove) {
    if (playerMove === computerMove) {
        return CONFIG.OUTCOMES.DRAW;
    }

    if (
        (playerMove === CONFIG.MOVES.ROCK && computerMove === CONFIG.MOVES.SCISSORS) ||
        (playerMove === CONFIG.MOVES.SCISSORS && computerMove === CONFIG.MOVES.PAPER) ||
        (playerMove === CONFIG.MOVES.PAPER && computerMove === CONFIG.MOVES.ROCK)
    ) {
        return CONFIG.OUTCOMES.WIN;
    }

    return CONFIG.OUTCOMES.LOSE;
}

function setButtonsState(disabled) {
    DOM.moveButtons.forEach(btn => {
        btn.disabled = disabled;
    });
}

function updateAura(slotElement, move) {
    Object.values(CONFIG.AURAS).forEach(auraClass => {
        slotElement.classList.remove(auraClass);
    });
    slotElement.classList.remove('active-aura');

    if (move && CONFIG.AURAS[move]) {
        slotElement.classList.add(CONFIG.AURAS[move]);
    } else {
        slotElement.classList.add('active-aura');
    }
}

function updateScoreDisplay(element, newScore) {
    element.textContent = newScore;
    element.classList.remove('bump');
    void element.offsetWidth;
    element.classList.add('bump');

    setTimeout(() => {
        element.classList.remove('bump');
    }, CONFIG.TIMING.SCORE_BUMP_DURATION);
}

function updateResultPanel(outcome) {
    DOM.resultPanel.classList.remove(CONFIG.OUTCOMES.WIN, CONFIG.OUTCOMES.LOSE, CONFIG.OUTCOMES.DRAW);
    void DOM.resultPanel.offsetWidth; 

    DOM.resultPanel.classList.add(outcome);

    switch (outcome) {
        case CONFIG.OUTCOMES.WIN:
            DOM.resultMessage.textContent = 'YOU WIN';
            DOM.resultDetails.textContent = 'Your Nen overpowered the opponent.';
            playWin();
            break;
        case CONFIG.OUTCOMES.LOSE:
            DOM.resultMessage.textContent = 'DEFEAT';
            DOM.resultDetails.textContent = 'Your opponent predicted your attack.';
            playLose();
            break;
        case CONFIG.OUTCOMES.DRAW:
            DOM.resultMessage.textContent = 'DRAW';
            DOM.resultDetails.textContent = 'Equal Nen output.';
            playDraw();
            break;
    }
}

async function executeCountdown() {
    DOM.countdownOverlay.classList.remove('hidden');
    DOM.countdownOverlay.setAttribute('aria-hidden', 'false');

    const sequence = [
        { text: 'ROCK', duration: CONFIG.TIMING.COUNTDOWN_STEP },
        { text: 'PAPER', duration: CONFIG.TIMING.COUNTDOWN_STEP },
        { text: 'SCISSORS', duration: CONFIG.TIMING.COUNTDOWN_STEP },
        { text: 'GO!', duration: CONFIG.TIMING.GO_STEP }
    ];

    for (const step of sequence) {
        DOM.countdownText.textContent = step.text;
        playCountdown();
        await wait(step.duration);
    }

    DOM.countdownOverlay.classList.add('hidden');
    DOM.countdownOverlay.setAttribute('aria-hidden', 'true');
}

async function playRound(playerMove) {
    if (state.isAnimating) return;
    
    state.isAnimating = true;
    setButtonsState(true);
    playClick();

    await executeCountdown();

    const computerMove = getComputerMove();
    const outcome = determineOutcome(playerMove, computerMove);

    DOM.playerHandDisplay.textContent = CONFIG.ICONS[playerMove];
    DOM.opponentHandDisplay.textContent = CONFIG.ICONS[computerMove];

    DOM.playerStatus.textContent = 'Unleashed';
    DOM.opponentStatus.textContent = 'Unleashed';

    DOM.playerSlotLabel.textContent = `${playerMove} active`;
    DOM.opponentSlotLabel.textContent = `${computerMove} active`;

    updateAura(DOM.playerSlot, playerMove);
    updateAura(DOM.opponentSlot, computerMove);

    updateResultPanel(outcome);

    if (outcome === CONFIG.OUTCOMES.WIN) {
        state.playerScore++;
        updateScoreDisplay(DOM.playerScore, state.playerScore);
    } else if (outcome === CONFIG.OUTCOMES.LOSE) {
        state.opponentScore++;
        updateScoreDisplay(DOM.opponentScore, state.opponentScore);
    }

    state.isAnimating = false;
    setButtonsState(false);
}

function initNewMatch() {
    state.playerScore = 0;
    state.opponentScore = 0;
    state.isAnimating = false;
    state.currentOpponent = getRandomOpponent();

    DOM.playerScore.textContent = '0';
    DOM.opponentScore.textContent = '0';

    DOM.opponentName.textContent = state.currentOpponent;

    DOM.playerHandDisplay.textContent = CONFIG.ICONS.defaultPlayer;
    DOM.opponentHandDisplay.textContent = CONFIG.ICONS.defaultOpponent;

    DOM.playerStatus.textContent = 'Charging...';
    DOM.opponentStatus.textContent = 'Waiting...';

    DOM.playerSlotLabel.textContent = 'Nen Concentrated';
    DOM.opponentSlotLabel.textContent = 'Enemy State';

    updateAura(DOM.playerSlot, null);
    updateAura(DOM.opponentSlot, null);
    DOM.opponentSlot.classList.remove('active-aura'); 

    DOM.resultPanel.classList.remove(CONFIG.OUTCOMES.WIN, CONFIG.OUTCOMES.LOSE, CONFIG.OUTCOMES.DRAW);
    DOM.resultMessage.textContent = 'Await Match Start';
    DOM.resultDetails.textContent = 'Focus your Nen aura to unleash a technique.';

    DOM.countdownOverlay.classList.add('hidden');
    DOM.countdownOverlay.setAttribute('aria-hidden', 'true');

    setButtonsState(false);
}

function bindEvents() {
    DOM.moveButtonsContainer.addEventListener('click', (event) => {
        const button = event.target.closest('.btn-jajanken');
        if (!button || state.isAnimating) return;

        const move = button.getAttribute('data-move');
        if (Object.values(CONFIG.MOVES).includes(move)) {
            playRound(move);
        }
    });

    DOM.btnReset.addEventListener('click', () => {
        if (state.isAnimating) return;
        playClick();
        initNewMatch();
    });
}

function init() {
    bindEvents();
    initNewMatch();
}

document.addEventListener('DOMContentLoaded', init);
})();