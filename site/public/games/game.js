// =============================================================
//  ZAPPY BIRD  -  Electrician Edition
//  Shaffer Construction  |  Canvas game with parallax & polish
// =============================================================

(() => {
'use strict';

// ---- Canvas & Scaling ----
const canvas  = document.getElementById('gameCanvas');
const ctx     = canvas.getContext('2d');
const GAME_W  = 400;
const GAME_H  = 600;
const ASPECT  = GAME_W / GAME_H;

function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (w / h > ASPECT) {
        canvas.height = h;
        canvas.width  = h * ASPECT;
    } else {
        canvas.width  = w;
        canvas.height = w / ASPECT;
    }
    ctx.setTransform(canvas.width / GAME_W, 0, 0, canvas.height / GAME_H, 0, 0);
}
resize();
window.addEventListener('resize', resize);

// ---- Brand colours ----
const COL = {
    blue:   '#2b7fbd',
    gold:   '#FFD700',
    orange: '#FF6600',
    dark1:  '#1a1a2e',
    dark2:  '#16213e',
    dark3:  '#0a0a1a',
};

// ---- Safe vibrate (navigator.vibrate is undefined on iOS Safari) ----
function safeVibrate(pattern) { if (navigator.vibrate) navigator.vibrate(pattern); }

// ---- State ----
let state      = 'start';   // start | playing | dying | gameOver
let score      = 0;
let highScore  = parseInt(localStorage.getItem('zappybird-highscore')) || 0;
let lastTime   = 0;
let animTime   = 0;         // total elapsed for animations (seconds)
let frameCount = 0;

// ---- Leaderboard (preserved) ----
function getLeaderboard() {
    return JSON.parse(localStorage.getItem('zappybird-leaderboard') || '[]');
}
function saveToLeaderboard(name, s) {
    let lb = getLeaderboard();
    lb.push({ name, score: s });
    lb.sort((a, b) => b.score - a.score);
    lb = lb.slice(0, 10);
    localStorage.setItem('zappybird-leaderboard', JSON.stringify(lb));
}
function isTopScore(s) {
    const lb = getLeaderboard();
    return lb.length < 10 || s > (lb[lb.length - 1]?.score ?? 0);
}

// ---- Player ----
const bird = {
    x: 80, y: 250, w: 38, h: 28,
    vy: 0,
    gravity: 1000,       // px / s^2  (was 1400 - more forgiving)
    jumpV: -420,         // px / s    (was -340 - stronger flap)
    rotation: 0,         // degrees
    flapPhase: 0,        // arm animation
    trail: [],           // recent positions for trail
    alive: true,
    deathVy: 0,
    deathRot: 0,
};

// ---- Pipes ----
const pipes          = [];
const PIPE_W         = 64;
const BASE_GAP       = 155;
const MIN_GAP        = 110;
const BASE_SPEED     = 140;    // px / s
const MAX_SPEED      = 250;
const GRACE_FRAMES   = 20;     // frames before first pipe
const PIPE_INTERVAL  = 100;    // frames between spawns
let pipeTimer        = 0;

function currentSpeed() {
    return Math.min(BASE_SPEED + score * 3, MAX_SPEED);
}
function currentGap() {
    return Math.max(BASE_GAP - score * 1.5, MIN_GAP);
}

// ---- Particles ----
const particles = [];

// ---- Background layers ----
// Each layer: array of objects for parallax
const bgStars     = [];
const bgClouds    = [];
const bgCityFar   = [];   // distant skyline rectangles
const bgCityNear  = [];   // mid-ground buildings
const bgSparkles  = [];   // floating electrical sparks

// Ground
const GROUND_H = 50;

// Screen shake
let shakeX = 0, shakeY = 0, shakeDur = 0, shakeIntensity = 0;

// ---- UI refs ----
const startScreen    = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn       = document.getElementById('start-btn');
const restartBtn     = document.getElementById('restart-btn');
const scoreHUD       = document.getElementById('score-display');
const finalScoreEl   = document.getElementById('final-score');
const highScoreEl    = document.getElementById('high-score');
const pipesCleared   = document.getElementById('pipes-cleared');
const newBestEl      = document.getElementById('new-best');
const hudWrap        = document.getElementById('hud');

// =============================================================
//  INIT BACKGROUND GEOMETRY
// =============================================================
function initBackground() {
    bgStars.length = 0;
    for (let i = 0; i < 60; i++) {
        bgStars.push({
            x: Math.random() * GAME_W,
            y: Math.random() * (GAME_H - GROUND_H - 100),
            r: Math.random() * 1.5 + 0.3,
            twinkle: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.3 + 0.1,
        });
    }

    bgClouds.length = 0;
    for (let i = 0; i < 6; i++) {
        bgClouds.push({
            x: Math.random() * (GAME_W + 200) - 100,
            y: 40 + Math.random() * 120,
            w: 50 + Math.random() * 80,
            h: 18 + Math.random() * 16,
            speed: 8 + Math.random() * 15,
            opacity: 0.15 + Math.random() * 0.25,
        });
    }

    bgCityFar.length = 0;
    let cx = 0;
    while (cx < GAME_W + 60) {
        const w = 20 + Math.random() * 40;
        const h = 40 + Math.random() * 100;
        bgCityFar.push({ x: cx, w, h, windows: Math.floor(Math.random() * 6) + 2 });
        cx += w + Math.random() * 10;
    }

    bgCityNear.length = 0;
    cx = 0;
    while (cx < GAME_W + 80) {
        const w = 30 + Math.random() * 50;
        const h = 60 + Math.random() * 80;
        bgCityNear.push({ x: cx, w, h, windows: Math.floor(Math.random() * 8) + 3 });
        cx += w + Math.random() * 8;
    }

    bgSparkles.length = 0;
    for (let i = 0; i < 12; i++) {
        bgSparkles.push({
            x: Math.random() * GAME_W,
            y: 80 + Math.random() * (GAME_H - GROUND_H - 160),
            phase: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random() * 1.5,
            size: 1 + Math.random() * 2,
        });
    }
}
initBackground();

// =============================================================
//  SKY GRADIENT  - shifts from dawn to night with score
// =============================================================
function drawSky(dt) {
    const t = Math.min(score / 30, 1); // 0 = dawn, 1 = night

    const grad = ctx.createLinearGradient(0, 0, 0, GAME_H - GROUND_H);

    // Dawn palette
    const dawnTop = [255, 140, 80];
    const dawnMid = [135, 206, 235];
    const dawnBot = [200, 230, 255];

    // Night palette
    const nightTop = [10, 10, 30];
    const nightMid = [22, 33, 62];
    const nightBot = [26, 26, 46];

    function lerp3(a, b, f) {
        return a.map((v, i) => Math.round(v + (b[i] - v) * f));
    }

    const top = lerp3(dawnTop, nightTop, t);
    const mid = lerp3(dawnMid, nightMid, t);
    const bot = lerp3(dawnBot, nightBot, t);

    grad.addColorStop(0,   `rgb(${top})`);
    grad.addColorStop(0.4, `rgb(${mid})`);
    grad.addColorStop(1,   `rgb(${bot})`);

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, GAME_W, GAME_H - GROUND_H);
}

