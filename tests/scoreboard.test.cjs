const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

function setup() {
    const elements = new Map();
    function element(id) {
        if (!elements.has(id)) elements.set(id, {
            textContent: '', hidden: id === 'reset-confirmation', disabled: false, attributes: {}, listeners: {},
            setAttribute(key, value) { this.attributes[key] = value; },
            addEventListener(type, fn) { this.listeners[type] = fn; },
            focus() {},
            click() { if (!this.disabled) this.listeners.click?.(); },
        });
        return elements.get(id);
    }
    const buttons = ['HOME', 'AWAY'].flatMap(team => [1, 2, 3].map(points => {
        const button = element(`${team}${points}`);
        button.dataset = { team, points: String(points) };
        return button;
    }));
    const document = { getElementById: element, querySelectorAll: () => buttons, addEventListener() {} };
    vm.runInNewContext(readFileSync(require.resolve('../index.js'), 'utf8'), { document });
    return element;
}

test('starts at zero and updates all six scoring controls and lead indicators', () => {
    const el = setup();
    assert.equal(el('index1').textContent, 0);
    assert.equal(el('index2').textContent, 0);
    assert.equal(el('undo').disabled, true);
    for (const team of ['HOME', 'AWAY']) for (const points of [1, 2, 3]) el(`${team}${points}`).click();
    assert.equal(el('index1').textContent, 6);
    assert.equal(el('index2').textContent, 6);
    assert.match(el('leads').textContent, /Tie game/);
    assert.equal(el('home-leader').hidden, true);
    assert.equal(el('away-leader').hidden, true);
    el('HOME1').click();
    assert.match(el('leads').textContent, /Home leads by 1 point\./);
    assert.equal(el('home-leader').hidden, false);
    el('AWAY3').click();
    assert.match(el('leads').textContent, /Away leads by 2 points\./);
    assert.equal(el('away-leader').hidden, false);
});

test('undo restores previous scores, including ties and the initial state', () => {
    const el = setup();
    el('HOME3').click();
    el('AWAY3').click();
    el('undo').click();
    assert.equal(el('index2').textContent, 0);
    assert.match(el('leads').textContent, /Home leads by 3 points/);
    el('undo').click();
    assert.equal(el('index1').textContent, 0);
    assert.equal(el('undo').disabled, true);
    el('undo').click();
    assert.equal(el('index1').textContent, 0);
});

test('new game preserves scores until confirmed, then resets scores, leader and undo', () => {
    const el = setup();
    el('AWAY2').click();
    el('new-game').click();
    assert.equal(el('reset-confirmation').hidden, false);
    assert.equal(el('index2').textContent, 2);
    el('cancel-reset').click();
    assert.equal(el('reset-confirmation').hidden, true);
    assert.equal(el('index2').textContent, 2);
    el('new-game').click();
    el('confirm-reset').click();
    assert.equal(el('index1').textContent, 0);
    assert.equal(el('index2').textContent, 0);
    assert.equal(el('home-leader').hidden, true);
    assert.equal(el('away-leader').hidden, true);
    assert.equal(el('undo').disabled, true);
    assert.equal(el('reset-confirmation').hidden, true);
    assert.match(el('leads').textContent, /All square/);
});
