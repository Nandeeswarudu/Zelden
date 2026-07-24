const enterButton = document.querySelector('#enter-game');
const gameMap = document.querySelector('#game-map');
const player = document.querySelector('#player');
const tutorial = document.querySelector('#tutorial');
const tutorialText = document.querySelector('#tutorial-text');
const tutorialNext = document.querySelector('#tutorial-next');
const tutorialActions = document.querySelector('#tutorial-actions');
const tutorialYes = document.querySelector('#tutorial-yes');
const tutorialNo = document.querySelector('#tutorial-no');
const leaveButton = document.querySelector('.leave-game');
let position = { x: 50, y: 53 };
let tutorialStep = 0;
let walkingTimeout;
let lastMoveAt = 0;
const tutorialLines = [
  "Use the WASD or arrow keys to move your character around the map.",
  "You'll discover quests, treasures, and other things as the game grows.",
  "I'm busy, bye."
];

function showTutorial() {
  tutorialStep = 0;
  tutorialText.textContent = "I'm busy. Would you like a tutorial?";
  tutorialActions.hidden = false;
  tutorialNext.hidden = true;
  tutorial.hidden = false;
}

function enterMap() {
  document.body.classList.add('game-active');
  showTutorial();
}

function leaveMap() {
  document.body.classList.remove('game-active');
  tutorial.hidden = true;
}

enterButton.addEventListener('click', enterMap);
leaveButton.addEventListener('click', leaveMap);
tutorialYes.addEventListener('click', () => {
  tutorialStep = 0;
  tutorialText.textContent = tutorialLines[tutorialStep];
  tutorialActions.hidden = true;
  tutorialNext.hidden = false;
  tutorialNext.innerHTML = 'Next <span aria-hidden="true">→</span>';
});
tutorialNo.addEventListener('click', () => { tutorial.hidden = true; });
tutorialNext.addEventListener('click', () => {
  tutorialStep += 1;
  if (tutorialStep >= tutorialLines.length) {
    tutorial.hidden = true;
    return;
  }
  tutorialText.textContent = tutorialLines[tutorialStep];
  if (tutorialStep === tutorialLines.length - 1) tutorialNext.textContent = 'Continue exploring';
});
if (window.location.hash) history.replaceState(null, '', window.location.pathname);

window.addEventListener('keydown', (event) => {
  if (!document.body.classList.contains('game-active')) return;
  const moves = { ArrowUp: [0, -1], w: [0, -1], ArrowDown: [0, 1], s: [0, 1], ArrowLeft: [-1, 0], a: [-1, 0], ArrowRight: [1, 0], d: [1, 0] };
  const move = moves[event.key];
  if (!move) return;
  event.preventDefault();
  const now = performance.now();
  if (now - lastMoveAt < 120) return;
  lastMoveAt = now;
  const direction = move[0] < 0 ? 'left' : move[0] > 0 ? 'right' : move[1] < 0 ? 'up' : 'down';
  player.dataset.direction = direction;
  player.classList.add('is-walking');
  window.clearTimeout(walkingTimeout);
  walkingTimeout = window.setTimeout(() => player.classList.remove('is-walking'), 180);
  position.x = Math.max(4, Math.min(96, position.x + move[0]));
  position.y = Math.max(14, Math.min(94, position.y + move[1]));
  player.style.left = `${position.x}%`;
  player.style.top = `${position.y}%`;
});
