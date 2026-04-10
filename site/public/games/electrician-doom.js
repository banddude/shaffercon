// ====================================
// DOOM - Episode 1: Shock to the System
// Enhanced raycasting FPS engine
// ====================================

// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const SCREEN_WIDTH = 960;
const SCREEN_HEIGHT = 600;
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;

const FOV = Math.PI / 3;
const HALF_FOV = FOV / 2;
const NUM_RAYS = SCREEN_WIDTH; // One ray per pixel column for smooth walls
const MAX_DEPTH = 24;
const DELTA_ANGLE = FOV / NUM_RAYS;

// Game State
let gameState = 'menu'; // menu, playing, levelComplete, gameOver, victory
let currentLevel = 1;
let gameTime = 0;
let levelStartTime = 0;
let totalKills = 0;
let totalItems = 0;
let totalSecrets = 0;
let showMinimap = true;

// Leaderboard functions
function getLeaderboard() {
    return JSON.parse(localStorage.getItem('doom-leaderboard') || '[]');
}

function saveToLeaderboard(name, level, kills, time) {
    let leaderboard = getLeaderboard();
    const score = level * 1000 + kills * 100 - Math.floor(time);
    leaderboard.push({ name, level, kills, time, score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10);
    localStorage.setItem('doom-leaderboard', JSON.stringify(leaderboard));
    window.dispatchEvent(new Event('storage'));
}

function isTopScore(level, kills, time) {
    const leaderboard = getLeaderboard();
    if (leaderboard.length < 10) return true;
    const score = level * 1000 + kills * 100 - Math.floor(time);
    return score > leaderboard[leaderboard.length - 1].score;
}

// Player State
const player = {
    x: 3.5,
    y: 3.5,
    angle: 0,
    health: 100,
    armor: 0,
    currentWeapon: 0,
    weapons: [true, false, false, false, false, false],
    ammo: [999, 0, 0, 0, 0, 0],
    keys: { yellow: false, red: false, blue: false },
    kills: 0,
    items: 0,
    secrets: 0,
    bobPhase: 0,
    damageFlash: 0,
    pickupFlash: 0,
    pickupFlashColor: '#FFD700'
};

// Weapons Data
const weapons = [
    { name: 'VOLTAGE TESTER', damage: 15, fireRate: 8, range: 12, infinite: true, color: '#FFD700', flashColor: '#FFFF00' },
    { name: 'WIRE STRIPPERS', damage: 60, fireRate: 18, range: 6, ammoUse: 1, spread: 7, color: '#FF6600', flashColor: '#FF8800' },
    { name: 'POWER DRILL', damage: 10, fireRate: 2, range: 15, ammoUse: 1, color: '#00FFFF', flashColor: '#00FFFF' },
    { name: 'ARC WELDER', damage: 35, fireRate: 10, range: 18, ammoUse: 1, color: '#0080FF', flashColor: '#4488FF' },
    { name: 'CIRCUIT BREAKER', damage: 100, fireRate: 22, range: 25, ammoUse: 1, explosive: true, color: '#FF0000', flashColor: '#FF4400' },
    { name: 'TESLA COIL', damage: 250, fireRate: 35, range: 25, ammoUse: 40, area: 4, color: '#FF00FF', flashColor: '#FF44FF' }
];

let weaponCooldown = 0;
let weaponFireAnim = 0; // frames of fire animation remaining
let muzzleFlashIntensity = 0;

// Enemy Types
const enemyTypes = {
    sparkImp: {
        name: 'Spark Imp',
        health: 25,
        damage: 8,
        speed: 0.025,
        size: 0.35,
        color: '#FFFF00',
        bodyColor: '#CCCC00',
        fireRate: 50,
        range: 10,
        points: 50
    },
    wireZombie: {
        name: 'Wire Zombie',
        health: 40,
        damage: 12,
        speed: 0.018,
        size: 0.45,
        color: '#00FF00',
        bodyColor: '#009900',
        fireRate: 35,
        range: 2,
        points: 100
    },
    circuitDemon: {
        name: 'Circuit Demon',
        health: 60,
        damage: 18,
        speed: 0.04,
        size: 0.45,
        color: '#FF0000',
        bodyColor: '#990000',
        fireRate: 28,
        range: 2,
        points: 150
    },
    voltageSpectre: {
        name: 'Voltage Spectre',
        health: 50,
        damage: 15,
        speed: 0.035,
        size: 0.45,
        color: '#8080FF',
        bodyColor: '#4040CC',
        fireRate: 45,
        range: 12,
        invisible: true,
        points: 200
    },
    arcTrooper: {
        name: 'Arc Trooper',
        health: 90,
        damage: 25,
        speed: 0.022,
        size: 0.55,
        color: '#FF6600',
        bodyColor: '#CC4400',
        fireRate: 32,
        range: 15,
        points: 250
    },
    teslaBaron: {
        name: 'Tesla Baron',
        health: 180,
        damage: 35,
        speed: 0.028,
        size: 0.65,
        color: '#FF00FF',
        bodyColor: '#AA00AA',
        fireRate: 38,
        range: 12,
        points: 500
    },
    masterBreaker: {
        name: 'Master Breaker',
        health: 600,
        damage: 60,
        speed: 0.025,
        size: 0.85,
        color: '#FFD700',
        bodyColor: '#CC9900',
        fireRate: 25,
        range: 18,
        boss: true,
        points: 1000
    }
};

// Pickup Types
const pickupTypes = {
    coffee: { health: 10, color: '#8B4513', size: 0.25, type: 'health' },
    energy: { health: 25, color: '#00FF00', size: 0.3, type: 'health' },
    medkit: { health: 50, color: '#FF0000', size: 0.35, type: 'health' },
    vest: { armor: 50, color: '#FF6600', size: 0.3, type: 'armor' },
    fullGear: { armor: 100, color: '#0080FF', size: 0.35, type: 'armor' },
    yellowKey: { key: 'yellow', color: '#FFD700', size: 0.3, type: 'key' },
    redKey: { key: 'red', color: '#FF0000', size: 0.3, type: 'key' },
    blueKey: { key: 'blue', color: '#0080FF', size: 0.3, type: 'key' },
    ammo1: { ammo: 1, amount: 10, color: '#FF6600', size: 0.25, type: 'ammo' },
    ammo2: { ammo: 2, amount: 50, color: '#00FFFF', size: 0.25, type: 'ammo' },
    ammo3: { ammo: 3, amount: 20, color: '#0080FF', size: 0.25, type: 'ammo' },
    ammo4: { ammo: 4, amount: 5, color: '#FF0000', size: 0.25, type: 'ammo' },
    ammo5: { ammo: 5, amount: 40, color: '#FF00FF', size: 0.25, type: 'ammo' },
    weapon1: { weapon: 1, color: '#FF6600', size: 0.35, type: 'weapon', symbol: 'W1' },
    weapon2: { weapon: 2, color: '#00FFFF', size: 0.35, type: 'weapon', symbol: 'W2' },
    weapon3: { weapon: 3, color: '#0080FF', size: 0.35, type: 'weapon', symbol: 'W3' },
    weapon4: { weapon: 4, color: '#FF0000', size: 0.35, type: 'weapon', symbol: 'W4' },
    weapon5: { weapon: 5, color: '#FF00FF', size: 0.35, type: 'weapon', symbol: 'W5' }
};

// ====================================
// PROCEDURAL TEXTURE GENERATION
// ====================================

const TEXTURE_SIZE = 64;
const textures = {};

function generateTextures() {
    // Wall type 1: Brick pattern (grey industrial)
    textures[1] = createTexture((data, w, h) => {
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const i = (y * w + x) * 4;
                const brickH = 8;
                const brickW = 16;
                const row = Math.floor(y / brickH);
                const offset = (row % 2) * (brickW / 2);
                const bx = (x + offset) % brickW;
                const by = y % brickH;
                const isMortar = bx === 0 || by === 0;
                if (isMortar) {
                    data[i] = 40; data[i+1] = 40; data[i+2] = 45; data[i+3] = 255;
                } else {
                    const noise = (Math.random() * 15) | 0;
                    data[i] = 70 + noise; data[i+1] = 65 + noise; data[i+2] = 60 + noise; data[i+3] = 255;
                }
            }
        }
    });

    // Wall type 2: Metal door (gold/yellow)
    textures[2] = createTexture((data, w, h) => {
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const i = (y * w + x) * 4;
                const panelBorder = x < 2 || x >= w-2 || y < 2 || y >= h-2;
                const midLine = Math.abs(x - w/2) < 1;
                const ribLine = y % 8 === 0;
                if (panelBorder || midLine) {
                    data[i] = 180; data[i+1] = 150; data[i+2] = 20; data[i+3] = 255;
                } else if (ribLine) {
                    data[i] = 160; data[i+1] = 140; data[i+2] = 30; data[i+3] = 255;
                } else {
                    const grad = (y / h) * 30;
                    data[i] = 140 + grad; data[i+1] = 120 + grad; data[i+2] = 15; data[i+3] = 255;
                }
            }
        }
    });

    // Wall type 3: Locked door (red metal)
    textures[3] = createTexture((data, w, h) => {
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const i = (y * w + x) * 4;
                const panelBorder = x < 2 || x >= w-2 || y < 2 || y >= h-2;
                const lockPlate = Math.abs(x - w/2) < 6 && Math.abs(y - h/2) < 6;
                if (lockPlate) {
                    data[i] = 255; data[i+1] = 200; data[i+2] = 0; data[i+3] = 255;
                } else if (panelBorder) {
                    data[i] = 200; data[i+1] = 40; data[i+2] = 40; data[i+3] = 255;
                } else {
                    const grad = (y / h) * 30;
                    data[i] = 150 + grad; data[i+1] = 20; data[i+2] = 20; data[i+3] = 255;
                }
            }
        }
    });

    // Wall type 9: Exit sign (green with arrow)
    textures[9] = createTexture((data, w, h) => {
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const i = (y * w + x) * 4;
                const border = x < 2 || x >= w-2 || y < 2 || y >= h-2;
                // Arrow shape in center
                const cx = w/2, cy = h/2;
                const isArrow = (Math.abs(y - cy) < 4 && x > cx - 10 && x < cx + 10) ||
                    (x > cx + 4 && x < cx + 12 && Math.abs(y - cy) < (12 - x + cx));
                if (border) {
                    data[i] = 0; data[i+1] = 200; data[i+2] = 0; data[i+3] = 255;
                } else if (isArrow) {
                    const pulse = 200 + Math.sin(x * 0.3) * 55;
                    data[i] = 0; data[i+1] = pulse; data[i+2] = 0; data[i+3] = 255;
                } else {
                    data[i] = 10; data[i+1] = 50; data[i+2] = 10; data[i+3] = 255;
                }
            }
        }
    });

    // Dark variant textures for N/S vs E/W shading
    for (const key of [1, 2, 3, 9]) {
        textures[key + '_dark'] = createDarkerTexture(textures[key], 0.7);
    }
}

