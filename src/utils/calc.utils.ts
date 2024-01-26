export function linearInterpolation(p1: IPoint, p2: IPoint, t: number): IPoint {
  const [x1, y1] = p1;
  const [x2, y2] = p2;

  const xDot = x1 + t * (x2 - x1);
  const yDot = y1 + t * (y2 - y1);

  return [xDot, yDot];
}

export function itemSplit(item: any[], count: number): number[][] {
  const splits = [];

  const rate = Math.round(item.length / count);
  for (let i = 0; i < item.length; i += rate) {
    if (i + rate < item.length) splits.push(item.slice(i, i + rate));
    else splits.push(item.slice(i));
  }

  return splits;
}
