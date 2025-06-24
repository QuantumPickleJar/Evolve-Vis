export function playBioseedFx(callback){
    const style = document.createElement('style');
    style.textContent = `
@keyframes rocketFlight {
    from { transform: translate(0,0) scale(1); }
    to { transform: translate(90vw, -40vh) scale(0.3); }
}`;
    document.head.appendChild(style);
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'white';
    overlay.style.zIndex = 9999;
    overlay.style.opacity = 0;
    overlay.style.transition = 'opacity 0.25s';
    document.body.appendChild(overlay);
    requestAnimationFrame(() => { overlay.style.opacity = 1; });
    setTimeout(() => { overlay.style.opacity = 0; }, 300);
    setTimeout(() => {
        overlay.style.background = 'transparent';
        const pre = document.createElement('pre');
        pre.textContent = '  /\\\n /  \\\n|NASA|\n/____\\';
        pre.style.position = 'absolute';
        pre.style.left = '0';
        pre.style.top = '0';
        pre.style.fontFamily = 'monospace';
        pre.style.fontSize = '24px';
        pre.style.animation = 'rocketFlight 2s linear forwards';
        overlay.appendChild(pre);
        overlay.style.opacity = 1;
        setTimeout(() => {
            document.body.removeChild(overlay);
            style.remove();
            if (callback) callback();
        }, 2000);
    }, 500);
}

export function playBigBangFx(callback){
    const style = document.createElement('style');
    style.textContent = `
@keyframes galaxyCollapse {
    from { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity:1; }
    to { transform: translate(-50%, -50%) scale(0) rotate(720deg); opacity:0; }
}`;
    document.head.appendChild(style);
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'black';
    overlay.style.zIndex = 9999;
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    document.body.appendChild(overlay);
    const pre = document.createElement('pre');
    pre.style.color = 'white';
    pre.style.fontFamily = 'monospace';
    pre.style.fontSize = '24px';
    pre.style.whiteSpace = 'pre';
    pre.textContent = '  *    .     *\n    .  *  .\n*  .  *  .  *\n    .    .\n';
    pre.style.animation = 'galaxyCollapse 2.5s forwards';
    overlay.appendChild(pre);
    setTimeout(() => {
        document.body.removeChild(overlay);
        style.remove();
        if (callback) callback();
    }, 2500);
}
