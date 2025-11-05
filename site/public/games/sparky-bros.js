// Game canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Detect mobile vs desktop
let isMobile = window.innerWidth < 768;
const GAME_WIDTH = isMobile ? 400 : 800;
const GAME_HEIGHT = 600;
const ASPECT_RATIO = GAME_WIDTH / GAME_HEIGHT;

// Resize canvas to maintain aspect ratio
function resizeCanvas() {
    isMobile = window.innerWidth < 768;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const windowAspectRatio = windowWidth / windowHeight;
    const currentGameWidth = isMobile ? 400 : 800;
    const currentAspectRatio = currentGameWidth / GAME_HEIGHT;

    if (windowAspectRatio > currentAspectRatio) {
        // Window is wider than game
        canvas.height = windowHeight;
        canvas.width = windowHeight * currentAspectRatio;
    } else {
        // Window is taller than game
        canvas.width = windowWidth;
        canvas.height = windowWidth / currentAspectRatio;
    }

    // Scale everything proportionally
    const scale = canvas.width / currentGameWidth;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
}
resizeCanvas();
window.addEventListener('resize', () => {
    const wasMobile = isMobile;
    resizeCanvas();
    // Reload level if we switched between mobile and desktop
    if (wasMobile !== isMobile && gameState === 'playing') {
        loadLevel(currentLevel);
    }
});

// Game state
let gameState = 'start';
let score = 0;
let lives = 3;
let coins = 0;
let currentLevel = 1;
let invincible = false;
let invincibleTimer = 0;

// Leaderboard functions
function getLeaderboard() {
    return JSON.parse(localStorage.getItem('sparkybros-leaderboard') || '[]');
}

function saveToLeaderboard(name, score) {
    let leaderboard = getLeaderboard();
    leaderboard.push({ name, score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10); // Keep top 10
    localStorage.setItem('sparkybros-leaderboard', JSON.stringify(leaderboard));
}

function isTopScore(score) {
    const leaderboard = getLeaderboard();
    return leaderboard.length < 10 || score > leaderboard[leaderboard.length - 1].score || leaderboard.length === 0;
}

// Player
const player = {
    x: 100,
    y: 400,
    width: 32,
    height: 32,
    velocityX: 0,
    velocityY: 0,
    speed: 4,
    jumpPower: 12,
    gravity: 0.6,
    onGround: false,
    direction: 1, // 1 = right, -1 = left
    animation: 0
};

// Input
const keys = {};

// Level objects
let platforms = [];
let wireNuts = [];
let enemies = [];
let pipes = [];
let particles = [];

// UI Elements
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const winScreen = document.getElementById('win-screen');
const nameEntryScreen = document.getElementById('name-entry-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const nextLevelBtn = document.getElementById('next-level-btn');
const submitNameBtn = document.getElementById('submit-name-btn');
const playerNameInput = document.getElementById('player-name-input');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const coinsDisplay = document.getElementById('coins');
const finalScoreDisplay = document.getElementById('final-score');
const winScoreDisplay = document.getElementById('win-score');
const highScoreValue = document.getElementById('high-score-value');

// Event listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
nextLevelBtn.addEventListener('click', nextLevel);
submitNameBtn.addEventListener('click', submitName);

// Allow Enter key to submit name
playerNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        submitName();
    }
});

document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'Space' && gameState === 'playing' && player.onGround) {
        e.preventDefault();
        player.velocityY = -player.jumpPower;
        player.onGround = false;
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Mobile touch controls
const leftBtn = document.getElementById('left-btn-game');
const rightBtn = document.getElementById('right-btn-game');
const jumpBtn = document.getElementById('jump-btn-game');

if (leftBtn) {
    leftBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keys['ArrowLeft'] = true;
    }, { passive: false });

    leftBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        keys['ArrowLeft'] = false;
    }, { passive: false });

    leftBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        keys['ArrowLeft'] = true;
    });

    leftBtn.addEventListener('mouseup', (e) => {
        e.preventDefault();
        keys['ArrowLeft'] = false;
    });
}

