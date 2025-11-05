# 🎮 Shaffer Construction Games

A collection of 8-bit electrician-themed browser games built with pure JavaScript and HTML5 Canvas.

## Games

### ⚡ ZappyBird
**File:** `zappy-bird.html`

A Flappy Bird clone with an electrician twist! Navigate through exposed electrical wires as a hard-hatted electrician.

**Features:**
- Simple one-tap/click controls
- Electrician character with safety gear
- Electrical hazard obstacles
- High score tracking
- Mobile-friendly

**Controls:**
- Click/Tap to flap
- Avoid the exposed wires!

---

### 🔧 Sparky Bros
**File:** `sparky-bros.html`

A Super Mario Bros-style platformer featuring an electrician on an adventure through electrical hazards.

**Features:**
- Classic platformer gameplay
- Multiple levels with warp pipes
- Collect wire nuts
- Avoid electrical sparks
- Touch controls for mobile

**Controls:**
- **Desktop:** Arrow keys to move, Space to jump
- **Mobile:** On-screen D-pad and jump button
- Enter electrical panels to warp between areas

---

### 💀 Electrician Doom
**File:** `electrician-doom.html`

A complete first-person shooter in the style of classic Doom, themed around electrical warfare!

**Features:**
- Full 3D raycasting engine
- **9 complete levels** (Episode 1: Shock to the System)
- 7 enemy types (including final boss)
- 6 weapons (voltage tester to tesla coil)
- Colored key system (yellow, red, blue)
- Health and armor pickups
- Door mechanics
- Combat with projectiles and particle effects
- Complete HUD system
- Mobile controls support
- Victory and game over screens

**Story:**
The power plant has been overtaken by corrupted electrical entities. As the only electrician brave enough to enter, you must fight through 9 levels of electrical hazards, possessed equipment, and rogue robots to reach the Master Breaker and restore power to the city.

**Controls:**
- **WASD** - Move forward/backward/strafe
- **Arrow Keys / Mouse** - Look around
- **Space** - Shoot
- **1-6** - Switch weapons
- **E** - Use/Open doors
- **Mobile** - On-screen touch controls

**Levels:**
1. **E1M1: Power Plant Entrance** - Tutorial level
2. **E1M2: Transformer Station** - First keycard puzzles
3. **E1M3: Circuit Breaker Hell** - Complex maze
4. **E1M4: High Voltage Zone** - Hazardous environments
5. **E1M5: The Substation** - Large multi-key level
6. **E1M6: Wire Management Nightmare** - Dense enemy combat
7. **E1M7: Generator Core** - Heavy combat arena
8. **E1M8: Control Room Chaos** - Boss preparation
9. **E1M9: Master Breaker** - Epic boss battle!

**Enemies:**
- **Spark Imp** - Basic floating spark (20 HP)
- **Wire Zombie** - Possessed electrician (30 HP)
- **Circuit Demon** - Fast melee attacker (50 HP)
- **Voltage Spectre** - Semi-invisible threat (40 HP)
- **Arc Trooper** - Armored ranged robot (70 HP)
- **Tesla Baron** - Powerful mini-boss (150 HP)
- **Master Breaker** - Final boss (500 HP)

**Weapons:**
1. **Voltage Tester** - Infinite ammo pistol (10 damage)
2. **Wire Strippers** - Shotgun with spread (50 damage)
3. **Power Drill** - Rapid-fire chaingun (8 damage)
4. **Arc Welder** - Plasma rifle (30 damage)
5. **Circuit Breaker** - Explosive rockets (80 damage)
6. **Tesla Coil** - Ultimate weapon (200 damage, area effect)

**Tips:**
- Find colored keys to unlock doors
- Collect coffee ☕ for health
- Pick up safety gear 🦺 for armor
- Save your Tesla Coil ammo for the final boss!
- Watch out for Voltage Spectres - they're hard to see!
- The exit is marked green on each level

---

## Technical Details

### Architecture
All games are built with:
- Pure JavaScript (no frameworks)
- HTML5 Canvas rendering
- 8-bit pixel art style
- Electrician/construction theme
- Mobile-responsive controls
- Local storage for high scores

### Style Guide
- **Colors:** Gold (#FFD700), Orange (#FF6600), Blue (#0080FF)
- **Theme:** Electrician safety gear, electrical hazards, construction
- **Font:** Courier New monospace
- **Style:** Retro 8-bit pixel art aesthetic

### File Structure
```
games/
├── README.md                  # This file
├── zappy-bird.html           # ZappyBird game
├── sparky-bros.html          # Sparky Bros game
├── sparky-bros.css           # Sparky Bros styles
├── sparky-bros.js            # Sparky Bros game logic
├── electrician-doom.html     # Electrician Doom game
├── electrician-doom.css      # Doom styles
├── electrician-doom.js       # Doom game engine
├── game.js                   # ZappyBird game logic
└── style.css                 # ZappyBird styles
```

### Navigation
Each game includes a navigation bar linking back to:
- Main site: `../../`
- Games listing: `../../games`

### Base Path
All games use the centralized base path configuration from `site/app/config.ts`:
```javascript
export const BASE_PATH = '/shaffercon';
```

## Development

### Adding New Games
1. Create HTML file in `site/public/games/`
2. Use unique filename (not `index.html`)
3. Include navigation bar with base path
4. Follow 8-bit electrician theme
5. Add mobile controls if applicable
6. Update this README

### Testing
Games can be tested by:
1. Building the Next.js site: `npm run build`
2. Deploying to GitHub Pages
3. Accessing at: `https://banddude.github.io/shaffercon/games/[game-name].html`

Or test locally by opening HTML files directly.

## Credits

All games created for Shaffer Construction's website to showcase fun electrician-themed entertainment while maintaining the company's professional brand identity.

**Company:** Shaffer Construction
**Theme:** Electrician / Construction
**Style:** 8-bit Retro Gaming
**Platform:** Web Browser (Desktop & Mobile)

---

**⚡ Enjoy the games! Stay safe and grounded! ⚡**
