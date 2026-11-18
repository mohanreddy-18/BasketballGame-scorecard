# Courtside basketball scoreboard

A responsive, accessible scoreboard built with HTML, CSS, and JavaScript. Both teams start at zero. Add one, two, or three points, undo scoring actions, or start a new game. The lead indicator updates after every change, including ties and resets. Starting a new game asks for confirmation to avoid accidental score loss.

Open `index.html` in a browser, or serve this directory with any static web server. No dependencies or build step are required. Scores last for the current page session; reloading the page starts a fresh game.

## Checks

Run `node --check index.js` to check JavaScript syntax and `node --test tests/scoreboard.test.cjs` to verify scoring, undo, ties, and reset behavior.
