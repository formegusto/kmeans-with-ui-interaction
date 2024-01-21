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

export function SetModal() {
  const [value, setValue] = React.useState<string>("");
  const { mode, changeMode } = useUI();
  const { start } = useKMeans();

  const onSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      start(parseInt(value));
    },
    [value]
  );

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    []
  );

  return mode === "set" ? (
    <form onSubmit={onSubmit} className="set-modal-container">
      <div className="modal-question-group">
        <span>Your K is</span>
        <input
          type="text"
          maxLength={2}
          value={value}
          onChange={onChange}
          required
        />
        <SetButton type="submit" />
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 129.53 2"
        className="highlight-line"
      >
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
