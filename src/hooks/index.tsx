import { KMeansContext } from "@context";
import React from "react";

export function useUI() {
  const { mode, changeMode } = React.useContext<IKMeansContext>(KMeansContext);

  return { mode, changeMode };
}

export function useKMeans() {
  const { dataset, appendData, setRandomDataset } =
    React.useContext<IKMeansContext>(KMeansContext);
  return { dataset, appendData, setRandomDataset };
}
