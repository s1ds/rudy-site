# Third-Party Notices and Studied Repositories

This file documents the public repositories that were studied to design the shape-handling math, snapping tolerances, and layout mechanics for **Rudy's Shapes Lab**, ensuring full attribution and clean-room implementation standards.

## 1. twpride/tangram
- **Role:** Studied relative coordinate layouts for classic 7-piece tangram scales, and silhouette matching mathematics.
- **Implementation Aspect:** Studied only; no direct code copied.
- **License:** Permissive / Open Source.

## 2. OMerkel/Tangram
- **Role:** Reviewed for SVG-based interaction structures, touch coordinates mapping, and classic vector silhouette ratios.
- **Implementation Aspect:** Studied only; no direct code copied.
- **License:** GPL-3.0 / studied conceptually.

## 3. shgalus/tangram
- **Role:** Reviewed for lightweight, permissive canvas piece drag behaviors.
- **Implementation Aspect:** Conceptually studied coordinate translations; no direct code copied.
- **License:** MIT.

## 4. AnandSuresh02/saturday_hacknight
- **Role:** Reviewed for child-friendly touch targets, large clickable handlers, and forgiving snapping offsets.
- **Implementation Aspect:** Studied only to scale bounding boxes; no code copied.
- **License:** Permissive.

## 5. iliagrigorevdev/tangram
- **Role:** Studied for polygon rotations from the centroid and point snapping calculations.
- **Implementation Aspect:** Studied only; no code copied (adhering strictly to GPL-3.0 copy protection bounds).
- **License:** GPL-3.0.

## 6. flbulgarelli/headbreaker
- **Role:** Reviewed for custom snap states, level selection arrays, and board bounding boxes.
- **Implementation Aspect:** Studied only; no code copied.
- **License:** MIT.

---

### Clean-Room Engineering Approach
Rudy's Shapes Lab was written in entirety as a **Clean-Room React, Vite, and TypeScript application** using custom SVG renderers, manual HTML5 Pointer Event interfaces, an offline sound synthesizer built natively over the browser's Web Audio API, and custom CSS color blending. No proprietary assets, graphics, sound files, or interface templates were loaded or embedded from Polypad, Amplify, or other commercial math toolkits.
