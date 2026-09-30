/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const BOARD_WIDTH = 900;
export const BOARD_HEIGHT = 580;

export const ROTATION_INCREMENT = 45; // Default child-friendly rotation increment
export const ROTATION_INCREMENT_STRICT = 15; // Precision rotation if needed

// Forgiving snap parameters (in SVG coordinate pixels)
export const SNAP_DISTANCE_FORGIVING = 35;
export const SNAP_ANGLE_FORGIVING = 15;

// Strict snap parameters for Tangram mode
export const SNAP_DISTANCE_STRICT = 18;
export const SNAP_ANGLE_STRICT = 8;

export const SHAPE_COLORS = {
  red: "#F43F5E",     // Emerald, Rose, Amber etc. translucent plastic feeling
  rose: "#FDA4AF",
  blue: "#0EA5E9",
  sky: "#7DD3FC",
  green: "#10B981",
  emerald: "#6EE7B7",
  amber: "#F59E0B",
  orange: "#F97316",
  violet: "#8B5CF6",
  purple: "#D8B4FE",
  pink: "#EC4899",
  yellow: "#FBBF24",
  teal: "#14B8A6",
};

export const COLOR_BLENDS: Record<string, string> = {
  // Simple red + blue = purple color blending lookup for Light Box mode
  "#F43F5EB4_#0EA5E9B4": "#A855F7C8", // translucent red + translucent blue = purple
  "#F43F5EB4_#FBBF24B4": "#F97316C8", // red + yellow = orange
  "#0EA5E9B4_#FBBF24B4": "#10B981C8", // blue + yellow = green
  "#14B8A6B4_#F43F5EB4": "#64748BC8", // teal + red
  // fallbacks can be computed/approximated dynamically as well in Light Box!
};