if (rightBtn) {
    rightBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keys['ArrowRight'] = true;
    }, { passive: false });

    rightBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        keys['ArrowRight'] = false;
    }, { passive: false });

    rightBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        keys['ArrowRight'] = true;
    });

    rightBtn.addEventListener('mouseup', (e) => {
        e.preventDefault();
        keys['ArrowRight'] = false;
    });
}

if (jumpBtn) {
    jumpBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (gameState === 'playing' && player.onGround) {
            player.velocityY = -player.jumpPower;
            player.onGround = false;
        }
    }, { passive: false });

    jumpBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        if (gameState === 'playing' && player.onGround) {
            player.velocityY = -player.jumpPower;
            player.onGround = false;
        }
    });
}

// Load level
function loadLevel(level) {
    platforms = [];
    wireNuts = [];
    enemies = [];
    pipes = [];
    particles = [];

    const gameWidth = isMobile ? 400 : 800;

    if (level === 1) {
        if (isMobile) {
            // MOBILE LEVEL 1 - narrower, more vertical
            platforms.push({ x: 0, y: 550, width: 400, height: 50, type: 'ground' });

            // Platforms stacked more vertically
            platforms.push({ x: 50, y: 470, width: 120, height: 20, type: 'platform' });
            platforms.push({ x: 230, y: 400, width: 120, height: 20, type: 'platform' });
            platforms.push({ x: 80, y: 330, width: 100, height: 20, type: 'platform' });
            platforms.push({ x: 250, y: 260, width: 120, height: 20, type: 'platform' });
            platforms.push({ x: 100, y: 190, width: 100, height: 20, type: 'platform' });

            // Wire nuts
            wireNuts.push({ x: 90, y: 440, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 270, y: 370, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 120, y: 300, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 290, y: 230, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 140, y: 160, width: 16, height: 16, collected: false });

            // Enemies
            enemies.push({ x: 200, y: 350, width: 24, height: 24, velocityX: 2, type: 'spark' });

            // Exit pipe at top
            pipes.push({ x: 310, y: 110, width: 60, height: 80, type: 'exit' });
        } else {
            // DESKTOP LEVEL 1 - original wider layout
            platforms.push({ x: 0, y: 550, width: 800, height: 50, type: 'ground' });

            platforms.push({ x: 200, y: 450, width: 150, height: 20, type: 'platform' });
            platforms.push({ x: 400, y: 380, width: 120, height: 20, type: 'platform' });
            platforms.push({ x: 250, y: 300, width: 100, height: 20, type: 'platform' });
            platforms.push({ x: 500, y: 250, width: 150, height: 20, type: 'platform' });
            platforms.push({ x: 680, y: 450, width: 120, height: 20, type: 'platform' });

            wireNuts.push({ x: 230, y: 420, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 280, y: 420, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 430, y: 350, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 280, y: 270, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 550, y: 220, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 730, y: 420, width: 16, height: 16, collected: false });

            enemies.push({ x: 450, y: 300, width: 24, height: 24, velocityX: 2, type: 'spark' });
            enemies.push({ x: 600, y: 500, width: 24, height: 24, velocityX: -2, type: 'spark' });

            pipes.push({ x: 720, y: 370, width: 60, height: 80, type: 'exit' });
        }

    } else if (level === 2) {
        if (isMobile) {
            // MOBILE LEVEL 2 - more challenging vertical layout
            platforms.push({ x: 0, y: 550, width: 150, height: 50, type: 'ground' });
            platforms.push({ x: 250, y: 550, width: 150, height: 50, type: 'ground' });

            // Challenging platforms
            platforms.push({ x: 50, y: 460, width: 90, height: 20, type: 'platform' });
            platforms.push({ x: 260, y: 390, width: 90, height: 20, type: 'platform' });
            platforms.push({ x: 80, y: 320, width: 100, height: 20, type: 'platform' });
            platforms.push({ x: 240, y: 250, width: 90, height: 20, type: 'platform' });
            platforms.push({ x: 100, y: 180, width: 100, height: 20, type: 'platform' });
            platforms.push({ x: 260, y: 110, width: 100, height: 20, type: 'platform' });

            // Wire nuts
            wireNuts.push({ x: 80, y: 430, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 290, y: 360, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 120, y: 290, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 270, y: 220, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 140, y: 150, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 300, y: 80, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 320, y: 520, width: 16, height: 16, collected: false });

            // More enemies
            enemies.push({ x: 150, y: 370, width: 24, height: 24, velocityX: 2, type: 'spark' });
            enemies.push({ x: 200, y: 230, width: 24, height: 24, velocityX: -2, type: 'spark' });

            // Exit pipe at top
            pipes.push({ x: 320, y: 30, width: 60, height: 80, type: 'exit' });
        } else {
            // DESKTOP LEVEL 2 - original wider layout
            platforms.push({ x: 0, y: 550, width: 250, height: 50, type: 'ground' });
            platforms.push({ x: 350, y: 550, width: 200, height: 50, type: 'ground' });
            platforms.push({ x: 650, y: 550, width: 150, height: 50, type: 'ground' });

            platforms.push({ x: 150, y: 450, width: 100, height: 20, type: 'platform' });
            platforms.push({ x: 300, y: 380, width: 80, height: 20, type: 'platform' });
            platforms.push({ x: 180, y: 310, width: 120, height: 20, type: 'platform' });
            platforms.push({ x: 400, y: 280, width: 100, height: 20, type: 'platform' });
            platforms.push({ x: 550, y: 350, width: 120, height: 20, type: 'platform' });
            platforms.push({ x: 680, y: 280, width: 100, height: 20, type: 'platform' });

            wireNuts.push({ x: 180, y: 420, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 330, y: 350, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 220, y: 280, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 430, y: 250, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 590, y: 320, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 720, y: 250, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 400, y: 520, width: 16, height: 16, collected: false });

            enemies.push({ x: 200, y: 360, width: 24, height: 24, velocityX: 2, type: 'spark' });
            enemies.push({ x: 450, y: 200, width: 24, height: 24, velocityX: -2, type: 'spark' });
            enemies.push({ x: 600, y: 270, width: 24, height: 24, velocityX: 2, type: 'spark' });

            pipes.push({ x: 720, y: 200, width: 60, height: 80, type: 'exit' });
        }
    } else if (level === 3) {
        if (isMobile) {
            // MOBILE LEVEL 3 - Moving platforms and precision jumps
            platforms.push({ x: 0, y: 550, width: 120, height: 50, type: 'ground' });
            platforms.push({ x: 280, y: 550, width: 120, height: 50, type: 'ground' });

            // Small platforms requiring precision
            platforms.push({ x: 150, y: 480, width: 70, height: 20, type: 'platform' });
            platforms.push({ x: 50, y: 400, width: 80, height: 20, type: 'platform' });
            platforms.push({ x: 270, y: 340, width: 70, height: 20, type: 'platform' });
            platforms.push({ x: 100, y: 270, width: 90, height: 20, type: 'platform' });
            platforms.push({ x: 280, y: 200, width: 80, height: 20, type: 'platform' });
            platforms.push({ x: 130, y: 130, width: 100, height: 20, type: 'platform' });

            // Wire nuts in tricky spots
            wireNuts.push({ x: 170, y: 450, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 80, y: 370, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 290, y: 310, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 130, y: 240, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 310, y: 170, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 160, y: 100, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 340, y: 520, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 40, y: 520, width: 16, height: 16, collected: false });

            // More aggressive enemies
            enemies.push({ x: 180, y: 330, width: 24, height: 24, velocityX: 2.5, type: 'spark' });
            enemies.push({ x: 250, y: 180, width: 24, height: 24, velocityX: -2.5, type: 'spark' });
            enemies.push({ x: 150, y: 500, width: 24, height: 24, velocityX: 3, type: 'spark' });

            // Exit pipe at top
            pipes.push({ x: 310, y: 50, width: 60, height: 80, type: 'exit' });
        } else {
            // DESKTOP LEVEL 3 - Wide jumps and speed required
            platforms.push({ x: 0, y: 550, width: 200, height: 50, type: 'ground' });
            platforms.push({ x: 600, y: 550, width: 200, height: 50, type: 'ground' });

            // Wide gaps requiring momentum
            platforms.push({ x: 100, y: 470, width: 100, height: 20, type: 'platform' });
            platforms.push({ x: 350, y: 420, width: 90, height: 20, type: 'platform' });
            platforms.push({ x: 550, y: 380, width: 100, height: 20, type: 'platform' });
            platforms.push({ x: 250, y: 320, width: 120, height: 20, type: 'platform' });
            platforms.push({ x: 480, y: 260, width: 110, height: 20, type: 'platform' });
            platforms.push({ x: 150, y: 200, width: 100, height: 20, type: 'platform' });
            platforms.push({ x: 650, y: 180, width: 130, height: 20, type: 'platform' });

            // Wire nuts
            wireNuts.push({ x: 130, y: 440, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 380, y: 390, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 590, y: 350, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 290, y: 290, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 520, y: 230, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 180, y: 170, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 700, y: 150, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 100, y: 520, width: 16, height: 16, collected: false });

            // Fast enemies
            enemies.push({ x: 300, y: 360, width: 24, height: 24, velocityX: 3, type: 'spark' });
            enemies.push({ x: 500, y: 210, width: 24, height: 24, velocityX: -3, type: 'spark' });
            enemies.push({ x: 650, y: 500, width: 24, height: 24, velocityX: 2.5, type: 'spark' });
            enemies.push({ x: 200, y: 140, width: 24, height: 24, velocityX: 2, type: 'spark' });

            pipes.push({ x: 720, y: 100, width: 60, height: 80, type: 'exit' });
        }
    } else if (level === 4) {
        if (isMobile) {
            // MOBILE LEVEL 4 - Moderate challenge (not too narrow)
            platforms.push({ x: 0, y: 550, width: 120, height: 50, type: 'ground' });
            platforms.push({ x: 280, y: 550, width: 120, height: 50, type: 'ground' });

            // Wider platforms for better playability
            platforms.push({ x: 160, y: 490, width: 80, height: 20, type: 'platform' });
            platforms.push({ x: 70, y: 430, width: 90, height: 20, type: 'platform' });
            platforms.push({ x: 240, y: 370, width: 80, height: 20, type: 'platform' });
            platforms.push({ x: 110, y: 310, width: 100, height: 20, type: 'platform' });
            platforms.push({ x: 260, y: 240, width: 90, height: 20, type: 'platform' });
            platforms.push({ x: 80, y: 170, width: 110, height: 20, type: 'platform' });
            platforms.push({ x: 240, y: 100, width: 120, height: 20, type: 'platform' });

            // Wire nuts
            wireNuts.push({ x: 190, y: 460, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 110, y: 400, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 270, y: 340, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 150, y: 280, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 300, y: 210, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 120, y: 140, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 290, y: 70, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 350, y: 520, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 30, y: 520, width: 16, height: 16, collected: false });

            // Slower enemies for better balance
            enemies.push({ x: 200, y: 410, width: 24, height: 24, velocityX: 1.8, type: 'spark' });
            enemies.push({ x: 160, y: 290, width: 24, height: 24, velocityX: -2, type: 'spark' });
            enemies.push({ x: 280, y: 220, width: 24, height: 24, velocityX: 2, type: 'spark' });
            enemies.push({ x: 130, y: 150, width: 24, height: 24, velocityX: -1.8, type: 'spark' });

            pipes.push({ x: 310, y: 20, width: 60, height: 80, type: 'exit' });
        } else {
            // DESKTOP LEVEL 4 - Moderate enemy challenge
            platforms.push({ x: 0, y: 550, width: 150, height: 50, type: 'ground' });
            platforms.push({ x: 250, y: 550, width: 150, height: 50, type: 'ground' });
            platforms.push({ x: 500, y: 550, width: 150, height: 50, type: 'ground' });
            platforms.push({ x: 700, y: 550, width: 100, height: 50, type: 'ground' });

            // Multiple paths
            platforms.push({ x: 80, y: 460, width: 100, height: 20, type: 'platform' });
            platforms.push({ x: 280, y: 450, width: 90, height: 20, type: 'platform' });
            platforms.push({ x: 500, y: 440, width: 100, height: 20, type: 'platform' });
            platforms.push({ x: 150, y: 370, width: 110, height: 20, type: 'platform' });
            platforms.push({ x: 400, y: 350, width: 100, height: 20, type: 'platform' });
            platforms.push({ x: 620, y: 340, width: 110, height: 20, type: 'platform' });
            platforms.push({ x: 250, y: 280, width: 120, height: 20, type: 'platform' });
            platforms.push({ x: 500, y: 250, width: 100, height: 20, type: 'platform' });
            platforms.push({ x: 350, y: 180, width: 150, height: 20, type: 'platform' });

            // Wire nuts
            wireNuts.push({ x: 120, y: 430, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 310, y: 420, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 540, y: 410, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 190, y: 340, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 440, y: 320, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 660, y: 310, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 290, y: 250, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 540, y: 220, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 410, y: 150, width: 16, height: 16, collected: false });

            // Slower enemies for better balance
            enemies.push({ x: 150, y: 390, width: 24, height: 24, velocityX: 1.8, type: 'spark' });
            enemies.push({ x: 350, y: 500, width: 24, height: 24, velocityX: -2.2, type: 'spark' });
            enemies.push({ x: 550, y: 380, width: 24, height: 24, velocityX: 2, type: 'spark' });
            enemies.push({ x: 300, y: 300, width: 24, height: 24, velocityX: -2, type: 'spark' });
            enemies.push({ x: 650, y: 280, width: 24, height: 24, velocityX: 2.2, type: 'spark' });
            enemies.push({ x: 400, y: 120, width: 24, height: 24, velocityX: 1.8, type: 'spark' });

            pipes.push({ x: 440, y: 100, width: 60, height: 80, type: 'exit' });
        }
    } else if (level === 5) {
        if (isMobile) {
            // MOBILE LEVEL 5 - Final challenge with everything
            platforms.push({ x: 0, y: 550, width: 80, height: 50, type: 'ground' });
            platforms.push({ x: 320, y: 550, width: 80, height: 50, type: 'ground' });

            // Extreme platforming
            platforms.push({ x: 160, y: 500, width: 60, height: 20, type: 'platform' });
            platforms.push({ x: 60, y: 440, width: 70, height: 20, type: 'platform' });
            platforms.push({ x: 270, y: 400, width: 60, height: 20, type: 'platform' });
            platforms.push({ x: 140, y: 340, width: 50, height: 20, type: 'platform' });
            platforms.push({ x: 280, y: 280, width: 70, height: 20, type: 'platform' });
            platforms.push({ x: 100, y: 220, width: 60, height: 20, type: 'platform' });
            platforms.push({ x: 260, y: 160, width: 80, height: 20, type: 'platform' });
            platforms.push({ x: 120, y: 100, width: 70, height: 20, type: 'platform' });
            platforms.push({ x: 280, y: 40, width: 90, height: 20, type: 'platform' });

            // All the wire nuts
            wireNuts.push({ x: 180, y: 470, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 85, y: 410, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 295, y: 370, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 155, y: 310, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 310, y: 250, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 120, y: 190, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 295, y: 130, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 145, y: 70, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 320, y: 10, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 30, y: 520, width: 16, height: 16, collected: false });

            // Maximum enemies
            enemies.push({ x: 190, y: 450, width: 24, height: 24, velocityX: 2.5, type: 'spark' });
            enemies.push({ x: 240, y: 380, width: 24, height: 24, velocityX: -3, type: 'spark' });
            enemies.push({ x: 170, y: 310, width: 24, height: 24, velocityX: 2, type: 'spark' });
            enemies.push({ x: 280, y: 250, width: 24, height: 24, velocityX: -2.5, type: 'spark' });
            enemies.push({ x: 130, y: 190, width: 24, height: 24, velocityX: 3, type: 'spark' });

            pipes.push({ x: 310, y: -40, width: 60, height: 80, type: 'exit' });
        } else {
            // DESKTOP LEVEL 5 - Epic finale
            platforms.push({ x: 0, y: 550, width: 120, height: 50, type: 'ground' });
            platforms.push({ x: 680, y: 550, width: 120, height: 50, type: 'ground' });

            // Complex multi-path layout
            platforms.push({ x: 50, y: 480, width: 80, height: 20, type: 'platform' });
            platforms.push({ x: 200, y: 500, width: 90, height: 20, type: 'platform' });
            platforms.push({ x: 360, y: 480, width: 80, height: 20, type: 'platform' });
            platforms.push({ x: 510, y: 500, width: 100, height: 20, type: 'platform' });
            platforms.push({ x: 150, y: 410, width: 90, height: 20, type: 'platform' });
            platforms.push({ x: 320, y: 390, width: 100, height: 20, type: 'platform' });
            platforms.push({ x: 500, y: 410, width: 90, height: 20, type: 'platform' });
            platforms.push({ x: 680, y: 430, width: 100, height: 20, type: 'platform' });
            platforms.push({ x: 100, y: 320, width: 80, height: 20, type: 'platform' });
            platforms.push({ x: 260, y: 300, width: 100, height: 20, type: 'platform' });
            platforms.push({ x: 440, y: 320, width: 90, height: 20, type: 'platform' });
            platforms.push({ x: 620, y: 300, width: 100, height: 20, type: 'platform' });
            platforms.push({ x: 180, y: 220, width: 100, height: 20, type: 'platform' });
            platforms.push({ x: 380, y: 230, width: 110, height: 20, type: 'platform' });
            platforms.push({ x: 580, y: 210, width: 100, height: 20, type: 'platform' });
            platforms.push({ x: 280, y: 140, width: 120, height: 20, type: 'platform' });
            platforms.push({ x: 500, y: 120, width: 150, height: 20, type: 'platform' });

            // All the wire nuts
            wireNuts.push({ x: 80, y: 450, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 230, y: 470, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 390, y: 450, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 550, y: 470, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 180, y: 380, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 360, y: 360, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 530, y: 380, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 720, y: 400, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 130, y: 290, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 300, y: 270, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 470, y: 290, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 660, y: 270, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 220, y: 190, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 430, y: 200, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 620, y: 180, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 330, y: 110, width: 16, height: 16, collected: false });
            wireNuts.push({ x: 570, y: 90, width: 16, height: 16, collected: false });

            // Maximum chaos
            enemies.push({ x: 180, y: 450, width: 24, height: 24, velocityX: 3, type: 'spark' });
            enemies.push({ x: 350, y: 430, width: 24, height: 24, velocityX: -2.5, type: 'spark' });
            enemies.push({ x: 650, y: 480, width: 24, height: 24, velocityX: 2.5, type: 'spark' });
            enemies.push({ x: 200, y: 350, width: 24, height: 24, velocityX: -3, type: 'spark' });
            enemies.push({ x: 450, y: 360, width: 24, height: 24, velocityX: 3, type: 'spark' });
            enemies.push({ x: 700, y: 340, width: 24, height: 24, velocityX: -2, type: 'spark' });
            enemies.push({ x: 250, y: 260, width: 24, height: 24, velocityX: 2.5, type: 'spark' });
            enemies.push({ x: 550, y: 250, width: 24, height: 24, velocityX: -2.5, type: 'spark' });
            enemies.push({ x: 400, y: 170, width: 24, height: 24, velocityX: 3, type: 'spark' });

            pipes.push({ x: 590, y: 40, width: 60, height: 80, type: 'exit' });
        }
    }
}