// =============================================================
//  STARS (visible as score increases toward night)
// =============================================================
function drawStars(dt) {
    const vis = Math.max(0, Math.min((score - 8) / 15, 1)); // fade in after score 8
    if (vis <= 0) return;

    bgStars.forEach(s => {
        s.twinkle += s.speed * dt * 4;
        const alpha = (0.4 + 0.6 * Math.abs(Math.sin(s.twinkle))) * vis;
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
    });
}

// =============================================================
//  CLOUDS
// =============================================================
function drawClouds(dt) {
    const nightFade = Math.max(0.2, 1 - score / 40);
    bgClouds.forEach(c => {
        c.x -= c.speed * dt;
        if (c.x + c.w < -20) { c.x = GAME_W + 20 + Math.random() * 60; c.y = 40 + Math.random() * 120; }

        ctx.fillStyle = `rgba(255,255,255,${(c.opacity * nightFade).toFixed(2)})`;
        ctx.beginPath();
        // fluffy cloud shape
        const cx = c.x + c.w / 2;
        const cy = c.y + c.h / 2;
        ctx.ellipse(cx, cy, c.w / 2, c.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx - c.w * 0.25, cy - c.h * 0.15, c.w * 0.3, c.h * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + c.w * 0.2, cy - c.h * 0.1, c.w * 0.25, c.h * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
    });
}

// =============================================================
//  CITY SKYLINE (parallax)
// =============================================================
function drawCity(dt, layer, speedMult, baseColor, windowColor, horizonY) {
    const spd = currentSpeed() * speedMult * dt;
    layer.forEach(b => {
        b.x -= spd;
        if (b.x + b.w < -10) b.x += GAME_W + b.w + 60;

        const bx = b.x;
        const by = horizonY - b.h;
        ctx.fillStyle = baseColor;
        ctx.fillRect(bx, by, b.w, b.h);

        // windows
        const winW = 3, winH = 4, padX = 5, padY = 8;
        let wy = by + padY;
        let wi = 0;
        while (wy + winH < horizonY - 4 && wi < b.windows * 3) {
            let wx = bx + padX;
            while (wx + winW < bx + b.w - 2) {
                if (Math.sin(wx * 13 + wy * 7 + b.w) > 0.1) {
                    ctx.fillStyle = windowColor;
                    ctx.fillRect(wx, wy, winW, winH);
                }
                wx += winW + 3;
            }
            wy += winH + padY;
            wi++;
        }
    });
}

// =============================================================
//  FLOATING ELECTRICAL SPARKLES
// =============================================================
function drawSparkles(dt) {
    bgSparkles.forEach(s => {
        s.phase += s.speed * dt * 3;
        s.x -= currentSpeed() * 0.05 * dt;
        if (s.x < -10) { s.x = GAME_W + 10; s.y = 80 + Math.random() * (GAME_H - GROUND_H - 160); }

        const alpha = 0.3 + 0.7 * Math.abs(Math.sin(s.phase));
        const glow  = s.size + Math.sin(s.phase * 1.7) * 0.8;
        ctx.fillStyle = `rgba(43,127,189,${alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y + Math.sin(s.phase * 0.8) * 6, glow, 0, Math.PI * 2);
        ctx.fill();

        // tiny glow halo
        ctx.fillStyle = `rgba(43,127,189,${(alpha * 0.2).toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y + Math.sin(s.phase * 0.8) * 6, glow * 3, 0, Math.PI * 2);
        ctx.fill();
    });
}

// =============================================================
//  GROUND
// =============================================================
let groundOffset = 0;
function drawGround(dt) {
    const gy = GAME_H - GROUND_H;
    groundOffset = (groundOffset + currentSpeed() * dt) % 40;

    // dirt
    const dirtGrad = ctx.createLinearGradient(0, gy, 0, GAME_H);
    dirtGrad.addColorStop(0, '#5a3a1a');
    dirtGrad.addColorStop(0.3, '#6b4423');
    dirtGrad.addColorStop(1, '#3d2510');
    ctx.fillStyle = dirtGrad;
    ctx.fillRect(0, gy, GAME_W, GROUND_H);

    // grass strip
    const grassGrad = ctx.createLinearGradient(0, gy - 4, 0, gy + 10);
    grassGrad.addColorStop(0, '#4aba3b');
    grassGrad.addColorStop(0.5, '#348c28');
    grassGrad.addColorStop(1, '#2a6e1f');
    ctx.fillStyle = grassGrad;
    ctx.fillRect(0, gy - 2, GAME_W, 12);

    // grass blades
    ctx.strokeStyle = '#5cd44a';
    ctx.lineWidth = 1.2;
    for (let gx = -groundOffset; gx < GAME_W + 10; gx += 8) {
        ctx.beginPath();
        ctx.moveTo(gx, gy);
        ctx.lineTo(gx - 2, gy - 5 - Math.sin(gx * 0.3 + animTime * 2) * 2);
        ctx.stroke();
    }

    // dirt texture lines
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 0.5;
    for (let ly = gy + 14; ly < GAME_H; ly += 7) {
        ctx.beginPath();
        ctx.moveTo(0, ly);
        ctx.lineTo(GAME_W, ly + 1);
        ctx.stroke();
    }

    // pebbles
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    for (let px = -groundOffset; px < GAME_W + 10; px += 20) {
        ctx.beginPath();
        ctx.arc(px + 5, gy + 20 + Math.sin(px) * 4, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// =============================================================
//  PIPES  (electrical conduit / panels)
// =============================================================
function spawnPipe() {
    const gap = currentGap();
    const minTop = 60;
    const maxTop = GAME_H - GROUND_H - gap - 60;
    const topH = Math.floor(Math.random() * (maxTop - minTop)) + minTop;

    pipes.push({
        x: GAME_W + 10,
        topH,
        gap,
        scored: false,
        arcPhase: Math.random() * Math.PI * 2,
    });
}

function drawPipe(p) {
    const botY = p.topH + p.gap;
    const botH = GAME_H - GROUND_H - botY;
    const pw   = PIPE_W;

    // --- Draw conduit bodies ---
    function drawConduit(x, y, w, h, isTop) {
        // main body gradient
        const grad = ctx.createLinearGradient(x, 0, x + w, 0);
        grad.addColorStop(0,   '#4a4a5a');
        grad.addColorStop(0.3, '#6a6a7a');
        grad.addColorStop(0.5, '#7a7a8a');
        grad.addColorStop(0.7, '#6a6a7a');
        grad.addColorStop(1,   '#4a4a5a');
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, w, h);

        // panel cap
        const capH = 24;
        const capY = isTop ? y + h - capH : y;
        const capGrad = ctx.createLinearGradient(x - 5, 0, x + w + 5, 0);
        capGrad.addColorStop(0,   '#555568');
        capGrad.addColorStop(0.3, '#72728a');
        capGrad.addColorStop(0.5, '#8888a0');
        capGrad.addColorStop(0.7, '#72728a');
        capGrad.addColorStop(1,   '#555568');
        ctx.fillStyle = capGrad;
        ctx.fillRect(x - 5, capY, w + 10, capH);

        // cap border lines
        ctx.strokeStyle = 'rgba(0,0,0,0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x - 5, capY, w + 10, capH);

        // rivets on cap
        const rivetColor = '#999';
        ctx.fillStyle = rivetColor;
        [6, w - 2, w / 2].forEach(rx => {
            ctx.beginPath();
            ctx.arc(x + rx, capY + capH / 2, 2.5, 0, Math.PI * 2);
            ctx.fill();
            // rivet highlight
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.beginPath();
            ctx.arc(x + rx - 0.5, capY + capH / 2 - 0.5, 1, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = rivetColor;
        });

        // warning stripes on cap
        ctx.save();
        ctx.beginPath();
        ctx.rect(x - 5, capY, w + 10, capH);
        ctx.clip();
        ctx.strokeStyle = 'rgba(255,165,0,0.35)';
        ctx.lineWidth = 3;
        for (let sx = x - 20; sx < x + w + 20; sx += 12) {
            ctx.beginPath();
            ctx.moveTo(sx, capY);
            ctx.lineTo(sx + capH, capY + capH);
            ctx.stroke();
        }
        ctx.restore();

        // vertical seam lines on body
        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.lineWidth = 0.8;
        [w * 0.3, w * 0.7].forEach(sx => {
            ctx.beginPath();
            ctx.moveTo(x + sx, y);
            ctx.lineTo(x + sx, y + h);
            ctx.stroke();
        });

        // "DANGER HIGH VOLTAGE" label
        if (h > 80) {
            const lblY = isTop ? y + h - capH - 30 : y + capH + 10;
            ctx.fillStyle = '#cc2200';
            const lblW = 40, lblH = 14;
            const lblX = x + (w - lblW) / 2;
            ctx.fillRect(lblX, lblY, lblW, lblH);
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 6px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('DANGER', x + w / 2, lblY + 7);
            ctx.fillStyle = '#fff';
            ctx.font = '5px sans-serif';
            ctx.fillText('HIGH VOLTAGE', x + w / 2, lblY + 13);
            ctx.textAlign = 'start';
        }
    }

    // top conduit
    drawConduit(p.x, 0, pw, p.topH, true);
    // bottom conduit
    drawConduit(p.x, botY, pw, botH, false);

    // --- Electrical arcs between gap ---
    p.arcPhase += 0.15;
    const arcIntensity = 0.5 + 0.5 * Math.sin(p.arcPhase * 2.3);
    if (Math.sin(p.arcPhase * 5) > 0.2) {
        drawArc(p.x + pw / 2, p.topH, p.x + pw / 2, botY, arcIntensity);
    }
}

function drawArc(x1, y1, x2, y2, intensity) {
    const steps = 6;
    const dx = (x2 - x1) / steps;
    const dy = (y2 - y1) / steps;
    ctx.strokeStyle = `rgba(100,180,255,${(0.6 * intensity).toFixed(2)})`;
    ctx.lineWidth = 2;
    ctx.shadowColor = COL.blue;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    for (let i = 1; i < steps; i++) {
        const jitter = (Math.random() - 0.5) * 18 * intensity;
        ctx.lineTo(x1 + dx * i + jitter, y1 + dy * i);
    }
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // brighter core
    ctx.strokeStyle = `rgba(200,230,255,${(0.4 * intensity).toFixed(2)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    for (let i = 1; i < steps; i++) {
        const jitter = (Math.random() - 0.5) * 10 * intensity;
        ctx.lineTo(x1 + dx * i + jitter, y1 + dy * i);
    }
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.shadowBlur = 0;
}

// =============================================================
//  BIRD (electrician character)
// =============================================================
function drawBird() {
    const bx = bird.x + bird.w / 2;
    const by = bird.y + bird.h / 2;

    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(bird.rotation * Math.PI / 180);

    // Trail glow when alive
    if (bird.alive && Math.abs(bird.vy) > 80) {
        const trailAlpha = Math.min(Math.abs(bird.vy) / 400, 0.3);
        ctx.fillStyle = `rgba(43,127,189,${trailAlpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.ellipse(-10, 0, 16, 8, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    // Body / vest (orange safety vest)
    ctx.fillStyle = COL.orange;
    roundRect(-14, -4, 28, 18, 4);
    ctx.fill();

    // Vest reflective stripes
    ctx.fillStyle = '#FFE44D';
    ctx.fillRect(-12, 2, 24, 2);
    ctx.fillRect(-12, 8, 24, 2);

    // Face
    ctx.fillStyle = '#FFDBAC';
    roundRect(-10, -10, 20, 16, 3);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(-4, -3, 2.2, 0, Math.PI * 2);
    ctx.arc(5, -3, 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Eye highlights
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-3.2, -3.8, 0.8, 0, Math.PI * 2);
    ctx.arc(5.8, -3.8, 0.8, 0, Math.PI * 2);
    ctx.fill();

    // Mouth - small smile
    ctx.strokeStyle = '#b07040';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(1, 1, 3, 0.1, Math.PI - 0.1);
    ctx.stroke();

    // Hard hat (yellow)
    ctx.fillStyle = COL.gold;
    roundRect(-13, -16, 26, 8, 2);
    ctx.fill();
    // hat brim
    ctx.fillStyle = '#e6c200';
    roundRect(-15, -10, 30, 4, 1);
    ctx.fill();
    // hat highlight
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(-10, -15, 16, 3);

    // Tool belt
    ctx.fillStyle = '#6b3a1a';
    ctx.fillRect(-14, 12, 28, 4);
    // belt buckle
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(-2, 12, 4, 4);
    // tools hanging
    ctx.fillStyle = '#888';
    ctx.fillRect(-12, 14, 3, 4);
    ctx.fillRect(9, 14, 3, 5);

    // Arms (animated flap)
    const flapAngle = bird.alive ? Math.sin(bird.flapPhase) * 35 : 20;

    // left arm
    ctx.save();
    ctx.translate(-14, 2);
    ctx.rotate((-30 + flapAngle) * Math.PI / 180);
    ctx.fillStyle = COL.orange;
    roundRect(-3, -2, 6, 14, 2);
    ctx.fill();
    // glove
    ctx.fillStyle = '#e6c200';
    ctx.beginPath();
    ctx.arc(0, 13, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // right arm
    ctx.save();
    ctx.translate(14, 2);
    ctx.rotate((30 - flapAngle) * Math.PI / 180);
    ctx.fillStyle = COL.orange;
    roundRect(-3, -2, 6, 14, 2);
    ctx.fill();
    ctx.fillStyle = '#e6c200';
    ctx.beginPath();
    ctx.arc(0, 13, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
}

function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

// =============================================================
//  PARTICLES
// =============================================================
function spawnParticles(x, y, color, count, spread, life) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x, y,
            vx: (Math.random() - 0.5) * spread,
            vy: (Math.random() - 0.5) * spread - 1,
            life: life || 30 + Math.random() * 20,
            maxLife: life || 30 + Math.random() * 20,
            color,
            size: 1 + Math.random() * 3,
            type: 'spark',
        });
    }
}

function spawnScoreStars(x, y) {
    const colors = [COL.gold, '#fff', COL.blue];
    for (let i = 0; i < 10; i++) {
        const angle = (Math.PI * 2 * i) / 10;
        const speed = 60 + Math.random() * 80;
        particles.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 40 + Math.random() * 20,
            maxLife: 50,
            color: colors[i % colors.length],
            size: 2 + Math.random() * 2,
            type: 'star',
        });
    }
}

function spawnDeathExplosion(x, y) {
    // big explosion
    for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 40 + Math.random() * 160;
        particles.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 40 + Math.random() * 40,
            maxLife: 60,
            color: ['#ff4444', COL.gold, '#fff', COL.orange, COL.blue][Math.floor(Math.random() * 5)],
            size: 2 + Math.random() * 4,
            type: 'spark',
        });
    }
}

function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 200 * dt; // gravity on particles
        p.life -= dt * 60;
        if (p.life <= 0) particles.splice(i, 1);
    }
}

