import React from "react";

const initialValue: IKMeansContext = {
  dataset: [],
  mode: null,

  changeMode: () => {},
  appendData: () => {},
};

export const KMeansContext = React.createContext<IKMeansContext>(initialValue);
export function KMeansProvider({ children }: React.PropsWithChildren) {
  const [dataset, setDataset] = React.useState<IPoint[]>([]);
  const [mode, setMode] = React.useState<UIMode>(null);

  const changeMode = React.useCallback((m: UIMode) => {
    setMode(m);
  }, []);

  const appendData = React.useCallback((p: IPoint) => {
    setDataset((prev) => prev.concat([p]));
  }, []);

  return (
    <KMeansContext.Provider value={{ dataset, mode, changeMode, appendData }}>
      {children}
    </KMeansContext.Provider>
  );
}