// Start game
function startGame() {
    gameState = 'playing';
    score = 0;
    lives = 3;
    coins = 0;
    currentLevel = 1;
    player.x = 100;
    player.y = 400;
    player.velocityX = 0;
    player.velocityY = 0;
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    winScreen.classList.add('hidden');
    nameEntryScreen.classList.add('hidden');
    loadLevel(currentLevel);
    updateHUD();
    gameLoop();
}

// Restart game
function restartGame() {
    startGame();
}

// Next level
function nextLevel() {
    currentLevel++;
    if (currentLevel > 5) {
        currentLevel = 1;
        score += 10000; // Bonus for completing all levels
    }
    player.x = 100;
    player.y = 400;
    player.velocityX = 0;
    player.velocityY = 0;
    gameState = 'playing';
    winScreen.classList.add('hidden');
    loadLevel(currentLevel);
    updateHUD();
    gameLoop();
}

// Update HUD
function updateHUD() {
    scoreDisplay.textContent = `SCORE: ${score}`;
    livesDisplay.textContent = `LIVES: ${'❤️'.repeat(lives)}`;
    coinsDisplay.textContent = `NUTS: ${coins}`;
}

// Create spark particles
function createSparks(x, y, color, count = 8) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 30,
            color: color,
            size: Math.random() * 4 + 2
        });
    }
}

