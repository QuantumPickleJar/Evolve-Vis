import { initLayoutVisualizer, updateSubtitle } from '../src/layout.js';
import { onPhaseChange } from '../src/phaseVisualizer.js';
import { global } from '../src/vars.js';

describe('layout visualizer', () => {
  let ctx;
  beforeEach(() => {
    global.city = { cottage:{count:1}, factory:{count:2}, hall:{count:3} };
    global.resource = { human: { amount: 5 } };
    global.civic = { garrison: { workers: 2 } };
    global.race = { species: 'human' };
    document.body.innerHTML = '<canvas id="c" width="200" height="200"></canvas><h2 id="sub"></h2>' +
      '<button id="layoutKeyToggle"></button><div id="layoutKey" style="display:none"></div>';
    ctx = { clearRect: jest.fn(), save: jest.fn(), translate: jest.fn(), scale: jest.fn(), fillRect: jest.fn(), restore: jest.fn() };
    HTMLCanvasElement.prototype.getContext = () => ctx;
    initLayoutVisualizer('c','sub');
  });

  test('subtitle updates with phase', () => {
    updateSubtitle(2);
    expect(document.getElementById('sub').textContent).toContain('Planetary');
    updateSubtitle(5);
    expect(document.getElementById('sub').textContent).toContain('Interplanetary');
  });

  test('phase change callback triggers subtitle', () => {
    onPhaseChange(phase => updateSubtitle(phase));
    updateSubtitle(0);
    expect(document.getElementById('sub').textContent).toContain('Planetary');
  });
});
