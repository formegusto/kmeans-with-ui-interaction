declare type IDot = [number, number];
declare interface IPrediction {
  dot: IDot;
  label: number;
}
declare type UIMode = null | "gen" | "set-K" | "set-length" | "run" | "predict";
declare type UIInterpolation = {
  centers: IDot[][];
  labels: number[][][];
};

declare interface IKMeansMethodParams {
  dataset?: IDot[];
  centers?: IDot[];
  distances?: number[][];
  labels?: number[];
}

declare interface IKMeansResult extends IKMeansMethodParams {
  inertia?: number;
  nextCenters?: IDot[];
}

declare type KMeansMethod<R = number[][]> = (params: IKMeansMethodParams) => R;

declare interface IKMeansSetting {
  K: number;
  dataset?: IDot[];
  centers?: IDot[];
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
  moveCenters: KMeansMethod<IDot[] | null>;
  calcInertia: KMeansMethod<number>;

  predict?: KMeansMethod<number[]>;
}