// Update game
function update() {
    if (gameState !== 'playing') return;

    player.animation++;

    // Handle input
    player.velocityX = 0;
    if (keys['ArrowLeft']) {
        player.velocityX = -player.speed;
        player.direction = -1;
    }
    if (keys['ArrowRight']) {
        player.velocityX = player.speed;
        player.direction = 1;
    }

    // Apply gravity
    player.velocityY += player.gravity;

    // Update position
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Check platform collisions
    player.onGround = false;
    platforms.forEach(platform => {
        if (checkPlatformCollision(player, platform)) {
            if (player.velocityY > 0) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.onGround = true;
            }
        }
    });

    // Boundary checks
    const gameWidth = isMobile ? 400 : 800;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > gameWidth) player.x = gameWidth - player.width;

    // Fall off screen
    if (player.y > GAME_HEIGHT) {
        loseLife();
    }

    // Collect wire nuts
    wireNuts.forEach(nut => {
        if (!nut.collected && checkCollision(player, nut)) {
            nut.collected = true;
            coins++;
            score += 100;
            updateHUD();
            createSparks(nut.x + nut.width / 2, nut.y + nut.height / 2, '#FFD700', 10);
        }
    });

    // Update enemies
    enemies.forEach(enemy => {
        enemy.x += enemy.velocityX;

        // Bounce off edges
        const gameWidth = isMobile ? 400 : 800;
        if (enemy.x < 0 || enemy.x + enemy.width > gameWidth) {
            enemy.velocityX *= -1;
        }

        // Check collision with player
        if (!invincible && checkCollision(player, enemy)) {
            loseLife();
        }
    });

    // Check pipe (win condition)
    pipes.forEach(pipe => {
        if (checkCollision(player, pipe)) {
            winLevel();
        }
    });

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3; // Gravity on particles
        p.life--;
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }

    // Update invincibility
    if (invincible) {
        invincibleTimer--;
        if (invincibleTimer <= 0) {
            invincible = false;
        }
    }
}

