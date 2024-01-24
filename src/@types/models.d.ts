declare type IPoint = [number, number];
declare type UIMode = null | "gen" | "set" | "run";

declare interface IKMeansContext {
  dataset: IPoint[];
  mode: UIMode;
  K: null | number;

  changeMode: (m: UIMode) => void;
  appendData: (p: IPoint) => void;
  clearCanvas: () => void;
  setRandomDataset: () => void;
  start: (k: number) => void;
  next: () => void;

  centers: IPoint[] | null;
  interpolations: IPoint[][] | null;
  labelInterpolations: any | null;
  labels: number[] | null;
}

declare interface IKMeansMethodParams {
  dataset?: IPoint[];
  centers?: IPoint[];
  distances?: number[][];
  labels?: number[];
}

declare interface IKMeansResult extends IKMeansMethodParams {
  inertia: number;
  interpolations?: IPoint[][];
  labelInterpolations?: any;
}

declare type KMeansMethod<R = number[][]> = (params: IKMeansMethodParams) => R;

declare interface IKMeansSetting {
  K: number;
  dataset?: IPoint[];
  centers?: IPoint[];
}
declare interface IKMeans extends IKMeansSetting, Iterable<IKMeansResult> {
  fit: KMeansMethod<IKMeansResult | undefined>;
  steps: KMeansMethod<IKMeansResult[]>;
}
declare interface IKMeansIterator
  extends IKMeansSetting,
    IterableIterator<IKMeansResult> {
  initCenters: KMeansMethod;
  calcDistances: KMeansMethod;
  setLabels: KMeansMethod<number[]>;
  moveCenters: KMeansMethod<{
    nextCenters: IPoint[];
    labelInterpolations: any;
  } | null>;
  calcInertia: KMeansMethod<number>;
}
