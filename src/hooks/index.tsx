import { KMeansContext } from "@context";
import React from "react";

export function useUI() {
  const { mode, changeMode } = React.useContext<IKMeansContext>(KMeansContext);

  return { mode, changeMode };
}
