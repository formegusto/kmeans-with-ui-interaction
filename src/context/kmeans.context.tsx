import { KMeans } from "@models";
import { generateRandomDataset } from "@utils";
import React from "react";

const initialValues: IKMeansContextValues = {
  dataset: [],
  K: null,

  result: null,
  interpolations: null,
  labelInterpolations: null,
};
const initialActions: IKMeansContextActions = {
  appendData: () => {},
  clearCanvas: () => {},
  setRandomDataset: () => {},
  start: () => {},
  next: () => {},
};
export const KMeansContext = React.createContext<IKMeansContext>({
  ...initialValues,
  ...initialActions,
});
export function KMeansProvider({ children }: React.PropsWithChildren) {
  const [dataset, setDataset] = React.useState<IPoint[]>([]);
  const [result, setResult] = React.useState<IKMeansResult | null>(null);
  const [iterator, setIterator] = React.useState<IKMeansIterator | null>(null);
  const [K, setK] = React.useState<number | null>(null);
  const [interpolations, setInterpolations] = React.useState<IPoint[][] | null>(
    null
  );
  const [labelInterpolations, setLabelInterpolations] = React.useState<
    any | null
  >(null);

  const appendData = React.useCallback((p: IPoint) => {
    setDataset((prev) => prev.concat([p]));
  }, []);

  const setRandomDataset = React.useCallback(() => {
    const genDataset = generateRandomDataset({ shape: [200, 2] });
    setDataset(genDataset);
  }, []);
  const clearCanvas = React.useCallback(() => {
    setDataset([]);
    setResult(null);
    setInterpolations(null);
    setLabelInterpolations(null);
    setIterator(null);
    setK(null);
  }, []);

  const start = React.useCallback(
    (k: number) => {
      if (dataset.length > 0) {
        setK(k);
        const kmeans = new KMeans(k, dataset);
        const iterator = kmeans[Symbol.iterator]() as IKMeansIterator;
        setIterator(iterator);
        setResult({
          centers: iterator.centers!,
        });
      }
    },
    [dataset]
  );

  const next = React.useCallback(() => {
    if (iterator) {
      const iterResult = iterator.next();
      if (!iterResult.done) {
        const result = iterResult.value;
        setResult(result);
        if (result.interpolations) setInterpolations(result.interpolations);
        if (result.labelInterpolations)
          setLabelInterpolations(result.labelInterpolations);
      }
    }
  }, [iterator]);

  return (
    <KMeansContext.Provider
      value={{
        dataset,
        K,
        result,
        interpolations,
        labelInterpolations,
        appendData,
        clearCanvas,
        setRandomDataset,
        start,
        next,
      }}>
      {children}
    </KMeansContext.Provider>
  );
}
