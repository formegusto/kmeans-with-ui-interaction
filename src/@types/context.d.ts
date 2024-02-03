declare interface ICommonContextActions {
  clear: () => void;
}
declare interface IUIContextValues {
  mode: UIMode;
  points: IPoint[] | null;
  interpolation: UIInterpolation | null;
}
declare interface IUIContextActions extends ICommonContextActions {
  changeMode: (m: UIMode) => void;
  appendPoint: (p: IPoint) => void;
  randomPoints: (l?: number) => void;
  calcInterpolation: (result: IKMeansResult, frameCount: number) => void;
  refresh: () => void;

  appendPrediction: (p: IPrediction) => void;
}
declare interface IUIContext extends IUIContextValues, IUIContextActions {}

declare interface IKMeansContextValues {
  K: number | null;
  result: IKMeansResult | null;
  round: number | null;
  isDone: boolean | null;
}
declare interface IKMeansContextActions extends ICommonContextActions {
  start: (k: number, ds: IPoint[]) => void;
  next: () => void;
  autoNext: () => void;
  refresh: (ds: IPoint[]) => void;
  predict: (points: IPoint[]) => void;
}
declare interface IKMeansContext
  extends IKMeansContextValues,
    IKMeansContextActions {}
