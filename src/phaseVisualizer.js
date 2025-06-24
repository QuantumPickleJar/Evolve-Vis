import { global } from './vars.js';

let container = null;
const unlockedTabs = new Set();
const phaseCallbacks = [];

function phaseVal() {
    if (global.phase === undefined) {
        global.phase = 0;
    }
    return global.phase;
}

function draw() {
    if (!container) return;
    const total = 10;
    const phase = phaseVal();
    const filled = Math.min(total, phase % (total + 1));
    const bar = '[' + '#'.repeat(filled) + '-'.repeat(total - filled) + ']';
    container.textContent = `Phase ${phase}\n${bar}`;
}

export function initPhaseVisualizer(id) {
    container = document.getElementById(id);
    draw();
}

export function recordEvent(eventType, detail) {
    if (eventType === 'tabUnlocked') {
        if (detail && unlockedTabs.has(detail)) return;
        if (detail) unlockedTabs.add(detail);
        global.phase = phaseVal() + 1;
    } else if (['buttonUnlocked','milestoneReached','subheaderAdded'].includes(eventType)) {
        global.phase = phaseVal() + 1;
    }
    phaseCallbacks.forEach(fn => {
        try { fn(global.phase); } catch (e) {}
    });
    draw();
}

export function currentPhase() {
    return phaseVal();
}

export function onPhaseChange(fn){
    phaseCallbacks.push(fn);
}
