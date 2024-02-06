import { useUI } from "@hooks";
import { KMeans } from "@models";
import React from "react";

const FRAME_COUNT = 50;
const DATASET_COUNT_THRESHOLD = 10;

const initialValues: IKMeansContextValues = {
  K: null,
  result: null,
  round: null,
  isDone: null,
};
const initialActions: IKMeansContextActions = {
  start: () => {},
  next: () => {},
  clear: () => {},
  refresh: () => {},
  autoNext: () => {},
  predict: () => null,
};
export const KMeansContext = React.createContext<IKMeansContext>({
  ...initialValues,
  ...initialActions,
});
export function KMeansProvider({ children }: React.PropsWithChildren) {
  const { calcInterpolation, refresh: uiRefresh, changeMode } = useUI();
  const [isDone, setIsDone] = React.useState<boolean | null>(null);
  const [result, setResult] = React.useState<IKMeansResult | null>(null);
  const [iterator, setIterator] = React.useState<IKMeansIterator | null>(null);
  const [K, setK] = React.useState<number | null>(null);
  const [round, setRound] = React.useState<number | null>(null);
  const start = React.useCallback(
    (k: number, dataset: IDot[]) => {
      if (dataset.length > DATASET_COUNT_THRESHOLD) {
        if (k <= 1) {
          alert("K 설정값이 너무 작습니다. 2 이상의 값을 입력해주세요.");
          changeMode(null);
        } else {
          setK(k);
          const kmeans = new KMeans(k, dataset);
          const iterator = kmeans[Symbol.iterator]() as IKMeansIterator;
          setIterator(iterator);
          setResult({
            centers: iterator.centers!,
          });
          setRound(0);
          changeMode("run");
        }
      } else {
        alert("데이터 셋의 길이가 너무 작습니다.");
        changeMode(null);
      }
    },
    [changeMode]
  );

  const next = React.useCallback(() => {
    if (iterator) {
      const iterResult = iterator.next();
      if (!iterResult.done) {
        const result = iterResult.value;
        setResult(result);
        calcInterpolation(result, FRAME_COUNT);
        setRound((prev) => prev! + 1);
        setIsDone(false);
      } else {
        setIsDone(true);
        changeMode("predict");
      }
    }
  }, [iterator, calcInterpolation, changeMode]);

  const clear = React.useCallback(() => {
    setResult(null);
    setIterator(null);
    setK(null);
    setRound(null);
    setIsDone(null);
  }, []);
  const refresh = React.useCallback(
    (dataset: IDot[]) => {
      clear();
      uiRefresh();
      setTimeout(() => {
        start(K!, dataset);
      }, 200);
    },
    [start, K, clear, uiRefresh]
  );
  const autoNext = React.useCallback(() => {
    if (iterator && result) {
      let centers = result.centers;
      let _round = round!;
      let _result = {} as IKMeansResult;
      for (_result of iterator) _round++;
      _result.nextCenters = _result.centers;
      _result.centers = centers;
      _result.distances = iterator.calcDistances({
        dataset: iterator.dataset,
        centers,
      });
      setResult(_result);
      calcInterpolation(_result, FRAME_COUNT);
      setRound(_round);
      setIsDone(true);
      changeMode("predict");
    }
  }, [round, iterator, calcInterpolation, result, changeMode]);

  const predict = React.useCallback(
    (dots: IDot[]) => {
      if (result && result.predict) {
        const labels = result.predict({ dataset: dots });
        console.log(labels);

        return labels;
      }
      return null;
    },
    [result]
  );

  return (
    <KMeansContext.Provider
      value={{
        K,
        isDone,
        result,
        round,
        clear,
        start,
        next,
        refresh,
        autoNext,
        predict,
      }}
    >
      {children}
    </KMeansContext.Provider>
  );
}
