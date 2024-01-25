import { KMeansContext, UIContext } from "@context";
import React from "react";

export function useUI() {
  const { mode, changeMode } = React.useContext<IUIContext>(UIContext);

  return { mode, changeMode };
}

export function useKMeans() {
  const {
    K,
    dataset,
    appendData,
    setRandomDataset,
    start,
    result,
    interpolations,
    labelInterpolations,
    next,

    clearCanvas,
  } = React.useContext<IKMeansContext>(KMeansContext);
  return {
    K,
    dataset,
    appendData,
    setRandomDataset,
    clearCanvas,
    start,
    result,
    interpolations,
    labelInterpolations,
    next,
  };
}
