# Rudy's Shapes Lab 🧩🎨

Welcome to **Rudy's Shapes Lab**, a playful, immersive, and educational geometry sandbox and classic tangram solver. This application has been designed specifically for young explorers to learn about shape sorting, classic physical puzzle matching, and glowing light box color blending.

The application is written as a **zero-dependency, clean-room implementation** utilizing React, Vite, TypeScript, SVG coordinate transformations, and the HTML5 Pointer Events standard (touch-and-stylus supportive).

---

## 🎮 Game Modes

### 1. 🌟 Free Play Mode
- A complete digital tray of colorful toys: stars, hearts, trapezoids, circles, triangles, rectangle slabs, and diamonds.
- Children can spawn infinite blocks in the center of the screen with a tap, slide them around, and scale or organize them in freeform layout structures.
- Supports a handy sandbox-mixing "Mix Magic" randomizer, individual piece trashing, and full grid toggling.

### 2. 🎯 Shape Match Mode (5 Levels)
- Custom-tailored preschool shape-sorting outlines with friendly, easy-grip touch surfaces.
- Forgiving magnetic snap zones allow little fingers to slide shapes close to targets, where they snap cleanly with a glowing bubble pop chime.
- Staggered initial piece layouts are presented orderly inside a bottom wooden "StAGING DOCK" to preserve desktop layout purity.

### 3. 🧩 Classic Tangram Mode (5 Levels)
- Seven geometry shape parts (large triangles, medium, small, square room, and slanted parallelograms) are combined to solve solid silhouette puzzles (cozy cottage, little sailboat, rocket, kitty, and flying swan).
- Rotating pieces is accessible: clicking an active shape reveals giant Touch Rotator bubbles.
- Pressing **Q** or **E** on the keyboard rotates selected blocks.
- Clicking **Hint** sequentially reveals faint individual piece diagrams inside the black silhouette block.

### 4. 💡 Illuminated Light Box Mode
- Inspired by scientific illuminated shape sorting tables.
- Shapes obtain a brilliant acrylic translucency. Sliding blocks over each other blends colors natively inside the browser's GPU rendering layer (e.g., sliding yellow over cyan automatically forms green).
- Displays active color-blend interaction readouts.

---

## 🛠️ Developmental Math and Snapping Architecture

- **Centroid Transformations (`src/game/geometry.ts`):** 
  All polygon matrix operations translate and rotate around the local `(0, 0)` centroid, keeping the element beautifully positioned relative to the mouse/touch cursor.
- **Magnetic Snappings (`src/game/snapping.ts`):**
  Incorporates modular modulo logic to evaluate rotary symmetry for circles, squares (90-degree congruence), rectangles (180-degree congruence), and parallelograms, supporting multi-orientational snaps.
- **Container Boundaries (`src/game/collision.ts`):**
  Ensures pieces stay safely confined on the board.
- **Synthesized Audio Engine (`src/game/sounds.ts`):**
  Uses the standard **Web Audio API** to dynamically synthesize rich pentatonic scale complete chimes, bubble pops, and bouncy indicators entirely on-device, running completely offline with no copyrighted MP3 assets.

---

## 🚀 Setup and Local Development Instructions

The project is fully installable and executable. Ensure you have Node.js (v18+) installed.

### 1. Install dependencies
```bash
npm install
```

### 2. Run the application in development mode
The server binds to port `3000` to support local ingress tunnels:
```bash
npm run dev
```

### 3. Build for production compilation
```bash
npm run build
```

---

## 📑 Attributions and Study Credits
Please refer to `docs/THIRD_PARTY_NOTICES.md` for a ledger of open-source repositories studied to formulate the geometry structures of Rudy's Shapes Lab.