function createTexture(drawFunc) {
    const tCanvas = document.createElement('canvas');
    tCanvas.width = TEXTURE_SIZE;
    tCanvas.height = TEXTURE_SIZE;
    const tCtx = tCanvas.getContext('2d');
    const imageData = tCtx.createImageData(TEXTURE_SIZE, TEXTURE_SIZE);
    drawFunc(imageData.data, TEXTURE_SIZE, TEXTURE_SIZE);
    tCtx.putImageData(imageData, 0, 0);
    return tCanvas;
}

function createDarkerTexture(srcCanvas, factor) {
    const tCanvas = document.createElement('canvas');
    tCanvas.width = TEXTURE_SIZE;
    tCanvas.height = TEXTURE_SIZE;
    const tCtx = tCanvas.getContext('2d');
    tCtx.drawImage(srcCanvas, 0, 0);
    const imageData = tCtx.getImageData(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);
    const d = imageData.data;
    for (let i = 0; i < d.length; i += 4) {
        d[i] = (d[i] * factor) | 0;
        d[i+1] = (d[i+1] * factor) | 0;
        d[i+2] = (d[i+2] * factor) | 0;
    }
    tCtx.putImageData(imageData, 0, 0);
    return tCanvas;
}

// ====================================
// LEVEL DEFINITIONS - ALL 9 LEVELS
// ====================================

