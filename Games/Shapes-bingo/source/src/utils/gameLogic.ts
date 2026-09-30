import { ShapeType, ColorType, SHAPES, COLORS, ShapeInfo, ColorInfo, GameMode } from '../data/assets';

export interface BingoCell {
  id: string;
  shape: ShapeType;
  color: ColorType;
  marked: boolean;
  shapeInfo: ShapeInfo;
  colorInfo: ColorInfo;
}

// Generate unique, non-repitive cells depending on the mode
export function generateBoard(mode: GameMode, gridSize: 3 | 4): BingoCell[] {
  const totalCells = gridSize * gridSize;
  const boardCells: BingoCell[] = [];

  // Deep copy/shuffle helper
  const shuffledShapes = [...SHAPES].sort(() => Math.random() - 0.5);
  const shuffledColors = [...COLORS].sort(() => Math.random() - 0.5);

  if (mode === 'shapes_only') {
    // Each cell must have a completely unique shape.
    // If the gridSize is 4x4 (16 cells) but we only have 13 shapes, we can allow a small fallback or duplicate colors but keep shapes as distinct as possible.
    for (let i = 0; i < totalCells; i++) {
      const shapeInfo = shuffledShapes[i % shuffledShapes.length];
      // Random color
      const colorInfo = shuffledColors[Math.floor(Math.random() * shuffledColors.length)];
      boardCells.push({
        id: `cell-${i}-${Date.now()}`,
        shape: shapeInfo.id,
        color: colorInfo.id,
        marked: false,
        shapeInfo,
        colorInfo,
      });
    }
  } else if (mode === 'colors_only') {
    // Each cell must have a completely unique color.
    for (let i = 0; i < totalCells; i++) {
      const colorInfo = shuffledColors[i % shuffledColors.length];
      // Random shape
      const shapeInfo = shuffledShapes[Math.floor(Math.random() * shuffledShapes.length)];
      boardCells.push({
        id: `cell-${i}-${Date.now()}`,
        shape: shapeInfo.id,
        color: colorInfo.id,
        marked: false,
        shapeInfo,
        colorInfo,
      });
    }
  } else {
    // Shapes & Colors: combinations must be unique. Let's build a pool of distinct pairs.
    const usedPairs = new Set<string>();
    let safetyCounter = 0;

    while (boardCells.length < totalCells && safetyCounter < 1000) {
      safetyCounter++;
      const shapeInfo = shuffledShapes[Math.floor(Math.random() * shuffledShapes.length)];
      const colorInfo = shuffledColors[Math.floor(Math.random() * shuffledColors.length)];
      const pairKey = `${shapeInfo.id}-${colorInfo.id}`;

      if (!usedPairs.has(pairKey)) {
        usedPairs.add(pairKey);
        boardCells.push({
          id: `cell-${boardCells.length}-${Date.now()}`,
          shape: shapeInfo.id,
          color: colorInfo.id,
          marked: false,
          shapeInfo,
          colorInfo,
        });
      }
    }

    // Fallback if safety limit reached
    if (boardCells.length < totalCells) {
      for (let i = boardCells.length; i < totalCells; i++) {
        const shapeInfo = shuffledShapes[i % shuffledShapes.length];
        const colorInfo = shuffledColors[i % shuffledColors.length];
        boardCells.push({
          id: `cell-${i}-${Date.now()}`,
          shape: shapeInfo.id,
          color: colorInfo.id,
          marked: false,
          shapeInfo,
          colorInfo,
        });
      }
    }
  }

  return boardCells;
}

// Select a random unmarked tile and generate its vocal command
export interface TargetPrompt {
  cellId: string;
  text: string;
  speakText: string;
  shape?: ShapeType;
  color?: ColorType;
}