function drawParticles() {
    particles.forEach(p => {
        const alpha = Math.max(0, p.life / p.maxLife);
        const s = p.size * alpha;
        if (p.type === 'star') {
            // draw a small star / sparkle
            ctx.fillStyle = p.color;
            ctx.globalAlpha = alpha;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(animTime * 3);
            for (let r = 0; r < 4; r++) {
                ctx.fillRect(-s / 2, -0.5, s, 1);
                ctx.rotate(Math.PI / 4);
            }
            ctx.restore();
            ctx.globalAlpha = 1;
        } else {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, s, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    });
}

// =============================================================
//  TRAIL
// =============================================================
function drawTrail() {
    if (!bird.alive) return;
    const trail = bird.trail;
    if (trail.length < 2) return;

    for (let i = 1; i < trail.length; i++) {
        const t = i / trail.length;
        const alpha = t * 0.25;
        const size = t * 3;
        ctx.fillStyle = `rgba(43,127,189,${alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(trail[i].x, trail[i].y, size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// =============================================================
//  SCREEN SHAKE
// =============================================================
function triggerShake(dur, intensity) {
    shakeDur = dur;
    shakeIntensity = intensity;
}

function updateShake(dt) {
    if (shakeDur > 0) {
        shakeDur -= dt;
        shakeX = (Math.random() - 0.5) * shakeIntensity * 2;
        shakeY = (Math.random() - 0.5) * shakeIntensity * 2;
        shakeIntensity *= 0.92;
    } else {
        shakeX = 0;
        shakeY = 0;
    }
}

// =============================================================
//  COLLISION
// =============================================================
function checkCollision(p) {
    const pad = 4;
    if (bird.x + bird.w - pad > p.x && bird.x + pad < p.x + PIPE_W) {
        if (bird.y + pad < p.topH || bird.y + bird.h - pad > p.topH + p.gap) {
            return true;
        }
    }
    return false;
}

// =============================================================
//  GAME ACTIONS
// =============================================================
function startGame() {
    state       = 'playing';
    score       = 0;
    frameCount  = 0;
    pipeTimer   = 0;
    bird.y      = 250;
    bird.vy     = 0;
    bird.rotation = 0;
    bird.alive  = true;
    bird.flapPhase = 0;
    bird.trail  = [];
    pipes.length     = 0;
    particles.length = 0;

    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    hudWrap.style.display = 'flex';
    scoreHUD.textContent  = '0';

    initBackground();
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
}

function flap() {
    if (state !== 'playing' || !bird.alive) return;
    bird.vy = bird.jumpV;
    bird.flapPhase = Math.PI * 0.8; // snap arms up
    spawnParticles(bird.x + bird.w / 2, bird.y + bird.h, COL.gold, 4, 3, 15);
}

function die() {
    if (state !== 'playing') return;
    state = 'dying';
    bird.alive = false;
    bird.deathVy = bird.vy;
    bird.deathRot = bird.rotation;

    safeVibrate([100, 50, 100, 50, 200]);
    spawnDeathExplosion(bird.x + bird.w / 2, bird.y + bird.h / 2);
    triggerShake(0.5, 8);

    // update high score
    let isNewBest = false;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('zappybird-highscore', highScore);
        isNewBest = true;
    }

    // delay before game over screen
    setTimeout(() => {
        state = 'gameOver';
        finalScoreEl.textContent   = score;
        highScoreEl.textContent    = highScore;
        pipesCleared.textContent   = score;
        newBestEl.classList.toggle('hidden', !isNewBest);

        // leaderboard
        if (isTopScore(score) && score > 0) {
            const name = prompt('You made the leaderboard! Enter your name:');
            if (name && name.trim()) {
                saveToLeaderboard(name.trim().substring(0, 20), score);
            }
        }

        gameOverScreen.classList.remove('hidden');
        hudWrap.style.display = 'none';
    }, 1200);
}

// =============================================================
//  UPDATE
// =============================================================
function update(dt) {
    animTime += dt;
    frameCount++;

    updateShake(dt);
    updateParticles(dt);

    if (state === 'dying') {
        // death fall animation
        bird.deathVy += 800 * dt;
        bird.y += bird.deathVy * dt;
        bird.deathRot = Math.min(bird.deathRot + 360 * dt, 90);
        bird.rotation = bird.deathRot;
        return;
    }

    if (state !== 'playing') return;

    // ---- Bird physics ----
    bird.vy += bird.gravity * dt;
    bird.y  += bird.vy * dt;

    // rotation follows velocity
    const targetRot = Math.max(-25, Math.min(bird.vy * 0.18, 70));
    bird.rotation += (targetRot - bird.rotation) * 6 * dt;

    // flap animation decay
    if (bird.flapPhase > 0) {
        bird.flapPhase -= dt * 12;
        if (bird.flapPhase < 0) bird.flapPhase = 0;
    }

    // trail
    bird.trail.unshift({ x: bird.x + bird.w / 2, y: bird.y + bird.h / 2 });
    if (bird.trail.length > 12) bird.trail.pop();

    // ---- Pipes ----
    pipeTimer++;
    if (pipeTimer >= GRACE_FRAMES && (pipeTimer - GRACE_FRAMES) % PIPE_INTERVAL === 0) {
        spawnPipe();
    }

    const spd = currentSpeed() * dt;
    for (let i = pipes.length - 1; i >= 0; i--) {
        const p = pipes[i];
        p.x -= spd;

        // score
        if (!p.scored && p.x + PIPE_W < bird.x) {
            p.scored = true;
            score++;
            safeVibrate(30);
            scoreHUD.textContent = score;
            // score bump animation
            scoreHUD.classList.add('bump');
            setTimeout(() => scoreHUD.classList.remove('bump'), 120);
            // star burst at gap center
            spawnScoreStars(p.x + PIPE_W + 10, p.topH + p.gap / 2);
        }

        // remove off-screen
        if (p.x + PIPE_W < -20) {
            pipes.splice(i, 1);
            continue;
        }

        // collision
        if (checkCollision(p)) {
            die();
            return;
        }
    }

    // boundary check
    if (bird.y + bird.h > GAME_H - GROUND_H) {
        bird.y = GAME_H - GROUND_H - bird.h;
        die();
        return;
    }
    if (bird.y < -10) {
        bird.y = -10;
        bird.vy = 0;
    }
}

// =============================================================
//  DRAW (full frame)
// =============================================================
function draw(dt) {
    ctx.save();
    ctx.translate(shakeX, shakeY);

    // sky
    drawSky(dt);
    drawStars(dt);

    // parallax layers
    const horizonY = GAME_H - GROUND_H;
    drawCity(dt, bgCityFar, 0.15, 'rgba(20,20,40,0.6)', 'rgba(255,200,80,0.5)', horizonY);
    drawClouds(dt);
    drawCity(dt, bgCityNear, 0.35, 'rgba(30,30,55,0.8)', 'rgba(255,220,100,0.6)', horizonY);
    drawSparkles(dt);

    // pipes
    pipes.forEach(p => drawPipe(p));

    // trail
    drawTrail();

    // bird
    drawBird();

    // particles on top
    drawParticles();

    // ground (on top of everything else)
    drawGround(dt);

    ctx.restore();
}

// =============================================================
//  GAME LOOP  (delta-time based)
// =============================================================
function gameLoop(timestamp) {
    if (!timestamp) timestamp = performance.now();
    let dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    // clamp delta to avoid spiral of death
    if (dt > 0.05) dt = 0.05;

    update(dt);
    draw(dt);

    if (state === 'playing' || state === 'dying') {
        requestAnimationFrame(gameLoop);
    }
}

// =============================================================
//  ATTRACT / IDLE DRAW  (for start & game-over screens)
// =============================================================
let idleRAF = null;
let idleScore = 12; // cosmetic score for idle sky rendering
function idleLoop(timestamp) {
    if (state === 'playing' || state === 'dying') return;
    if (!timestamp) timestamp = performance.now();
    let dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    if (dt > 0.05) dt = 0.05;
    animTime += dt;

    // Use idle score for sky rendering
    const savedScore = score;
    score = idleScore;

    // draw background only
    ctx.save();
    drawSky(dt);
    drawStars(dt);
    const horizonY = GAME_H - GROUND_H;
    drawCity(dt, bgCityFar, 0.08, 'rgba(20,20,40,0.6)', 'rgba(255,200,80,0.5)', horizonY);
    drawClouds(dt);
    drawCity(dt, bgCityNear, 0.18, 'rgba(30,30,55,0.8)', 'rgba(255,220,100,0.6)', horizonY);
    drawSparkles(dt);
    drawGround(dt);
    ctx.restore();

    score = savedScore;

    idleRAF = requestAnimationFrame(idleLoop);
}

function startIdle() {
    lastTime = performance.now();
    idleRAF = requestAnimationFrame(idleLoop);
}

// =============================================================
//  EVENT LISTENERS
// =============================================================
startBtn.addEventListener('click', () => {
    if (idleRAF) { cancelAnimationFrame(idleRAF); idleRAF = null; }
    startGame();
});

restartBtn.addEventListener('click', () => {
    if (idleRAF) { cancelAnimationFrame(idleRAF); idleRAF = null; }
    startGame();
});

document.addEventListener('keydown', e => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (state === 'playing') flap();
        else if (state === 'start') { startBtn.click(); }
        else if (state === 'gameOver') { restartBtn.click(); }
    }
});

canvas.addEventListener('click', () => {
    if (state === 'playing') flap();
});

canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    if (state === 'playing') flap();
}, { passive: false });

// =============================================================
//  INIT
// =============================================================
highScoreEl.textContent = highScore;
hudWrap.style.display = 'none';
startIdle();

})();
