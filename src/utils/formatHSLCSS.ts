import { HSL } from '../data/data';

export function formatHSLCSS(hsl: HSL): string {
  const { h, s, l } = hsl;
  return `hsl(${h}deg ${s}% ${l}%)`;
}
