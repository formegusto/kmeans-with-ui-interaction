import { useKMeans, useUI } from "@hooks";
import React from "react";

interface SetButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  highlightSize: any;
}

export function SetButton({ highlightSize, ...htmlProps }: SetButtonProps) {
  const refBtn = React.useRef<SVGSVGElement>(null);
  React.useEffect(() => {
    setTimeout(() => {
      const elHighlightLine = document.querySelector(".highlight-line");
      if (elHighlightLine) {
        const rects = elHighlightLine.getBoundingClientRect();
        console.log(rects);
      }

      if (refBtn.current) {
        refBtn.current.style.strokeDashoffset = "0";
      }
    }, 600);
  }, []);

  return (
    <button
      className="highlight-button"
      {...htmlProps}
      style={{
        width: 60,
        height: highlightSize.inputHeight,
        right: -60,
      }}
    >
      <svg
        ref={refBtn}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 60 ${highlightSize.inputHeight}`}
        width={60}
        height={highlightSize.inputHeight}
        style={{
          transition: "0.35s",
          strokeDasharray: 60 * 2.1,
          strokeDashoffset: 60 * 2.1,
        }}
      >
        <path
          d={`M 0 ${highlightSize.inputHeight} L 40 ${
            highlightSize.inputHeight
          } C 80 ${highlightSize.inputHeight} 40 ${
            highlightSize.inputHeight / 2 - 40
          } 20 ${highlightSize.inputHeight / 2}`}
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
          style={{
            width: 32,
          }}
          required
          autoFocus
        />
      </div>
      {highlightSize && (
        <div
          className="highlight-group"
          style={{
            width: highlightSize.groupWidth,
            height: highlightSize.inputHeight,
          }}
        >
          <svg
            ref={refHighlight}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${highlightSize.groupWidth + 90} ${
              highlightSize.inputHeight
            }`}
            width={highlightSize.groupWidth + 90}
            height={highlightSize.inputHeight}
            className="highlight-line"
            style={{
              transition: ".75s",
              strokeDasharray: highlightSize.groupWidth * 2.75,
              strokeDashoffset: highlightSize.groupWidth * 2.75,
            }}
          >
            <path
              d={`M -30 ${highlightSize.inputHeight} L ${
                highlightSize.groupWidth
              } ${highlightSize.inputHeight} L ${
                highlightSize.groupWidth
              } -1 L ${
                highlightSize.groupWidth - highlightSize.inputWidth - 5
              } -1 L ${
                highlightSize.groupWidth - highlightSize.inputWidth - 5
              } ${highlightSize.inputHeight} L ${
                highlightSize.groupWidth + 30
              } ${highlightSize.inputHeight}`}
            />
          </svg>
          <SetButton type="submit" highlightSize={highlightSize} />
        </div>
      )}
    </form>
  ) : (
    <></>
  );
}

export function SetLengthModal() {
  const refGroup = React.useRef<HTMLDivElement>(null);
  const refInput = React.useRef<HTMLInputElement>(null);
  const refHighlight = React.useRef<SVGSVGElement>(null);
  const [highlightSize, setHighlightSize] = React.useState<any | null>(null);
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

  React.useEffect(() => {
    if (mode === "set-length" && refGroup.current && refInput.current) {
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

  return mode === "set-length" ? (
    <form onSubmit={onSubmit} className="set-modal-container">
      <div ref={refGroup} className="modal-question-group">
        <span>Your points length is</span>
        <input
          ref={refInput}
          type="text"
          maxLength={3}
          value={value}
          onChange={onChange}
          style={{
            width: 48,
          }}
          required
          autoFocus
        />
      </div>
      {highlightSize && (
        <div
          className="highlight-group"
          style={{
            width: highlightSize.groupWidth,
            height: highlightSize.inputHeight,
          }}
        >
          <svg
            ref={refHighlight}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${highlightSize.groupWidth + 90} ${
              highlightSize.inputHeight
            }`}
            width={highlightSize.groupWidth + 90}
            height={highlightSize.inputHeight}
            className="highlight-line"
            style={{
              transition: ".75s",
              strokeDasharray: highlightSize.groupWidth * 2.75,
              strokeDashoffset: highlightSize.groupWidth * 2.75,
            }}
          >
            <path
              d={`M -30 ${highlightSize.inputHeight} L ${
                highlightSize.groupWidth
              } ${highlightSize.inputHeight} L ${
                highlightSize.groupWidth
              } -1 L ${
                highlightSize.groupWidth - highlightSize.inputWidth - 5
              } -1 L ${
                highlightSize.groupWidth - highlightSize.inputWidth - 5
              } ${highlightSize.inputHeight} L ${
                highlightSize.groupWidth + 30
              } ${highlightSize.inputHeight}`}
            />
          </svg>
          <SetButton type="submit" highlightSize={highlightSize} />
        </div>
      )}
    </form>
  ) : (
    <></>
  );
}
