# Rudy's Shapes Lab • Design and Architecture Notes

This document provides a technical walkthrough of the core physics, mathematics, and architecture underpinning Rudy's interactive playground.

## 1. Math and Geometry System (`src/game/geometry.ts`)

- **Centroid-Based Transforms:**
  Each shape template's points are defined relative to its local centroid at `(0, 0)`. When rendering or dragging, we translate all points using standard vector translation:
  $$P_{global} = P_{local} \cdot S + \vec{Translate}$$
  And rotate them by angle $\theta$ around parent centroid `(0, 0)`:
  $$x' = x \cdot \cos(\theta) - y \cdot \sin(\theta)$$
  $$y' = x \cdot \sin(\theta) + y \cdot \cos(\theta)$$
  By rotating around the local `(0, 0)` centroid, rotating pieces doesn't cause them to drift erratically on the board.

- **Bounding Box Boundary Enforcement (`src/game/collision.ts`):**
  We map local bounding limits in real time so the active pieces never slide off-screen during fast drag events. The bounding boxes are computed dynamically from the rotated global points coordinates.

## 2. Interactive Snapping Systems (`src/game/snapping.ts`)

- **Rotational Symmetry Mapping:**
  To make shapes feel ultra-forgiving and intuitive for children, our snaps account for symmetric alignments:
  - **Circles:** Invariant under rotation (any angle snaps successfully).
  - **Squares / Tangram Squares:** Symmetric every $90^\circ$. The delta rotation is mapped using a modulo $90$ delta check:
    $$\Delta \theta = ||(\theta_{piece} - \theta_{target}) \pmod{90}||$$
  - **Rectangles, Diamonds, Parallelograms:** Symmetric every $180^\circ$ ($180^\circ$ modulo check).
  - **Isosceles Triangles:** Snaps in its exact correct $360^\circ$ layout.

- **Dual-Tolerance Profiles (`src/game/constants.ts`):**
  - **Shape Match (Preschool):** Uses forgiving tolerances (distance $< 35\text{px}$, rotation delta $< 15^\circ$) so children do not get frustrated.
  - **Tangram Solitaire (Puzzles):** Uses tighter precision controls (distance $< 18\text{px}$, rotation delta $< 8^\circ$) to maintain appropriate cognitive challenge.

## 3. Real-Time Color Blending (`src/modes/LightBoxMode.tsx`)

- **Natively Blended Alphas:**
  To achieve high-fidelity transparent plastic color overlays, we omit heavy canvas pixel color evaluations. Instead, we use native SVG stacking combined with custom opacity states (`fill-opacity="0.74"` and glow filters). The browser's compositing engine naturally blends overlapping light-waves, creating new mixing spectra automatically when blocks cross paths.
