import { generateRandomDataset } from "@utils";
import React from "react";

const initialValue: IKMeansContext = {
  dataset: [],
  mode: null,
  K: null,

  changeMode: () => {},
  appendData: () => {},
  setK: () => {},
  setRandomDataset: () => {},
};

export const KMeansContext = React.createContext<IKMeansContext>(initialValue);
export function KMeansProvider({ children }: React.PropsWithChildren) {
  const [dataset, setDataset] = React.useState<IPoint[]>([]);
  const [mode, setMode] = React.useState<UIMode>(null);
  const [K, setK] = React.useState<number | null>(null);

  const changeMode = React.useCallback((m: UIMode) => {
    setMode(m);
  }, []);

  const appendData = React.useCallback((p: IPoint) => {
    setDataset((prev) => prev.concat([p]));
  }, []);

  const setRandomDataset = React.useCallback(() => {
    setDataset(generateRandomDataset({ shape: [100, 2] }));
  }, []);

  return (
    <KMeansContext.Provider
      value={{
        dataset,
        mode,
        changeMode,
        appendData,
        K,
        setK,
        setRandomDataset,
      }}
    >
      {children}
    </KMeansContext.Provider>
  );
}
