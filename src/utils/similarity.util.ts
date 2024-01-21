export function euclideanDistance(A: number[], B: number[]) {
  return Math.sqrt(A.reduce((acc, A_i, i) => acc + (B[i] - A_i) ** 2, 0));
}
