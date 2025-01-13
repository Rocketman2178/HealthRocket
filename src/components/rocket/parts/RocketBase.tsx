import React from 'react';
import { cn } from '../../../lib/utils';
import type { RocketColors, RocketDesign } from '../../../types/rocket';

interface RocketBaseProps {
  colors: RocketColors;
  design: RocketDesign;
  level: number;
  className?: string;
}

export function RocketBase({ colors, design, level, className }: RocketBaseProps) {
  return (
    <svg
      viewBox="241.832 93.613 181 254"
      className={cn("transition-all duration-500", className)}
    >
      {/* Left Flame Base */}
      <path
        d="M241.832,286.262C272.832,260.41 309.684,278.793 309.684,278.793L327.555,225.957C286.152,219.375 256.141,246.23 241.832,286.262Z"
        fill={colors.accent}
        className="transition-colors duration-300"
      />
      
      {/* Right Flame Base */}
      <path
        d="M348.516,347.055C355.406,307.281 321.059,284.562 321.059,284.562L357.883,242.664C384.285,275.234 376.035,314.648 348.516,347.055Z"
        fill={colors.accent}
        className="transition-colors duration-300"
      />
      
      {/* Main Rocket Body */}
      <path
        d="M297.434,293.027C313.691,195.668 353.547,127.375 422.246,93.613C427.355,169.992 388.137,238.652 311.953,301.41L297.434,293.027Z"
        fill={colors.primary}
        className="transition-colors duration-300"
      />
      
      {/* Window */}
      <path
        d="M372.598,161.125C362.034,161.125 353.504,169.66 353.504,180.223C353.504,190.785 362.034,199.363 372.598,199.363C383.16,199.363 391.738,190.785 391.738,180.223C391.738,169.66 383.16,161.125 372.598,161.125Z"
        fill={colors.window}
        className="transition-colors duration-300"
      />
    </svg>
  );
}