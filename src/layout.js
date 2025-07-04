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
let layoutState;
const cell = 20;
const colorMap = {
    residential: '#3498db',
    industrial: '#e67e22',
    civic: '#2ecc71'
};

function hasRace(){
    return global.race && Object.keys(global.race).length > 0;
}

function hasGenetics(){
    return global.resource && global.resource.DNA && global.resource.RNA;
}

export function initLayoutVisualizer(canvasId, subtitleId) {
    canvas = document.getElementById(canvasId);
    subtitle = document.getElementById(subtitleId);
    keyToggle = document.getElementById('layoutKeyToggle');
    keyBox = document.getElementById('layoutKey');
    if (!canvas) return;
    if(!hasRace()){
        if(subtitle) subtitle.style.display = 'none';
        canvas.style.display = 'none';
        if(keyToggle) keyToggle.style.display = 'none';
        return;
    } else {
        canvas.style.display = 'block';
        if(keyToggle) keyToggle.style.display = 'inline-block';
    }
    ctx = canvas.getContext('2d');
    layoutState = global.layout || (global.layout = { positions: [] });
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
    stepLayout();
    setInterval(stepLayout, loopTimers().mainTimer);
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
    const list = [];
    if (!global.city) return list;
    Object.keys(global.city).forEach(k=>{
        const count = global.city[k] && global.city[k].count ? global.city[k].count : 0;
        let type = 'civic';
        if (/house|cottage|apartment/i.test(k)) type = 'residential';
        else if (/factory|foundry|mill|forge/i.test(k)) type = 'industrial';
        for(let i=0;i<count;i++) list.push(type);
    });
    return list;
}

function gatherPopulation(){
    const citizens = global.resource[global.race?.species]?.amount || 0;
    const soldiers = global.civic?.garrison?.workers || 0;
    return { citizens, soldiers };
}

function randomCoord(){
    const maxX = Math.floor(canvas.width / cell / zoom);
    const maxY = Math.floor(canvas.height / cell / zoom);
    return { x: Math.floor(Math.random()*maxX), y: Math.floor(Math.random()*maxY) };
}

function updateLayoutState(){
    const buildings = gatherBuildings();
    const pos = layoutState.positions;
    while(pos.length < buildings.length){
        const p = randomCoord();
        if(!pos.some(o=>o.x===p.x && o.y===p.y)) pos.push({ ...p, type: buildings[pos.length] });
    }
    while(pos.length > buildings.length){
        pos.pop();
    }
    pos.forEach((p,i)=>{ p.type = buildings[i]; });
}

function layoutStage(phase){
    if(!hasRace()) return '';
    if(phaseName(phase) === 'Cellular' && hasGenetics()) return 'Cytoskeleton';

    const tech = global.tech || {};
    if(tech.existential) return 'Existential Dominion';
    if(tech.dimensional) return 'Dimensional Conquest';
    if(tech.intergalactic) return 'Intergalactic Empire';
    if(tech.interstellar) return 'Interstellar Expansion';
    if(tech.deep_space) return 'Deep Space Colonization';
    if(tech.early_space) return 'Early Space Age';
    if(tech.globalized) return 'Globalized Industry';
    if(tech.industrialized){
        if(tech.industrialized < 2 && global.stats?.days < 50) return 'Early Industrial Revolution';
        return 'Industrial Revolution';
    }
    if(tech.discovery) return 'Age of Discovery';
    if(tech.civilized) return 'Civilized Development';
    if(!tech.primitive || tech.primitive < 3) return 'Nomadic Operations';
    return `${phaseName(phase)} Operations`;
}

function stepLayout(){
    updateLayoutState();
    draw();
}

function draw(){
    if(!ctx) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(zoom, zoom);
    const pop = gatherPopulation();
    layoutState.positions.forEach(p=>{
        ctx.fillStyle = colorMap[p.type];
        ctx.fillRect(p.x*cell, p.y*cell, cell-2, cell-2);
        const cx = p.x*cell + cell/2;
        const cy = p.y*cell + cell/2;
        const w = canvas.width/zoom;
        const h = canvas.height/zoom;
        const edges = [
            {x: cx, y: 0},
            {x: cx, y: h},
            {x: 0, y: cy},
            {x: w, y: cy}
        ];
        let nearest = edges[0];
        let nd = Math.abs(nearest.x-cx)+Math.abs(nearest.y-cy);
        edges.slice(1).forEach(e=>{
            const d=Math.abs(e.x-cx)+Math.abs(e.y-cy);
            if(d<nd){ nd=d; nearest=e; }
        });
        ctx.strokeStyle='#777';
        ctx.beginPath();
        ctx.moveTo(cx,cy);
        ctx.lineTo(nearest.x,nearest.y);
        ctx.stroke();
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
    const text = layoutStage(phase);
    if(!text){
        subtitle.style.display = 'none';
    } else {
        subtitle.style.display = 'block';
        subtitle.textContent = text;
    }
    stepLayout();
}
