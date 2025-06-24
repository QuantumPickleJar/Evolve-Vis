let phase = 0;
let container = null;
const unlockedTabs = new Set();

function draw() {
    if (!container) return;
    const total = 10;
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
        phase += 1;
    } else if (['buttonUnlocked','milestoneReached','subheaderAdded'].includes(eventType)) {
        phase += 1;
    }
    draw();
}

export function currentPhase() {
    return phase;
}
