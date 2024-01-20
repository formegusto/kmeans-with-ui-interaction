import React from "react";

const initialValue: IKMeansContext = {
  dataset: [],
  mode: null,
};

export const KMeansContext = React.createContext<IKMeansContext>(initialValue);
export function KMeansProvider({ children }: React.PropsWithChildren) {
  const [dataset, setDataset] = React.useState<IPoint[]>([]);
  const [mode, setMode] = React.useState<UIMode>(null);

  return (
    <KMeansContext.Provider value={{ dataset, mode }}>
      {children}
    </KMeansContext.Provider>
  );
}
