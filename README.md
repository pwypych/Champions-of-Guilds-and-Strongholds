# Champions of Guilds and Strongholds

Champions of Guilds and Strongholds is a multiplayer strategy game set in a fantasy world of castles, heroes, and rival factions. Players explore a shared map, expand their power from their castles, and clash in tactical battles where unit skills and positioning decide the outcome.

![Game Lobby Placeholder](docs/images/game-lobby.png)

## Game Context
You lead a faction of heroes and units across a procedurally built land. Each game starts with a generated map and land layout, then players choose their race, prepare their forces, and enter the world together. The goal is to grow your economy, control key locations, and defeat rival heroes.

![World Map Placeholder](docs/images/world-map.png)

## Features
- Multiplayer fantasy strategy with simultaneous turns (all players act at the same time, then the turn resolves together).
- Procedural map generator and land generator for varied playthroughs.
- Castle management: build race-specific buildings and unlock stronger units.
- Unit recruitment system with resource costs and tiered progression.
- World exploration with fog, resources, and strategic positions.
- Capturable mines that generate ongoing income.
- NPC encounters and PvP hero battles.
- Save/load snapshots of turns for quick rollback and replay.

![Map Generator Placeholder](docs/images/map-generator.png)
![Land Generator Placeholder](docs/images/land-generator.png)

## Core Gameplay Loop
1. Pick your race and name in the lobby.
2. Prepare your castle and initial hero.
3. Explore the map, gather resources, and capture mines.
4. Recruit units and build fortifications to expand your army.
5. Engage in battles against NPC stacks or other players.
6. End the turn when ready and wait for other players to finish.

## Economy and Resources
Resources are collected directly from the map and from captured mines. Each day (turn) provides baseline income, and mines add ongoing resource generation. This fuels building construction and unit recruitment.

## Battles
Battles take place on a grid-based battlefield with unit stacks. Each stack has its own stats (life, movement, maneuvers, damage) and can perform actions like walking, melee attacks, shooting, or waiting. Damage is calculated using multiple parameters:
- Unit base damage and unit count.
- Line-of-fire obstacles for ranged attacks.
- Randomized damage grades (miss, low, mid, high, crit).
- Target life/stack size and remaining unit health.

When a player fights against NPC forces, another human player controls the NPC units, turning the encounter into a PvP-style tactical duel.

![Battle GIF Placeholder](docs/images/placeholder-battle.gif)

## Screenshots and Media
- Game lobby: `docs/images/placeholder-game-lobby.png`
- Map generator: `docs/images/placeholder-map-generator.png`
- Land generator: `docs/images/placeholder-land-generator.png`
- Battle gif: `docs/images/placeholder-battle.gif`

## Tech Stack
- Node.js + Express backend
- MongoDB persistence
- Pixi.js rendering on the client

## Roadmap Ideas
- Additional races and unit archetypes
- More map generators and land presets
- Expanded battle abilities and terrain effects
