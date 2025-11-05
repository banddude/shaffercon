// ====================================
// DΩΩM - Episode 1: Shock to the System
// A complete 8-bit Doom-style game with 9 levels
// ====================================

// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;
const FOV = Math.PI / 3;
const HALF_FOV = FOV / 2;
const NUM_RAYS = 120;
const MAX_DEPTH = 20;
const DELTA_ANGLE = FOV / NUM_RAYS;

// Game State
let gameState = 'menu'; // menu, playing, levelComplete, gameOver, victory
let currentLevel = 1;
let gameTime = 0;
let levelStartTime = 0;
let totalKills = 0;
let totalItems = 0;
let totalSecrets = 0;

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
    secrets: 0
};

// Weapons Data
const weapons = [
    { name: 'VOLTAGE TESTER', damage: 15, fireRate: 8, range: 12, infinite: true, color: '#FFD700' },
    { name: 'WIRE STRIPPERS', damage: 60, fireRate: 18, range: 6, ammoUse: 1, spread: 7, color: '#FF6600' },
    { name: 'POWER DRILL', damage: 10, fireRate: 2, range: 15, ammoUse: 1, color: '#00FFFF' },
    { name: 'ARC WELDER', damage: 35, fireRate: 10, range: 18, ammoUse: 1, color: '#0080FF' },
    { name: 'CIRCUIT BREAKER', damage: 100, fireRate: 22, range: 25, ammoUse: 1, explosive: true, color: '#FF0000' },
    { name: 'TESLA COIL', damage: 250, fireRate: 35, range: 25, ammoUse: 40, area: 4, color: '#FF00FF' }
];

let weaponCooldown = 0;

// Enemy Types
const enemyTypes = {
    sparkImp: {
        name: 'Spark Imp',
        health: 25,
        damage: 8,
        speed: 0.025,
        size: 0.35,
        color: '#FFFF00',
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
        fireRate: 25,
        range: 18,
        boss: true,
        points: 1000
    }
};

// Pickup Types - NO EMOJIS, pixel art drawn in code
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

