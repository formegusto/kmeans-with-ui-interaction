export function generateRandomDataset({
  shape,
  max,
}: GenerateRandomDatasetParams): GenerateRandomDatasetResult {
  const [r, c] = shape;
  max = max ?? 100;
  const dataset = Array.from(
    {
      length: r ?? 1,
    },
    () =>
      Array.from(
        {
          length: c,
        },
        () => Math.round(Math.random() * max!)
      )
  );
  return dataset;
}
