/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GameSettings {
  muted: boolean;
  reducedMotion: boolean;
  selectedLevelId: string;
  completedLevelIds: string[];
  gridSnapEnabled: boolean;
  targetSnapEnabled: boolean;
  sandboxPieces?: string; // Serialized string for sandbox mode
}

const LOCAL_STORAGE_KEY = "rudy_shapes_lab_progress_v2";

const DEFAULT_SETTINGS: GameSettings = {
  muted: false,
  reducedMotion: false,
  selectedLevelId: "match_1",
  completedLevelIds: [],
  gridSnapEnabled: false,
  targetSnapEnabled: true,
};

/**
 * Loads settings and level completion progress from local storage
 */
export function loadGameSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    };
  } catch (err) {
    console.error("Failed to load game progress:", err);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Persists game settings and progress into local storage
 */
export function saveGameSettings(settings: Partial<GameSettings>): void {
  try {
    const current = loadGameSettings();
    const updated = {
      ...current,
      ...settings,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save game progress:", err);
  }
}

/**
 * Resets all progress data
 */
export function resetGameProgress(): GameSettings {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return DEFAULT_SETTINGS;
  } catch (err) {
    console.error("Failed to reset progress:", err);
    return DEFAULT_SETTINGS;
  }
}
