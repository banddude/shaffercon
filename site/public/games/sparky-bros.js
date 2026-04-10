// =============================================================
//  SPARKY BROS  -  Polished Retro Platformer
//  Shaffer Construction  |  Brand colors throughout
// =============================================================

// ---- Canvas & scaling ----
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let isMobile = window.innerWidth < 768;
const GAME_HEIGHT = 600;

function getGameWidth() { return isMobile ? 400 : 800; }

function resizeCanvas() {
    isMobile = window.innerWidth < 768;
    const gw = getGameWidth();
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    const ar = gw / GAME_HEIGHT;
    if (ww / wh > ar) {
        canvas.height = wh;
        canvas.width = wh * ar;
    } else {
        canvas.width = ww;
        canvas.height = ww / ar;
    }
    const scale = canvas.width / gw;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
}
resizeCanvas();
window.addEventListener('resize', () => {
    const wasMobile = isMobile;
    resizeCanvas();
    if (wasMobile !== isMobile && gameState === 'playing') loadLevel(currentLevel);
});

// ---- Game state ----
let gameState = 'start'; // start | playing | dead | win | gameOver | nameEntry | gameComplete
let score = 0;
let lives = 3;
let coins = 0;
let currentLevel = 1;
const MAX_LEVEL = 3;
let invincible = false;
let invincibleTimer = 0;
let cameraX = 0;
let levelWidth = 800;
let deathTimer = 0;
let winTimer = 0;
let transitionTimer = 0;
let transitionLevel = 1;
let animFrame = 0;
let speedBoost = false;
let speedBoostTimer = 0;
let gameTime = 0; // master clock ticks

// ---- Leaderboard ----
function getLeaderboard() {
    return JSON.parse(localStorage.getItem('sparkybros-leaderboard') || '[]');
}
function saveToLeaderboard(name, sc) {
    let lb = getLeaderboard();
    lb.push({ name, score: sc });
    lb.sort((a, b) => b.score - a.score);
    lb = lb.slice(0, 10);
    localStorage.setItem('sparkybros-leaderboard', JSON.stringify(lb));
}
function isTopScore(sc) {
    const lb = getLeaderboard();
    return lb.length < 10 || sc > (lb[lb.length - 1]?.score ?? 0);
}
function escapeHTML(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function renderLeaderboardHTML() {
    const lb = getLeaderboard();
    if (lb.length === 0) return '';
    let html = '<table class="leaderboard-table"><tr><th>#</th><th>Name</th><th>Score</th></tr>';
    lb.forEach((e, i) => {
        html += `<tr><td>${i + 1}</td><td>${escapeHTML(e.name)}</td><td>${e.score}</td></tr>`;
    });
    html += '</table>';
    return html;
}

// ---- Player ----
const player = {
    x: 100, y: 400,
    width: 28, height: 36,
    vx: 0, vy: 0,
    speed: 3.8, maxSpeed: 5.5,
    accel: 0.5, decel: 0.35,
    jumpPower: 12.5,
    gravity: 0.52,
    onGround: false,
    dir: 1,
    walkFrame: 0,
    walkTimer: 0,
    wasOnGround: false,
    coyoteTime: 0,
    jumpHeld: false,
    jumpCut: false,
    alive: true,
    deathVY: 0,
    squash: 1,
    stretch: 1,
    stomp: false
};

// ---- Input ----
const keys = {};
let jumpPressed = false;
let jumpJustPressed = false;

// ---- Level data ----
let platforms = [];
let wireNuts = [];
let enemies = [];
let pipes = [];
let particles = [];
let powerUps = [];
let decorations = []; // background props

// ---- UI elements ----
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const winScreen = document.getElementById('win-screen');
const gameCompleteScreen = document.getElementById('game-complete-screen');
const nameEntryScreen = document.getElementById('name-entry-screen');
const levelTransition = document.getElementById('level-transition');
const levelTransitionText = document.getElementById('level-transition-text');
const levelTransitionSubtitle = document.getElementById('level-transition-subtitle');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const nextLevelBtn = document.getElementById('next-level-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const submitNameBtn = document.getElementById('submit-name-btn');
const playerNameInput = document.getElementById('player-name-input');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const coinsDisplay = document.getElementById('coins');
const finalScoreDisplay = document.getElementById('final-score');
const winScoreDisplay = document.getElementById('win-score');
const highScoreValue = document.getElementById('high-score-value');
const leaderboardDisplay = document.getElementById('leaderboard-display');
const completeScore = document.getElementById('complete-score');
const completeLeaderboard = document.getElementById('complete-leaderboard-display');

// ---- Events ----
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
nextLevelBtn.addEventListener('click', nextLevel);
if (playAgainBtn) playAgainBtn.addEventListener('click', restartGame);
submitNameBtn.addEventListener('click', submitName);
playerNameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitName(); });

document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if ((e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') && gameState === 'playing') {
        e.preventDefault();
        if (!jumpPressed) jumpJustPressed = true;
        jumpPressed = true;
    }
});
document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        jumpPressed = false;
    }
});

// ---- Mobile controls ----
function bindBtn(id, onDown, onUp) {
    const el = document.getElementById(id);
    if (!el) return;
    const down = (e) => { e.preventDefault(); onDown(); };
    const up = (e) => { e.preventDefault(); onUp(); };
    el.addEventListener('touchstart', down, { passive: false });
    el.addEventListener('touchend', up, { passive: false });
    el.addEventListener('touchcancel', up, { passive: false });
    el.addEventListener('mousedown', down);
    el.addEventListener('mouseup', up);
    el.addEventListener('mouseleave', up);
}
bindBtn('left-btn-game', () => keys['ArrowLeft'] = true, () => keys['ArrowLeft'] = false);
bindBtn('right-btn-game', () => keys['ArrowRight'] = true, () => keys['ArrowRight'] = false);
bindBtn('jump-btn-game', () => {
    if (gameState === 'playing') {
        if (!jumpPressed) jumpJustPressed = true;
        jumpPressed = true;
    }
}, () => { jumpPressed = false; });

// =============================================================
//  PARALLAX BACKGROUND SYSTEM
// =============================================================
const bgLayers = {
    // deep sky gradient drawn procedurally
    // layer 1: distant city silhouette
    // layer 2: utility poles + power lines
    // layer 3: near buildings / structures
};

