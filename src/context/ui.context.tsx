import { generateRandomDataset, itemSplit, linearInterpolation } from "@utils";
import React from "react";

const MAX_X = 200;
const MAX_Y = 200;

const initialValues: IUIContextValues = {
  mode: null,
  points: null,
  interpolation: null,
  predictions: null,
  MAX_X,
  MAX_Y,
};
const initialActions: IUIContextActions = {
  changeMode: () => {},
  appendPoint: () => {},
  randomPoints: () => {},
  calcInterpolation: () => {},
  refresh: () => {},
  clear: () => {},
  appendPrediction: () => {},
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
    setPoints(generateRandomDataset({ shape: [l ?? 200, 2], max: 200 }));
  }, []);

  const [predictions, setPredictions] = React.useState<IPrediction[] | null>(
    null
  );

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

      // console.log(centers, nextCenters, centersInterpolation);

      // 2. label interpolation
      if (!result.distances || !result.labels) return;
      const { distances, labels } = result;

      // 2.1. generate min distances
      // const minDistances: number[] = [];
      // for (let i = 0; i < distances.length; i++) {
      //   const _distances = distances[i];
      //   minDistances.push(_distances[_distances.getMinIdx()]);
      // }

      // 2.1. label, min distances group 생성
      const idxes: number[] = Array.from(
        { length: labels.length },
        (_, i) => i
      );
      const pointsGroup: number[][] = Array.from(
        { length: centers.length },
        () => []
      );
      const distancesGroup: number[][] = Array.from(
        { length: centers.length },
        () => []
      );
      for (let i = 0; i < labels.length; i++) {
        pointsGroup[labels[i]].push(idxes[i]);
        distancesGroup[labels[i]].push(distances[i][labels[i]]);
      }

      // 2.3 group sorting
      for (let g = 0; g < pointsGroup.length; g++) {
        const _pointsGroup = pointsGroup[g];
        const _distancesGroup = distancesGroup[g];
        _pointsGroup.sort((a, b) => {
          const a_i = _pointsGroup.indexOf(a);
          const b_i = _pointsGroup.indexOf(b);

          return _distancesGroup[a_i] - _distancesGroup[b_i];
        });
      }

      // 2.4 labeling frames 생성
      const labelingFrames = pointsGroup.map((g) => itemSplit(g, frameCount));
      // console.log(centersInterpolation);
      setInterpolation({
        centers: centersInterpolation,
        labels: labelingFrames,
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

  const appendPrediction = React.useCallback(
    (p: IPrediction) => {
      if (predictions) setPredictions(predictions.concat(p));
    },
    [predictions]
  );

  React.useEffect(() => {
    if (mode === "predict") setPredictions([]);
    else setPredictions(null);
  }, [mode]);

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
        appendPrediction,
        predictions,
        MAX_X,
        MAX_Y,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}
