declare type IPoint = [number, number];
declare type UIMode = null | "gen" | "set" | "run";
declare type UIInterpolation = {
  centers: IPoint[][];
  labels: number[][][];
};

declare interface IKMeansMethodParams {
  dataset?: IPoint[];
  centers?: IPoint[];
  distances?: number[][];
  labels?: number[];
}

declare interface IKMeansResult extends IKMeansMethodParams {
  inertia?: number;
  nextCenters?: IPoint[];
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
