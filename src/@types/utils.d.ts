declare interface GenerateRandomDatasetParams {
  // [row, column]
  shape: [number, number];
  max?: number;
}

declare interface GenerateRandomDatasetRunParams {
  length: string;
}

declare type GenerateRandomDatasetResult = number[][];
