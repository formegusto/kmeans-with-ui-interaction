import { generateRandomDataset, itemSplit, linearInterpolation } from "@utils";
import React from "react";

const MAX_X = 200;
const MAX_Y = 200;

const initialValues: IUIContextValues = {
  mode: null,
  dots: null,
  interpolation: null,
  predictions: null,
  MAX_X,
  MAX_Y,
};
const initialActions: IUIContextActions = {
  changeMode: () => {},
  appendDot: () => {},
  randomDots: () => {},
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

  const [dots, setDots] = React.useState<IDot[] | null>(null);
  const appendDot = React.useCallback((p: IDot) => {
    setDots((prev) => (prev === null ? [p] : prev.concat([p])));
  }, []);
  const randomDots = React.useCallback((l?: number) => {
    setDots(generateRandomDataset({ shape: [l ?? 200, 2], max: 200 }));
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
      const centersInterpolation: IDot[][] = [];
      for (let i = 0; i < centers.length; i++) {
        const _inters: IDot[] = [];
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
    setDots(null);
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
        dots,
        interpolation,
        changeMode,
        appendDot,
        randomDots,
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