function drawParallaxBG(gw) {
    const t = gameTime * 0.01;
    // Sky gradient
    const grad = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
    grad.addColorStop(0, '#0a0a1e');
    grad.addColorStop(0.35, '#16213e');
    grad.addColorStop(0.7, '#1a2a4e');
    grad.addColorStop(1, '#2b4060');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, gw, GAME_HEIGHT);

    // Stars
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    for (let i = 0; i < 40; i++) {
        const sx = ((i * 137 + 50) % gw);
        const sy = ((i * 97 + 20) % (GAME_HEIGHT * 0.5));
        const blink = Math.sin(t * 2 + i) * 0.3 + 0.7;
        ctx.globalAlpha = blink * 0.6;
        ctx.fillRect(sx, sy, 2, 2);
    }
    ctx.globalAlpha = 1;

    // Moon
    ctx.fillStyle = 'rgba(255,240,200,0.9)';
    ctx.beginPath();
    ctx.arc(gw - 80, 60, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,240,200,0.15)';
    ctx.beginPath();
    ctx.arc(gw - 80, 60, 40, 0, Math.PI * 2);
    ctx.fill();

    // Layer 1: Distant cityscape (parallax 0.1)
    const off1 = cameraX * 0.08;
    ctx.fillStyle = '#0d1528';
    for (let i = -1; i < (gw / 60) + 2; i++) {
        const bx = i * 60 - (off1 % 60);
        const bh = 40 + ((i * 73 + 17) % 60);
        ctx.fillRect(bx, GAME_HEIGHT - 120 - bh, 50, bh + 120);
    }

    // Layer 2: Utility poles + power lines (parallax 0.25)
    const off2 = cameraX * 0.2;
    ctx.strokeStyle = 'rgba(60,80,100,0.7)';
    ctx.lineWidth = 2;
    const poleSpacing = 160;
    for (let i = -1; i < (gw / poleSpacing) + 2; i++) {
        const px = i * poleSpacing - (off2 % poleSpacing);
        // Pole
        ctx.fillStyle = 'rgba(50,40,30,0.8)';
        ctx.fillRect(px - 3, GAME_HEIGHT - 250, 6, 200);
        // Cross arm
        ctx.fillRect(px - 20, GAME_HEIGHT - 250, 40, 4);
        // Insulators
        ctx.fillStyle = 'rgba(100,180,255,0.5)';
        ctx.fillRect(px - 18, GAME_HEIGHT - 254, 4, 6);
        ctx.fillRect(px + 14, GAME_HEIGHT - 254, 4, 6);
    }
    // Power lines
    ctx.strokeStyle = 'rgba(80,100,120,0.4)';
    ctx.lineWidth = 1;
    for (let w = 0; w < 2; w++) {
        ctx.beginPath();
        for (let i = -1; i < (gw / poleSpacing) + 2; i++) {
            const px = i * poleSpacing - (off2 % poleSpacing);
            const py = GAME_HEIGHT - 250 + w * 12;
            const sag = 8;
            if (i === -1) { ctx.moveTo(px - 18 + w * 32, py); }
            else {
                const cpx = px - poleSpacing / 2;
                ctx.quadraticCurveTo(cpx, py + sag, px - 18 + w * 32, py);
            }
        }
        ctx.stroke();
    }

    // Layer 3: Closer industrial shapes (parallax 0.35)
    const off3 = cameraX * 0.35;
    ctx.fillStyle = '#111a28';
    for (let i = -1; i < (gw / 100) + 2; i++) {
        const bx = i * 100 - (off3 % 100);
        const bh = 20 + ((i * 41 + 7) % 30);
        ctx.fillRect(bx, GAME_HEIGHT - 50 - bh, 80, bh + 50);
        // Windows
        ctx.fillStyle = 'rgba(255,200,50,0.15)';
        for (let wy = 0; wy < bh - 10; wy += 14) {
            for (let wx = 0; wx < 60; wx += 18) {
                ctx.fillRect(bx + 8 + wx, GAME_HEIGHT - 50 - bh + 8 + wy, 10, 8);
            }
        }
        ctx.fillStyle = '#111a28';
    }
}

// =============================================================
//  DRAWING HELPERS
// =============================================================
function drawRoundedRect(x, y, w, h, r) {
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
//  DRAW PLAYER (multi-frame electrician)
// =============================================================
function drawPlayer() {
    const p = player;
    if (!p.alive && deathTimer > 40) return; // faded out

    const flash = invincible && Math.floor(invincibleTimer / 4) % 2 === 0;
    if (flash) return;

    // Speed boost trail
    if (speedBoost) {
        for (let i = 1; i <= 3; i++) {
            ctx.globalAlpha = 0.15 - i * 0.04;
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(p.x - cameraX - p.dir * i * 6, p.y + 4, p.width, p.height - 4);
        }
        ctx.globalAlpha = 1;
    }

    ctx.save();
    const drawX = p.x - cameraX;
    const drawY = p.y;
    const cx = drawX + p.width / 2;
    const cy = drawY + p.height;

    // Squash/stretch
    ctx.translate(cx, cy);
    ctx.scale(p.squash * (p.dir === -1 ? -1 : 1), p.stretch);
    ctx.translate(-p.width / 2, -p.height);

    // Death spin
    if (!p.alive) {
        ctx.globalAlpha = Math.max(0, 1 - deathTimer / 40);
    }

    const walkCycle = p.walkFrame;

    // -- BOOTS --
    ctx.fillStyle = '#2a2a2a';
    const bootOffset = p.onGround && Math.abs(p.vx) > 0.5 ? Math.sin(walkCycle * 0.6) * 3 : 0;
    ctx.fillRect(2, p.height - 6, 10, 6);     // left boot
    ctx.fillRect(p.width - 12, p.height - 6 + (p.onGround ? bootOffset * 0.5 : 0), 10, 6); // right boot

    // -- PANTS (dark blue work pants) --
    ctx.fillStyle = '#1a3055';
    ctx.fillRect(3, p.height - 14, p.width - 6, 10);

    // -- BODY (orange safety vest) --
    ctx.fillStyle = '#FF6600';
    ctx.fillRect(2, p.height - 24, p.width - 4, 12);

    // Reflective stripes on vest
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(4, p.height - 20, p.width - 8, 2);
    ctx.fillRect(4, p.height - 16, p.width - 8, 2);

    // -- ARMS --
    ctx.fillStyle = '#FF6600';
    const armSwing = p.onGround && Math.abs(p.vx) > 0.5 ? Math.sin(walkCycle * 0.6) * 4 : 0;
    // left arm
    ctx.fillRect(-2, p.height - 22 + armSwing, 5, 10);
    // right arm
    ctx.fillRect(p.width - 3, p.height - 22 - armSwing, 5, 10);

    // -- TOOL BELT --
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(2, p.height - 14, p.width - 4, 3);
    // tool pouches
    ctx.fillStyle = '#6B4F10';
    ctx.fillRect(4, p.height - 14, 6, 4);
    ctx.fillRect(p.width - 10, p.height - 14, 6, 4);

    // -- NECK --
    ctx.fillStyle = '#FFCCAA';
    ctx.fillRect(p.width / 2 - 4, p.height - 27, 8, 4);

    // -- HEAD --
    ctx.fillStyle = '#FFCCAA';
    ctx.fillRect(p.width / 2 - 7, p.height - 36, 14, 10);

    // -- HARD HAT --
    ctx.fillStyle = '#FFD700';
    // Hat brim
    ctx.fillRect(p.width / 2 - 10, p.height - 37, 20, 4);
    // Hat dome
    ctx.fillRect(p.width / 2 - 8, p.height - 42, 16, 6);
    // Hat top bump
    ctx.fillRect(p.width / 2 - 4, p.height - 43, 8, 2);

    // -- EYES --
    ctx.fillStyle = '#000';
    const blinkChance = Math.sin(gameTime * 0.05);
    const eyeH = blinkChance > 0.97 ? 1 : 3;
    ctx.fillRect(p.width / 2 - 5, p.height - 34, 3, eyeH);
    ctx.fillRect(p.width / 2 + 2, p.height - 34, 3, eyeH);

    // Pupils
    if (eyeH > 1) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(p.width / 2 - 4, p.height - 34, 1, 1);
        ctx.fillRect(p.width / 2 + 3, p.height - 34, 1, 1);
    }

    // -- MOUTH --
    ctx.fillStyle = '#cc8866';
    ctx.fillRect(p.width / 2 - 2, p.height - 29, 4, 1);

    ctx.restore();
}