export function selectNextTarget(cells: BingoCell[], mode: GameMode): TargetPrompt | null {
  const unmarked = cells.filter((c) => !c.marked);
  if (unmarked.length === 0) return null;

  // Pick a random unmarked cell
  const target = unmarked[Math.floor(Math.random() * unmarked.length)];

  // Formulate text depending on the active game mode
  let text = '';
  let speakText = '';

  if (mode === 'shapes_only') {
    text = `${target.shapeInfo.name}`;
    speakText = `Find the ${target.shapeInfo.name.toLowerCase()}`;
  } else if (mode === 'colors_only') {
    text = `${target.colorInfo.name}`;
    speakText = `Find a ${target.colorInfo.name.toLowerCase()} tile`;
  } else {
    text = `${target.colorInfo.name} ${target.shapeInfo.name}`;
    speakText = `Find the ${target.colorInfo.name.toLowerCase()} ${target.shapeInfo.name.toLowerCase()}`;
  }

  return {
    cellId: target.id,
    text,
    speakText,
    shape: target.shape,
    color: target.color,
  };
}

// Check if there is any finished row, column, or diagonal
export function checkBingo(cells: BingoCell[], gridSize: 3 | 4): { hasBingo: boolean; winningIndices: number[] } {
  const size = gridSize;
  const markedMap = cells.map((c) => c.marked);

  // Rows check
  for (let r = 0; r < size; r++) {
    const rowIndices: number[] = [];
    let complete = true;
    for (let c = 0; c < size; c++) {
      const idx = r * size + c;
      rowIndices.push(idx);
      if (!markedMap[idx]) {
        complete = false;
        break;
      }
    }
    if (complete) {
      return { hasBingo: true, winningIndices: rowIndices };
    }
  }

  // Columns check
  for (let c = 0; c < size; c++) {
    const colIndices: number[] = [];
    let complete = true;
    for (let r = 0; r < size; r++) {
      const idx = r * size + c;
      colIndices.push(idx);
      if (!markedMap[idx]) {
        complete = false;
        break;
      }
    }
    if (complete) {
      return { hasBingo: true, winningIndices: colIndices };
    }
  }

  // Diagonal 1 (Top-Left to Bottom-Right)
  const diag1Indices: number[] = [];
  let diag1Complete = true;
  for (let i = 0; i < size; i++) {
    const idx = i * size + i;
    diag1Indices.push(idx);
    if (!markedMap[idx]) {
      diag1Complete = false;
    }
  }
  if (diag1Complete) {
    return { hasBingo: true, winningIndices: diag1Indices };
  }

  // Diagonal 2 (Top-Right to Bottom-Left)
  const diag2Indices: number[] = [];
  let diag2Complete = true;
  for (let i = 0; i < size; i++) {
    const idx = i * size + (size - 1 - i);
    diag2Indices.push(idx);
    if (!markedMap[idx]) {
      diag2Complete = false;
    }
  }
  if (diag2Complete) {
    return { hasBingo: true, winningIndices: diag2Indices };
  }

  return { hasBingo: false, winningIndices: [] };
}

// Stats tracking interface in localStorage
export interface UserStats {
  gamesPlayed: number;
  totalCorrect: number;
  totalIncorrect: number;
  averageAccuracy: number;
}

export function loadUserStats(): UserStats {
  try {
    const data = localStorage.getItem('rudys_shapes_bingo_stats');
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Could not load user score stats', e);
  }
  return {
    gamesPlayed: 0,
    totalCorrect: 0,
    totalIncorrect: 0,
    averageAccuracy: 100,
  };
}

export function saveUserStats(stats: UserStats) {
  try {
    localStorage.setItem('rudys_shapes_bingo_stats', JSON.stringify(stats));
  } catch (e) {
    console.error('Could not save user score stats', e);
  }
}

export function updateStatsSummary(correctCount: number, incorrectCount: number) {
  const current = loadUserStats();

  const gamesPlayed = current.gamesPlayed + 1;
  const totalCorrect = current.totalCorrect + correctCount;
  const totalIncorrect = current.totalIncorrect + incorrectCount;

  // Accuracy calculation
  const totalTaps = correctCount + incorrectCount;
  const currentAccuracy = totalTaps > 0 ? Math.round((correctCount / totalTaps) * 100) : 100;

  // New moving average of accuracy across games
  const helperAverage = current.gamesPlayed > 0 ? current.averageAccuracy : 0;
  const newAverage = Math.round((helperAverage * current.gamesPlayed + currentAccuracy) / gamesPlayed);

  const updated: UserStats = {
    gamesPlayed,
    totalCorrect,
    totalIncorrect,
    averageAccuracy: newAverage,
  };

  saveUserStats(updated);
  return { currentAccuracy, overallAverage: newAverage };
}
