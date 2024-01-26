import { generateRandomDataset, linearInterpolation } from "@utils";
import React from "react";

const initialValues: IUIContextValues = {
  mode: null,
  points: null,
  interpolation: null,
};
const initialActions: IUIContextActions = {
  changeMode: () => {},
  appendPoint: () => {},
  randomPoints: () => {},
  calcInterpolation: () => {},
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

  const [interpolation, setInterpolation] =
    React.useState<UIInterpolation | null>(null);
  const calcInterpolation = React.useCallback(
    (result: IKMeansResult, frameCount: number) => {
      if (!result) return;
      // center interpolation
      if (!result.centers || !result.nextCenters) return;
      const { centers, nextCenters } = result;
      const centersInterpolation: IPoint[][] = [];
      for (let i = 0; i < centers.length; i++) {
        const _inters: IPoint[] = [];
        for (let t = 1 / frameCount; t <= 1; t += 1 / frameCount) {
          const _inter = linearInterpolation(centers[i], nextCenters![i], t);
          _inters.push(_inter);
        }
        centersInterpolation.push(_inters);
      }
      // console.log(centersInterpolation);
      setInterpolation({ centers: centersInterpolation, labels: [] });
      // label interpolation
      if (!result.distances || !result.labels) return;
    },
    []
  );

  const clear = React.useCallback(() => {
    setMode(null);
    setPoints(null);
    setInterpolation(null);
  }, []);

  return (
    <UIContext.Provider
      value={{
        mode,
        points,
        interpolation,
        changeMode,
        appendPoint,
        randomPoints,
        calcInterpolation,
        clear,
      }}>
      {children}
    </UIContext.Provider>
  );
}
