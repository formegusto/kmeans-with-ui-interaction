import { useKMeans, useUI } from "@hooks";
import React from "react";

export function SetButton(
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) {
  return (
    <button className="highlight-button" {...props}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <path
          d="M -12 16
            L 32 16"
        />
        <path
          d="M 32 16
            L 22 28"
        />
        <path
          d="M 32 16
            L 22 4"
        />
      </svg>
    </button>
  );
}

export function SetKModal() {
  const { points } = useUI();
  const [value, setValue] = React.useState<string>("");
  const { mode, changeMode } = useUI();
  const { start } = useKMeans();

  const onSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (points) start(parseInt(value), points);
      else {
        alert("데이터 셋이 설정되지 않았습니다.");
        changeMode(null);
      }
      setValue("");
    },
    [start, value, changeMode, points]
  );

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    []
  );

  return mode === "set-K" ? (
    <form onSubmit={onSubmit} className="set-modal-container">
      <div className="modal-question-group">
        <span>Your K is</span>
        <input
          type="text"
          maxLength={2}
          value={value}
          onChange={onChange}
          required
          autoFocus
        />
        <SetButton type="submit" />
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 129.53 2"
        className="highlight-line">
        <path
          d="M 0 1 
            L 129.53 1 
            L 129.53 -30
            L 98.53 -30
            L 98.53 1
            L 129.53 1"
        />
      </svg>
    </form>
  ) : (
    <></>
  );
}

export function SetLengthModal() {
  const [value, setValue] = React.useState<string>("");
  const { mode, changeMode, randomPoints, clear } = useUI();

  const onSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      clear();
      setValue("");
      randomPoints(parseInt(value));
      changeMode(null);
    },
    [value, randomPoints, changeMode, clear]
  );

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    []
  );

  return mode === "set-length" ? (
    <form onSubmit={onSubmit} className="set-modal-container">
      <div className="modal-question-group">
        <span>Your point length is</span>
        <input
          type="text"
          maxLength={3}
          value={value}
          onChange={onChange}
          required
          autoFocus
        />
        <SetButton type="submit" />
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 129.53 2"
        className="highlight-line">
        <path
          d="M -100 1 
            L 200 1 
            L 200 -30
            L 160 -30
            L 160 1
            L 180 1"
        />
      </svg>
    </form>
  ) : (
    <></>
  );
}
