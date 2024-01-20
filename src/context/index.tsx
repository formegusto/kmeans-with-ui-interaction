import React from "react";

const initialValue: IKMeansContext = {
  dataset: [],
  mode: null,

  changeMode: () => {},
};

export const KMeansContext = React.createContext<IKMeansContext>(initialValue);
export function KMeansProvider({ children }: React.PropsWithChildren) {
  const [dataset, setDataset] = React.useState<IPoint[]>([]);
  const [mode, setMode] = React.useState<UIMode>(null);

  const changeMode = React.useCallback((mode: UIMode) => {
    setMode(mode);
  }, []);

  return (
    <KMeansContext.Provider value={{ dataset, mode, changeMode }}>
      {children}
    </KMeansContext.Provider>
  );
}
