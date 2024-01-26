import { useKMeans, useUI } from "@hooks";
import { linearInterpolation } from "@utils";
import React from "react";

export function UtilsItems() {
  const { mode, changeMode, clear: clearUI } = useUI();
  const { clear: clearKMeans } = useKMeans();

  console.log(linearInterpolation([8, 10], [38, 38], 0.5));
  return (
    <div className="kmeans-utils-items">
      <button
        className={`kmeans-utils-btn ${mode === "gen" ? mode : ""}`}
        onClick={
          mode === "gen" ? () => changeMode(null) : () => changeMode("gen")
        }>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="utils-gen">
          <path d="M 23 3 L 23 45" />
          <path d="M 3 24 L 45 24" />
        </svg>
      </button>
      <button
        className={`kmeans-utils-btn ${mode === "set-length" ? mode : ""}`}
        onClick={
          mode === "set-length"
            ? () => changeMode(null)
            : () => changeMode("set-length")
        }>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="utils-set-length">
          {/* <path d="M 8 10 L 38 38" />
          <path d="M 38 10 L 8 38" /> */}
          <path d="M 8 10 L 23 24" />
          <path d="M 38 38 L 23 24" />
          <path d="M 38 10 L 23 24" />
          <path d="M 8 38 L 23 24" />
        </svg>
      </button>
      <button
        className="kmeans-utils-item"
        onClick={
          mode === "set-K" ? () => changeMode(null) : () => changeMode("set-K")
        }>
        Run
      </button>
      <button
        className="kmeans-utils-item"
        onClick={() => {
          clearUI();
          clearKMeans();
        }}>
        Cls
      </button>
    </div>
  );
}

export function UtilsButton({ isOpen, onClick }: any) {
  return (
    <button
      className={`kmeans-utils-btn ${isOpen ? "open" : ""}`}
      onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className="utils-burger">
        <path d="M 3 6 L 45 6" />
        <path d="M 3 22 L 45 22" />
        <path d="M 3 22 L 45 22" />
        <path d="M 3 40 L 45 40" />
      </svg>
    </button>
  );
}

export function UtilsArea() {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  return (
    <div className="kmeans-utils-area">
      <UtilsItems />
      <UtilsButton
        isOpen={isOpen}
        onClick={isOpen ? () => setIsOpen(false) : () => setIsOpen(true)}
      />
    </div>
  );
}