// Check collision
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Check platform collision (only from top)
function checkPlatformCollision(player, platform) {
    return player.x + 4 < platform.x + platform.width &&
           player.x + player.width - 4 > platform.x &&
           player.y + player.height > platform.y &&
           player.y + player.height < platform.y + platform.height &&
           player.velocityY >= 0;
}

// Lose life
function loseLife() {
    lives--;
    updateHUD();

    if (lives <= 0) {
        gameOver();
    } else {
        // Reset position with invincibility
        player.x = 100;
        player.y = 400;
        player.velocityX = 0;
        player.velocityY = 0;
        invincible = true;
        invincibleTimer = 120;
        createSparks(player.x + player.width / 2, player.y + player.height / 2, '#FF4444', 20);
    }
}

// Submit name to leaderboard
function submitName() {
    const name = playerNameInput.value.trim();
    if (name) {
        saveToLeaderboard(name.substring(0, 20), score);
        // Hide name entry screen and show game over screen
        nameEntryScreen.classList.add('hidden');
        finalScoreDisplay.textContent = `Score: ${score}`;
        gameOverScreen.classList.remove('hidden');
        // Clear input for next time
        playerNameInput.value = '';
    }
}

// Game over
function gameOver() {
    gameState = 'gameOver';

    // Check if score qualifies for leaderboard
    if (isTopScore(score) && score > 0) {
        setTimeout(() => {
            // Show custom name entry screen
            highScoreValue.textContent = `Score: ${score}`;
            nameEntryScreen.classList.remove('hidden');
            // Focus the input
            setTimeout(() => playerNameInput.focus(), 100);
        }, 500);
    } else {
        // Show game over screen
        finalScoreDisplay.textContent = `Score: ${score}`;
        setTimeout(() => {
            gameOverScreen.classList.remove('hidden');
        }, 500);
    }
}

