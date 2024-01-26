import { useKMeans, useUI } from "@hooks";
import React from "react";

export function UtilsItems() {
  const { mode, changeMode, clear: clearUI } = useUI();
  const { clear: clearKMeans } = useKMeans();

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
        className={`kmeans-utils-btn ${mode === "set-K" ? mode : ""}`}
        onClick={
          mode === "set-K" ? () => changeMode(null) : () => changeMode("set-K")
        }>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="utils-set-K">
          <path d="M 23 3 L 23 45" />
          <path d="M 23 3 L 23 45" />
          <path d="M 10 11 C -10 50 56 50 36 11" className="power-round" />
        </svg>
      </button>
      <button
        className="kmeans-utils-btn utils-clear"
        onClick={() => {
          clearUI();
          clearKMeans();
        }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
          <path d="M 3 9 L 43 9 L 23 9 L 23 1" className="garbage-hat" />
          <path d="M 6 18 C -10 55 56 55 40 18" />
        </svg>
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
