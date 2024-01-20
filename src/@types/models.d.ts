declare type IPoint = [number, number];
declare type UIMode = null | "gen" | "set" | "run";

declare interface IKMeansContext {
  dataset: IPoint[];
  mode: UIMode;

  changeMode: (m: UIMode) => void;
}
