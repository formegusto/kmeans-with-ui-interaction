import { useUI } from "@hooks";
import { KMeans } from "@models";
import React from "react";

const FRAME_COUNT = 20;

const initialValues: IKMeansContextValues = {
  K: null,
  result: null,
  round: null,
};
const initialActions: IKMeansContextActions = {
  start: () => {},
  next: () => {},
  clear: () => {},
  refresh: () => {},
};
export const KMeansContext = React.createContext<IKMeansContext>({
  ...initialValues,
  ...initialActions,
});
export function KMeansProvider({ children }: React.PropsWithChildren) {
  const { calcInterpolation } = useUI();
  const [result, setResult] = React.useState<IKMeansResult | null>(null);
  const [iterator, setIterator] = React.useState<IKMeansIterator | null>(null);
  const [K, setK] = React.useState<number | null>(null);
  const [round, setRound] = React.useState<number | null>(null);
  const start = React.useCallback((k: number, dataset: IPoint[]) => {
    if (dataset.length > 0) {
      setK(k);
      const kmeans = new KMeans(k, dataset);
      const iterator = kmeans[Symbol.iterator]() as IKMeansIterator;
      setIterator(iterator);
      setResult({
        centers: iterator.centers!,
      });
      setRound(0);
    }
  }, []);
  const next = React.useCallback(() => {
    if (iterator) {
      const iterResult = iterator.next();
      if (!iterResult.done) {
        const result = iterResult.value;
        setResult(result);
        calcInterpolation(result, FRAME_COUNT);
        setRound((prev) => prev! + 1);
      }
    }
  }, [iterator, calcInterpolation]);
  const refresh = React.useCallback(
    (dataset: IPoint[]) => {
      start(K!, dataset);
    },
    [start, K]
  );
  const clear = React.useCallback(() => {
    setResult(null);
    setIterator(null);
    setK(null);
    setRound(null);
  }, []);

  return (
    <KMeansContext.Provider
      value={{
        K,
        result,
        round,
        clear,
        start,
        next,
        refresh,
      }}
    >
      {children}
    </KMeansContext.Provider>
  );
}