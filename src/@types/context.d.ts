declare interface IUIContextValues {
  mode: UIMode;
}
declare interface IUIContextActions {
  changeMode: (m: UIMode) => void;
}
declare interface IUIContext extends IUIContextValues, IUIContextActions {}

declare interface IKMeansContextValues {
  dataset: IPoint[];
  K: number | null;

  result: IKMeansResult | null;
  interpolations: IPoint[][] | null;
  labelInterpolations: any | null;
}
declare interface IKMeansContextActions {
  appendData: (p: IPoint) => void;
  clearCanvas: () => void;
  setRandomDataset: () => void;
  start: (k: number) => void;
  next: () => void;
}
declare interface IKMeansContext
  extends IKMeansContextValues,
    IKMeansContextActions {}
