/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SnapTarget } from "./snapping";

export interface GameLevel {
  id: string;
  title: string;
  mode: "shape_match" | "tangram";
  description: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Preschool";
  requiredPieces: string[]; // List of pieces representing shapes, e.g. ['square', 'circle']
  targets: SnapTarget[];    // Targets where the pieces should snap
  hintData?: string[];      // Faint outline captions or sequential hints
}

const GAME_LEVELS_RAW: GameLevel[] = [
  // --- SHAPE MATCH MODE LEVEL 1 ---
  {
    id: "match_1",
    title: "Rudy's Warm Square",
    mode: "shape_match",
    description: "Drag the yellow square into the outline target on the board!",
    difficulty: "Preschool",
    requiredPieces: ["square"],
    targets: [
      {
        id: "m1_t1",
        type: "square",
        x: 450,
        y: 280,
        rotation: 0,
        scale: 1,
      },
    ],
    hintData: ["Look right in the center! Put the square in the box."],
  },
  
  // --- SHAPE MATCH MODE LEVEL 2 ---
  {
    id: "match_2",
    title: "Sunny Mountain",
    mode: "shape_match",
    description: "Place the round sun and the triangle mountain in their glowing slots.",
    difficulty: "Preschool",
    requiredPieces: ["circle", "triangle"],
    targets: [
      {
        id: "m2_t1",
        type: "circle",
        x: 350,
        y: 200,
        rotation: 0,
        scale: 1,
      },
      {
        id: "m2_t2",
        type: "triangle",
        x: 550,
        y: 290,
        rotation: 0,
        scale: 1,
      },
    ],
    hintData: ["The sun belongs in the sky!", "The mountain triangle sits on the ground."],
  },

  // --- SHAPE MATCH MODE LEVEL 3 ---
  {
    id: "match_3",
    title: "The Magic Playroom",
    mode: "shape_match",
    description: "Can you build a simple house? Match the roof, wall, and brick chimney!",
    difficulty: "Easy",
    requiredPieces: ["triangle", "square", "rectangle"],
    targets: [
      {
        id: "m3_t1",
        type: "triangle",
        x: 450,
        y: 190,
        rotation: 0,
        scale: 1,
      },
      {
        id: "m3_t2",
        type: "square",
        x: 450,
        y: 290,
        rotation: 0,
        scale: 1,
      },
      {
        id: "m3_t3",
        type: "rectangle",
        x: 560,
        y: 300,
        rotation: 90, // standing tall
        scale: 1,
      },
    ],
    hintData: ["The triangle roof goes on top!", "The square bottom forms the house.", "The rectangle chimney stands tall on the side."],
  },

  // --- SHAPE MATCH MODE LEVEL 4 ---
  {
    id: "match_4",
    title: "Outer Space Dream",
    mode: "shape_match",
    description: "Combine the star, the heart, and the curved dome to complete Rudy's space cruiser!",
    difficulty: "Medium",
    requiredPieces: ["star", "heart", "semicircle"],
    targets: [
      {
        id: "m4_t1",
        type: "star",
        x: 450,
        y: 180,
        rotation: 0,
        scale: 1,
      },
      {
        id: "m4_t2",
        type: "heart",
        x: 450,
        y: 310,
        rotation: 0,
        scale: 1,
      },
      {
        id: "m4_t3",
        type: "semicircle",
        x: 450,
        y: 430,
        rotation: 180, // upside down thrust dome
        scale: 1,
      },
    ],
    hintData: ["The shiny star flies on top!", "The friendly pink heart stays in the middle.", "The semicircle launcher fires glow engines!"],
  },

  // --- SHAPE MATCH MODE LEVEL 5 ---
  {
    id: "match_5",
    title: "The Heavy Geometry Truck",
    mode: "shape_match",
    description: "Match all the pieces to load the heavy truck with geometric cargo!",
    difficulty: "Hard",
    requiredPieces: ["rectangle", "trapezoid", "circle", "circle", "diamond"],
    targets: [
      {
        id: "m5_t1",
        type: "rectangle",
        x: 440,
        y: 280,
        rotation: 0,
        scale: 1.1,
      },
      {
        id: "m5_t2",
        type: "trapezoid",
        x: 600,
        y: 290,
        rotation: 90, // rotated cab hood
        scale: 1,
      },
      {
        id: "m5_t3",
        type: "circle",
        x: 370,
        y: 360,
        rotation: 0,
        scale: 0.9,
      },
      {
        id: "m5_t4",
        type: "circle",
        x: 510,
        y: 360,
        rotation: 0,
        scale: 0.9,
      },
      {
        id: "m5_t5",
        type: "diamond",
        x: 440,
        y: 180, // diamond carried on the flatbed!
        rotation: 45,
        scale: 1,
      },
    ],
    hintData: [
      "The large rectangle is the flatbed.",
      "The trapezoid is the engine hood facing front.",
      "Place both round wheels at the bottom.",
      "The glowing diamond diamond is the precious cargo!",
    ],
  },

  // --- TANGRAM MODE: ANIMALS (LEVELS 6-10) ---
  {
    id: "tangram_animal_1",
    title: "Sitting Cat",
    mode: "tangram",
    description: "Meow! Let's arrange classic pieces to draw a kitty looking back.",
    difficulty: "Medium",
    requiredPieces: [
      "large_triangle_1",
      "large_triangle_2",
      "medium_triangle",
      "small_triangle_1",
      "small_triangle_2",
      "tangram_square",
      "tangram_parallelogram",
    ],
    targets: [
      { id: "t_an1_lt1", type: "large_triangle_1", x: 450, y: 290, rotation: 45, scale: 1 },
      { id: "t_an1_lt2", type: "large_triangle_2", x: 450, y: 385, rotation: 135, scale: 1 },
      { id: "t_an1_mt", type: "medium_triangle", x: 450, y: 195, rotation: 180, scale: 1 },
      { id: "t_an1_st1", type: "small_triangle_1", x: 405, y: 135, rotation: 45, scale: 1 },
      { id: "t_an1_st2", type: "small_triangle_2", x: 495, y: 135, rotation: 315, scale: 1 },
      { id: "t_an1_sq", type: "tangram_square", x: 450, y: 148, rotation: 45, scale: 1 },
      { id: "t_an1_pa", type: "tangram_parallelogram", x: 360, y: 432, rotation: 45, scale: 1 },
    ],
    hintData: [
      "The small square sits tilted at 45 degrees to shape the head.",
      "The tiny triangles sit on top of the head as ears.",
      "The parallelogram forms the tail.",
    ],
  },
  {
    id: "tangram_animal_2",
    title: "Flying Swan",
    mode: "tangram",
    description: "Create a serene goose or swan spread out in majestic geometric flight!",
    difficulty: "Hard",
    requiredPieces: [
      "large_triangle_1",
      "large_triangle_2",
      "medium_triangle",
      "small_triangle_1",
      "small_triangle_2",
      "tangram_square",
      "tangram_parallelogram",
    ],
    targets: [
      { id: "t_an2_lt1", type: "large_triangle_1", x: 420, y: 350, rotation: 135, scale: 1 },
      { id: "t_an2_lt2", type: "large_triangle_2", x: 480, y: 350, rotation: 225, scale: 1 },
      { id: "t_an2_mt", type: "medium_triangle", x: 450, y: 250, rotation: 90, scale: 1 },
      { id: "t_an2_st1", type: "small_triangle_1", x: 380, y: 150, rotation: 45, scale: 1 },
      { id: "t_an2_st2", type: "small_triangle_2", x: 410, y: 200, rotation: 135, scale: 1 },
      { id: "t_an2_sq", type: "tangram_square", x: 450, y: 150, rotation: 0, scale: 1 },
      { id: "t_an2_pa", type: "tangram_parallelogram", x: 450, y: 450, rotation: 0, scale: 1 },
    ],
    hintData: [
      "Both large triangles spread out wide as wings.",
      "The small triangle and square shape the neck and beak.",
    ],
  },
  {
    id: "tangram_animal_3",
    title: "Running Dog",
    mode: "tangram",
    description: "Woof! Arrange the shapes to make a sweet puppy running fast!",
    difficulty: "Medium",
    requiredPieces: [
      "large_triangle_1",
      "large_triangle_2",
      "medium_triangle",
      "small_triangle_1",
      "small_triangle_2",
      "tangram_square",
      "tangram_parallelogram",
    ],
    targets: [
      { id: "t_an3_sq", type: "tangram_square", x: 340, y: 180, rotation: 45, scale: 1 },
      { id: "t_an3_st1", type: "small_triangle_1", x: 295, y: 145, rotation: 0, scale: 1 },
      { id: "t_an3_mt", type: "medium_triangle", x: 385, y: 225, rotation: 90, scale: 1 },
      { id: "t_an3_lt1", type: "large_triangle_1", x: 480, y: 270, rotation: 180, scale: 1 },
      { id: "t_an3_lt2", type: "large_triangle_2", x: 480, y: 365, rotation: 0, scale: 1 },
      { id: "t_an3_st2", type: "small_triangle_2", x: 575, y: 315, rotation: 270, scale: 1 },
      { id: "t_an3_pa", type: "tangram_parallelogram", x: 540, y: 225, rotation: 45, scale: 1 },
    ],
    hintData: [
      "The tilted square is the head.",
      "The medium triangle is the neck matching the main torso.",
    ],
  },
  {
    id: "tangram_animal_4",
    title: "Swimming Whale",
    mode: "tangram",
    description: "Splish splash! Build a giant friendly whale swimming in the deep blue ocean.",
    difficulty: "Hard",
    requiredPieces: [
      "large_triangle_1",
      "large_triangle_2",
      "medium_triangle",
      "small_triangle_1",
      "small_triangle_2",
      "tangram_square",
      "tangram_parallelogram",
    ],
    targets: [
      { id: "t_an4_lt1", type: "large_triangle_1", x: 400, y: 250, rotation: 90, scale: 1 },
      { id: "t_an4_lt2", type: "large_triangle_2", x: 495, y: 250, rotation: 270, scale: 1 },
      { id: "t_an4_mt", type: "medium_triangle", x: 590, y: 200, rotation: 0, scale: 1 },
      { id: "t_an4_st1", type: "small_triangle_1", x: 590, y: 290, rotation: 180, scale: 1 },
      { id: "t_an4_st2", type: "small_triangle_2", x: 400, y: 150, rotation: 135, scale: 1 },
      { id: "t_an4_pa", type: "tangram_parallelogram", x: 305, y: 250, rotation: 45, scale: 1 },
      { id: "t_an4_sq", type: "tangram_square", x: 400, y: 340, rotation: 45, scale: 1 },
    ],
    hintData: [
      "Both large triangles make the bulky whale belly.",
      "The medium and small triangles create the tall tail fin.",
    ],
  },
  {
    id: "tangram_animal_5",
    title: "Playful Camel",
    mode: "tangram",
    description: "Walk across the desert! Form a gorgeous camel with a big hump.",
    difficulty: "Hard",
    requiredPieces: [
      "large_triangle_1",
      "large_triangle_2",
      "medium_triangle",
      "small_triangle_1",
      "small_triangle_2",
      "tangram_square",
      "tangram_parallelogram",
    ],
    targets: [
      { id: "t_an5_st1", type: "small_triangle_1", x: 300, y: 140, rotation: 45, scale: 1 },
      { id: "t_an5_sq", type: "tangram_square", x: 300, y: 207, rotation: 45, scale: 1 },
      { id: "t_an5_lt1", type: "large_triangle_1", x: 395, y: 250, rotation: 90, scale: 1 },
      { id: "t_an5_mt", type: "medium_triangle", x: 300, y: 310, rotation: 180, scale: 1 },
      { id: "t_an5_lt2", type: "large_triangle_2", x: 480, y: 250, rotation: 270, scale: 1 },
      { id: "t_an5_pa", type: "tangram_parallelogram", x: 545, y: 340, rotation: 45, scale: 1 },
      { id: "t_an5_st2", type: "small_triangle_2", x: 480, y: 155, rotation: 135, scale: 1 },
    ],
    hintData: [
      "The square at (300, 207) shapes the long neck.",
      "The giant triangles create the sturdy back of the camel.",
    ],
  },
];

