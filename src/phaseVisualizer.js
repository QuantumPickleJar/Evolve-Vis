import { global } from './vars.js';

let container = null;
let canvas = null;
let ctx = null;
const unlockedTabs = new Set();
const phaseCallbacks = [];
let cell = { x: 0, y: 0 };
let food = { x: 3, y: 3 };
const grid = 10;
const step = 20;

function phaseVal() {
    if (global.phase === undefined) {
        global.phase = 0;
    }
    return global.phase;
}

function draw() {
    if (container) {
        const total = 10;
        const phase = phaseVal();
        const filled = Math.min(total, phase % (total + 1));
        const bar = '[' + '#'.repeat(filled) + '-'.repeat(total - filled) + ']';
        container.textContent = `Phase ${phase}\n${bar}`;
    }
    drawCell();
}

function drawCell(){
    if(!ctx) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = '#ccc';
    for(let i=0;i<=grid;i++){
        ctx.beginPath();
        ctx.moveTo(i*step,0);
        ctx.lineTo(i*step,grid*step);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0,i*step);
        ctx.lineTo(grid*step,i*step);
        ctx.stroke();
    }
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc((cell.x+0.5)*step,(cell.y+0.5)*step,step/2-2,0,Math.PI*2);
    ctx.fill();
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc((food.x+0.5)*step,(food.y+0.5)*step,step/4,0,Math.PI*2);
    ctx.fill();
}

function spawnFood(){
    food.x = Math.floor(Math.random()*grid);
    food.y = Math.floor(Math.random()*grid);
}

function handleKey(e){
    switch(e.key){
        case 'ArrowUp':
            cell.y = Math.max(0, cell.y-1); break;
        case 'ArrowDown':
            cell.y = Math.min(grid-1, cell.y+1); break;
        case 'ArrowLeft':
            cell.x = Math.max(0, cell.x-1); break;
        case 'ArrowRight':
            cell.x = Math.min(grid-1, cell.x+1); break;
        default:
            return;
    }
    checkFood();
    drawCell();
}

function checkFood(){
    if(cell.x === food.x && cell.y === food.y){
        spawnFood();
        recordEvent('cellFood');
    }
}

export function initPhaseVisualizer(textId, canvasId) {
    container = document.getElementById(textId);
    if (canvasId){
        canvas = document.getElementById(canvasId);
        if (canvas){
            ctx = canvas.getContext('2d');
            canvas.setAttribute('tabindex','0');
            canvas.addEventListener('keydown', handleKey);
            spawnFood();
        }
    }
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