const levels = [
    // E1M1: Power Plant Entrance
    {
        name: 'E1M1: POWER PLANT',
        map: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,1,1,1,1,2,1,1,1,1,0,0,0,0,1],
            [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1],
            [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1],
            [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1],
            [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1],
            [1,0,0,0,1,1,1,1,0,1,1,1,1,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ],
        start: { x: 2.5, y: 2.5, angle: 0 },
        enemies: [
            { type: 'sparkImp', x: 9.5, y: 5.5 },
            { type: 'sparkImp', x: 12.5, y: 10.5 },
            { type: 'wireZombie', x: 15.5, y: 10.5 }
        ],
        pickups: [
            { type: 'coffee', x: 6.5, y: 5.5 },
            { type: 'ammo1', x: 11.5, y: 5.5 },
            { type: 'weapon1', x: 14.5, y: 6.5 }
        ],
        doors: [
            { x: 8, y: 3, vertical: false, locked: false }
        ]
    },

    // E1M2: Transformer Station
    {
        name: 'E1M2: TRANSFORMER STATION',
        map: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
            [1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
            [1,0,0,0,0,3,0,0,0,0,0,0,0,0,3,0,0,0,0,1],
            [1,1,1,2,1,1,0,0,1,1,1,1,0,0,1,1,2,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,1],
            [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
            [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
            [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
            [1,0,0,0,0,0,1,1,1,2,1,1,1,1,0,0,0,0,9,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ],
        start: { x: 2.5, y: 2.5, angle: 0 },
        enemies: [
            { type: 'sparkImp', x: 9.5, y: 2.5 },
            { type: 'sparkImp', x: 10.5, y: 2.5 },
            { type: 'sparkImp', x: 9.5, y: 9.5 },
            { type: 'wireZombie', x: 3.5, y: 6.5 },
            { type: 'wireZombie', x: 16.5, y: 6.5 },
            { type: 'circuitDemon', x: 10.5, y: 9.5 }
        ],
        pickups: [
            { type: 'yellowKey', x: 9.5, y: 9.5 },
            { type: 'energy', x: 3.5, y: 10.5 },
            { type: 'vest', x: 16.5, y: 10.5 },
            { type: 'ammo1', x: 7.5, y: 5.5 },
            { type: 'ammo1', x: 12.5, y: 5.5 }
        ],
        doors: [
            { x: 3, y: 4, vertical: false, locked: false },
            { x: 16, y: 4, vertical: false, locked: false },
            { x: 5, y: 3, vertical: true, locked: true, key: 'yellow' },
            { x: 14, y: 3, vertical: true, locked: true, key: 'yellow' },
            { x: 9, y: 11, vertical: false, locked: false }
        ]
    },

    // E1M3: Circuit Breaker Hell
    {
        name: 'E1M3: CIRCUIT BREAKER HELL',
        map: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,0,1,0,0,1,0,1,1,1,1,0,1],
            [1,0,1,0,0,0,0,2,0,0,2,0,0,0,0,1,0,1],
            [1,0,1,0,1,1,1,1,0,0,1,1,1,1,0,1,0,1],
            [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
            [1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1],
            [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
            [1,0,1,0,1,1,1,1,0,0,1,1,1,1,0,1,0,1],
            [1,0,1,0,0,0,0,1,0,0,1,0,0,0,0,1,0,1],
            [1,0,1,1,1,1,0,1,0,0,1,0,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ],
        start: { x: 2.5, y: 1.5, angle: 0 },
        enemies: [
            { type: 'sparkImp', x: 5.5, y: 5.5 },
            { type: 'sparkImp', x: 12.5, y: 5.5 },
            { type: 'wireZombie', x: 9.5, y: 7.5 },
            { type: 'circuitDemon', x: 4.5, y: 9.5 },
            { type: 'circuitDemon', x: 13.5, y: 9.5 },
            { type: 'voltageSpectre', x: 9.5, y: 3.5 }
        ],
        pickups: [
            { type: 'redKey', x: 9.5, y: 5.5 },
            { type: 'energy', x: 4.5, y: 5.5 },
            { type: 'energy', x: 13.5, y: 5.5 },
            { type: 'weapon2', x: 9.5, y: 1.5 },
            { type: 'ammo2', x: 2.5, y: 10.5 },
            { type: 'ammo2', x: 15.5, y: 10.5 }
        ],
        doors: [
            { x: 7, y: 3, vertical: false, locked: false },
            { x: 10, y: 3, vertical: false, locked: false },
            { x: 2, y: 6, vertical: true, locked: true, key: 'red' },
            { x: 15, y: 6, vertical: true, locked: true, key: 'red' }
        ]
    },

    // E1M4: High Voltage Zone
    {
        name: 'E1M4: HIGH VOLTAGE ZONE',
        map: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1],
            [1,0,1,0,0,0,0,1,0,2,0,1,0,0,0,0,0,1,0,1],
            [1,0,1,0,0,0,0,1,0,1,0,1,0,0,0,0,0,1,0,1],
            [1,0,1,0,0,0,0,3,0,1,0,1,0,0,0,0,0,2,0,1],
            [1,0,1,1,1,2,1,1,0,1,0,1,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,9,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ],
        start: { x: 2.5, y: 1.5, angle: 0 },
        enemies: [
            { type: 'sparkImp', x: 6.5, y: 4.5 },
            { type: 'sparkImp', x: 14.5, y: 4.5 },
            { type: 'circuitDemon', x: 9.5, y: 5.5 },
            { type: 'voltageSpectre', x: 5.5, y: 7.5 },
            { type: 'voltageSpectre', x: 15.5, y: 7.5 },
            { type: 'arcTrooper', x: 10.5, y: 7.5 }
        ],
        pickups: [
            { type: 'blueKey', x: 5.5, y: 4.5 },
            { type: 'fullGear', x: 14.5, y: 4.5 },
            { type: 'weapon3', x: 9.5, y: 1.5 },
            { type: 'ammo3', x: 2.5, y: 7.5 },
            { type: 'energy', x: 17.5, y: 7.5 }
        ],
        doors: [
            { x: 9, y: 3, vertical: false, locked: false },
            { x: 7, y: 5, vertical: true, locked: true, key: 'blue' },
            { x: 17, y: 5, vertical: true, locked: true, key: 'blue' },
            { x: 5, y: 6, vertical: false, locked: false }
        ]
    },

    // E1M5: The Substation
    {
        name: 'E1M5: THE SUBSTATION',
        map: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,3,0,1,1,1,1,0,2,0,0,0,0,0,0,1],
            [1,1,1,1,2,1,1,1,0,1,0,0,1,0,1,1,1,2,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,2,1,1,1,0,1,1,1,1,0,1,1,1,2,1,1,1,1],
            [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,9,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ],
        start: { x: 2.5, y: 2.5, angle: 0 },
        enemies: [
            { type: 'sparkImp', x: 10.5, y: 2.5 },
            { type: 'sparkImp', x: 11.5, y: 2.5 },
            { type: 'wireZombie', x: 4.5, y: 5.5 },
            { type: 'wireZombie', x: 17.5, y: 5.5 },
            { type: 'circuitDemon', x: 10.5, y: 5.5 },
            { type: 'circuitDemon', x: 11.5, y: 7.5 },
            { type: 'voltageSpectre', x: 4.5, y: 10.5 },
            { type: 'arcTrooper', x: 17.5, y: 10.5 },
            { type: 'teslaBaron', x: 11.5, y: 10.5 }
        ],
        pickups: [
            { type: 'yellowKey', x: 10.5, y: 5.5 },
            { type: 'redKey', x: 11.5, y: 5.5 },
            { type: 'blueKey', x: 11.5, y: 9.5 },
            { type: 'fullGear', x: 2.5, y: 6.5 },
            { type: 'weapon4', x: 19.5, y: 6.5 },
            { type: 'ammo4', x: 10.5, y: 6.5 },
            { type: 'medkit', x: 2.5, y: 10.5 }
        ],
        doors: [
            { x: 7, y: 3, vertical: true, locked: true, key: 'yellow' },
            { x: 14, y: 3, vertical: false, locked: true, key: 'red' },
            { x: 4, y: 4, vertical: false, locked: false },
            { x: 17, y: 4, vertical: false, locked: false },
            { x: 9, y: 6, vertical: true, locked: false },
            { x: 12, y: 6, vertical: true, locked: false },
            { x: 4, y: 8, vertical: false, locked: false },
            { x: 17, y: 8, vertical: false, locked: false }
        ]
    },

    // E1M6: Wire Management Nightmare
    {
        name: 'E1M6: WIRE NIGHTMARE',
        map: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,1],
            [1,0,1,1,0,1,0,1,1,1,1,0,1,0,1,1,0,1],
            [1,0,1,0,0,2,0,0,0,0,0,0,2,0,0,1,0,1],
            [1,0,1,0,1,1,1,1,2,1,1,1,1,1,0,1,0,1],
            [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
            [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
            [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
            [1,0,1,0,1,1,1,1,2,1,1,1,1,1,0,1,0,1],
            [1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,9,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ],
        start: { x: 2.5, y: 1.5, angle: 0 },
        enemies: [
            { type: 'wireZombie', x: 9.5, y: 3.5 },
            { type: 'wireZombie', x: 9.5, y: 5.5 },
            { type: 'circuitDemon', x: 4.5, y: 7.5 },
            { type: 'circuitDemon', x: 13.5, y: 7.5 },
            { type: 'voltageSpectre', x: 9.5, y: 9.5 },
            { type: 'voltageSpectre', x: 9.5, y: 11.5 },
            { type: 'arcTrooper', x: 2.5, y: 9.5 },
            { type: 'arcTrooper', x: 15.5, y: 9.5 },
            { type: 'teslaBaron', x: 9.5, y: 7.5 }
        ],
        pickups: [
            { type: 'redKey', x: 9.5, y: 5.5 },
            { type: 'fullGear', x: 2.5, y: 5.5 },
            { type: 'fullGear', x: 15.5, y: 5.5 },
            { type: 'medkit', x: 9.5, y: 10.5 },
            { type: 'ammo3', x: 5.5, y: 7.5 },
            { type: 'ammo4', x: 12.5, y: 7.5 }
        ],
        doors: [
            { x: 5, y: 3, vertical: true, locked: false },
            { x: 12, y: 3, vertical: true, locked: false },
            { x: 8, y: 4, vertical: false, locked: true, key: 'red' },
            { x: 8, y: 10, vertical: false, locked: false }
        ]
    },

    // E1M7: Generator Core
    {
        name: 'E1M7: GENERATOR CORE',
        map: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1],
            [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
            [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
            [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
            [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
            [1,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,1,2,2,1],
            [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ],
        start: { x: 2.5, y: 1.5, angle: 0 },
        enemies: [
            { type: 'sparkImp', x: 7.5, y: 5.5 },
            { type: 'sparkImp', x: 12.5, y: 5.5 },
            { type: 'circuitDemon', x: 6.5, y: 6.5 },
            { type: 'circuitDemon', x: 13.5, y: 6.5 },
            { type: 'voltageSpectre', x: 9.5, y: 5.5 },
            { type: 'voltageSpectre', x: 10.5, y: 6.5 },
            { type: 'arcTrooper', x: 7.5, y: 10.5 },
            { type: 'arcTrooper', x: 12.5, y: 10.5 },
            { type: 'teslaBaron', x: 6.5, y: 10.5 },
            { type: 'teslaBaron', x: 13.5, y: 10.5 },
            { type: 'teslaBaron', x: 10.5, y: 10.5 }
        ],
        pickups: [
            { type: 'blueKey', x: 10.5, y: 5.5 },
            { type: 'weapon5', x: 9.5, y: 1.5 },
            { type: 'fullGear', x: 2.5, y: 10.5 },
            { type: 'fullGear', x: 17.5, y: 10.5 },
            { type: 'ammo5', x: 5.5, y: 5.5 },
            { type: 'ammo5', x: 14.5, y: 5.5 },
            { type: 'medkit', x: 9.5, y: 10.5 }
        ],
        doors: [
            { x: 9, y: 1, vertical: false, locked: false },
            { x: 10, y: 1, vertical: false, locked: false },
            { x: 1, y: 8, vertical: false, locked: true, key: 'blue' },
            { x: 2, y: 8, vertical: false, locked: true, key: 'blue' },
            { x: 17, y: 8, vertical: false, locked: true, key: 'blue' }
        ]
    },

    // E1M8: Control Room Chaos
    {
        name: 'E1M8: CONTROL ROOM',
        map: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
            [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
            [1,0,1,0,1,1,1,1,1,1,1,1,1,1,0,1,0,1],
            [1,0,1,0,1,0,0,0,0,0,0,0,0,1,0,1,0,1],
            [1,0,1,0,1,0,0,0,0,0,0,0,0,1,0,1,0,1],
            [1,0,1,0,1,0,0,0,0,0,0,0,0,1,0,1,0,1],
            [1,0,1,0,1,1,1,1,1,1,1,1,1,1,0,1,0,1],
            [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
            [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ],
        start: { x: 2.5, y: 1.5, angle: 0 },
        enemies: [
            { type: 'circuitDemon', x: 6.5, y: 3.5 },
            { type: 'circuitDemon', x: 11.5, y: 3.5 },
            { type: 'voltageSpectre', x: 8.5, y: 5.5 },
            { type: 'voltageSpectre', x: 9.5, y: 5.5 },
            { type: 'arcTrooper', x: 6.5, y: 6.5 },
            { type: 'arcTrooper', x: 11.5, y: 6.5 },
            { type: 'arcTrooper', x: 8.5, y: 7.5 },
            { type: 'teslaBaron', x: 6.5, y: 9.5 },
            { type: 'teslaBaron', x: 11.5, y: 9.5 },
            { type: 'teslaBaron', x: 8.5, y: 9.5 },
            { type: 'teslaBaron', x: 9.5, y: 9.5 }
        ],
        pickups: [
            { type: 'redKey', x: 8.5, y: 6.5 },
            { type: 'fullGear', x: 2.5, y: 3.5 },
            { type: 'fullGear', x: 15.5, y: 3.5 },
            { type: 'fullGear', x: 2.5, y: 9.5 },
            { type: 'fullGear', x: 15.5, y: 9.5 },
            { type: 'ammo5', x: 7.5, y: 6.5 },
            { type: 'ammo5', x: 10.5, y: 6.5 },
            { type: 'medkit', x: 8.5, y: 1.5 },
            { type: 'medkit', x: 9.5, y: 1.5 }
        ],
        doors: [
            { x: 8, y: 1, vertical: true, locked: true, key: 'red' },
            { x: 9, y: 1, vertical: true, locked: true, key: 'red' }
        ]
    },

    // E1M9: Master Breaker (Boss Level)
    {
        name: 'E1M9: MASTER BREAKER',
        map: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1],
            [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
            [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
            [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
            [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
            [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
            [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
            [1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ],
        start: { x: 2.5, y: 2.5, angle: 0 },
        enemies: [
            { type: 'masterBreaker', x: 11.5, y: 7.5 },
            { type: 'teslaBaron', x: 7.5, y: 5.5 },
            { type: 'teslaBaron', x: 15.5, y: 5.5 },
            { type: 'teslaBaron', x: 7.5, y: 9.5 },
            { type: 'teslaBaron', x: 15.5, y: 9.5 },
            { type: 'arcTrooper', x: 9.5, y: 5.5 },
            { type: 'arcTrooper', x: 13.5, y: 5.5 },
            { type: 'arcTrooper', x: 9.5, y: 9.5 },
            { type: 'arcTrooper', x: 13.5, y: 9.5 }
        ],
        pickups: [
            { type: 'fullGear', x: 2.5, y: 5.5 },
            { type: 'fullGear', x: 19.5, y: 5.5 },
            { type: 'fullGear', x: 2.5, y: 9.5 },
            { type: 'fullGear', x: 19.5, y: 9.5 },
            { type: 'medkit', x: 2.5, y: 7.5 },
            { type: 'medkit', x: 19.5, y: 7.5 },
            { type: 'ammo5', x: 11.5, y: 2.5 },
            { type: 'ammo5', x: 11.5, y: 11.5 },
            { type: 'ammo4', x: 6.5, y: 7.5 },
            { type: 'ammo4', x: 16.5, y: 7.5 }
        ],
        doors: []
    }
];

// Current level data
let currentLevelData = null;
let enemies = [];
let pickups = [];
let doors = [];
let projectiles = [];
let particles = [];

// Input State
const keys = {};
let mouseX = 0;
let mouseY = 0;
let mouseLocked = false;

// Rendering buffers
const depthBuffer = new Float32Array(SCREEN_WIDTH);
// Pre-allocate a screen image buffer for floor/ceiling
let screenBuffer = null;
let screenData = null;

// Minimap
const minimapCanvas = document.getElementById('minimap');
const minimapCtx = minimapCanvas.getContext('2d');

// UI Elements
const startScreen = document.getElementById('start-screen');
const levelCompleteScreen = document.getElementById('level-complete-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const victoryScreen = document.getElementById('victory-screen');
const nameEntryScreen = document.getElementById('name-entry-screen');
const hud = document.getElementById('hud');
const mobileControls = document.getElementById('mobile-controls');
const messageDisplay = document.getElementById('message-display');
const playerNameInput = document.getElementById('player-name-input');
const damageOverlay = document.getElementById('damage-overlay');

// ====================================
// INITIALIZATION
// ====================================

generateTextures();

// Create screen buffer for floor/ceiling rendering
screenBuffer = ctx.createImageData(SCREEN_WIDTH, SCREEN_HEIGHT);
screenData = screenBuffer.data;

// ====================================
// EVENT LISTENERS
// ====================================

document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('next-level-btn').addEventListener('click', nextLevel);
document.getElementById('restart-btn').addEventListener('click', restartLevel);
document.getElementById('main-menu-btn').addEventListener('click', showMainMenu);
document.getElementById('play-again-btn').addEventListener('click', startGame);
document.getElementById('submit-name-btn').addEventListener('click', submitName);

playerNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitName();
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;

    if (e.key === 'Escape') {
        if (document.pointerLockElement) {
            document.exitPointerLock();
        }
    }

    if (e.key === 'Enter') {
        if (gameState === 'menu') startGame();
        else if (gameState === 'levelComplete') nextLevel();
        else if (gameState === 'gameOver') restartLevel();
        else if (gameState === 'victory') startGame();
    }

    // Weapon switching
    if (e.key >= '1' && e.key <= '6') {
        const weaponIndex = parseInt(e.key) - 1;
        if (player.weapons[weaponIndex]) {
            player.currentWeapon = weaponIndex;
            updateHUD();
        }
    }

    // Toggle minimap
    if (e.key.toLowerCase() === 'm' && gameState === 'playing') {
        showMinimap = !showMinimap;
        minimapCanvas.classList.toggle('visible', showMinimap);
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// Mouse controls
canvas.addEventListener('click', () => {
    if (gameState === 'playing') {
        if (mouseLocked) {
            // Fire on click when locked
            if (weaponCooldown <= 0) {
                shoot();
                weaponCooldown = weapons[player.currentWeapon].fireRate;
            }
        } else {
            canvas.requestPointerLock();
        }
    }
});

document.addEventListener('pointerlockchange', () => {
    mouseLocked = document.pointerLockElement === canvas;
});

document.addEventListener('mousemove', (e) => {
    if (mouseLocked && gameState === 'playing') {
        player.angle += e.movementX * 0.002;
    }
});

// Mobile controls
if ('ontouchstart' in window) {
    mobileControls.classList.remove('hidden');

    const setupButton = (id, action) => {
        const btn = document.getElementById(id);
        if (!btn) return;
        btn.addEventListener('touchstart', (e) => { e.preventDefault(); action(true); }, { passive: false });
        btn.addEventListener('touchend', (e) => { e.preventDefault(); action(false); }, { passive: false });
        btn.addEventListener('touchcancel', (e) => { e.preventDefault(); action(false); }, { passive: false });
    };

    setupButton('btn-forward', (down) => keys['w'] = down);
    setupButton('btn-backward', (down) => keys['s'] = down);
    setupButton('btn-left', (down) => keys['arrowleft'] = down);
    setupButton('btn-right', (down) => keys['arrowright'] = down);
    setupButton('btn-strafe-left', (down) => keys['a'] = down);
    setupButton('btn-strafe-right', (down) => keys['d'] = down);
    setupButton('btn-shoot', (down) => keys[' '] = down);
    setupButton('btn-use', (down) => keys['e'] = down);
}

// ====================================
// GAME STATE FUNCTIONS
// ====================================

function startGame() {
    currentLevel = 1;
    totalKills = 0;
    totalItems = 0;
    totalSecrets = 0;
    gameTime = 0;

    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    victoryScreen.classList.add('hidden');
    nameEntryScreen.classList.add('hidden');

    loadLevel(1);
}

function loadLevel(levelNum) {
    currentLevel = levelNum;
    currentLevelData = levels[levelNum - 1];

    player.x = currentLevelData.start.x;
    player.y = currentLevelData.start.y;
    player.angle = currentLevelData.start.angle;

    if (levelNum === 1) {
        player.health = 100;
        player.armor = 0;
        player.currentWeapon = 0;
        player.weapons = [true, false, false, false, false, false];
        player.ammo = [999, 0, 0, 0, 0, 0];
        player.keys = { yellow: false, red: false, blue: false };
    } else {
        player.health = 100;
        player.keys = { yellow: false, red: false, blue: false };
    }

    player.kills = 0;
    player.items = 0;
    player.secrets = 0;
    player.damageFlash = 0;
    player.pickupFlash = 0;

    enemies = currentLevelData.enemies.map(e => ({
        ...enemyTypes[e.type],
        typeName: e.type,
        x: e.x,
        y: e.y,
        alive: true,
        shootTimer: Math.random() * 30,
        hitFlash: 0,
        deathTimer: 0,
        alertDistance: 12,
        alerted: false
    }));

    pickups = currentLevelData.pickups.map(p => ({
        ...pickupTypes[p.type],
        x: p.x,
        y: p.y,
        pickupType: p.type,
        collected: false,
        bobPhase: Math.random() * Math.PI * 2
    }));

    doors = currentLevelData.doors.map(d => ({
        ...d,
        open: false,
        opening: false,
        openAmount: 0
    }));

    projectiles = [];
    particles = [];
    weaponCooldown = 0;
    weaponFireAnim = 0;
    muzzleFlashIntensity = 0;
    levelStartTime = Date.now();
    gameState = 'playing';

    startScreen.classList.add('hidden');
    levelCompleteScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    victoryScreen.classList.add('hidden');
    hud.classList.remove('hidden');
    if (showMinimap) minimapCanvas.classList.add('visible');

    updateHUD();
    showMessage(currentLevelData.name);
    requestAnimationFrame(gameLoop);
}

function nextLevel() {
    levelCompleteScreen.classList.add('hidden');
    if (currentLevel >= levels.length) {
        showVictory();
    } else {
        loadLevel(currentLevel + 1);
    }
}

function restartLevel() {
    gameOverScreen.classList.add('hidden');
    loadLevel(currentLevel);
}

function showMainMenu() {
    gameState = 'menu';
    hud.classList.add('hidden');
    minimapCanvas.classList.remove('visible');
    gameOverScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    if (document.pointerLockElement) document.exitPointerLock();
}

function showVictory() {
    gameState = 'victory';
    hud.classList.add('hidden');
    minimapCanvas.classList.remove('visible');
    if (document.pointerLockElement) document.exitPointerLock();

    if (isTopScore(currentLevel, totalKills, gameTime)) {
        document.getElementById('name-entry-level').textContent = 'E1M' + currentLevel;
        document.getElementById('name-entry-kills').textContent = totalKills;
        document.getElementById('name-entry-time').textContent = formatTime(gameTime);
        nameEntryScreen.classList.remove('hidden');
        setTimeout(() => playerNameInput.focus(), 100);
    } else {
        document.getElementById('victory-kills').textContent = totalKills;
        document.getElementById('victory-items').textContent = totalItems;
        document.getElementById('victory-secrets').textContent = totalSecrets;
        document.getElementById('victory-time').textContent = formatTime(gameTime);
        victoryScreen.classList.remove('hidden');
    }
}

function submitName() {
    const name = playerNameInput.value.trim();
    if (name) {
        saveToLeaderboard(name.substring(0, 20), currentLevel, totalKills, gameTime);
        nameEntryScreen.classList.add('hidden');
        document.getElementById('victory-kills').textContent = totalKills;
        document.getElementById('victory-items').textContent = totalItems;
        document.getElementById('victory-secrets').textContent = totalSecrets;
        document.getElementById('victory-time').textContent = formatTime(gameTime);
        victoryScreen.classList.remove('hidden');
        playerNameInput.value = '';
    }
}

function levelComplete() {
    gameState = 'levelComplete';
    if (document.pointerLockElement) document.exitPointerLock();

    const levelTime = Math.floor((Date.now() - levelStartTime) / 1000);
    totalKills += player.kills;
    totalItems += player.items;
    totalSecrets += player.secrets;
    gameTime += levelTime;

    const totalEnemies = enemies.length;
    const totalPickups = pickups.length;

    document.getElementById('completed-level').textContent = currentLevelData.name;
    document.getElementById('kill-count').textContent = player.kills + ' / ' + totalEnemies;
    document.getElementById('item-count').textContent = player.items + ' / ' + totalPickups;
    document.getElementById('secret-count').textContent = player.secrets + ' / 0';
    document.getElementById('level-time').textContent = formatTime(levelTime);

    levelCompleteScreen.classList.remove('hidden');
}

function gameOver() {
    gameState = 'gameOver';
    if (document.pointerLockElement) document.exitPointerLock();

    document.getElementById('final-level').textContent = currentLevelData.name;
    document.getElementById('total-kills').textContent = totalKills + player.kills;

    setTimeout(() => {
        gameOverScreen.classList.remove('hidden');
    }, 1000);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

function showMessage(text, duration = 3000) {
    messageDisplay.textContent = text;
    messageDisplay.classList.remove('hidden');
    setTimeout(() => {
        messageDisplay.classList.add('hidden');
    }, duration);
}

function updateHUD() {
    document.getElementById('health-value').textContent = Math.max(0, Math.floor(player.health));
    document.getElementById('health-fill').style.width = Math.max(0, player.health) + '%';

    document.getElementById('armor-value').textContent = Math.floor(player.armor);
    document.getElementById('armor-fill').style.width = Math.min(100, player.armor) + '%';

    const weapon = weapons[player.currentWeapon];
    document.getElementById('weapon-name').textContent = weapon.name;
    document.getElementById('ammo-count').textContent = weapon.infinite ? 'INF' : player.ammo[player.currentWeapon];

    // Keys - toggle active class on key slots
    document.getElementById('yellow-key').classList.toggle('active', player.keys.yellow);
    document.getElementById('red-key').classList.toggle('active', player.keys.red);
    document.getElementById('blue-key').classList.toggle('active', player.keys.blue);

    document.getElementById('level-name').textContent = currentLevelData.name;

    const faceDisplay = document.getElementById('face-display');
    if (player.health > 75) faceDisplay.textContent = ':)';
    else if (player.health > 50) faceDisplay.textContent = ':|';
    else if (player.health > 25) faceDisplay.textContent = ':/';
    else faceDisplay.textContent = 'X(';
}

// ====================================
// IMPROVED RAYCASTING ENGINE
// ====================================

function castRayDDA(angle) {
    const map = currentLevelData.map;
    const sinA = Math.sin(angle);
    const cosA = Math.cos(angle);

    // DDA algorithm for precise wall hits
    let mapX = Math.floor(player.x);
    let mapY = Math.floor(player.y);

    const deltaDistX = Math.abs(1 / cosA) || 1e10;
    const deltaDistY = Math.abs(1 / sinA) || 1e10;

    let stepX, stepY;
    let sideDistX, sideDistY;

    if (cosA < 0) {
        stepX = -1;
        sideDistX = (player.x - mapX) * deltaDistX;
    } else {
        stepX = 1;
        sideDistX = (mapX + 1.0 - player.x) * deltaDistX;
    }
    if (sinA < 0) {
        stepY = -1;
        sideDistY = (player.y - mapY) * deltaDistY;
    } else {
        stepY = 1;
        sideDistY = (mapY + 1.0 - player.y) * deltaDistY;
    }

    let side = 0; // 0 = E/W hit, 1 = N/S hit
    let depth = 0;
    let wallType = 1;
    let hitDoor = false;
    let texX = 0;

    for (let step = 0; step < 100; step++) {
        if (sideDistX < sideDistY) {
            sideDistX += deltaDistX;
            mapX += stepX;
            side = 0;
        } else {
            sideDistY += deltaDistY;
            mapY += stepY;
            side = 1;
        }

        if (mapX < 0 || mapX >= map[0].length || mapY < 0 || mapY >= map.length) {
            depth = MAX_DEPTH;
            break;
        }

        const cell = map[mapY][mapX];

        // Check doors
        const door = doors.find(d => d.x === mapX && d.y === mapY);
        if (door) {
            if (side === 0) {
                depth = sideDistX - deltaDistX;
            } else {
                depth = sideDistY - deltaDistY;
            }
            const hitX = player.x + cosA * depth;
            const hitY = player.y + sinA * depth;
            const doorPos = door.vertical ? hitX - mapX : hitY - mapY;
            if (doorPos > door.openAmount) {
                hitDoor = true;
                wallType = door.locked ? 3 : 2;
                texX = doorPos;
                break;
            }
            continue;
        }

        if (cell > 0 && cell !== 9) {
            wallType = cell;
            if (side === 0) {
                depth = sideDistX - deltaDistX;
                texX = player.y + sinA * depth;
            } else {
                depth = sideDistY - deltaDistY;
                texX = player.x + cosA * depth;
            }
            texX = texX - Math.floor(texX);
            break;
        } else if (cell === 9) {
            wallType = 9;
            if (side === 0) {
                depth = sideDistX - deltaDistX;
                texX = player.y + sinA * depth;
            } else {
                depth = sideDistY - deltaDistY;
                texX = player.x + cosA * depth;
            }
            texX = texX - Math.floor(texX);
            break;
        }
    }

    if (depth === 0) depth = MAX_DEPTH;

    return { depth, wallType, side, hitDoor, texX };
}

// ====================================
// RENDERING
// ====================================

function render() {
    const time = Date.now() * 0.001;

    // Clear the screen buffer
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Draw gradient ceiling
    const ceilGrad = ctx.createLinearGradient(0, 0, 0, SCREEN_HEIGHT / 2);
    ceilGrad.addColorStop(0, '#050510');
    ceilGrad.addColorStop(0.5, '#0a0a1e');
    ceilGrad.addColorStop(1, '#16213e');
    ctx.fillStyle = ceilGrad;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT / 2);

    // Draw gradient floor
    const floorGrad = ctx.createLinearGradient(0, SCREEN_HEIGHT / 2, 0, SCREEN_HEIGHT);
    floorGrad.addColorStop(0, '#1a1a2e');
    floorGrad.addColorStop(0.4, '#222235');
    floorGrad.addColorStop(1, '#2a2a3e');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, SCREEN_HEIGHT / 2, SCREEN_WIDTH, SCREEN_HEIGHT / 2);

    // Muzzle flash ambient lighting on floor/ceiling
    if (muzzleFlashIntensity > 0) {
        const flashAlpha = muzzleFlashIntensity * 0.15;
        const weapon = weapons[player.currentWeapon];
        ctx.fillStyle = weapon.flashColor;
        ctx.globalAlpha = flashAlpha;
        ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        ctx.globalAlpha = 1;
    }

    // Cast rays and render walls
    for (let ray = 0; ray < NUM_RAYS; ray++) {
        const rayAngle = player.angle - HALF_FOV + ray * DELTA_ANGLE;
        const hit = castRayDDA(rayAngle);

        // Correct for fish-eye
        const correctedDepth = hit.depth * Math.cos(rayAngle - player.angle);
        depthBuffer[ray] = correctedDepth;

        // Wall height
        const wallHeight = (SCREEN_HEIGHT / correctedDepth) * 0.55;
        const wallTop = (SCREEN_HEIGHT - wallHeight) / 2;

        // Select texture
        const texKey = hit.side === 1 ? hit.wallType + '_dark' : hit.wallType;
        const tex = textures[texKey] || textures[hit.wallType];

        if (tex) {
            // Sample texture column
            const texXPixel = Math.floor(hit.texX * TEXTURE_SIZE) % TEXTURE_SIZE;

            // Distance fog factor
            const fogFactor = Math.max(0.08, 1.0 - (correctedDepth / MAX_DEPTH));

            // Muzzle flash lighting on walls
            let flashBoost = 0;
            if (muzzleFlashIntensity > 0 && correctedDepth < 6) {
                flashBoost = muzzleFlashIntensity * (1 - correctedDepth / 6) * 0.5;
            }

            const brightness = Math.min(1, fogFactor + flashBoost);

            // Draw textured wall strip
            ctx.save();
            ctx.imageSmoothingEnabled = false;
            ctx.globalAlpha = brightness;
            ctx.drawImage(
                tex,
                texXPixel, 0, 1, TEXTURE_SIZE,
                ray, wallTop, 1, wallHeight
            );
            ctx.globalAlpha = 1;
            ctx.restore();

            // Add fog overlay for depth
            if (fogFactor < 0.9) {
                ctx.fillStyle = 'rgba(5, 5, 16, ' + (1 - fogFactor) * 0.7 + ')';
                ctx.fillRect(ray, wallTop, 1, wallHeight);
            }
        }
    }

    // Draw sprites
    drawSprites(time);

    // Draw projectile trails
    drawProjectiles();

    // Draw particles
    drawParticles();

    // Draw weapon in first person
    drawWeapon(time);

    // Damage vignette overlay
    if (player.damageFlash > 0) {
        ctx.save();
        const grad = ctx.createRadialGradient(
            SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, SCREEN_WIDTH * 0.2,
            SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, SCREEN_WIDTH * 0.7
        );
        grad.addColorStop(0, 'rgba(255, 0, 0, 0)');
        grad.addColorStop(1, 'rgba(200, 0, 0, ' + (player.damageFlash * 0.5) + ')');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        ctx.restore();
    }

    // Pickup flash
    if (player.pickupFlash > 0) {
        ctx.save();
        ctx.fillStyle = player.pickupFlashColor;
        ctx.globalAlpha = player.pickupFlash * 0.15;
        ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        ctx.restore();
    }

    // Draw minimap
    if (showMinimap && gameState === 'playing') {
        drawMinimap();
    }
}

function drawSprites(time) {
    const sprites = [];

    // Add alive enemies
    enemies.forEach(enemy => {
        if (!enemy.alive && enemy.deathTimer <= 0) return;
        const dx = enemy.x - player.x;
        const dy = enemy.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) - player.angle;

        sprites.push({
            distance,
            angle,
            size: enemy.size,
            color: enemy.color,
            bodyColor: enemy.bodyColor || enemy.color,
            invisible: enemy.invisible,
            isEnemy: true,
            hitFlash: enemy.hitFlash || 0,
            alive: enemy.alive,
            deathTimer: enemy.deathTimer || 0,
            boss: enemy.boss,
            data: enemy
        });
    });

    // Add pickups with bobbing
    pickups.forEach(pickup => {
        if (pickup.collected) return;
        const dx = pickup.x - player.x;
        const dy = pickup.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) - player.angle;

        sprites.push({
            distance,
            angle,
            size: pickup.size,
            color: pickup.color,
            isPickup: true,
            bobPhase: pickup.bobPhase,
            data: pickup
        });
    });

    // Sort far to near
    sprites.sort((a, b) => b.distance - a.distance);

    sprites.forEach(sprite => {
        let spriteAngle = sprite.angle;
        while (spriteAngle > Math.PI) spriteAngle -= 2 * Math.PI;
        while (spriteAngle < -Math.PI) spriteAngle += 2 * Math.PI;

        if (Math.abs(spriteAngle) < HALF_FOV + 0.5) {
            const spriteHeight = (SCREEN_HEIGHT / sprite.distance) * sprite.size;
            const spriteWidth = spriteHeight;
            const spriteX = (SCREEN_WIDTH / 2) + (spriteAngle / HALF_FOV) * (SCREEN_WIDTH / 2) - spriteWidth / 2;
            let spriteY = (SCREEN_HEIGHT - spriteHeight) / 2;

            // Bobbing for pickups
            if (sprite.isPickup) {
                spriteY += Math.sin(time * 3 + sprite.bobPhase) * (spriteHeight * 0.05);
            }

            // Check depth buffer visibility
            const xStart = Math.max(0, Math.floor(spriteX));
            const xEnd = Math.min(SCREEN_WIDTH, Math.ceil(spriteX + spriteWidth));
            let visibleCols = 0;
            for (let x = xStart; x < xEnd; x++) {
                if (sprite.distance < depthBuffer[x]) visibleCols++;
            }

            if (visibleCols > 0) {
                const brightness = Math.max(0.15, 1 - (sprite.distance / MAX_DEPTH));

                // Clip to visible columns
                ctx.save();
                ctx.beginPath();
                for (let x = xStart; x < xEnd; x++) {
                    if (sprite.distance < depthBuffer[x]) {
                        ctx.rect(x, 0, 1, SCREEN_HEIGHT);
                    }
                }
                ctx.clip();

                if (sprite.isPickup) {
                    drawPickupSprite(spriteX, spriteY, spriteWidth, spriteHeight, sprite, brightness, time);
                } else {
                    drawEnemySprite(spriteX, spriteY, spriteWidth, spriteHeight, sprite, brightness, time);
                }

                ctx.restore();
            }
        }
    });
}

function drawPickupSprite(x, y, w, h, sprite, brightness, time) {
    const pickup = sprite.data;
    const glowAlpha = 0.3 + Math.sin(time * 4 + (sprite.bobPhase || 0)) * 0.15;

    ctx.globalAlpha = brightness;

    // Glow effect behind pickup
    ctx.fillStyle = sprite.color;
    ctx.globalAlpha = brightness * glowAlpha * 0.3;
    ctx.beginPath();
    ctx.arc(x + w/2, y + h/2, w * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = brightness;

    // Draw the pickup shape
    ctx.fillStyle = sprite.color;

    if (pickup.type === 'health') {
        // Health cross
        const cw = w * 0.15;
        ctx.fillRect(x + w/2 - cw, y + h * 0.2, cw * 2, h * 0.6);
        ctx.fillRect(x + w * 0.2, y + h/2 - cw, w * 0.6, cw * 2);
    } else if (pickup.type === 'armor') {
        // Shield shape
        ctx.beginPath();
        ctx.moveTo(x + w/2, y + h * 0.15);
        ctx.lineTo(x + w * 0.8, y + h * 0.3);
        ctx.lineTo(x + w * 0.75, y + h * 0.7);
        ctx.lineTo(x + w/2, y + h * 0.85);
        ctx.lineTo(x + w * 0.25, y + h * 0.7);
        ctx.lineTo(x + w * 0.2, y + h * 0.3);
        ctx.closePath();
        ctx.fill();
    } else if (pickup.type === 'key') {
        // Key shape
        const kw = w * 0.12;
        ctx.beginPath();
        ctx.arc(x + w * 0.3, y + h * 0.4, w * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(x + w * 0.4, y + h * 0.4 - kw/2, w * 0.4, kw);
        ctx.fillRect(x + w * 0.7, y + h * 0.4 - kw, kw, kw * 2);
        ctx.fillRect(x + w * 0.6, y + h * 0.4 - kw, kw, kw * 2);
    } else if (pickup.type === 'ammo') {
        // Ammo box
        ctx.fillRect(x + w * 0.2, y + h * 0.25, w * 0.6, h * 0.5);
        ctx.fillStyle = '#000';
        ctx.fillRect(x + w * 0.25, y + h * 0.3, w * 0.5, h * 0.4);
        ctx.fillStyle = sprite.color;
        ctx.fillRect(x + w * 0.35, y + h * 0.4, w * 0.3, h * 0.2);
    } else if (pickup.type === 'weapon') {
        // Weapon on pedestal
        ctx.fillRect(x + w * 0.15, y + h * 0.3, w * 0.7, h * 0.15);
        ctx.fillRect(x + w * 0.3, y + h * 0.2, w * 0.4, h * 0.1);
        ctx.fillStyle = '#000';
        ctx.font = Math.max(8, w * 0.3) + 'px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pickup.symbol || 'W', x + w/2, y + h * 0.6);
    }

    ctx.globalAlpha = 1;
}

function drawEnemySprite(x, y, w, h, sprite, brightness, time) {
    const enemy = sprite.data;
    let alpha = sprite.invisible ? 0.25 + Math.sin(time * 2) * 0.1 : 1.0;

    // Death animation
    if (!sprite.alive) {
        const deathProgress = 1 - (sprite.deathTimer / 30);
        alpha *= (1 - deathProgress);
        y += h * deathProgress * 0.3;
        h *= (1 - deathProgress * 0.3);
    }

    ctx.globalAlpha = brightness * alpha;

    // Hit flash - make sprite white
    if (sprite.hitFlash > 0) {
        ctx.globalAlpha = Math.min(1, brightness * alpha + 0.5);
    }

    const bodyColor = sprite.hitFlash > 0 ? '#FFFFFF' : sprite.bodyColor;
    const headColor = sprite.hitFlash > 0 ? '#FFFFFF' : sprite.color;

    // Shadow beneath
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(x + w/2, y + h * 0.95, w * 0.3, h * 0.03, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = bodyColor;
    const bodyW = w * 0.5;
    const bodyH = h * 0.45;
    ctx.fillRect(x + w/2 - bodyW/2, y + h * 0.35, bodyW, bodyH);

    // Head
    ctx.fillStyle = headColor;
    const headSize = w * 0.3;
    ctx.fillRect(x + w/2 - headSize/2, y + h * 0.12, headSize, headSize);

    // Eyes
    if (sprite.hitFlash <= 0) {
        ctx.fillStyle = '#FF0000';
        const eyeSize = Math.max(2, w * 0.06);
        ctx.fillRect(x + w/2 - headSize * 0.25, y + h * 0.18, eyeSize, eyeSize);
        ctx.fillRect(x + w/2 + headSize * 0.1, y + h * 0.18, eyeSize, eyeSize);

        // Eye glow
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(x + w/2 - headSize * 0.2, y + h * 0.19, eyeSize * 1.5, 0, Math.PI * 2);
        ctx.arc(x + w/2 + headSize * 0.15, y + h * 0.19, eyeSize * 1.5, 0, Math.PI * 2);
        ctx.fill();
    }

    // Arms
    ctx.fillStyle = bodyColor;
    const armW = w * 0.08;
    ctx.fillRect(x + w/2 - bodyW/2 - armW, y + h * 0.38, armW, h * 0.3);
    ctx.fillRect(x + w/2 + bodyW/2, y + h * 0.38, armW, h * 0.3);

    // Legs
    const legW = w * 0.12;
    ctx.fillRect(x + w/2 - bodyW * 0.3, y + h * 0.78, legW, h * 0.15);
    ctx.fillRect(x + w/2 + bodyW * 0.1, y + h * 0.78, legW, h * 0.15);

    // Boss crown
    if (sprite.boss && sprite.hitFlash <= 0) {
        ctx.fillStyle = '#FFD700';
        const crownW = headSize * 1.2;
        ctx.fillRect(x + w/2 - crownW/2, y + h * 0.06, crownW, h * 0.06);
        // Crown points
        for (let i = 0; i < 3; i++) {
            const px = x + w/2 - crownW/2 + crownW * (i + 0.5) / 3;
            ctx.fillRect(px - 2, y + h * 0.02, 4, h * 0.04);
        }
    }

    ctx.globalAlpha = 1;
}

function drawProjectiles() {
    projectiles.forEach(p => {
        const dx = p.x - player.x;
        const dy = p.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) - player.angle;

        let pAngle = angle;
        while (pAngle > Math.PI) pAngle -= 2 * Math.PI;
        while (pAngle < -Math.PI) pAngle += 2 * Math.PI;

        if (Math.abs(pAngle) < HALF_FOV + 0.3 && distance < MAX_DEPTH) {
            const screenX = (SCREEN_WIDTH / 2) + (pAngle / HALF_FOV) * (SCREEN_WIDTH / 2);
            const screenY = SCREEN_HEIGHT / 2;
            const size = Math.max(3, (SCREEN_HEIGHT / distance) * 0.08);

            const sx = Math.floor(screenX);
            if (sx >= 0 && sx < SCREEN_WIDTH && distance < depthBuffer[sx]) {
                // Glow
                ctx.save();
                ctx.globalAlpha = 0.3;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(screenX, screenY, size * 3, 0, Math.PI * 2);
                ctx.fill();

                // Core
                ctx.globalAlpha = 1;
                ctx.fillStyle = '#FFF';
                ctx.beginPath();
                ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(screenX, screenY, size * 1.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
    });
}

function drawParticles() {
    particles.forEach(p => {
        const dx = p.x - player.x;
        const dy = p.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) - player.angle;

        let pAngle = angle;
        while (pAngle > Math.PI) pAngle -= 2 * Math.PI;
        while (pAngle < -Math.PI) pAngle += 2 * Math.PI;

        if (Math.abs(pAngle) < HALF_FOV + 0.3 && distance < MAX_DEPTH && distance > 0.1) {
            const size = Math.max(1, (SCREEN_HEIGHT / distance) * 0.04);
            const sx = (SCREEN_WIDTH / 2) + (pAngle / HALF_FOV) * (SCREEN_WIDTH / 2);
            const sy = (SCREEN_HEIGHT / 2) + ((p.z - 0.5) / distance) * SCREEN_HEIGHT;

            const screenX = Math.floor(sx);
            if (screenX >= 0 && screenX < SCREEN_WIDTH && distance < depthBuffer[screenX]) {
                const fadeAlpha = Math.min(1, p.life / 15);
                ctx.globalAlpha = fadeAlpha;
                ctx.fillStyle = p.color;
                ctx.fillRect(sx - size/2, sy - size/2, size, size);
                ctx.globalAlpha = 1;
            }
        }
    });
}

function drawWeapon(time) {
    const weapon = weapons[player.currentWeapon];
    const bobX = Math.sin(player.bobPhase) * 8;
    const bobY = Math.abs(Math.cos(player.bobPhase)) * 5;

    const wpnX = SCREEN_WIDTH / 2 + bobX;
    const wpnY = SCREEN_HEIGHT - 140 + bobY;

    // Fire animation kick
    let fireKick = 0;
    if (weaponFireAnim > 0) {
        fireKick = weaponFireAnim * 3;
    }

    const drawY = wpnY + fireKick;

    // Muzzle flash
    if (weaponFireAnim > 3) {
        ctx.save();
        const flashSize = 40 + Math.random() * 20;
        const grad = ctx.createRadialGradient(wpnX, drawY - 40, 0, wpnX, drawY - 40, flashSize);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        grad.addColorStop(0.3, weapon.flashColor);
        grad.addColorStop(1, 'rgba(255, 200, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(wpnX, drawY - 40, flashSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // Draw weapon based on type
    ctx.save();
    ctx.fillStyle = '#333';
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 2;

    switch (player.currentWeapon) {
        case 0: // Voltage Tester - simple probe
            ctx.fillStyle = '#666';
            ctx.fillRect(wpnX - 4, drawY - 60, 8, 80);
            ctx.fillStyle = weapon.color;
            ctx.fillRect(wpnX - 6, drawY - 65, 12, 10);
            ctx.fillStyle = '#444';
            ctx.fillRect(wpnX - 12, drawY + 10, 24, 30);
            break;

        case 1: // Wire Strippers - dual prongs
            ctx.fillStyle = '#555';
            ctx.fillRect(wpnX - 15, drawY - 50, 8, 70);
            ctx.fillRect(wpnX + 7, drawY - 50, 8, 70);
            ctx.fillStyle = weapon.color;
            ctx.fillRect(wpnX - 17, drawY - 55, 12, 8);
            ctx.fillRect(wpnX + 5, drawY - 55, 12, 8);
            ctx.fillStyle = '#333';
            ctx.fillRect(wpnX - 18, drawY + 15, 36, 25);
            break;

        case 2: // Power Drill - rotating barrel
            ctx.fillStyle = '#555';
            ctx.fillRect(wpnX - 8, drawY - 70, 16, 90);
            ctx.fillStyle = weapon.color;
            const drillAngle = time * 20;
            for (let i = 0; i < 4; i++) {
                const a = drillAngle + i * Math.PI / 2;
                ctx.fillRect(wpnX - 3 + Math.cos(a) * 5, drawY - 75 + Math.sin(a) * 3, 6, 6);
            }
            ctx.fillStyle = '#333';
            ctx.fillRect(wpnX - 14, drawY + 10, 28, 30);
            break;

        case 3: // Arc Welder - chunky gun
            ctx.fillStyle = '#444';
            ctx.fillRect(wpnX - 14, drawY - 55, 28, 75);
            ctx.fillStyle = weapon.color;
            ctx.fillRect(wpnX - 10, drawY - 60, 20, 8);
            ctx.fillStyle = '#2b7fbd';
            ctx.fillRect(wpnX - 16, drawY - 10, 32, 15);
            ctx.fillStyle = '#333';
            ctx.fillRect(wpnX - 10, drawY + 15, 20, 30);
            break;

        case 4: // Circuit Breaker - rocket launcher shape
            ctx.fillStyle = '#444';
            ctx.fillRect(wpnX - 16, drawY - 60, 32, 80);
            ctx.fillStyle = '#222';
            ctx.fillRect(wpnX - 10, drawY - 65, 20, 10);
            ctx.fillStyle = weapon.color;
            ctx.fillRect(wpnX - 6, drawY - 68, 12, 6);
            ctx.fillStyle = '#333';
            ctx.fillRect(wpnX - 12, drawY + 15, 24, 30);
            break;

        case 5: // Tesla Coil - elaborate device
            ctx.fillStyle = '#555';
            ctx.fillRect(wpnX - 12, drawY - 65, 24, 85);
            // Coil rings
            ctx.fillStyle = weapon.color;
            for (let i = 0; i < 5; i++) {
                const ry = drawY - 60 + i * 12;
                ctx.fillRect(wpnX - 15 - Math.sin(time * 3 + i) * 2, ry, 30 + Math.sin(time * 3 + i) * 4, 4);
            }
            // Energy ball at tip
            ctx.beginPath();
            ctx.arc(wpnX, drawY - 70, 8 + Math.sin(time * 5) * 2, 0, Math.PI * 2);
            ctx.fillStyle = weapon.flashColor;
            ctx.fill();
            ctx.fillStyle = '#333';
            ctx.fillRect(wpnX - 14, drawY + 15, 28, 30);
            break;
    }
    ctx.restore();
}

// ====================================
// MINIMAP
// ====================================

function drawMinimap() {
    const map = currentLevelData.map;
    const mmW = minimapCanvas.width;
    const mmH = minimapCanvas.height;
    const cellSize = 8;
    const offsetX = player.x * cellSize - mmW / 2;
    const offsetY = player.y * cellSize - mmH / 2;

    minimapCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    minimapCtx.fillRect(0, 0, mmW, mmH);

    // Draw map cells
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            const sx = x * cellSize - offsetX;
            const sy = y * cellSize - offsetY;
            if (sx < -cellSize || sx > mmW || sy < -cellSize || sy > mmH) continue;

            const cell = map[y][x];
            if (cell > 0 && cell !== 9) {
                minimapCtx.fillStyle = cell === 1 ? '#444' : cell === 2 ? '#886600' : '#880000';
                minimapCtx.fillRect(sx, sy, cellSize, cellSize);
            } else if (cell === 9) {
                minimapCtx.fillStyle = '#006600';
                minimapCtx.fillRect(sx, sy, cellSize, cellSize);
            }
        }
    }

    // Draw enemies
    enemies.forEach(e => {
        if (!e.alive) return;
        const ex = e.x * cellSize - offsetX;
        const ey = e.y * cellSize - offsetY;
        if (ex > 0 && ex < mmW && ey > 0 && ey < mmH) {
            minimapCtx.fillStyle = e.color;
            minimapCtx.fillRect(ex - 2, ey - 2, 4, 4);
        }
    });

    // Draw pickups
    pickups.forEach(p => {
        if (p.collected) return;
        const px = p.x * cellSize - offsetX;
        const py = p.y * cellSize - offsetY;
        if (px > 0 && px < mmW && py > 0 && py < mmH) {
            minimapCtx.fillStyle = p.color;
            minimapCtx.fillRect(px - 1, py - 1, 3, 3);
        }
    });

    // Draw player
    const px = mmW / 2;
    const py = mmH / 2;
    minimapCtx.fillStyle = '#FFD700';
    minimapCtx.beginPath();
    minimapCtx.arc(px, py, 3, 0, Math.PI * 2);
    minimapCtx.fill();

    // Player direction
    minimapCtx.strokeStyle = '#FFD700';
    minimapCtx.lineWidth = 2;
    minimapCtx.beginPath();
    minimapCtx.moveTo(px, py);
    minimapCtx.lineTo(px + Math.cos(player.angle) * 12, py + Math.sin(player.angle) * 12);
    minimapCtx.stroke();

    // FOV cone
    minimapCtx.strokeStyle = 'rgba(255, 215, 0, 0.2)';
    minimapCtx.lineWidth = 1;
    minimapCtx.beginPath();
    minimapCtx.moveTo(px, py);
    minimapCtx.lineTo(px + Math.cos(player.angle - HALF_FOV) * 30, py + Math.sin(player.angle - HALF_FOV) * 30);
    minimapCtx.moveTo(px, py);
    minimapCtx.lineTo(px + Math.cos(player.angle + HALF_FOV) * 30, py + Math.sin(player.angle + HALF_FOV) * 30);
    minimapCtx.stroke();

    // Border
    minimapCtx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
    minimapCtx.lineWidth = 1;
    minimapCtx.strokeRect(0, 0, mmW, mmH);
}

// ====================================
// GAME LOGIC
// ====================================

function update(deltaTime) {
    if (gameState !== 'playing') return;

    const moveSpeed = 0.05;
    const rotSpeed = 0.05;

    // Update bob phase when moving
    const isMoving = keys['w'] || keys['s'] || keys['a'] || keys['d'] || keys['arrowup'] || keys['arrowdown'];
    if (isMoving) {
        player.bobPhase += 0.12;
    } else {
        player.bobPhase *= 0.9;
    }

    // Rotation
    if (keys['arrowleft']) player.angle -= rotSpeed;
    if (keys['arrowright']) player.angle += rotSpeed;

    // Movement
    let newX = player.x;
    let newY = player.y;

    if (keys['w'] || keys['arrowup']) {
        newX += Math.cos(player.angle) * moveSpeed;
        newY += Math.sin(player.angle) * moveSpeed;
    }
    if (keys['s'] || keys['arrowdown']) {
        newX -= Math.cos(player.angle) * moveSpeed;
        newY -= Math.sin(player.angle) * moveSpeed;
    }
    if (keys['a']) {
        newX += Math.cos(player.angle - Math.PI / 2) * moveSpeed;
        newY += Math.sin(player.angle - Math.PI / 2) * moveSpeed;
    }
    if (keys['d']) {
        newX += Math.cos(player.angle + Math.PI / 2) * moveSpeed;
        newY += Math.sin(player.angle + Math.PI / 2) * moveSpeed;
    }

    // Sliding collision
    if (!checkWallCollision(newX, newY)) {
        player.x = newX;
        player.y = newY;
    } else {
        if (!checkWallCollision(newX, player.y)) player.x = newX;
        if (!checkWallCollision(player.x, newY)) player.y = newY;
    }

    // Check exit
    const exitCell = currentLevelData.map[Math.floor(player.y)]?.[Math.floor(player.x)];
    if (exitCell === 9) {
        levelComplete();
        return;
    }

    // Use doors
    if (keys['e']) {
        useDoor();
        keys['e'] = false;
    }

    // Shooting
    if (keys[' '] && weaponCooldown <= 0) {
        shoot();
        weaponCooldown = weapons[player.currentWeapon].fireRate;
    }

    if (weaponCooldown > 0) weaponCooldown--;

    // Weapon fire animation
    if (weaponFireAnim > 0) weaponFireAnim--;
    if (muzzleFlashIntensity > 0) muzzleFlashIntensity -= 0.15;

    // Decay flashes
    if (player.damageFlash > 0) player.damageFlash -= 0.05;
    if (player.pickupFlash > 0) player.pickupFlash -= 0.08;

    // Update game entities
    updateEnemies();
    updateProjectiles();
    updateParticles();
    updateDoors();
    checkPickups();

    // Check death
    if (player.health <= 0) {
        gameOver();
    }
}

function checkWallCollision(x, y) {
    const map = currentLevelData.map;
    const margin = 0.2;
    const corners = [
        [x - margin, y - margin],
        [x + margin, y - margin],
        [x - margin, y + margin],
        [x + margin, y + margin]
    ];

    for (const [cx, cy] of corners) {
        const mapX = Math.floor(cx);
        const mapY = Math.floor(cy);
        if (mapX < 0 || mapX >= map[0].length || mapY < 0 || mapY >= map.length) return true;

        const cell = map[mapY][mapX];
        if (cell > 0 && cell !== 9) {
            const door = doors.find(d => d.x === mapX && d.y === mapY);
            if (!door || door.openAmount < 0.9) return true;
        }
    }
    return false;
}

function useDoor() {
    const checkDist = 1.5;
    const checkX = player.x + Math.cos(player.angle) * checkDist;
    const checkY = player.y + Math.sin(player.angle) * checkDist;

    const door = doors.find(d => {
        const dx = d.x + 0.5 - checkX;
        const dy = d.y + 0.5 - checkY;
        return Math.sqrt(dx * dx + dy * dy) < 1.0;
    });

    if (door && !door.open && !door.opening) {
        if (door.locked) {
            if (player.keys[door.key]) {
                door.opening = true;
                showMessage('Door opened', 1000);
            } else {
                showMessage('Need ' + door.key + ' key', 2000);
            }
        } else {
            door.opening = true;
        }
    }
}

function updateDoors() {
    doors.forEach(door => {
        if (door.opening) {
            door.openAmount += 0.03;
            if (door.openAmount >= 1) {
                door.openAmount = 1;
                door.open = true;
                door.opening = false;
            }
        }
    });
}

function shoot() {
    const weapon = weapons[player.currentWeapon];

    if (!weapon.infinite) {
        if (player.ammo[player.currentWeapon] < (weapon.ammoUse || 1)) {
            showMessage('Out of ammo!', 1000);
            return;
        }
        player.ammo[player.currentWeapon] -= (weapon.ammoUse || 1);
    }

    // Fire animation
    weaponFireAnim = 6;
    muzzleFlashIntensity = 1.0;

    // Muzzle particles
    for (let i = 0; i < 8; i++) {
        particles.push({
            x: player.x + Math.cos(player.angle) * 0.5,
            y: player.y + Math.sin(player.angle) * 0.5,
            z: 0.5,
            vx: Math.cos(player.angle) * 0.15 + (Math.random() - 0.5) * 0.08,
            vy: Math.sin(player.angle) * 0.15 + (Math.random() - 0.5) * 0.08,
            vz: (Math.random() - 0.5) * 0.08,
            life: 8,
            color: weapon.flashColor
        });
    }

    // Hitscan
    if (!weapon.explosive) {
        const spread = weapon.spread || 1;
        for (let i = 0; i < spread; i++) {
            const spreadAngle = weapon.spread ? (Math.random() - 0.5) * 0.2 : 0;
            const hitEnemy = castRayForEnemy(player.angle + spreadAngle);
            if (hitEnemy) {
                damageEnemy(hitEnemy, weapon.damage);
            } else {
                // Wall spark particles
                const wallHit = castRayDDA(player.angle + spreadAngle);
                if (wallHit.depth < MAX_DEPTH) {
                    const hitX = player.x + Math.cos(player.angle + spreadAngle) * wallHit.depth;
                    const hitY = player.y + Math.sin(player.angle + spreadAngle) * wallHit.depth;
                    for (let j = 0; j < 3; j++) {
                        particles.push({
                            x: hitX,
                            y: hitY,
                            z: 0.5,
                            vx: (Math.random() - 0.5) * 0.1,
                            vy: (Math.random() - 0.5) * 0.1,
                            vz: Math.random() * 0.15,
                            life: 12,
                            color: '#FFAA00'
                        });
                    }
                }
            }
        }
    } else {
        // Projectile
        projectiles.push({
            x: player.x,
            y: player.y,
            angle: player.angle,
            speed: 0.3,
            damage: weapon.damage,
            explosive: weapon.explosive,
            area: weapon.area || 0,
            color: weapon.color,
            life: 100
        });
    }

    updateHUD();
}

function castRayForEnemy(angle) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    let closest = null;
    let closestDist = Infinity;

    enemies.forEach(enemy => {
        if (!enemy.alive) return;
        const dx = enemy.x - player.x;
        const dy = enemy.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const enemyAngle = Math.atan2(dy, dx);

        let angleDiff = enemyAngle - angle;
        while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
        while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
        angleDiff = Math.abs(angleDiff);

        const tolerance = Math.min(0.3, 0.1 + (0.5 / Math.max(distance, 1)));

        if (angleDiff < tolerance && distance < closestDist) {
            const hit = castRayDDA(angle);
            if (hit.depth > distance) {
                closest = enemy;
                closestDist = distance;
            }
        }
    });

    return closest;
}

function damageEnemy(enemy, damage) {
    enemy.health -= damage;
    enemy.hitFlash = 6;
    enemy.alerted = true;

    // Hit particles
    for (let i = 0; i < 12; i++) {
        particles.push({
            x: enemy.x,
            y: enemy.y,
            z: 0.3 + Math.random() * 0.4,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            vz: Math.random() * 0.15,
            life: 15 + Math.random() * 10,
            color: enemy.color
        });
    }

    if (enemy.health <= 0) {
        enemy.alive = false;
        enemy.deathTimer = 30;
        player.kills++;

        // Death explosion particles
        for (let i = 0; i < 40; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.1 + Math.random() * 0.25;
            particles.push({
                x: enemy.x,
                y: enemy.y,
                z: 0.2 + Math.random() * 0.6,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                vz: Math.random() * 0.2,
                life: 25 + Math.random() * 25,
                color: Math.random() > 0.5 ? enemy.color : '#FF4400'
            });
        }
    }
}

function updateEnemies() {
    enemies.forEach(enemy => {
        if (!enemy.alive) {
            if (enemy.deathTimer > 0) enemy.deathTimer--;
            return;
        }

        // Decay hit flash
        if (enemy.hitFlash > 0) enemy.hitFlash--;

        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Alert nearby enemies when one is attacked
        if (distance < enemy.alertDistance) {
            enemy.alerted = true;
        }

        if (!enemy.alerted && distance > enemy.range) return;
        enemy.alerted = true;

        if (distance < enemy.range) {
            enemy.shootTimer--;

            if (enemy.shootTimer <= 0) {
                if (distance < 1.5) {
                    damagePlayer(enemy.damage);
                } else {
                    // Check line of sight before shooting
                    const shootAngle = Math.atan2(dy, dx);
                    const losCheck = castRayDDA(shootAngle + Math.PI);
                    if (losCheck.depth >= distance * 0.8) {
                        projectiles.push({
                            x: enemy.x,
                            y: enemy.y,
                            angle: Math.atan2(dy, dx),
                            speed: 0.15,
                            damage: enemy.damage,
                            color: enemy.color,
                            fromEnemy: true,
                            life: 100
                        });
                    }
                }
                enemy.shootTimer = enemy.fireRate;
            }
        }

        // Improved movement AI - try to close distance, with some path variation
        if (distance > 1.8 && enemy.alerted) {
            const moveAngle = Math.atan2(dy, dx);
            // Add slight wobble to movement for more natural feel
            const wobble = Math.sin(Date.now() * 0.003 + enemy.x * 7) * 0.3;
            const finalAngle = moveAngle + wobble;

            const moveX = enemy.x + Math.cos(finalAngle) * enemy.speed;
            const moveY = enemy.y + Math.sin(finalAngle) * enemy.speed;

            if (!checkWallCollision(moveX, moveY)) {
                enemy.x = moveX;
                enemy.y = moveY;
            } else {
                // Try sliding along walls
                if (!checkWallCollision(moveX, enemy.y)) {
                    enemy.x = moveX;
                } else if (!checkWallCollision(enemy.x, moveY)) {
                    enemy.y = moveY;
                } else {
                    // Try perpendicular directions
                    const perpAngle = moveAngle + Math.PI / 2;
                    const perpX = enemy.x + Math.cos(perpAngle) * enemy.speed;
                    const perpY = enemy.y + Math.sin(perpAngle) * enemy.speed;
                    if (!checkWallCollision(perpX, perpY)) {
                        enemy.x = perpX;
                        enemy.y = perpY;
                    }
                }
            }
        }
    });
}

function damagePlayer(damage) {
    if (player.armor > 0) {
        const armorAbsorb = Math.min(damage / 2, player.armor);
        player.armor -= armorAbsorb;
        damage -= armorAbsorb;
    }

    player.health -= damage;
    player.damageFlash = 1.0;
    updateHUD();
}

function updateProjectiles() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];

        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        p.life--;

        // Trail particles for projectiles
        if (Math.random() > 0.5) {
            particles.push({
                x: p.x,
                y: p.y,
                z: 0.5,
                vx: (Math.random() - 0.5) * 0.02,
                vy: (Math.random() - 0.5) * 0.02,
                vz: (Math.random() - 0.5) * 0.02,
                life: 8,
                color: p.color
            });
        }

        const mapX = Math.floor(p.x);
        const mapY = Math.floor(p.y);
        const cell = currentLevelData.map[mapY]?.[mapX];

        if (cell === undefined || (cell > 0 && cell !== 9)) {
            if (p.explosive && p.area) {
                // Explosion particles
                for (let j = 0; j < 20; j++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 0.1 + Math.random() * 0.2;
                    particles.push({
                        x: p.x, y: p.y, z: 0.5,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        vz: Math.random() * 0.2,
                        life: 20 + Math.random() * 15,
                        color: Math.random() > 0.3 ? '#FF4400' : '#FFAA00'
                    });
                }
                enemies.forEach(enemy => {
                    if (!enemy.alive) return;
                    const edx = enemy.x - p.x;
                    const edy = enemy.y - p.y;
                    const dist = Math.sqrt(edx * edx + edy * edy);
                    if (dist < p.area) {
                        damageEnemy(enemy, p.damage * (1 - dist / p.area));
                    }
                });
            }
            projectiles.splice(i, 1);
            continue;
        }

        if (!p.fromEnemy) {
            let hitSomething = false;
            for (const enemy of enemies) {
                if (!enemy.alive) continue;
                const edx = enemy.x - p.x;
                const edy = enemy.y - p.y;
                const dist = Math.sqrt(edx * edx + edy * edy);
                if (dist < 0.5) {
                    damageEnemy(enemy, p.damage);
                    if (!p.explosive) hitSomething = true;
                    break;
                }
            }
            if (hitSomething) {
                projectiles.splice(i, 1);
                continue;
            }
        } else {
            const pdx = player.x - p.x;
            const pdy = player.y - p.y;
            const dist = Math.sqrt(pdx * pdx + pdy * pdy);
            if (dist < 0.5) {
                damagePlayer(p.damage);
                projectiles.splice(i, 1);
                continue;
            }
        }

        if (p.life <= 0) {
            projectiles.splice(i, 1);
        }
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.vz -= 0.008;
        p.life--;
        if (p.life <= 0 || p.z < 0) {
            particles.splice(i, 1);
        }
    }
}

function checkPickups() {
    pickups.forEach(pickup => {
        if (pickup.collected) return;

        const dx = player.x - pickup.x;
        const dy = player.y - pickup.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 0.5) {
            pickup.collected = true;
            player.items++;
            player.pickupFlash = 1.0;
            player.pickupFlashColor = pickup.color;

            if (pickup.health) {
                player.health = Math.min(100, player.health + pickup.health);
                showMessage('+' + pickup.health + ' Health', 1000);
            }
            if (pickup.armor) {
                player.armor = Math.min(200, player.armor + pickup.armor);
                showMessage('+' + pickup.armor + ' Armor', 1000);
            }
            if (pickup.key) {
                player.keys[pickup.key] = true;
                showMessage('Got ' + pickup.key.toUpperCase() + ' key!', 2000);
                player.pickupFlashColor = pickup.color;
                player.pickupFlash = 1.5;
            }
            if (pickup.weapon !== undefined) {
                if (!player.weapons[pickup.weapon]) {
                    player.weapons[pickup.weapon] = true;
                    player.currentWeapon = pickup.weapon;
                    showMessage('New: ' + weapons[pickup.weapon].name, 2000);
                }
                player.ammo[pickup.weapon] += 20;
            }
            if (pickup.ammo !== undefined) {
                player.ammo[pickup.ammo] += pickup.amount;
                showMessage('+' + pickup.amount + ' Ammo', 1000);
            }

            // Pickup particles
            for (let i = 0; i < 15; i++) {
                const angle = Math.random() * Math.PI * 2;
                particles.push({
                    x: pickup.x, y: pickup.y, z: 0.5,
                    vx: Math.cos(angle) * 0.1,
                    vy: Math.sin(angle) * 0.1,
                    vz: Math.random() * 0.15,
                    life: 15 + Math.random() * 10,
                    color: pickup.color
                });
            }

            updateHUD();
        }
    });
}

// ====================================
// GAME LOOP
// ====================================

let lastTime = Date.now();

function gameLoop() {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    update(deltaTime);
    render();

    if (gameState === 'playing') {
        requestAnimationFrame(gameLoop);
    }
}

// Show start screen
startScreen.classList.remove('hidden');