// Win level
function winLevel() {
    gameState = 'win';
    score += 1000; // Level completion bonus
    winScoreDisplay.textContent = `Score: ${score}`;
    winScreen.classList.remove('hidden');
}

// Draw everything
function draw() {
    // Clear canvas
    const gameWidth = isMobile ? 400 : 800;
    ctx.fillStyle = '#5b9bd5';
    ctx.fillRect(0, 0, gameWidth, GAME_HEIGHT);

    // Draw clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (let i = 0; i < 4; i++) {
        ctx.fillRect(i * 250 - (player.animation % 500), 50 + i * 30, 80, 30);
    }

    // Draw platforms
    platforms.forEach(platform => {
        if (platform.type === 'ground') {
            // Ground (concrete)
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            ctx.fillStyle = '#654321';
            for (let i = 0; i < platform.width; i += 30) {
                ctx.fillRect(platform.x + i, platform.y, 28, platform.height);
            }
        } else {
            // Platform (circuit board)
            ctx.fillStyle = '#2d5016';
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(platform.x + 2, platform.y + 2, platform.width - 4, platform.height - 4);

            // Circuit traces
            ctx.strokeStyle = '#2d5016';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(platform.x + 10, platform.y + 10);
            ctx.lineTo(platform.x + platform.width - 10, platform.y + 10);
            ctx.stroke();
        }
    });

    // Draw pipes (electrical panels)
    pipes.forEach(pipe => {
        // Panel body (gray)
        ctx.fillStyle = '#666';
        ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);

        // Panel door
        ctx.fillStyle = '#888';
        ctx.fillRect(pipe.x + 5, pipe.y + 5, pipe.width - 10, pipe.height - 10);

        // Warning stripes
        ctx.fillStyle = '#FFD700';
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(pipe.x + 10, pipe.y + 15 + i * 20, pipe.width - 20, 8);
        }

        // Warning symbol
        ctx.fillStyle = '#FF0000';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('⚡', pipe.x + pipe.width / 2, pipe.y + pipe.height - 15);
    });

    // Draw wire nuts
    wireNuts.forEach(nut => {
        if (!nut.collected) {
            // Wire nut (orange hexagon)
            ctx.fillStyle = '#FF6600';
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                const x = nut.x + nut.width / 2 + Math.cos(angle) * 8;
                const y = nut.y + nut.height / 2 + Math.sin(angle) * 8;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();

            // Shine
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(nut.x + 4, nut.y + 4, 4, 4);
        }
    });

    // Draw enemies
    enemies.forEach(enemy => {
        // Spark ball
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width / 2, 0, Math.PI * 2);
        ctx.fill();

        // Electric arcs
        const time = Date.now() / 100;
        ctx.strokeStyle = '#FFFF00';
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
            const angle = (Math.PI / 2) * i + time;
            const x1 = enemy.x + enemy.width / 2;
            const y1 = enemy.y + enemy.height / 2;
            const x2 = x1 + Math.cos(angle) * 15;
            const y2 = y1 + Math.sin(angle) * 15;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    });

    // Draw player
    const flash = invincible && Math.floor(invincibleTimer / 5) % 2 === 0;
    if (!flash) {
        ctx.save();
        if (player.direction === -1) {
            ctx.scale(-1, 1);
            ctx.translate(-player.x * 2 - player.width, 0);
        }

        // Hard hat
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(player.x + 4, player.y, 24, 12);
        ctx.fillRect(player.x + 8, player.y - 4, 16, 4);

        // Face
        ctx.fillStyle = '#FFDBAC';
        ctx.fillRect(player.x + 6, player.y + 12, 20, 14);

        // Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(player.x + 10, player.y + 16, 3, 3);
        ctx.fillRect(player.x + 19, player.y + 16, 3, 3);

        // Body (orange vest)
        ctx.fillStyle = '#FF6600';
        ctx.fillRect(player.x + 4, player.y + 20, 24, 12);

        // Reflective stripes
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(player.x + 6, player.y + 24, 20, 2);

        ctx.restore();
    }

    // Draw particles
    particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 30;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        ctx.globalAlpha = 1;
    });
}

// Game loop
function gameLoop() {
    update();
    draw();

    if (gameState === 'playing') {
        requestAnimationFrame(gameLoop);
    }
}
