import { KMeansContext, UIContext } from "@context";
import React from "react";

export function useUI() {
  return React.useContext<IUIContext>(UIContext);
}

export function useKMeans() {
  return React.useContext<IKMeansContext>(KMeansContext);
}