// Level Definitions - IMPROVED MAPS
const levels = [
    // E1M1: Power Plant Entrance - Tutorial level
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

// UI Elements
const startScreen = document.getElementById('start-screen');
const levelCompleteScreen = document.getElementById('level-complete-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const victoryScreen = document.getElementById('victory-screen');
const hud = document.getElementById('hud');
const mobileControls = document.getElementById('mobile-controls');
const messageDisplay = document.getElementById('message-display');

// Event Listeners
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('next-level-btn').addEventListener('click', nextLevel);
document.getElementById('restart-btn').addEventListener('click', restartLevel);
document.getElementById('main-menu-btn').addEventListener('click', showMainMenu);
document.getElementById('play-again-btn').addEventListener('click', startGame);

// Keyboard controls
document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;

    // Escape key to release pointer lock
    if (e.key === 'Escape') {
        if (document.pointerLockElement) {
            document.exitPointerLock();
        }
    }

    // Enter key for menu navigation
    if (e.key === 'Enter') {
        if (gameState === 'menu') {
            startGame();
        } else if (gameState === 'levelComplete') {
            nextLevel();
        } else if (gameState === 'gameOver') {
            restartLevel();
        } else if (gameState === 'victory') {
            startGame();
        }
    }

    // Weapon switching
    if (e.key >= '1' && e.key <= '6') {
        const weaponIndex = parseInt(e.key) - 1;
        if (player.weapons[weaponIndex]) {
            player.currentWeapon = weaponIndex;
            updateHUD();
        }
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// Mouse controls - click to toggle pointer lock
canvas.addEventListener('click', () => {
    if (gameState === 'playing') {
        if (mouseLocked) {
            document.exitPointerLock();
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
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            action(true);
        });
        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            action(false);
        });
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
// PIXEL ART DRAWING FUNCTIONS
// ====================================

function drawPixelPickup(spriteCtx, w, h, pickup) {
    const pixelSize = Math.max(1, Math.floor(Math.min(w, h) / 8));

    spriteCtx.fillStyle = pickup.color;

    if (pickup.type === 'health') {
        // Health cross
        spriteCtx.fillRect(w/2 - pixelSize, h/4, pixelSize*2, h/2);
        spriteCtx.fillRect(w/4, h/2 - pixelSize, w/2, pixelSize*2);
    } else if (pickup.type === 'armor') {
        // Armor shield
        spriteCtx.fillRect(w/4, h/4, w/2, h/2);
        spriteCtx.fillRect(w/3, h/4 - pixelSize, w/3, pixelSize);
        spriteCtx.fillRect(w/2 - pixelSize/2, h*3/4, pixelSize, h/4);
    } else if (pickup.type === 'key') {
        // Key shape
        spriteCtx.fillRect(w/4, h/3, pixelSize*2, pixelSize*2);
        spriteCtx.fillRect(w/4 + pixelSize*2, h/3 + pixelSize/2, w/2, pixelSize);
        spriteCtx.fillRect(w*3/4 - pixelSize, h/3, pixelSize, pixelSize*3);
    } else if (pickup.type === 'ammo') {
        // Ammo box
        spriteCtx.fillRect(w/4, h/3, w/2, h/2);
        spriteCtx.strokeStyle = '#000';
        spriteCtx.lineWidth = pixelSize/2;
        spriteCtx.strokeRect(w/4, h/3, w/2, h/2);
        spriteCtx.strokeRect(w/3, h/2 - pixelSize, w/3, pixelSize*2);
    } else if (pickup.type === 'weapon') {
        // Weapon icon with letter
        spriteCtx.fillRect(w/4, h/3, w/2, h/3);
        spriteCtx.fillStyle = '#000';
        spriteCtx.font = `bold ${pixelSize*3}px monospace`;
        spriteCtx.textAlign = 'center';
        spriteCtx.textBaseline = 'middle';
        spriteCtx.fillText(pickup.symbol || 'W', w/2, h/2);
    }
}

function drawPixelEnemy(spriteCtx, w, h, enemy) {
    const pixelSize = Math.max(1, Math.floor(Math.min(w, h) / 8));

    spriteCtx.fillStyle = enemy.color;

    // Body
    spriteCtx.fillRect(w/4, h/3, w/2, h/2);

    // Head
    spriteCtx.fillRect(w/3, h/5, w/3, h/4);

    // Eyes (always red)
    spriteCtx.fillStyle = '#FF0000';
    const eyeSize = pixelSize;
    spriteCtx.fillRect(w/3 + pixelSize, h/5 + pixelSize, eyeSize, eyeSize);
    spriteCtx.fillRect(w*2/3 - pixelSize*2, h/5 + pixelSize, eyeSize, eyeSize);

    // Arms
    spriteCtx.fillStyle = enemy.color;
    spriteCtx.fillRect(w/6, h/3 + pixelSize, pixelSize, h/3);
    spriteCtx.fillRect(w*5/6 - pixelSize, h/3 + pixelSize, pixelSize, h/3);
}

// ====================================
// GAME FUNCTIONS
// ====================================

function startGame() {
    currentLevel = 1;
    totalKills = 0;
    totalItems = 0;
    totalSecrets = 0;
    gameTime = 0;
    loadLevel(1);
}

function loadLevel(levelNum) {
    currentLevel = levelNum;
    currentLevelData = levels[levelNum - 1];

    // Reset player
    player.x = currentLevelData.start.x;
    player.y = currentLevelData.start.y;
    player.angle = currentLevelData.start.angle;

    // Keep weapons and ammo between levels
    if (levelNum === 1) {
        player.health = 100;
        player.armor = 0;
        player.currentWeapon = 0;
        player.weapons = [true, false, false, false, false, false];
        player.ammo = [999, 0, 0, 0, 0, 0];
        player.keys = { yellow: false, red: false, blue: false };
    } else {
        // Reset health to 100 but keep armor
        player.health = 100;
        player.keys = { yellow: false, red: false, blue: false };
    }

    player.kills = 0;
    player.items = 0;
    player.secrets = 0;

    // Load enemies
    enemies = currentLevelData.enemies.map(e => ({
        ...enemyTypes[e.type],
        x: e.x,
        y: e.y,
        alive: true,
        shootTimer: 0,
        targetAngle: 0
    }));

    // Load pickups
    pickups = currentLevelData.pickups.map(p => ({
        ...pickupTypes[p.type],
        x: p.x,
        y: p.y,
        pickupType: p.type,
        collected: false
    }));

    // Load doors
    doors = currentLevelData.doors.map(d => ({
        ...d,
        open: false,
        opening: false,
        openAmount: 0
    }));

    projectiles = [];
    particles = [];
    levelStartTime = Date.now();
    gameState = 'playing';

    // Hide all screens, show game
    startScreen.classList.add('hidden');
    levelCompleteScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    victoryScreen.classList.add('hidden');
    hud.classList.remove('hidden');

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
    gameOverScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');

    // Release pointer lock to show cursor
    if (document.pointerLockElement) {
        document.exitPointerLock();
    }
}

function showVictory() {
    gameState = 'victory';
    hud.classList.add('hidden');

    // Release pointer lock to show cursor
    if (document.pointerLockElement) {
        document.exitPointerLock();
    }

    document.getElementById('victory-kills').textContent = totalKills;
    document.getElementById('victory-items').textContent = totalItems;
    document.getElementById('victory-secrets').textContent = totalSecrets;
    document.getElementById('victory-time').textContent = formatTime(gameTime);

    victoryScreen.classList.remove('hidden');
}

function levelComplete() {
    gameState = 'levelComplete';

    // Release pointer lock to show cursor
    if (document.pointerLockElement) {
        document.exitPointerLock();
    }

    const levelTime = Math.floor((Date.now() - levelStartTime) / 1000);
    totalKills += player.kills;
    totalItems += player.items;
    totalSecrets += player.secrets;
    gameTime += levelTime;

    const totalEnemies = enemies.length;
    const totalPickups = pickups.filter(p => !p.collected).length + player.items;

    document.getElementById('completed-level').textContent = currentLevelData.name;
    document.getElementById('kill-count').textContent = player.kills + ' / ' + totalEnemies;
    document.getElementById('item-count').textContent = player.items + ' / ' + totalPickups;
    document.getElementById('secret-count').textContent = player.secrets + ' / 0';
    document.getElementById('level-time').textContent = formatTime(levelTime);

    levelCompleteScreen.classList.remove('hidden');
}

function gameOver() {
    gameState = 'gameOver';

    // Release pointer lock to show cursor
    if (document.pointerLockElement) {
        document.exitPointerLock();
    }

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
    // Health
    document.getElementById('health-value').textContent = Math.max(0, Math.floor(player.health));
    document.getElementById('health-fill').style.width = Math.max(0, player.health) + '%';

    // Armor
    document.getElementById('armor-value').textContent = Math.floor(player.armor);
    document.getElementById('armor-fill').style.width = Math.min(100, player.armor) + '%';

    // Weapon and ammo
    const weapon = weapons[player.currentWeapon];
    document.getElementById('weapon-name').textContent = weapon.name;
    document.getElementById('ammo-count').textContent = weapon.infinite ? 'INF' : player.ammo[player.currentWeapon];

    // Keys - just show/hide colored boxes
    document.getElementById('yellow-key').classList.toggle('hidden', !player.keys.yellow);
    document.getElementById('red-key').classList.toggle('hidden', !player.keys.red);
    document.getElementById('blue-key').classList.toggle('hidden', !player.keys.blue);

    // Level name
    document.getElementById('level-name').textContent = currentLevelData.name;

    // Face - use text symbols instead of emojis
    const faceDisplay = document.getElementById('face-display');
    if (player.health > 75) {
        faceDisplay.textContent = ':)';
    } else if (player.health > 50) {
        faceDisplay.textContent = ':|';
    } else if (player.health > 25) {
        faceDisplay.textContent = ':/';
    } else {
        faceDisplay.textContent = 'X(';
    }
}

// ====================================
// RAYCASTING ENGINE
// ====================================

function castRay(angle) {
    const map = currentLevelData.map;
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    let depth = 0;
    let hitWall = false;
    let hitDoor = false;
    let doorAmount = 0;
    let wallType = 1;

    while (!hitWall && depth < MAX_DEPTH) {
        depth += 0.1;
        const testX = player.x + cos * depth;
        const testY = player.y + sin * depth;

        const mapX = Math.floor(testX);
        const mapY = Math.floor(testY);

        // Check bounds
        if (mapX < 0 || mapX >= map[0].length || mapY < 0 || mapY >= map.length) {
            hitWall = true;
            depth = MAX_DEPTH;
            break;
        }

        const cell = map[mapY][mapX];

        // Check for doors
        const door = doors.find(d => d.x === mapX && d.y === mapY);
        if (door) {
            const doorPos = door.vertical ? testX - mapX : testY - mapY;
            if (doorPos > door.openAmount) {
                hitDoor = true;
                hitWall = true;
                doorAmount = door.openAmount;
                wallType = door.locked ? 3 : 2;
            }
        } else if (cell > 0 && cell !== 9) {
            hitWall = true;
            wallType = cell;
        } else if (cell === 9) {
            // Exit found
            hitWall = true;
            wallType = 9;
        }
    }

    return { depth, wallType, hitDoor, doorAmount };
}

// Depth buffer to prevent drawing sprites through walls
const depthBuffer = new Array(SCREEN_WIDTH);

function render() {
    // Clear screen
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Draw ceiling
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT / 2);

    // Draw floor
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, SCREEN_HEIGHT / 2, SCREEN_WIDTH, SCREEN_HEIGHT / 2);

    // Cast rays for walls and fill depth buffer
    for (let ray = 0; ray < NUM_RAYS; ray++) {
        const rayAngle = player.angle - HALF_FOV + (ray / NUM_RAYS) * FOV;
        const hit = castRay(rayAngle);

        // Fix fish-eye
        const correctedDepth = hit.depth * Math.cos(rayAngle - player.angle);

        // Store depth in buffer for sprite occlusion
        const screenX = Math.floor((ray / NUM_RAYS) * SCREEN_WIDTH);
        const screenWidth = Math.ceil(SCREEN_WIDTH / NUM_RAYS) + 1;
        for (let i = screenX; i < Math.min(screenX + screenWidth, SCREEN_WIDTH); i++) {
            depthBuffer[i] = correctedDepth;
        }

        // Calculate wall height
        const wallHeight = (SCREEN_HEIGHT / correctedDepth) * 0.5;
        const wallTop = (SCREEN_HEIGHT - wallHeight) / 2;

        // Wall color based on type
        let color;
        switch(hit.wallType) {
            case 1: color = '#444444'; break;
            case 2: color = '#FFD700'; break;
            case 3: color = '#FF0000'; break;
            case 9: color = '#00FF00'; break;
            default: color = '#666666';
        }

        // Darken based on distance
        const brightness = Math.max(0.2, 1 - (correctedDepth / MAX_DEPTH));
        const r = parseInt(color.substr(1, 2), 16) * brightness;
        const g = parseInt(color.substr(3, 2), 16) * brightness;
        const b = parseInt(color.substr(5, 2), 16) * brightness;

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(
            screenX,
            wallTop,
            screenWidth,
            wallHeight
        );
    }

    // Draw sprites (enemies, pickups)
    drawSprites();

    // Draw particles
    drawParticles();
}

function drawSprites() {
    const sprites = [];

    // Add enemies
    enemies.forEach(enemy => {
        if (!enemy.alive) return;
        const dx = enemy.x - player.x;
        const dy = enemy.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) - player.angle;

        sprites.push({
            distance,
            angle,
            size: enemy.size,
            color: enemy.color,
            invisible: enemy.invisible,
            isEnemy: true,
            data: enemy
        });
    });

    // Add pickups
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
            data: pickup
        });
    });

    // Sort by distance (far to near)
    sprites.sort((a, b) => b.distance - a.distance);

    // Draw sprites
    sprites.forEach(sprite => {
        // Check if in FOV
        let spriteAngle = sprite.angle;
        if (spriteAngle > Math.PI) spriteAngle -= 2 * Math.PI;
        if (spriteAngle < -Math.PI) spriteAngle += 2 * Math.PI;

        if (Math.abs(spriteAngle) < HALF_FOV + 0.5) {
            const spriteHeight = (SCREEN_HEIGHT / sprite.distance) * sprite.size;
            const spriteWidth = spriteHeight;
            const spriteX = (SCREEN_WIDTH / 2) + (spriteAngle / HALF_FOV) * (SCREEN_WIDTH / 2) - spriteWidth / 2;
            const spriteY = (SCREEN_HEIGHT - spriteHeight) / 2;

            // Check if sprite is behind a wall by testing depth buffer
            const spriteScreenXStart = Math.max(0, Math.floor(spriteX));
            const spriteScreenXEnd = Math.min(SCREEN_WIDTH, Math.ceil(spriteX + spriteWidth));
            let visiblePixels = 0;
            for (let x = spriteScreenXStart; x < spriteScreenXEnd; x++) {
                if (sprite.distance < depthBuffer[x]) {
                    visiblePixels++;
                }
            }

            // Only draw sprite if at least some pixels are visible (not fully behind walls)
            if (visiblePixels > 0) {
                // Brightness based on distance
                const brightness = Math.max(0.2, 1 - (sprite.distance / MAX_DEPTH));

                if (sprite.isPickup) {
                    // Draw pickup using pixel art
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = spriteWidth;
                    tempCanvas.height = spriteHeight;
                    const tempCtx = tempCanvas.getContext('2d');

                    drawPixelPickup(tempCtx, spriteWidth, spriteHeight, sprite.data);

                    // Use depth buffer as mask
                    ctx.save();
                    ctx.beginPath();
                    for (let x = spriteScreenXStart; x < spriteScreenXEnd; x++) {
                        if (sprite.distance < depthBuffer[x]) {
                            ctx.rect(x, 0, 1, SCREEN_HEIGHT);
                        }
                    }
                    ctx.clip();

                    ctx.globalAlpha = brightness;
                    ctx.drawImage(tempCanvas, spriteX, spriteY);
                    ctx.globalAlpha = 1;
                    ctx.restore();
                } else {
                    // Draw enemy using pixel art
                    const alpha = sprite.invisible ? 0.3 : 1.0;

                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = spriteWidth;
                    tempCanvas.height = spriteHeight;
                    const tempCtx = tempCanvas.getContext('2d');

                    drawPixelEnemy(tempCtx, spriteWidth, spriteHeight, sprite.data);

                    // Use depth buffer as mask
                    ctx.save();
                    ctx.beginPath();
                    for (let x = spriteScreenXStart; x < spriteScreenXEnd; x++) {
                        if (sprite.distance < depthBuffer[x]) {
                            ctx.rect(x, 0, 1, SCREEN_HEIGHT);
                        }
                    }
                    ctx.clip();

                    ctx.globalAlpha = brightness * alpha;
                    ctx.drawImage(tempCanvas, spriteX, spriteY);
                    ctx.globalAlpha = 1;
                    ctx.restore();
                }
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

        let particleAngle = angle;
        if (particleAngle > Math.PI) particleAngle -= 2 * Math.PI;
        if (particleAngle < -Math.PI) particleAngle += 2 * Math.PI;

        if (Math.abs(particleAngle) < HALF_FOV + 0.5 && distance < MAX_DEPTH) {
            const size = (SCREEN_HEIGHT / distance) * 0.05;
            const x = (SCREEN_WIDTH / 2) + (particleAngle / HALF_FOV) * (SCREEN_WIDTH / 2);
            const y = (SCREEN_HEIGHT / 2) + ((p.z - 0.5) / distance) * SCREEN_HEIGHT;

            // Check depth buffer - only draw particle if it's in front of walls
            const screenX = Math.floor(x);
            if (screenX >= 0 && screenX < SCREEN_WIDTH && distance < depthBuffer[screenX]) {
                ctx.fillStyle = p.color;
                ctx.fillRect(x - size / 2, y - size / 2, size, size);
            }
        }
    });
}

// ====================================
// GAME LOGIC
// ====================================

function update(deltaTime) {
    if (gameState !== 'playing') return;

    // Player movement
    const moveSpeed = 0.05;
    const rotSpeed = 0.05;

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

    // Collision detection
    if (!checkWallCollision(newX, newY)) {
        player.x = newX;
        player.y = newY;
    }

    // Check for exit
    const exitCell = currentLevelData.map[Math.floor(player.y)][Math.floor(player.x)];
    if (exitCell === 9) {
        levelComplete();
        return;
    }

    // Use/Open doors
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

    // Update enemies
    updateEnemies();

    // Update projectiles
    updateProjectiles();

    // Update particles
    updateParticles();

    // Update doors
    updateDoors();

    // Check pickups
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

        if (mapX < 0 || mapX >= map[0].length || mapY < 0 || mapY >= map.length) {
            return true;
        }

        const cell = map[mapY][mapX];
        if (cell > 0 && cell !== 9) {
            const door = doors.find(d => d.x === mapX && d.y === mapY);
            if (!door || door.openAmount < 0.9) {
                return true;
            }
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
            door.openAmount += 0.05;
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

    // Check ammo
    if (!weapon.infinite) {
        if (player.ammo[player.currentWeapon] < weapon.ammoUse) {
            showMessage('Out of ammo!', 1000);
            return;
        }
        player.ammo[player.currentWeapon] -= weapon.ammoUse;
    }

    // Create muzzle flash particles
    for (let i = 0; i < 5; i++) {
        particles.push({
            x: player.x + Math.cos(player.angle) * 0.5,
            y: player.y + Math.sin(player.angle) * 0.5,
            z: 0.5,
            vx: Math.cos(player.angle) * 0.1 + (Math.random() - 0.5) * 0.1,
            vy: Math.sin(player.angle) * 0.1 + (Math.random() - 0.5) * 0.1,
            vz: (Math.random() - 0.5) * 0.1,
            life: 10,
            color: weapon.color
        });
    }

    // Hitscan weapons (most weapons)
    if (!weapon.explosive) {
        const spread = weapon.spread || 1;
        for (let i = 0; i < spread; i++) {
            const spreadAngle = weapon.spread ? (Math.random() - 0.5) * 0.2 : 0;
            const hitEnemy = castRayForEnemy(player.angle + spreadAngle);
            if (hitEnemy) {
                damageEnemy(hitEnemy, weapon.damage);
            }
        }
    } else {
        // Projectile weapons
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

        // Normalize angle difference to handle wrapping at -π/π boundary
        let angleDiff = enemyAngle - angle;
        while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
        while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
        angleDiff = Math.abs(angleDiff);

        // Use larger tolerance at close range, smaller at long range
        const tolerance = Math.min(0.3, 0.1 + (0.5 / Math.max(distance, 1)));

        if (angleDiff < tolerance && distance < closestDist) {
            const hit = castRay(angle);
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

    // Create particles
    for (let i = 0; i < 10; i++) {
        particles.push({
            x: enemy.x,
            y: enemy.y,
            z: 0.5,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            vz: Math.random() * 0.1,
            life: 20,
            color: enemy.color
        });
    }

    if (enemy.health <= 0) {
        enemy.alive = false;
        player.kills++;

        // Death particles
        for (let i = 0; i < 30; i++) {
            particles.push({
                x: enemy.x,
                y: enemy.y,
                z: 0.5,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                vz: Math.random() * 0.2,
                life: 40,
                color: enemy.color
            });
        }
    }
}

function updateEnemies() {
    enemies.forEach(enemy => {
        if (!enemy.alive) return;

        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < enemy.range) {
            enemy.shootTimer--;

            if (enemy.shootTimer <= 0 && distance < enemy.range) {
                if (distance < 1.5) {
                    damagePlayer(enemy.damage);
                } else {
                    const angle = Math.atan2(dy, dx);
                    projectiles.push({
                        x: enemy.x,
                        y: enemy.y,
                        angle: angle,
                        speed: 0.15,
                        damage: enemy.damage,
                        color: enemy.color,
                        fromEnemy: true,
                        life: 100
                    });
                }
                enemy.shootTimer = enemy.fireRate;
            }

            if (distance > 2) {
                const moveX = enemy.x + (dx / distance) * enemy.speed;
                const moveY = enemy.y + (dy / distance) * enemy.speed;

                if (!checkWallCollision(moveX, moveY)) {
                    enemy.x = moveX;
                    enemy.y = moveY;
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
    updateHUD();

    // Screen flash
    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
}

function updateProjectiles() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];

        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        p.life--;

        const mapX = Math.floor(p.x);
        const mapY = Math.floor(p.y);
        const cell = currentLevelData.map[mapY]?.[mapX];

        if (!cell || cell > 0) {
            if (p.explosive && p.area) {
                enemies.forEach(enemy => {
                    if (!enemy.alive) return;
                    const dx = enemy.x - p.x;
                    const dy = enemy.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < p.area) {
                        damageEnemy(enemy, p.damage * (1 - dist / p.area));
                    }
                });
            }
            projectiles.splice(i, 1);
            continue;
        }

        if (!p.fromEnemy) {
            for (const enemy of enemies) {
                if (!enemy.alive) continue;
                const dx = enemy.x - p.x;
                const dy = enemy.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 0.5) {
                    damageEnemy(enemy, p.damage);
                    if (!p.explosive) {
                        projectiles.splice(i, 1);
                    }
                    break;
                }
            }
        } else {
            const dx = player.x - p.x;
            const dy = player.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 0.5) {
                damagePlayer(p.damage);
                projectiles.splice(i, 1);
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
        p.vz -= 0.01;
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
                showMessage('Got ' + pickup.key + ' key', 2000);
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