// --- TANGRAM MODE: ALL 26 ALPHABET LEVELS (A-Z) ---

interface LetterRawConfig {
  title: string;
  desc: string;
  diff: "Easy" | "Medium" | "Hard";
  coords: [number, number, number][]; // Order: lt1, lt2, mt, st1, st2, sq, pa
  hints: string[];
}

const letterConfigs: Record<string, LetterRawConfig> = {
  A: {
    title: "Letter A",
    desc: "A is for Astronaut and Apple! Match the pieces to form the letter A.",
    diff: "Easy",
    coords: [
      [410, 220, 135], [490, 220, 225], [450, 130, 180],
      [380, 310, 45],  [520, 310, 315], [450, 220, 0],
      [450, 280, 90]
    ],
    hints: [
      "The square forms the central bridge bar of the 'A'.",
      "The medium triangle is the pointed cap at the very top."
    ]
  },
  B: {
    title: "Letter B",
    desc: "B is for Balloon and Bear! Shape the rounded letter B.",
    diff: "Medium",
    coords: [
      [415, 180, 90], [415, 310, 90], [490, 245, 270],
      [490, 155, 180], [490, 335, 0], [415, 410, 0],
      [520, 410, 45]
    ],
    hints: [
      "Both large triangles line up on the left side to mark the straight spine.",
      "The square sits at the bottom-left corner."
    ]
  },
  C: {
    title: "Letter C",
    desc: "C is for Cookie and Cat! Fit the shapes to curve the letter C.",
    diff: "Hard",
    coords: [
      [450, 160, 0], [450, 340, 180], [370, 250, 90],
      [430, 250, 270], [490, 160, 45], [490, 340, 45],
      [370, 160, 135]
    ],
    hints: [
      "The large triangles form the top and bottom arches of the letter.",
      "The medium triangle secures the center-left backing spine."
    ]
  },
  D: {
    title: "Letter D",
    desc: "D is for Dinosaur and Drum! Assemble a friendly Letter D.",
    diff: "Medium",
    coords: [
      [400, 180, 90], [400, 320, 90], [480, 250, 270],
      [480, 150, 180], [480, 350, 0], [400, 420, 0],
      [500, 250, 45]
    ],
    hints: [
      "Stack the large triangles to build the tall left wall.",
      "The parallelogram sticks out on the right side of the curve."
    ]
  },
  E: {
    title: "Letter E",
    desc: "E is for Elephant and Engine! Combine three shelves to form the letter E.",
    diff: "Medium",
    coords: [
      [410, 180, 90], [410, 320, 90], [490, 150, 180],
      [490, 250, 180], [490, 350, 180], [410, 420, 0],
      [490, 420, 0]
    ],
    hints: [
      "Align the long pieces vertically to stand up the Letter E spine.",
      "The three medium and small triangles extend to the right like shelves."
    ]
  },
  F: {
    title: "Letter F",
    desc: "F is for Flamingo and Fox! Craft the elegant Letter F.",
    diff: "Medium",
    coords: [
      [410, 180, 90], [410, 320, 90], [490, 150, 180],
      [490, 250, 180], [410, 420, 0], [490, 420, 45],
      [370, 180, 135]
    ],
    hints: [
      "Arrange the vertical backbone using the two big triangles.",
      "Place the two shelves pointing to the right."
    ]
  },
  G: {
    title: "Letter G",
    desc: "G is for Giraffe and Grapes! Form the wide curly Letter G.",
    diff: "Hard",
    coords: [
      [450, 160, 0], [450, 340, 180], [370, 250, 90],
      [430, 250, 270], [530, 290, 90], [490, 340, 45],
      [370, 160, 135]
    ],
    hints: [
      "Use the large triangles to form the top and bottom curves.",
      "The small triangle at the right points inward to represent the gate."
    ]
  },
  H: {
    title: "Letter H",
    desc: "H is for Hippo and House! Bridge the gap with a high Letter H.",
    diff: "Medium",
    coords: [
      [380, 250, 90], [520, 250, 270], [450, 250, 0],
      [380, 150, 180], [520, 150, 0], [380, 350, 45],
      [520, 350, 45]
    ],
    hints: [
      "The big triangles stand tall on both the left and right side.",
      "Use the medium triangle to bridge the left and right columns."
    ]
  },
  I: {
    title: "Letter I",
    desc: "I is for Iguana and Ice Cream! Put together a straight Letter I.",
    diff: "Easy",
    coords: [
      [450, 230, 0], [450, 330, 180], [450, 150, 90],
      [390, 150, 180], [510, 150, 0], [450, 420, 45],
      [390, 420, 45]
    ],
    hints: [
      "Stack the big triangles vertically to build the tall column.",
      "Align the top and bottom crossbars symmetrical."
    ]
  },
  J: {
    title: "Letter J",
    desc: "J is for Jellyfish and Juice! Bend the tail of the Letter J.",
    diff: "Medium",
    coords: [
      [480, 210, 0], [480, 310, 180], [400, 370, 135],
      [480, 110, 180], [400, 310, 45], [480, 390, 45],
      [480, 110, 45]
    ],
    hints: [
      "The long column is on the right side.",
      "A curved hook sweeps up on the bottom left."
    ]
  },
  K: {
    title: "Letter K",
    desc: "K is for Koala and Kite! Spread out the wings of Letter K.",
    diff: "Hard",
    coords: [
      [390, 250, 90], [490, 180, 135], [490, 330, 45],
      [390, 130, 180], [390, 370, 0], [440, 250, 45],
      [540, 390, 45]
    ],
    hints: [
      "One vertical stem is on the left.",
      "Two limbs branch out to the upper-right and lower-right."
    ]
  },
  L: {
    title: "Letter L",
    desc: "L is for Lion and Lemon! Build a sturdy right-angled Letter L.",
    diff: "Easy",
    coords: [
      [400, 200, 90], [400, 340, 90], [400, 430, 0],
      [480, 430, 0], [540, 430, 0], [400, 110, 45],
      [480, 340, 45]
    ],
    hints: [
      "Stack the vertical column on the left edge.",
      "Align the horizontal foot flat on the ground."
    ]
  },
  M: {
    title: "Letter M",
    desc: "M is for Monkey and Mouse! Shape the double peak of Letter M.",
    diff: "Hard",
    coords: [
      [360, 280, 90], [540, 280, 270], [450, 200, 180],
      [410, 150, 45], [490, 150, 315], [360, 140, 45],
      [540, 140, 45]
    ],
    hints: [
      "Place the two largest triangles on the outer left and right.",
      "The medium and small triangles cluster in the middle to form the V-dip."
    ]
  },
  N: {
    title: "Letter N",
    desc: "N is for Nest and Nut! Run the diagonal bridge for Letter N.",
    diff: "Hard",
    coords: [
      [380, 250, 90], [520, 250, 270], [450, 250, 135],
      [380, 130, 180], [520, 370, 0], [410, 180, 45],
      [490, 320, 45]
    ],
    hints: [
      "Build two separate vertical towers on the sides.",
      "Connect them with a dramatic diagonal slope in the center."
    ]
  },
  O: {
    title: "Letter O",
    desc: "O is for Owl and Octopus! Circle back around for Letter O.",
    diff: "Medium",
    coords: [
      [450, 170, 0], [450, 330, 180], [380, 250, 90],
      [520, 250, 270], [450, 250, 45], [380, 170, 45],
      [520, 330, 45]
    ],
    hints: [
      "Arrange the shapes with a hollow circular space in the center.",
      "The large triangles cap the top and bottom arches."
    ]
  },
  P: {
    title: "Letter P",
    desc: "P is for Penguin and Panda! Cap off the tall Letter P loop.",
    diff: "Medium",
    coords: [
      [400, 210, 90], [400, 340, 90], [470, 170, 180],
      [470, 260, 0], [400, 110, 180], [400, 430, 0],
      [470, 220, 45]
    ],
    hints: [
      "Stand the tall vertical backbone on the left side.",
      "The circular wing nests on the upper-right."
    ]
  },
  Q: {
    title: "Letter Q",
    desc: "Q is for Queen and Quack! Add a little tail to the Letter Q.",
    diff: "Hard",
    coords: [
      [450, 170, 0], [450, 330, 180], [380, 250, 90],
      [520, 250, 270], [540, 370, 45], [380, 170, 45],
      [500, 340, 45]
    ],
    hints: [
      "Assemble the circular O body first.",
      "Place the small triangle pointing down-right as the diagnostic tail."
    ]
  },
  R: {
    title: "Letter R",
    desc: "R is for Rabbit and Rainbow! Run the kick leg for Letter R.",
    diff: "Hard",
    coords: [
      [400, 210, 90], [400, 340, 90], [470, 170, 180],
      [470, 250, 0], [470, 350, 45], [400, 110, 45],
      [540, 400, 135]
    ],
    hints: [
      "Create the high looping head on the top-right.",
      "Stick out the parallelogram to complete the kick-stand leg."
    ]
  },
  S: {
    title: "Letter S",
    desc: "S is for Snake and Sun! Curve twice to form the Letter S.",
    diff: "Hard",
    coords: [
      [450, 160, 0], [450, 340, 180], [410, 250, 135],
      [370, 190, 90], [520, 310, 270], [510, 160, 45],
      [380, 340, 45]
    ],
    hints: [
      "Top-left starts the high curve going right.",
      "Bottom-right curves back to the left."
    ]
  },
  T: {
    title: "Letter T",
    desc: "T is for Tiger and Turtle! Align the classic crossbar Letter T.",
    diff: "Easy",
    coords: [
      [450, 150, 180], [450, 280, 0], [450, 410, 180],
      [350, 150, 90], [550, 150, 270], [450, 350, 45],
      [350, 220, 135]
    ],
    hints: [
      "Lay down the upper horizontal crossbar using parts on top.",
      "The tall central body anchors the down-stroke."
    ]
  },
  U: {
    title: "Letter U",
    desc: "U is for Umbrella and Unicorn! Build a bowl for Letter U.",
    diff: "Medium",
    coords: [
      [380, 230, 90], [520, 230, 270], [450, 340, 180],
      [380, 120, 180], [520, 120, 0], [380, 320, 45],
      [520, 320, 45]
    ],
    hints: [
      "Ensure there is a deep hollow space between the two tall towers.",
      "The bottom is connected by flat-oriented triangles."
    ]
  },
  V: {
    title: "Letter V",
    desc: "V is for Volcano and Violin! Meet at the bottom point for Letter V.",
    diff: "Medium",
    coords: [
      [410, 250, 135], [490, 250, 225], [450, 340, 180],
      [370, 160, 180], [530, 160, 0], [450, 410, 45],
      [450, 415, 0]
    ],
    hints: [
      "Left and right arms slide down at diagonals.",
      "They converge at a neat bottom point."
    ]
  },
  W: {
    title: "Letter W",
    desc: "W is for Walrus and Watermelon! Double dip to create Letter W.",
    diff: "Hard",
    coords: [
      [380, 280, 45], [520, 280, 315], [450, 350, 0],
      [350, 180, 180], [550, 180, 0], [410, 390, 45],
      [490, 390, 45]
    ],
    hints: [
      "The layout has two high wings and dual valleys.",
      "Align the large triangles outwards."
    ]
  },
  X: {
    title: "Letter X",
    desc: "X is for Xylophone and X-ray! Cross in the center for Letter X.",
    diff: "Hard",
    coords: [
      [450, 250, 45], [450, 250, 135], [370, 170, 45],
      [530, 170, 315], [370, 330, 135], [530, 330, 225],
      [450, 150, 45]
    ],
    hints: [
      "Cross both massive triangles right in the center.",
      "Stack the small triangles and square symmetrically on the four corners."
    ]
  },
  Y: {
    title: "Letter Y",
    desc: "Y is for Yak and Yo-yo! Split the top to form Letter Y.",
    diff: "Medium",
    coords: [
      [410, 200, 135], [490, 200, 225], [450, 300, 180],
      [450, 380, 0], [450, 440, 180], [370, 120, 45],
      [530, 120, 45]
    ],
    hints: [
      "Build a single vertical post at the bottom-center.",
      "Split the two diagonal arms going skyward from the middle."
    ]
  },
  Z: {
    title: "Letter Z",
    desc: "Z is for Zebra and Zigzag! Zip across the board for Letter Z.",
    diff: "Hard",
    coords: [
      [450, 150, 180], [450, 350, 0], [450, 250, 135],
      [370, 150, 90], [530, 350, 270], [380, 250, 45],
      [520, 250, 45]
    ],
    hints: [
      "Lay top and bottom beams perfectly flat.",
      "Create the diagonal connect down from upper-right to lower-left."
    ]
  }
};

