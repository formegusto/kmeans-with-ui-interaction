declare type IPoint = [number, number];
declare type UIMode = null | "gen" | "set" | "run";

declare interface IKMeansContext {
  dataset: IPoint[];
  mode: UIMode;
  K: null | number;

  changeMode: (m: UIMode) => void;
  appendData: (p: IPoint) => void;
  setRandomDataset: () => void;
  start: (k: number) => void;

  centers: IPoint[] | null;
}

declare interface IKMeansMethodParams {
  dataset?: IPoint[];
  centers?: IPoint[];
  distances?: number[][];
  labels?: number[];
}

declare interface IKMeansResult extends IKMeansMethodParams {
  inertia: number;
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
  moveCenters: KMeansMethod<IPoint[] | null>;
  calcInertia: KMeansMethod<number>;
}
