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
  const refGroup = React.useRef<HTMLDivElement>(null);
  const refInput = React.useRef<HTMLInputElement>(null);
  const refHighlight = React.useRef<SVGSVGElement>(null);
  const [highlightSize, setHighlightSize] = React.useState<any | null>(null);

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

  React.useEffect(() => {
    if (mode === "set-K" && refGroup.current && refInput.current) {
      const { width: groupWidth } = refGroup.current.getBoundingClientRect();

      const { width: inputWidth, height: inputHeight } =
        refInput.current.getBoundingClientRect();

      setHighlightSize({
        groupWidth: groupWidth,
        inputWidth: inputWidth - 6,
        inputHeight: inputHeight + 12,
      });
    }
  }, [mode]);

  React.useEffect(() => {
    if (highlightSize) {
      setTimeout(() => {
        if (refHighlight.current) {
          refHighlight.current.style.strokeDashoffset = "0";
        }
      }, 300);
    }
  }, [highlightSize]);

  return mode === "set-K" ? (
    <form onSubmit={onSubmit} className="set-modal-container">
      <div ref={refGroup} className="modal-question-group">
        <span>Your K is</span>
        <input
          ref={refInput}
          type="text"
          maxLength={2}
          value={value}
          onChange={onChange}
          required
          autoFocus
        />
        {/* <SetButton type="submit" /> */}
      </div>
      {highlightSize && (
        <svg
          ref={refHighlight}
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${highlightSize.groupWidth} ${highlightSize.inputHeight}`}
          width={highlightSize.groupWidth}
          height={highlightSize.inputHeight}
          className="highlight-line"
          style={{
            transition: ".5s",
            strokeDasharray: highlightSize.groupWidth * 2.75,
            strokeDashoffset: highlightSize.groupWidth * 2.75,
          }}
        >
          <path
            d={`M ${-30} ${highlightSize.inputHeight} L ${
              highlightSize.groupWidth
            } ${highlightSize.inputHeight} L ${highlightSize.groupWidth} -1 L ${
              highlightSize.groupWidth - highlightSize.inputWidth - 5
            } -1 L ${highlightSize.groupWidth - highlightSize.inputWidth - 5} ${
              highlightSize.inputHeight
            } L ${highlightSize.groupWidth + 30} ${highlightSize.inputHeight}`}
          />
        </svg>
      )}
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
        className="highlight-line"
      >
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