const TANGRAM_PIECES = [
  "large_triangle_1",
  "large_triangle_2",
  "medium_triangle",
  "small_triangle_1",
  "small_triangle_2",
  "tangram_square",
  "tangram_parallelogram",
];

const alphabetsSequence: GameLevel[] = Object.entries(letterConfigs).map(([letter, data], idx) => {
  return {
    id: `tangram_abc_${idx + 1}`,
    title: data.title,
    mode: "tangram",
    description: data.desc,
    difficulty: data.diff,
    requiredPieces: [...TANGRAM_PIECES],
    targets: TANGRAM_PIECES.map((pieceType, pIdx) => {
      const coord = data.coords[pIdx];
      return {
        id: `t_ab${idx + 1}_${pIdx}`,
        type: pieceType,
        x: coord[0],
        y: coord[1],
        rotation: coord[2],
        scale: 1,
      };
    }),
    hintData: data.hints,
  };
});

const thingsSequence: GameLevel[] = [
  // --- TANGRAM MODE: THINGS (LEVELS 16-20) ---
  {
    id: "tangram_thing_1",
    title: "Classic Little House",
    mode: "tangram",
    description: "Assemble the seven classic pieces to build a cozy tangram cottage!",
    difficulty: "Easy",
    requiredPieces: TANGRAM_PIECES,
    targets: [
      { id: "t_th1_lt1", type: "large_triangle_1", x: 450, y: 350, rotation: 0, scale: 1 },
      { id: "t_th1_lt2", type: "large_triangle_2", x: 450, y: 350, rotation: 90, scale: 1 },
      { id: "t_th1_mt", type: "medium_triangle", x: 450, y: 220, rotation: 180, scale: 1 },
      { id: "t_th1_st1", type: "small_triangle_1", x: 383, y: 283, rotation: 225, scale: 1 },
      { id: "t_th1_st2", type: "small_triangle_2", x: 517, y: 283, rotation: 135, scale: 1 },
      { id: "t_th1_sq", type: "tangram_square", x: 450, y: 283, rotation: 45, scale: 1 },
      { id: "t_th1_pa", type: "tangram_parallelogram", x: 550, y: 383, rotation: 135, scale: 1 },
    ],
    hintData: [
      "Both giant triangles create the sturdy base floor.",
      "The square rests comfortably in the center room.",
      "The chimney stack stands on the right.",
    ],
  },
  {
    id: "tangram_thing_2",
    title: "The Happy Boat",
    mode: "tangram",
    description: "Sailing through the geometry seas! Form the sailboat silhouette.",
    difficulty: "Medium",
    requiredPieces: TANGRAM_PIECES,
    targets: [
      { id: "t_th2_lt1", type: "large_triangle_1", x: 410, y: 250, rotation: 270, scale: 1 },
      { id: "t_th2_lt2", type: "large_triangle_2", x: 540, y: 250, rotation: 180, scale: 1 },
      { id: "t_th2_mt", type: "medium_triangle", x: 410, y: 380, rotation: 45, scale: 1 },
      { id: "t_th2_st1", type: "small_triangle_1", x: 475, y: 315, rotation: 90, scale: 1 },
      { id: "t_th2_st2", type: "small_triangle_2", x: 510, y: 380, rotation: 135, scale: 1 },
      { id: "t_th2_sq", type: "tangram_square", x: 475, y: 380, rotation: 0, scale: 1 },
      { id: "t_th2_pa", type: "tangram_parallelogram", x: 310, y: 380, rotation: 45, scale: 1 },
    ],
    hintData: [
      "The massive triangles form the tall sails pointing upward.",
      "The small square sits in the middle of the boat hull.",
    ],
  },
  {
    id: "tangram_thing_3",
    title: "Space Rocket Ship",
    mode: "tangram",
    description: "Help Rudy reach the cosmos! Fit the pieces to form the space rocket ship.",
    difficulty: "Medium",
    requiredPieces: TANGRAM_PIECES,
    targets: [
      { id: "t_th3_lt1", type: "large_triangle_1", x: 450, y: 250, rotation: 90, scale: 1 },
      { id: "t_th3_lt2", type: "large_triangle_2", x: 450, y: 350, rotation: 270, scale: 1 },
      { id: "t_th3_mt", type: "medium_triangle", x: 450, y: 150, rotation: 0, scale: 1 },
      { id: "t_th3_st1", type: "small_triangle_1", x: 380, y: 380, rotation: 0, scale: 1 },
      { id: "t_th3_st2", type: "small_triangle_2", x: 520, y: 380, rotation: 180, scale: 1 },
      { id: "t_th3_sq", type: "tangram_square", x: 450, y: 450, rotation: 45, scale: 1 },
      { id: "t_th3_pa", type: "tangram_parallelogram", x: 450, y: 520, rotation: 90, scale: 1 },
    ],
    hintData: [
      "The medium triangle is the sharp tip of the nose cone.",
      "The two giant pieces fit together to make the main steel hull block.",
    ],
  },
  {
    id: "tangram_thing_4",
    title: "Cozy Teapot",
    mode: "tangram",
    description: "Tea party time! Let's arrange classic pieces to draw a sweet teapot.",
    difficulty: "Hard",
    requiredPieces: TANGRAM_PIECES,
    targets: [
      { id: "t_th4_lt1", type: "large_triangle_1", x: 430, y: 270, rotation: 45, scale: 1 },
      { id: "t_th4_lt2", type: "large_triangle_2", x: 430, y: 365, rotation: 135, scale: 1 },
      { id: "t_th4_mt", type: "medium_triangle", x: 430, y: 175, rotation: 180, scale: 1 },
      { id: "t_th4_pa", type: "tangram_parallelogram", x: 340, y: 270, rotation: 45, scale: 1 },
      { id: "t_th4_sq", type: "tangram_square", x: 520, y: 270, rotation: 45, scale: 1 },
      { id: "t_th4_st1", type: "small_triangle_1", x: 430, y: 125, rotation: 0, scale: 1 },
      { id: "t_th4_st2", type: "small_triangle_2", x: 520, y: 365, rotation: 90, scale: 1 },
    ],
    hintData: [
      "The parallelogram forms the streaming spout on the left side.",
      "The square is the strong handle on the right side.",
    ],
  },
  {
    id: "tangram_thing_5",
    title: "Loving Heart",
    mode: "tangram",
    description: "Spread love and shapes! Form a beautiful symmetrical design heart.",
    difficulty: "Medium",
    requiredPieces: TANGRAM_PIECES,
    targets: [
      { id: "t_th5_lt1", type: "large_triangle_1", x: 410, y: 320, rotation: 45, scale: 1 },
      { id: "t_th5_lt2", type: "large_triangle_2", x: 490, y: 320, rotation: 315, scale: 1 },
      { id: "t_th5_mt", type: "medium_triangle", x: 450, y: 230, rotation: 180, scale: 1 },
      { id: "t_th5_st1", type: "small_triangle_1", x: 370, y: 230, rotation: 225, scale: 1 },
      { id: "t_th5_st2", type: "small_triangle_2", x: 530, y: 230, rotation: 135, scale: 1 },
      { id: "t_th5_sq", type: "tangram_square", x: 450, y: 150, rotation: 45, scale: 1 },
      { id: "t_th5_pa", type: "tangram_parallelogram", x: 450, y: 390, rotation: 0, scale: 1 },
    ],
    hintData: [
      "The large triangles form the left and right rounded lobes.",
      "The square sits right on top in the center.",
    ],
  },
];

export const GAME_LEVELS: GameLevel[] = [
  ...GAME_LEVELS_RAW,
  ...alphabetsSequence,
  ...thingsSequence,
];
