import { global } from './vars.js';
import { currentPhase, onPhaseChange, phaseName } from './phaseVisualizer.js';
import { loopTimers } from './functions.js';

let canvas, ctx, subtitle, keyToggle, keyBox;
let zoom = 1;
let offsetX = 0;
let offsetY = 0;
let dragging = false;
let startX = 0;
let startY = 0;

export function initLayoutVisualizer(canvasId, subtitleId) {
    canvas = document.getElementById(canvasId);
    subtitle = document.getElementById(subtitleId);
    keyToggle = document.getElementById('layoutKeyToggle');
    keyBox = document.getElementById('layoutKey');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    canvas.addEventListener('wheel', onWheel);
    canvas.addEventListener('mousedown', startDrag);
    canvas.addEventListener('mousemove', drag);
    canvas.addEventListener('mouseup', endDrag);
    canvas.addEventListener('mouseleave', endDrag);
    if (keyToggle && keyBox) {
        keyToggle.addEventListener('click', () => {
            keyBox.style.display = keyBox.style.display === 'none' ? 'block' : 'none';
        });
    }
    onPhaseChange(updateSubtitle);
    updateSubtitle(currentPhase());
    draw();
    setInterval(draw, loopTimers().mainTimer);
}

function onWheel(e) {
    e.preventDefault();
    zoom += e.deltaY > 0 ? -0.1 : 0.1;
    zoom = Math.max(0.2, Math.min(zoom, 5));
    draw();
}

function startDrag(e){
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
}

function drag(e){
    if(!dragging) return;
    offsetX += (e.clientX - startX);
    offsetY += (e.clientY - startY);
    startX = e.clientX;
    startY = e.clientY;
    draw();
}

function endDrag(){
    dragging = false;
}

function gatherBuildings(){
    const counts = { residential:0, industrial:0, civic:0 };
    if (!global.city) return counts;
    Object.keys(global.city).forEach(k=>{
        const count = global.city[k] && global.city[k].count ? global.city[k].count : 0;
        if (/house|cottage|apartment/i.test(k)) counts.residential += count;
        else if (/factory|foundry|mill|forge/i.test(k)) counts.industrial += count;
        else counts.civic += count;
    });
    return counts;
}

function gatherPopulation(){
    const citizens = global.resource[global.race?.species]?.amount || 0;
    const soldiers = global.civic?.garrison?.workers || 0;
    return { citizens, soldiers };
}

function draw(){
    if(!ctx) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(zoom, zoom);
    const cell = 20;
    const counts = gatherBuildings();
    const pop = gatherPopulation();
    const groups = [
        { count: counts.residential, color: '#3498db' },
        { count: counts.industrial, color: '#e67e22' },
        { count: counts.civic, color: '#2ecc71' }
    ];
    const maxX = Math.floor(canvas.width / cell / zoom);
    const total = groups.reduce((n,g)=>n+g.count,0);
    const rows = Math.ceil(total / maxX);
    const coords = [];
    for(let yy=0; yy<rows; yy++){
        for(let xx=0; xx<maxX; xx++){
            coords.push({x:xx,y:yy});
        }
    }
    for(let i=coords.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [coords[i],coords[j]]=[coords[j],coords[i]];
    }
    let idx=0;
    groups.forEach(g=>{
        for(let i=0;i<g.count;i++){
            if(idx>=coords.length) break;
            const p=coords[idx++];
            ctx.fillStyle=g.color;
            ctx.fillRect(p.x*cell,p.y*cell,cell-2,cell-2);
        }
    });
    const maxDots = 200;
    for(let i=0;i<Math.min(pop.citizens,maxDots);i++){
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(Math.random()*canvas.width/zoom, Math.random()*canvas.height/zoom, 2, 2);
    }
    for(let i=0;i<Math.min(pop.soldiers,maxDots);i++){
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(Math.random()*canvas.width/zoom, Math.random()*canvas.height/zoom, 2, 2);
    }
    ctx.restore();
}

export function updateSubtitle(phase){
    if(!subtitle) return;
    const name = phaseName(phase);
    subtitle.textContent = `${name} Operations`;
    draw();
}
