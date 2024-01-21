import { KMeans } from "@models";
import { generateRandomDataset } from "@utils";
import React from "react";

const initialValue: IKMeansContext = {
  dataset: [],
  mode: null,
  K: null,

  changeMode: () => {},
  appendData: () => {},
  setRandomDataset: () => {},
  start: () => {},
  next: () => {},

  centers: null,
  labels: null,
};

export const KMeansContext = React.createContext<IKMeansContext>(initialValue);
export function KMeansProvider({ children }: React.PropsWithChildren) {
  const [dataset, setDataset] = React.useState<IPoint[]>([]);
  const [centers, setCenters] = React.useState<IPoint[] | null>(null);
  const [labels, setLabels] = React.useState<number[] | null>(null);
  const [mode, setMode] = React.useState<UIMode>(null);
  const [K, setK] = React.useState<number | null>(null);
  const [iter, setIter] = React.useState<IKMeansIterator | null>(null);

  const changeMode = React.useCallback((m: UIMode) => {
    setMode(m);
  }, []);

  const appendData = React.useCallback((p: IPoint) => {
    setDataset((prev) => prev.concat([p]));
  }, []);

  const setRandomDataset = React.useCallback(() => {
    setDataset(generateRandomDataset({ shape: [200, 2] }));
  }, []);

  const start = React.useCallback(
    (k: number) => {
      setK(k);
      const kmeans = new KMeans(k, dataset);
      const iter = kmeans[Symbol.iterator]() as IKMeansIterator;
      setIter(iter);
      setCenters(iter.centers!);
      setMode("run");
    },
    [dataset]
  );

  const next = React.useCallback(() => {
    if (iter) {
      const iterResult = iter?.next();
      if (!iterResult.done) {
        const result = iterResult.value;
        setLabels(result.labels!);
        setCenters(result.centers!);
      }
    }
  }, [iter]);

  return (
    <KMeansContext.Provider
      value={{
        dataset,
        mode,
        changeMode,
        appendData,
        K,
        setRandomDataset,
        start,
        centers,
        labels,
        next,
      }}
    >
      {children}
    </KMeansContext.Provider>
  );
}
