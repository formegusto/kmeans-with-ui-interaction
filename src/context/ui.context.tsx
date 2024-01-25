import { generateRandomDataset } from "@utils";
import React from "react";

const initialValues: IUIContextValues = {
  mode: null,
  points: null,
};
const initialActions: IUIContextActions = {
  changeMode: () => {},
  appendPoint: () => {},
  randomPoints: () => {},
  clear: () => {},
};
export const UIContext = React.createContext<IUIContext>({
  ...initialValues,
  ...initialActions,
});
export function UIProvider({ children }: React.PropsWithChildren) {
  const [mode, setMode] = React.useState<UIMode>(null);
  const changeMode = React.useCallback((m: UIMode) => {
    setMode(m);
  }, []);

  const [points, setPoints] = React.useState<IPoint[] | null>(null);
  const appendPoint = React.useCallback((p: IPoint) => {
    setPoints((prev) => (prev === null ? [p] : prev.concat([p])));
  }, []);
  const randomPoints = React.useCallback((l?: number) => {
    setPoints(generateRandomDataset({ shape: [l ?? 200, 2] }));
  }, []);

  const clear = React.useCallback(() => {
    setMode(null);
    setPoints(null);
  }, []);

  return (
    <UIContext.Provider
      value={{ mode, points, changeMode, appendPoint, randomPoints, clear }}>
      {children}
    </UIContext.Provider>
  );
}
