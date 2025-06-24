import { initPhaseVisualizer, recordEvent, currentPhase } from '../src/phaseVisualizer.js';
import { global } from '../src/vars.js';

describe('phase visualizer', () => {
  beforeEach(() => {
    document.body.innerHTML = '<pre id="pv"></pre>';
    global.phase = undefined;
    initPhaseVisualizer('pv');
  });

  test('initializes to phase 0', () => {
    expect(currentPhase()).toBe(0);
    expect(document.getElementById('pv').textContent).toContain('Phase 0');
  });

  test('advances phase on events', () => {
    recordEvent('buttonUnlocked');
    expect(currentPhase()).toBe(1);
    expect(document.getElementById('pv').textContent).toContain('Phase 1');
    recordEvent('milestoneReached');
    expect(currentPhase()).toBe(2);
  });
});
