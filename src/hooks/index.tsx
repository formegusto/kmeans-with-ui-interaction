import { KMeansContext } from "@context";
import React from "react";

export function useUI() {
  const { mode, changeMode } = React.useContext<IKMeansContext>(KMeansContext);

  return { mode, changeMode };
}

export function useKMeans() {
  const {
    K,
    dataset,
    appendData,
    setRandomDataset,
    start,
    centers,
    interpolations,
    labelInterpolations,
    next,
    labels,
    clearCanvas,
  } = React.useContext<IKMeansContext>(KMeansContext);
  return {
    K,
    dataset,
    appendData,
    setRandomDataset,
    clearCanvas,
    start,
    centers,
    interpolations,
    labelInterpolations,
    next,
    labels,
  };
}
