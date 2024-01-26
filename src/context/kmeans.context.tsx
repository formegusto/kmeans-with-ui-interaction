import { KMeans } from "@models";
import React from "react";

const initialValues: IKMeansContextValues = {
  K: null,
  result: null,
};
const initialActions: IKMeansContextActions = {
  start: () => {},
  next: () => {},
  clear: () => {},
};
export const KMeansContext = React.createContext<IKMeansContext>({
  ...initialValues,
  ...initialActions,
});
export function KMeansProvider({ children }: React.PropsWithChildren) {
  const [result, setResult] = React.useState<IKMeansResult | null>(null);
  const [iterator, setIterator] = React.useState<IKMeansIterator | null>(null);
  const [K, setK] = React.useState<number | null>(null);
  const start = React.useCallback((k: number, dataset: IPoint[]) => {
    if (dataset.length > 0) {
      setK(k);
      const kmeans = new KMeans(k, dataset);
      const iterator = kmeans[Symbol.iterator]() as IKMeansIterator;
      setIterator(iterator);
      setResult({
        centers: iterator.centers!,
      });
    }
  }, []);
  const next = React.useCallback(() => {
    if (iterator) {
      const iterResult = iterator.next();
      if (!iterResult.done) {
        const result = iterResult.value;
        setResult(result);
      }
    }
  }, [iterator]);
  const clear = React.useCallback(() => {
    setResult(null);
    setIterator(null);
    setK(null);
  }, []);

  return (
    <KMeansContext.Provider
      value={{
        K,
        result,
        clear,
        start,
        next,
      }}>
      {children}
    </KMeansContext.Provider>
  );
}
