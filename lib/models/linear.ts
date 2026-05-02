export function evaluateLinear(m: number, b: number, x: number): number {
  return m * x + b;
}

export function generatePoints(
  m: number,
  b: number,
  xMin: number,
  xMax: number,
  steps: number
): { x: number; y: number }[] {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + (i / steps) * (xMax - xMin);
    points.push({ x: Math.round(x * 100) / 100, y: evaluateLinear(m, b, x) });
  }
  return points;
}
