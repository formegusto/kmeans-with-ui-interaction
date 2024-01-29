import { generateRandomDataset, itemSplit, linearInterpolation } from "@utils";
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
  refresh: () => {},
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
      // 1. center interpolation
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

      // 2. label interpolation
      if (!result.distances || !result.labels) return;
      const { distances, labels } = result;

      // 2.1. min distances group
      const minDistances: number[] = [];
      for (let i = 0; i < distances.length; i++) {
        const _distances = distances[i];
        minDistances.push(_distances[_distances.getMinIdx()]);
      }

      // 2.2. label, distances group 생성
      const idxes: number[] = Array.from(
        { length: labels.length },
        (_, i) => i
      );
      const labelGroup: number[][] = Array.from(
        { length: centers.length },
        () => []
      );
      const minDistancesGroup: number[][] = Array.from(
        { length: centers.length },
        () => []
      );
      for (let i = 0; i < labels.length; i++) {
        labelGroup[labels[i]].push(idxes[i]);
        minDistancesGroup[labels[i]].push(minDistances[i]);
      }

      for (let g = 0; g < labelGroup.length; g++) {
        const _labelGroup = labelGroup[g];
        const _minDistancesGroup = minDistancesGroup[g];
        _labelGroup.sort((a, b) => {
          const a_i = _labelGroup.indexOf(a);
          const b_i = _labelGroup.indexOf(b);

          return _minDistancesGroup[a_i] - _minDistancesGroup[b_i];
        });
      }

      // console.log(centersInterpolation);
      setInterpolation({
        centers: centersInterpolation,
        labels: labelGroup.map((g) => itemSplit(g, frameCount)),
      });
    },
    []
  );

  const clear = React.useCallback(() => {
    setMode(null);
    setPoints(null);
    setInterpolation(null);
  }, []);

  const refresh = React.useCallback(() => {
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
        refresh,
      }}>
      {children}
    </UIContext.Provider>
  );
}