// =============================================================
//  DRAW PLATFORM TILES
// =============================================================
function drawPlatform(plat) {
    const x = plat.x - cameraX;
    const y = plat.y;
    const w = plat.width;
    const h = plat.height;

    if (plat.type === 'ground') {
        // Asphalt/concrete ground
        ctx.fillStyle = '#3a3a3a';
        ctx.fillRect(x, y, w, h);
        // Concrete texture lines
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        for (let i = 0; i < w; i += 32) {
            ctx.beginPath();
            ctx.moveTo(x + i, y);
            ctx.lineTo(x + i, y + h);
            ctx.stroke();
        }
        // Top edge highlight
        ctx.fillStyle = '#555';
        ctx.fillRect(x, y, w, 3);
        // Yellow safety line
        ctx.fillStyle = 'rgba(255,215,0,0.5)';
        ctx.fillRect(x, y, w, 2);
    } else if (plat.type === 'metal') {
        // Metal grating / conduit tray
        ctx.fillStyle = '#4a5568';
        ctx.fillRect(x, y, w, h);
        // Diamond plate pattern
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        for (let gx = 0; gx < w; gx += 8) {
            for (let gy = 0; gy < h; gy += 8) {
                ctx.fillRect(x + gx + 2, y + gy + 1, 3, 2);
            }
        }
        // Edge bolts
        ctx.fillStyle = '#6a7588';
        ctx.fillRect(x, y, w, 2);
        ctx.fillRect(x, y + h - 2, w, 2);
        ctx.fillStyle = '#8899aa';
        for (let bx = 6; bx < w; bx += 20) {
            ctx.fillRect(x + bx, y + 1, 3, 3);
        }
    } else {
        // Electrical panel platform
        ctx.fillStyle = '#2b5278';
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = 'rgba(43,127,189,0.4)';
        ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
        // Top bright edge
        ctx.fillStyle = '#2b7fbd';
        ctx.fillRect(x, y, w, 2);
        // Circuit trace pattern
        ctx.strokeStyle = 'rgba(255,215,0,0.15)';
        ctx.lineWidth = 1;
        for (let tx = 8; tx < w - 8; tx += 16) {
            ctx.beginPath();
            ctx.moveTo(x + tx, y + 4);
            ctx.lineTo(x + tx, y + h - 4);
            ctx.stroke();
        }
    }
}

// =============================================================
//  DRAW WIRE NUTS (glowing, spinning)
// =============================================================
function drawWireNut(nut) {
    if (nut.collected) return;
    const x = nut.x - cameraX + nut.width / 2;
    const y = nut.y + nut.height / 2 + Math.sin(gameTime * 0.08 + nut.x) * 3;
    const rot = gameTime * 0.06 + nut.x * 0.1;

    // Glow
    ctx.fillStyle = 'rgba(255,102,0,0.15)';
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.fill();

    // Nut body (hexagon)
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.fillStyle = '#FF6600';
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        const r = 8;
        if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();

    // Inner highlight
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        const r = 4;
        if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();

    // Sparkle
    const sparkle = Math.sin(gameTime * 0.15 + nut.x) * 0.5 + 0.5;
    ctx.fillStyle = `rgba(255,255,255,${sparkle * 0.7})`;
    ctx.fillRect(-1, -5, 2, 3);
    ctx.fillRect(-1, 3, 2, 3);
    ctx.fillRect(-5, -1, 3, 2);
    ctx.fillRect(3, -1, 3, 2);

    ctx.restore();
}

