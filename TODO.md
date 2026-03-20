# MAMU BUTT ADVENTURE: TODO List

## ✅ Completed Tasks
- [x] **Project Setup**: Integrated React 19 + Phaser 3 + Vite.
- [x] **Ghibli Style CSS**: Soft colors, rounded buttons, and warm UI elements.
- [x] **Mamu Butt Character**: Created 🧔 on a 🛹 (Skateboard).
- [x] **Physics Fix**: Enabled Arcade Physics in `main.ts` (fixed "Start Adventure" crash).
- [x] **Level Logic**: Implemented Jungle (L1) and Snowy Mountains (L2) with transitions.
- [x] **EventBus Sync**: Connected Phaser scene status back to React UI for "Start" and "Restart".
- [x] **Responsive UI**: Fixed CSS buttons for better clickability across devices.
- [x] **Advanced Scenery**: Added parallax background layers (Sky, Clouds, Distant Hills, Near Hills).
- [x] **Vehicle Expansion**: Implemented multiple options: Skateboard (🛹), Rickshaw (🛺), UFO (🛸), Boat (⛵), Scooter (🛵), and Sofa (🛋️).
- [x] **Vehicle Picker**: Users can now click Mamu Butt in the Main Menu to cycle through vehicles.

## 🚧 In Progress
- [ ] **Sound Effects**: Integrating nature-inspired sounds (wind, birds, soft piano).

## ⏳ To Do (Pending)
- [ ] **Dynamic Level 3**: Underwater or Night biome.
- [ ] **High Score Persistence**: Save the best score to local storage.


## ❌ Known Issues / Fixed Errors
- [x] **Button Unresponsive**: Fixed by enabling Arcade Physics and improving `useEffect` in `PhaserGame.tsx`.
- [x] **Phaser Config Error**: Added missing physics settings in `main.ts`.
- [ ] **Hitbox Tuning**: (Pending) Verify if the gap is "easy" enough for all users.
