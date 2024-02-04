declare interface ICommonContextActions {
  clear: () => void;
}
declare interface IUIContextValues {
  mode: UIMode;
  dots: IDot[] | null;
  interpolation: UIInterpolation | null;

  MAX_X: number;
  MAX_Y: number;

  predictions: IPrediction[] | null;
}
declare interface IUIContextActions extends ICommonContextActions {
  changeMode: (m: UIMode) => void;
  appendDot: (d: IDot) => void;
  randomDots: (l?: number) => void;
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
  start: (k: number, ds: IDot[]) => void;
  next: () => void;
  autoNext: () => void;
  refresh: (ds: IDot[]) => void;
  predict: (dots: IDot[]) => number[] | null;
}
declare interface IKMeansContext
  extends IKMeansContextValues,
    IKMeansContextActions {}