// =============================================================
//  DRAW ENEMIES
// =============================================================
function drawEnemy(enemy) {
    if (enemy.dead) return;
    const x = enemy.x - cameraX + enemy.width / 2;
    const y = enemy.y + enemy.height / 2;
    const t = gameTime * 0.1 + enemy.x;

    if (enemy.type === 'spark') {
        // Electric spark ball
        // Outer glow
        ctx.fillStyle = 'rgba(255,255,0,0.1)';
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, Math.PI * 2);
        ctx.fill();

        // Core
        const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, enemy.width / 2);
        coreGrad.addColorStop(0, '#fff');
        coreGrad.addColorStop(0.4, '#FFD700');
        coreGrad.addColorStop(1, '#FF6600');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(x, y, enemy.width / 2 - 2, 0, Math.PI * 2);
        ctx.fill();

        // Lightning arcs
        ctx.strokeStyle = 'rgba(255,255,100,0.8)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 / 5) * i + t;
            const len = 10 + Math.sin(t * 3 + i) * 4;
            const mx = x + Math.cos(angle) * (enemy.width / 2);
            const my = y + Math.sin(angle) * (enemy.width / 2);
            const ex = x + Math.cos(angle) * len;
            const ey = y + Math.sin(angle) * len;
            const jx = (mx + ex) / 2 + (Math.random() - 0.5) * 6;
            const jy = (my + ey) / 2 + (Math.random() - 0.5) * 6;
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(jx, jy);
            ctx.lineTo(ex, ey);
            ctx.stroke();
        }

        // Angry eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(x - 5, y - 3, 3, 3);
        ctx.fillRect(x + 2, y - 3, 3, 3);
        // Frown
        ctx.fillRect(x - 3, y + 3, 6, 1);

    } else if (enemy.type === 'circuit') {
        // Circuit demon - bigger, slower
        // Body
        ctx.fillStyle = '#1a3055';
        ctx.fillRect(x - 14, y - 14, 28, 28);
        // Glowing circuit lines
        ctx.strokeStyle = `rgba(43,127,189,${0.6 + Math.sin(t * 2) * 0.3})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 12, y - 5); ctx.lineTo(x - 4, y - 5); ctx.lineTo(x - 4, y + 5); ctx.lineTo(x + 4, y + 5);
        ctx.lineTo(x + 4, y - 5); ctx.lineTo(x + 12, y - 5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x - 8, y + 10); ctx.lineTo(x + 8, y + 10);
        ctx.stroke();
        // Eyes
        ctx.fillStyle = '#ff3333';
        ctx.fillRect(x - 8, y - 10, 5, 5);
        ctx.fillRect(x + 3, y - 10, 5, 5);
        // Outline glow
        ctx.strokeStyle = 'rgba(43,127,189,0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x - 14, y - 14, 28, 28);
    }
}

// =============================================================
//  DRAW PIPE (conduit exit)
// =============================================================
function drawPipe(pipe) {
    const x = pipe.x - cameraX;
    const y = pipe.y;
    const w = pipe.width;
    const h = pipe.height;

    // Conduit body
    ctx.fillStyle = '#5a6a7a';
    ctx.fillRect(x, y, w, h);

    // Metal shading
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(x + 2, y, w / 3, h);
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(x + w * 0.7, y, w * 0.3, h);

    // Conduit coupling rings
    ctx.fillStyle = '#7a8a9a';
    ctx.fillRect(x - 3, y, w + 6, 6);
    ctx.fillRect(x - 3, y + h - 6, w + 6, 6);

    // Warning label
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(x + 4, y + h / 2 - 12, w - 8, 24);
    // Warning stripes
    ctx.fillStyle = '#000';
    for (let s = 0; s < w - 8; s += 8) {
        ctx.fillRect(x + 4 + s, y + h / 2 - 12, 4, 24);
    }
    // Label text
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(x + 8, y + h / 2 - 6, w - 16, 12);
    ctx.fillStyle = '#000';
    ctx.font = 'bold 8px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('EXIT', x + w / 2, y + h / 2 + 3);

    // Glow pulse
    const glow = Math.sin(gameTime * 0.06) * 0.15 + 0.15;
    ctx.fillStyle = `rgba(255,215,0,${glow})`;
    ctx.fillRect(x - 4, y - 4, w + 8, h + 8);
}

// =============================================================
//  DRAW POWER-UP
// =============================================================
function drawPowerUp(pu) {
    if (pu.collected) return;
    const x = pu.x - cameraX + pu.width / 2;
    const y = pu.y + pu.height / 2 + Math.sin(gameTime * 0.06 + pu.x) * 4;

    // Glow
    ctx.fillStyle = 'rgba(43,127,189,0.2)';
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();

    if (pu.type === 'speed') {
        // Lightning bolt icon
        ctx.fillStyle = '#2b7fbd';
        ctx.beginPath();
        ctx.moveTo(x + 2, y - 10);
        ctx.lineTo(x - 4, y + 1);
        ctx.lineTo(x + 1, y + 1);
        ctx.lineTo(x - 2, y + 10);
        ctx.lineTo(x + 6, y - 1);
        ctx.lineTo(x + 1, y - 1);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(x + 1, y - 7);
        ctx.lineTo(x - 2, y + 1);
        ctx.lineTo(x + 1, y + 1);
        ctx.lineTo(x - 1, y + 7);
        ctx.lineTo(x + 4, y - 1);
        ctx.lineTo(x + 1, y - 1);
        ctx.closePath();
        ctx.fill();
    } else if (pu.type === 'life') {
        // Heart
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.arc(x - 4, y - 2, 5, 0, Math.PI * 2);
        ctx.arc(x + 4, y - 2, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x - 9, y);
        ctx.lineTo(x, y + 9);
        ctx.lineTo(x + 9, y);
        ctx.fill();
    }
}

// =============================================================
//  PARTICLES
// =============================================================
function createSparks(x, y, color, count = 8) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 1) * 6,
            life: 25 + Math.random() * 15,
            maxLife: 40,
            color,
            size: Math.random() * 3 + 1.5,
            type: 'spark'
        });
    }
}

function createFireworks(x, y) {
    const colors = ['#FFD700', '#FF6600', '#2b7fbd', '#fff', '#ff4444'];
    for (let i = 0; i < 30; i++) {
        const angle = (Math.PI * 2 / 30) * i;
        const speed = 3 + Math.random() * 4;
        particles.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 40 + Math.random() * 20,
            maxLife: 60,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 3 + 2,
            type: 'firework'
        });
    }
}

function createStompEffect(x, y) {
    for (let i = 0; i < 12; i++) {
        particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 6,
            vy: -Math.random() * 5 - 2,
            life: 20 + Math.random() * 10,
            maxLife: 30,
            color: i % 2 === 0 ? '#FFD700' : '#fff',
            size: Math.random() * 3 + 1,
            type: 'spark'
        });
    }
}

function drawParticles() {
    particles.forEach(p => {
        const alpha = p.life / p.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        if (p.type === 'firework') {
            ctx.beginPath();
            ctx.arc(p.x - cameraX, p.y, p.size * alpha, 0, Math.PI * 2);
            ctx.fill();
        } else {
            const s = p.size * (0.5 + alpha * 0.5);
            ctx.fillRect(p.x - cameraX - s / 2, p.y - s / 2, s, s);
        }
    });
    ctx.globalAlpha = 1;
}

// =============================================================
//  LEVEL DEFINITIONS
// =============================================================
const LEVEL_NAMES = ['Residential Wiring', 'Commercial Complex', 'High Voltage Tower'];

function loadLevel(level) {
    platforms = [];
    wireNuts = [];
    enemies = [];
    pipes = [];
    particles = [];
    powerUps = [];
    decorations = [];

    const gw = getGameWidth();
    // All levels are wider than screen for side-scrolling
    // Level widths scale relative to the game viewport

    if (level === 1) {
        // ---- LEVEL 1: Residential Wiring ----
        // A gentle introduction with wide platforms and few enemies
        levelWidth = gw * 3;

        // Ground segments
        addGround(0, 550, gw * 1.2);
        addGround(gw * 1.4, 550, gw * 0.6);
        addGround(gw * 2.1, 550, gw * 0.9);

        // Platforms (metal grating)
        addPlatform(gw * 0.25, 460, 140, 'metal');
        addPlatform(gw * 0.55, 400, 120, 'metal');
        addPlatform(gw * 0.85, 450, 130, 'metal');
        addPlatform(gw * 1.1, 380, 110, 'platform');
        addPlatform(gw * 1.5, 460, 150, 'metal');
        addPlatform(gw * 1.8, 400, 120, 'platform');
        addPlatform(gw * 2.15, 450, 140, 'metal');
        addPlatform(gw * 2.45, 380, 130, 'platform');

        // Wire nuts along the path
        addNut(gw * 0.3, 425); addNut(gw * 0.36, 425);
        addNut(gw * 0.6, 365); addNut(gw * 0.66, 365);
        addNut(gw * 0.9, 415);
        addNut(gw * 1.15, 345); addNut(gw * 1.21, 345);
        addNut(gw * 1.55, 425);
        addNut(gw * 1.85, 365); addNut(gw * 1.91, 365);
        addNut(gw * 2.2, 415);
        addNut(gw * 2.5, 345);

        // Enemies
        enemies.push(makeEnemy(gw * 0.7, 520, 2, 'spark'));
        enemies.push(makeEnemy(gw * 1.6, 520, -1.8, 'spark'));
        enemies.push(makeEnemy(gw * 2.3, 520, 2.2, 'spark'));

        // Speed power-up
        powerUps.push({ x: gw * 1.15, y: 330, width: 20, height: 20, type: 'speed', collected: false });

        // Exit pipe
        pipes.push({ x: levelWidth - 80, y: 470, width: 50, height: 80, type: 'exit' });

    } else if (level === 2) {
        // ---- LEVEL 2: Commercial Complex ----
        // More gaps, more enemies, circuit demons introduced
        levelWidth = gw * 3.5;

        addGround(0, 550, gw * 0.7);
        addGround(gw * 0.9, 550, gw * 0.5);
        addGround(gw * 1.6, 550, gw * 0.4);
        addGround(gw * 2.3, 550, gw * 0.5);
        addGround(gw * 3.0, 550, gw * 0.5);

        // Platforms - mix of types
        addPlatform(gw * 0.2, 460, 100, 'metal');
        addPlatform(gw * 0.5, 390, 100, 'platform');
        addPlatform(gw * 0.75, 450, 90, 'metal');
        addPlatform(gw * 1.0, 380, 120, 'platform');
        addPlatform(gw * 1.25, 320, 100, 'metal');
        addPlatform(gw * 1.5, 440, 110, 'metal');
        addPlatform(gw * 1.75, 370, 100, 'platform');
        addPlatform(gw * 2.05, 430, 120, 'metal');
        addPlatform(gw * 2.35, 350, 100, 'platform');
        addPlatform(gw * 2.6, 420, 110, 'metal');
        addPlatform(gw * 2.85, 340, 130, 'platform');
        addPlatform(gw * 3.1, 450, 120, 'metal');

        // Wire nuts
        addNut(gw * 0.25, 425); addNut(gw * 0.31, 425);
        addNut(gw * 0.55, 355); addNut(gw * 0.61, 355);
        addNut(gw * 1.05, 345); addNut(gw * 1.3, 285);
        addNut(gw * 1.55, 405); addNut(gw * 1.8, 335);
        addNut(gw * 2.1, 395); addNut(gw * 2.4, 315);
        addNut(gw * 2.65, 385); addNut(gw * 2.9, 305);
        addNut(gw * 3.15, 415);

        // Enemies - more varied
        enemies.push(makeEnemy(gw * 0.4, 520, 2, 'spark'));
        enemies.push(makeEnemy(gw * 1.0, 520, -2.5, 'spark'));
        enemies.push(makeEnemy(gw * 1.7, 520, 2, 'spark'));
        enemies.push(makeEnemy(gw * 2.4, 520, -2.2, 'circuit'));
        enemies.push(makeEnemy(gw * 3.0, 520, 1.8, 'spark'));
        enemies.push(makeEnemy(gw * 1.3, 290, 1.5, 'spark'));
        enemies.push(makeEnemy(gw * 2.9, 310, -1.5, 'spark'));

        // Power-ups
        powerUps.push({ x: gw * 0.55, y: 340, width: 20, height: 20, type: 'speed', collected: false });
        powerUps.push({ x: gw * 2.35, y: 300, width: 20, height: 20, type: 'life', collected: false });

        pipes.push({ x: levelWidth - 80, y: 470, width: 50, height: 80, type: 'exit' });

    } else if (level === 3) {
        // ---- LEVEL 3: High Voltage Tower ----
        // Tough precision platforming, many enemies, tight gaps
        levelWidth = gw * 4;

        addGround(0, 550, gw * 0.5);
        addGround(gw * 0.7, 550, gw * 0.3);
        addGround(gw * 1.2, 550, gw * 0.4);
        addGround(gw * 1.9, 550, gw * 0.3);
        addGround(gw * 2.5, 550, gw * 0.3);
        addGround(gw * 3.1, 550, gw * 0.3);
        addGround(gw * 3.6, 550, gw * 0.4);

        // Dense platform layout
        addPlatform(gw * 0.15, 470, 80, 'metal');
        addPlatform(gw * 0.4, 410, 90, 'platform');
        addPlatform(gw * 0.65, 470, 70, 'metal');
        addPlatform(gw * 0.85, 390, 80, 'platform');
        addPlatform(gw * 1.1, 340, 90, 'metal');
        addPlatform(gw * 1.35, 430, 80, 'platform');
        addPlatform(gw * 1.55, 370, 90, 'metal');
        addPlatform(gw * 1.8, 310, 80, 'platform');
        addPlatform(gw * 2.0, 440, 100, 'metal');
        addPlatform(gw * 2.25, 370, 80, 'platform');
        addPlatform(gw * 2.5, 310, 90, 'metal');
        addPlatform(gw * 2.75, 420, 80, 'metal');
        addPlatform(gw * 2.95, 350, 90, 'platform');
        addPlatform(gw * 3.2, 290, 80, 'metal');
        addPlatform(gw * 3.45, 400, 100, 'platform');
        addPlatform(gw * 3.7, 460, 100, 'metal');

        // Wire nuts - generous placement
        addNut(gw * 0.2, 435); addNut(gw * 0.45, 375);
        addNut(gw * 0.7, 435); addNut(gw * 0.9, 355);
        addNut(gw * 1.15, 305); addNut(gw * 1.4, 395);
        addNut(gw * 1.6, 335); addNut(gw * 1.85, 275);
        addNut(gw * 2.05, 405); addNut(gw * 2.3, 335);
        addNut(gw * 2.55, 275); addNut(gw * 2.8, 385);
        addNut(gw * 3.0, 315); addNut(gw * 3.25, 255);
        addNut(gw * 3.5, 365); addNut(gw * 3.75, 425);

        // Enemies - the works
        enemies.push(makeEnemy(gw * 0.3, 520, 2.5, 'spark'));
        enemies.push(makeEnemy(gw * 0.8, 520, -2, 'spark'));
        enemies.push(makeEnemy(gw * 1.3, 520, 2.5, 'circuit'));
        enemies.push(makeEnemy(gw * 1.6, 340, 1.5, 'spark'));
        enemies.push(makeEnemy(gw * 2.0, 520, -2.5, 'spark'));
        enemies.push(makeEnemy(gw * 2.5, 520, 2, 'circuit'));
        enemies.push(makeEnemy(gw * 2.95, 320, -1.8, 'spark'));
        enemies.push(makeEnemy(gw * 3.2, 520, 3, 'spark'));
        enemies.push(makeEnemy(gw * 3.5, 520, -2.5, 'spark'));

        // Power-ups
        powerUps.push({ x: gw * 1.15, y: 290, width: 20, height: 20, type: 'speed', collected: false });
        powerUps.push({ x: gw * 2.5, y: 260, width: 20, height: 20, type: 'life', collected: false });
        powerUps.push({ x: gw * 3.45, y: 350, width: 20, height: 20, type: 'speed', collected: false });

        pipes.push({ x: levelWidth - 80, y: 470, width: 50, height: 80, type: 'exit' });
    }

    // Set player start
    player.x = 60;
    player.y = 480;
    player.vx = 0;
    player.vy = 0;
    player.onGround = false;
    player.alive = true;
    player.squash = 1;
    player.stretch = 1;
    cameraX = 0;
}

// Helper to add level objects
function addGround(x, y, w) {
    platforms.push({ x, y, width: w, height: 50, type: 'ground' });
}
function addPlatform(x, y, w, type) {
    platforms.push({ x, y, width: w, height: 18, type: type || 'platform' });
}
function addNut(x, y) {
    wireNuts.push({ x, y, width: 16, height: 16, collected: false });
}
function makeEnemy(x, y, vx, type) {
    const size = type === 'circuit' ? 28 : 24;
    return { x, y: y - size, width: size, height: size, velocityX: vx, type, dead: false, deadTimer: 0 };
}

// =============================================================
//  GAME FLOW
// =============================================================
function startGame() {
    score = 0;
    lives = 3;
    coins = 0;
    currentLevel = 1;
    invincible = false;
    speedBoost = false;
    gameTime = 0;
    loopRunning = false;
    hideAllScreens();
    showLevelTransition(currentLevel, () => {
        gameState = 'playing';
        loadLevel(currentLevel);
        updateHUD();
        ensureLoop();
    });
}

function restartGame() {
    startGame();
}

function nextLevel() {
    currentLevel++;
    if (currentLevel > MAX_LEVEL) {
        // Game complete!
        gameState = 'gameComplete';
        score += 5000; // completion bonus
        hideAllScreens();
        if (isTopScore(score) && score > 0) {
            highScoreValue.textContent = `Score: ${score}`;
            nameEntryScreen.classList.remove('hidden');
            setTimeout(() => playerNameInput.focus(), 100);
        } else {
            showGameCompleteScreen();
        }
        return;
    }
    hideAllScreens();
    loopRunning = false;
    showLevelTransition(currentLevel, () => {
        gameState = 'playing';
        loadLevel(currentLevel);
        updateHUD();
        ensureLoop();
    });
}

function showLevelTransition(level, callback) {
    gameState = 'transition';
    levelTransitionText.textContent = `LEVEL ${level}`;
    levelTransitionSubtitle.textContent = LEVEL_NAMES[level - 1] || '';
    levelTransition.classList.remove('hidden');
    transitionTimer = 0;

    let ticking = true;
    function tick() {
        transitionTimer++;
        if (transitionTimer > 90) { // ~1.5 seconds
            levelTransition.classList.add('hidden');
            ticking = false;
            callback();
        } else if (ticking) {
            requestAnimationFrame(tick);
        }
    }
    requestAnimationFrame(tick);
}

function hideAllScreens() {
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    winScreen.classList.add('hidden');
    nameEntryScreen.classList.add('hidden');
    levelTransition.classList.add('hidden');
    if (gameCompleteScreen) gameCompleteScreen.classList.add('hidden');
}

function updateHUD() {
    scoreDisplay.textContent = `SCORE: ${score}`;
    const hearts = lives > 0 ? '\u2764\uFE0F'.repeat(Math.min(lives, 5)) : '';
    livesDisplay.textContent = `LIVES: ${hearts || '0'}`;
    coinsDisplay.textContent = `NUTS: ${coins}`;
}

function showGameCompleteScreen() {
    if (completeScore) completeScore.textContent = `Score: ${score}`;
    if (completeLeaderboard) completeLeaderboard.innerHTML = renderLeaderboardHTML();
    if (gameCompleteScreen) gameCompleteScreen.classList.remove('hidden');
}

// =============================================================
//  COLLISION
// =============================================================
function checkCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function checkPlatformCollision(pl, plat) {
    const inset = 4; // forgiving horizontal inset
    return pl.x + inset < plat.x + plat.width &&
           pl.x + pl.width - inset > plat.x &&
           pl.y + pl.height >= plat.y &&
           pl.y + pl.height <= plat.y + plat.height + 6 &&
           pl.vy >= 0;
}

// =============================================================
//  UPDATE
// =============================================================
function update() {
    if (gameState !== 'playing') return;
    gameTime++;

    const gw = getGameWidth();
    const p = player;

    // -- Death sequence --
    if (!p.alive) {
        deathTimer++;
        p.deathVY += 0.5;
        p.y += p.deathVY;
        if (deathTimer > 60) {
            if (lives <= 0) {
                gameOver();
            } else {
                loadLevel(currentLevel);
                invincible = true;
                invincibleTimer = 120;
                updateHUD();
            }
        }
        return;
    }

    // -- Walk animation --
    if (Math.abs(p.vx) > 0.5 && p.onGround) {
        p.walkTimer++;
        if (p.walkTimer > 5) { p.walkTimer = 0; p.walkFrame++; }
    } else {
        p.walkFrame = 0;
        p.walkTimer = 0;
    }

    // -- Horizontal movement (acceleration-based) --
    const moveSpeed = speedBoost ? p.maxSpeed * 1.4 : p.maxSpeed;
    let inputX = 0;
    if (keys['ArrowLeft'] || keys['KeyA']) inputX = -1;
    if (keys['ArrowRight'] || keys['KeyD']) inputX = 1;

    if (inputX !== 0) {
        p.vx += inputX * p.accel;
        p.vx = Math.max(-moveSpeed, Math.min(moveSpeed, p.vx));
        p.dir = inputX;
    } else {
        // Decelerate
        if (p.vx > 0) p.vx = Math.max(0, p.vx - p.decel);
        else if (p.vx < 0) p.vx = Math.min(0, p.vx + p.decel);
    }

    // -- Coyote time --
    if (p.wasOnGround && !p.onGround && p.vy >= 0) {
        p.coyoteTime = 6; // 6 frames to still jump
    }
    if (p.coyoteTime > 0) p.coyoteTime--;

    // -- Jumping (variable height) --
    if (jumpJustPressed && (p.onGround || p.coyoteTime > 0)) {
        p.vy = -p.jumpPower;
        p.onGround = false;
        p.coyoteTime = 0;
        p.jumpCut = false;
        // Jump squash
        p.squash = 1.15;
        p.stretch = 0.85;
    }
    jumpJustPressed = false;

    // Variable jump height - cut jump short if button released
    if (!jumpPressed && p.vy < -3) {
        p.vy *= 0.65; // cut velocity
        p.jumpCut = true;
    }

    // -- Gravity --
    p.vy += p.gravity;
    if (p.vy > 12) p.vy = 12; // terminal velocity

    // -- Move & collide --
    p.wasOnGround = p.onGround;
    p.x += p.vx;
    p.y += p.vy;
    p.onGround = false;

    // Platform collisions
    for (const plat of platforms) {
        // Top collision (landing)
        if (checkPlatformCollision(p, plat)) {
            p.y = plat.y - p.height;
            if (p.vy > 5) {
                p.squash = 0.8;
                p.stretch = 1.2;
            }
            p.vy = 0;
            p.onGround = true;
        }
        // Bottom collision (head bonk) - player jumping up into platform from below
        const inset = 4;
        if (p.vy < 0 &&
            p.x + inset < plat.x + plat.width &&
            p.x + p.width - inset > plat.x &&
            p.y < plat.y + plat.height &&
            p.y > plat.y &&
            p.y - p.vy >= plat.y + plat.height) {
            p.y = plat.y + plat.height;
            p.vy = 0;
        }
        // Side collision for ground blocks to prevent going through
        if (plat.type === 'ground') {
            // Left side
            if (p.x + p.width > plat.x && p.x < plat.x &&
                p.y + p.height > plat.y + 4 && p.y < plat.y + plat.height) {
                p.x = plat.x - p.width;
                p.vx = 0;
            }
            // Right side
            if (p.x < plat.x + plat.width && p.x + p.width > plat.x + plat.width &&
                p.y + p.height > plat.y + 4 && p.y < plat.y + plat.height) {
                p.x = plat.x + plat.width;
                p.vx = 0;
            }
        }
    }

    // Squash/stretch lerp back
    p.squash += (1 - p.squash) * 0.2;
    p.stretch += (1 - p.stretch) * 0.2;

    // Boundary
    if (p.x < 0) { p.x = 0; p.vx = 0; }
    if (p.x + p.width > levelWidth) { p.x = levelWidth - p.width; p.vx = 0; }

    // Fall off screen
    if (p.y > GAME_HEIGHT + 50) {
        loseLife();
        return;
    }

    // -- Camera --
    const targetCam = p.x - gw / 2 + p.width / 2;
    cameraX += (targetCam - cameraX) * 0.1;
    if (cameraX < 0) cameraX = 0;
    if (cameraX > levelWidth - gw) cameraX = levelWidth - gw;

    // -- Collect wire nuts --
    wireNuts.forEach(nut => {
        if (!nut.collected && checkCollision(p, nut)) {
            nut.collected = true;
            coins++;
            score += 100;
            navigator.vibrate(30);
            updateHUD();
            createSparks(nut.x + nut.width / 2, nut.y + nut.height / 2, '#FFD700', 12);
        }
    });

    // -- Power-ups --
    powerUps.forEach(pu => {
        if (!pu.collected && checkCollision(p, pu)) {
            pu.collected = true;
            if (pu.type === 'speed') {
                speedBoost = true;
                speedBoostTimer = 300; // 5 seconds
                score += 200;
                createSparks(pu.x + pu.width / 2, pu.y + pu.height / 2, '#2b7fbd', 15);
            } else if (pu.type === 'life') {
                lives = Math.min(lives + 1, 5);
                score += 500;
                createSparks(pu.x + pu.width / 2, pu.y + pu.height / 2, '#ff4444', 15);
            }
            updateHUD();
        }
    });

    // -- Speed boost timer --
    if (speedBoost) {
        speedBoostTimer--;
        if (speedBoostTimer <= 0) speedBoost = false;
    }

    // -- Enemies --
    enemies.forEach(enemy => {
        if (enemy.dead) {
            enemy.deadTimer++;
            return;
        }
        enemy.x += enemy.velocityX;

        // Bounce off level edges
        if (enemy.x < 0 || enemy.x + enemy.width > levelWidth) {
            enemy.velocityX *= -1;
        }

        // Bounce off platform edges (keep on their platform)
        let onAnyPlatform = false;
        for (const plat of platforms) {
            if (enemy.x + enemy.width > plat.x && enemy.x < plat.x + plat.width &&
                enemy.y + enemy.height >= plat.y - 2 && enemy.y + enemy.height <= plat.y + 10) {
                onAnyPlatform = true;
                // Edge detection - reverse at platform edges
                if (enemy.x <= plat.x) { enemy.velocityX = Math.abs(enemy.velocityX); }
                if (enemy.x + enemy.width >= plat.x + plat.width) { enemy.velocityX = -Math.abs(enemy.velocityX); }
            }
        }

        // Collision with player
        if (!invincible && checkCollision(p, enemy)) {
            // Stomp check: player falling onto enemy from above
            if (p.vy > 0 && p.y + p.height < enemy.y + enemy.height * 0.6) {
                // Stomp!
                enemy.dead = true;
                enemy.deadTimer = 0;
                p.vy = -8; // bounce off
                score += 200;
                navigator.vibrate(50);
                updateHUD();
                createStompEffect(enemy.x + enemy.width / 2, enemy.y);
            } else {
                loseLife();
            }
        }
    });

    // -- Pipe (exit) --
    pipes.forEach(pipe => {
        if (checkCollision(p, pipe)) {
            winLevel();
        }
    });

    // -- Update particles --
    for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        if (pt.type !== 'firework') pt.vy += 0.25;
        else pt.vy += 0.06;
        pt.vx *= 0.98;
        pt.life--;
        if (pt.life <= 0) particles.splice(i, 1);
    }

    // -- Invincibility --
    if (invincible) {
        invincibleTimer--;
        if (invincibleTimer <= 0) invincible = false;
    }
}

// =============================================================
//  LOSE / WIN / GAME OVER
// =============================================================
function loseLife() {
    lives--;
    navigator.vibrate([100, 50, 100, 50, 200]);
    updateHUD();
    createSparks(player.x + player.width / 2, player.y + player.height / 2, '#FF4444', 20);
    player.alive = false;
    player.deathVY = -8;
    deathTimer = 0;
    // gameState stays 'playing' so the loop continues for the death animation
}

function gameOver() {
    gameState = 'gameOver';
    if (isTopScore(score) && score > 0) {
        setTimeout(() => {
            highScoreValue.textContent = `Score: ${score}`;
            nameEntryScreen.classList.remove('hidden');
            setTimeout(() => playerNameInput.focus(), 100);
        }, 300);
    } else {
        finalScoreDisplay.textContent = `Score: ${score}`;
        if (leaderboardDisplay) leaderboardDisplay.innerHTML = renderLeaderboardHTML();
        setTimeout(() => gameOverScreen.classList.remove('hidden'), 300);
    }
}

function winLevel() {
    gameState = 'win';
    score += 1000;
    navigator.vibrate([50, 30, 50, 30, 100]);
    updateHUD();
    winScoreDisplay.textContent = `Score: ${score}`;

    // Fireworks!
    const gw = getGameWidth();
    const px = player.x;
    createFireworks(px, player.y - 30);
    setTimeout(() => createFireworks(px - 60, player.y - 80), 200);
    setTimeout(() => createFireworks(px + 60, player.y - 60), 400);

    winTimer = 0;
    function winTick() {
        winTimer++;
        // Keep drawing during celebration
        drawFrame();
        // Update particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const pt = particles[i];
            pt.x += pt.vx;
            pt.y += pt.vy;
            pt.vy += 0.06;
            pt.vx *= 0.98;
            pt.life--;
            if (pt.life <= 0) particles.splice(i, 1);
        }
        if (winTimer < 80) {
            requestAnimationFrame(winTick);
        } else {
            if (currentLevel >= MAX_LEVEL) {
                // Show game complete path
                nextLevel();
            } else {
                winScreen.classList.remove('hidden');
            }
        }
    }
    requestAnimationFrame(winTick);
}

function submitName() {
    const name = playerNameInput.value.trim();
    if (name) {
        saveToLeaderboard(name.substring(0, 20), score);
        nameEntryScreen.classList.add('hidden');
        playerNameInput.value = '';
        if (gameState === 'gameOver') {
            finalScoreDisplay.textContent = `Score: ${score}`;
            if (leaderboardDisplay) leaderboardDisplay.innerHTML = renderLeaderboardHTML();
            gameOverScreen.classList.remove('hidden');
        } else if (gameState === 'gameComplete') {
            showGameCompleteScreen();
        }
    }
}

// =============================================================
//  DRAW FRAME
// =============================================================
function drawFrame() {
    const gw = getGameWidth();

    // Parallax background
    drawParallaxBG(gw);

    // Platforms
    platforms.forEach(p => {
        if (p.x + p.width > cameraX - 50 && p.x < cameraX + gw + 50) {
            drawPlatform(p);
        }
    });

    // Pipes
    pipes.forEach(p => drawPipe(p));

    // Power-ups
    powerUps.forEach(p => drawPowerUp(p));

    // Wire nuts
    wireNuts.forEach(n => drawWireNut(n));

    // Enemies
    enemies.forEach(e => {
        if (!e.dead || e.deadTimer < 20) drawEnemy(e);
    });

    // Player
    drawPlayer();

    // Particles (on top)
    drawParticles();

    // Speed boost HUD indicator
    if (speedBoost) {
        ctx.fillStyle = 'rgba(43,127,189,0.3)';
        ctx.fillRect(0, 0, gw, 4);
        const barW = (speedBoostTimer / 300) * gw;
        ctx.fillStyle = '#2b7fbd';
        ctx.fillRect(0, 0, barW, 4);
    }
}

// =============================================================
//  GAME LOOP
// =============================================================
let loopRunning = false;

function gameLoop() {
    update();
    drawFrame();

    // Continue loop while playing (including death animation before game-over)
    if (gameState === 'playing') {
        requestAnimationFrame(gameLoop);
    } else {
        loopRunning = false;
    }
}

function ensureLoop() {
    if (!loopRunning && gameState === 'playing') {
        loopRunning = true;
        requestAnimationFrame(gameLoop);
    }
}
