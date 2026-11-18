'use strict';

const scores = { HOME: 0, AWAY: 0 };
const history = [];
const homeDisplay = document.getElementById('index1');
const awayDisplay = document.getElementById('index2');
const status = document.getElementById('leads');
const undoButton = document.getElementById('undo');
const newGameButton = document.getElementById('new-game');
const confirmation = document.getElementById('reset-confirmation');

function render() {
    homeDisplay.textContent = scores.HOME;
    awayDisplay.textContent = scores.AWAY;
    homeDisplay.setAttribute('aria-label', `Home score: ${scores.HOME}`);
    awayDisplay.setAttribute('aria-label', `Away score: ${scores.AWAY}`);
    document.getElementById('home-leader').hidden = scores.HOME <= scores.AWAY;
    document.getElementById('away-leader').hidden = scores.AWAY <= scores.HOME;
    const difference = Math.abs(scores.HOME - scores.AWAY);
    const result = difference === 0
        ? (scores.HOME === 0 ? 'All square. Let’s play.' : 'Tie game. Every point counts.')
        : `${scores.HOME > scores.AWAY ? 'Home' : 'Away'} leads by ${difference} ${difference === 1 ? 'point' : 'points'}.`;
    status.textContent = `Home ${scores.HOME}, Away ${scores.AWAY}. ${result}`;
    undoButton.disabled = history.length === 0;
}

function closeConfirmation() {
    confirmation.hidden = true;
    newGameButton.setAttribute('aria-expanded', 'false');
}

for (const button of document.querySelectorAll('[data-points]')) {
    button.addEventListener('click', () => {
        const team = button.dataset.team;
        const points = Number(button.dataset.points);
        if (!(team in scores) || ![1, 2, 3].includes(points) || !Number.isSafeInteger(scores[team] + points)) return;
        scores[team] += points;
        history.push({ team, points });
        closeConfirmation();
        render();
    });
}

undoButton.addEventListener('click', () => {
    const last = history.pop();
    if (!last) return;
    scores[last.team] -= last.points;
    closeConfirmation();
    render();
});

newGameButton.setAttribute('aria-controls', 'reset-confirmation');
newGameButton.setAttribute('aria-expanded', 'false');
newGameButton.addEventListener('click', () => {
    if (!history.length) return;
    confirmation.hidden = !confirmation.hidden;
    newGameButton.setAttribute('aria-expanded', String(!confirmation.hidden));
    if (!confirmation.hidden) document.getElementById('cancel-reset').focus();
});
document.getElementById('cancel-reset').addEventListener('click', () => {
    closeConfirmation();
    newGameButton.focus();
});
document.getElementById('confirm-reset').addEventListener('click', () => {
    scores.HOME = 0;
    scores.AWAY = 0;
    history.length = 0;
    closeConfirmation();
    render();
    newGameButton.focus();
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !confirmation.hidden) {
        closeConfirmation();
        newGameButton.focus();
    }
});
render();
