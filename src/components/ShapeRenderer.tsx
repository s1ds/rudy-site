import React from 'react';
import { ShapeType } from '../data/assets';

interface ShapeRendererProps {
  type: ShapeType;
  colorHex: string;
  className?: string;
  highContrast?: boolean;
}

export const ShapeRenderer: React.FC<ShapeRendererProps> = ({
  type,
  colorHex,
  className = 'w-full h-full',
  highContrast = false,
}) => {
  // Determine actual color mapping (high contrast = black/white shapes, otherwise normal colors)
  const fill = highContrast ? (colorHex === '#F9FAFB' ? '#111827' : '#000000') : colorHex;
  const stroke = highContrast ? '#FFFFFF' : 'rgba(0, 0, 0, 0.15)';
  const strokeWidth = highContrast ? 4 : 2.5;

  // Render SVG based on selected shape type
  // Standard viewBox is 0 0 100 100
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} overflow-visible`}
      role="img"
      aria-label={`A ${colorHex} ${type}`}
    >
      <defs>
        {/* Shading/Gradients for beautiful 3D shapes */}
        <linearGradient id={`shading-cube-${type}-${colorHex}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#000000" stopOpacity={0.25} />
        </linearGradient>
        <linearGradient id={`cone-grad-${colorHex}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={fill} stopOpacity={0.9} />
          <stop offset="30%" stopColor="#FFFFFF" stopOpacity={0.3} />
          <stop offset="70%" stopColor={fill} stopOpacity={0.9} />
          <stop offset="100%" stopColor="#000000" stopOpacity={0.35} />
        </linearGradient>
      </defs>

      {/* Actual Shape Path Definitions */}
      {(() => {
        switch (type) {
          case 'circle':
            return (
              <circle
                cx="50"
                cy="50"
                r="38"
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
              />
            );

          case 'square':
            return (
              <rect
                x="15"
                y="15"
                width="70"
                height="70"
                rx="12"
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
              />
            );

          case 'triangle':
            return (
              <polygon
                points="50,12 88,82 12,82"
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
              />
            );

          case 'heart':
            return (
              <path
                d="M50 85 C50 85 12 52 12 30 C12 15 24 8 36 8 C44 8 48 13 50 16 C52 13 56 8 64 8 C76 8 88 15 88 30 C88 52 50 85 50 85 Z"
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
              />
            );

          case 'star':
            return (
              <polygon
                points="50,7 63,35 93,35 69,54 78,84 50,66 22,84 31,54 7,35 37,35"
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
              />
            );

          case 'oval':
            return (
              <ellipse
                cx="50"
                cy="50"
                rx="28"
                ry="42"
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
              />
            );

          case 'rectangle':
            return (
              <rect
                x="10"
                y="22"
                width="80"
                height="56"
                rx="12"
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
              />
            );

          case 'diamond':
            return (
              <polygon
                points="50,10 88,50 50,90 12,50"
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
              />
            );

          case 'crescent':
            return (
              <path
                d="M32 15 C54 15 76 33 76 58 C76 74 65 89 54 94 C68 91 84 78 84 58 C84 31 63 10 32 15 Z"
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
              />
            );

          case 'hexagon':
            return (
              <polygon
                points="50,8 86,28 86,70 50,90 14,70 14,28"
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
              />
            );

          case 'cone':
            return (
              <g filter="drop-shadow(0 6px 8px rgba(0,0,0,0.15))">
                {/* Cone Body: Triangle with rounded base. Front & back gradients for 3D simulation */}
                <path
                  d="M50 10 L82 72 A32 10 0 0 1 18 72 Z"
                  fill={`url(#cone-grad-${colorHex})`}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeLinejoin="round"
                />
                {/* 3D Circular base overlay */}
                <ellipse
                  cx="50"
                  cy="72"
                  rx="31"
                  ry="9.5"
                  fill="none"
                  stroke={stroke}
                  strokeWidth={strokeWidth / 1.5}
                  strokeDasharray="4 4"
                  opacity={highContrast ? 0 : 0.4}
                />
              </g>
            );

          case 'cube':
            return (
              <g filter="drop-shadow(0 6px 10px rgba(0,0,0,0.18))">
                {/* 3D Isometric projection of a cube */}
                {/* Base color background */}
                <path
                  d="M50 15 L82 31 L82 69 L50 85 L18 69 L18 31 Z"
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeLinejoin="round"
                />

                {!highContrast && (
                  <>
                    {/* Top Face (Lighter shading) */}
                    <path
                      d="M50 15 L82 31 L50 47 L18 31 Z"
                      fill="#FFFFFF"
                      opacity={0.3}
                      stroke={stroke}
                      strokeWidth={strokeWidth / 2}
                    />
                    {/* Front Right Face (Darker shading) */}
                    <path
                      d="M50 47 L82 31 L82 69 L50 85 Z"
                      fill="#000000"
                      opacity={0.2}
                      stroke={stroke}
                      strokeWidth={strokeWidth / 2}
                    />
                    {/* Front Left Face (Intermediate color, natural fill) */}
                    <path
                      d="M18 31 L50 47 L50 85 L18 69 Z"
                      fill="#FFFFFF"
                      opacity={0.1}
                      stroke={stroke}
                      strokeWidth={strokeWidth / 2}
                    />
                  </>
                )}

                {highContrast && (
                  <>
                    {/* High contrast separator lines to distinguish faces */}
                    <line x1="50" y1="15" x2="50" y2="85" stroke={stroke} strokeWidth={strokeWidth} />
                    <line x1="18" y1="31" x2="50" y2="47" stroke={stroke} strokeWidth={strokeWidth} />
                    <line x1="82" y1="31" x2="50" y2="47" stroke={stroke} strokeWidth={strokeWidth} />
                  </>
                )}
              </g>
            );

          case 'cylinder':
            return (
              <g filter="drop-shadow(0 6px 8px rgba(0,0,0,0.15))">
                {/* Curved bottom face and wall */}
                <path
                  d="M20 25 L80 25 L80 72 A30 10 0 0 1 20 72 Z"
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeLinejoin="round"
                />

                {!highContrast && (
                  // Shiny highlight gradient layer
                  <path
                    d="M38 25 L50 25 L50 78 A30 10 0 0 1 38 78 Z"
                    fill="#FFFFFF"
                    opacity={0.18}
                  />
                )}

                {/* Top flat face */}
                <ellipse
                  cx="50"
                  cy="25"
                  rx="30"
                  ry="9.5"
                  fill={highContrast ? fill : 'rgba(255,255,255,0.25)'}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                />
              </g>
            );

          default:
            return null;
        }
      })()}
    </svg>
  );
};
