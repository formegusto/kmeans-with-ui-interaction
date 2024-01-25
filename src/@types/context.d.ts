declare interface ICommonContextActions {
  clear: () => void;
}

declare interface IUIContextValues {
  mode: UIMode;
  points: IPoint[] | null;
}
declare interface IUIContextActions extends ICommonContextActions {
  changeMode: (m: UIMode) => void;
  appendPoint: (p: IPoint) => void;
  randomPoints: (l?: number) => void;
}
declare interface IUIContext extends IUIContextValues, IUIContextActions {}

declare interface IKMeansContextValues {
  K: number | null;
  result: IKMeansResult | null;

  interpolations: IPoint[][] | null;
  labelInterpolations: any | null;
}
declare interface IKMeansContextActions extends ICommonContextActions {
  start: (k: number, ds: IPoint[]) => void;
  next: () => void;
}
declare interface IKMeansContext
  extends IKMeansContextValues,
    IKMeansContextActions {}
