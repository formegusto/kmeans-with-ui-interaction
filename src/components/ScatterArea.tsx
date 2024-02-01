import { useKMeans, useUI } from "@hooks";
import { IOSDefault, IOSGrayLight } from "@styles/palette";
import React from "react";

// const moveCenters = React.useCallback((nextCenters: IPoint[]) => {
//   for (let i = 0; i < nextCenters.length; i++) {
//     const el = document.querySelector(`.center-${i}`);
//     if (el) {
//       el.setAttribute("cx", nextCenters[i][0] + "%");
//       el.setAttribute("cy", nextCenters[i][1] + "%");
//     }
//   }
// }, []);

// React.useEffect(() => {
//   if (result) {
//     if (!initCenters) setInitCenters(result.centers!);
//     moveCenters(result.centers!);
//   } else {
//     setInitCenters(null);
//   }
// }, [result, initCenters, moveCenters]);

export function ScatterArea() {
  const { points, interpolation, calcInterpolation } = useUI();
  const { result } = useKMeans();
  const [windowSize, setWindowSize] = React.useState<IPoint>([0, 0]);
  const [initCenters, setInitCenters] = React.useState<IPoint[] | null>(null);

  React.useEffect(() => {
    const setAspectRatio = () => {
      let vh = window.innerHeight * 0.01;
      //그런 다음 --vh 사용자 정의 속성의 값을 문서의 루트로 설정합니다.
      document.documentElement.style.setProperty("--vh", `${vh}px`);
      setWindowSize([window.innerWidth, vh * 100]);

      if (window.innerWidth <= 600) {
        const elHighlight = document.querySelector(
          ".highlight-line"
        ) as SVGSVGElement;
        const elHighlightBtn = document.querySelector(".highlight-button");
        const elHighlightBtnSVG = document.querySelector(
          ".highlight-button > svg"
        ) as SVGSVGElement;
        if (elHighlight && elHighlightBtn) {
          const elGroup = document.querySelector(".modal-question-group");
          const { width: groupWidth } = elGroup!.getBoundingClientRect();
          elHighlight.setAttribute("width", `${groupWidth + 90}`);

          const elInput = document.querySelector(
            ".modal-question-group > input"
          );
          const { height: inputHeight } = elInput!.getBoundingClientRect();
          elHighlight.setAttribute("height", `${inputHeight + 12}`);

          elHighlightBtn.setAttribute(
            "style",
            `width: ${40}px; height: ${inputHeight + 12}px; right: ${-5}px;`
          );

          elHighlightBtnSVG.setAttribute("height", `${inputHeight + 12}`);
        }
      } else {
        const elHighlight = document.querySelector(
          ".highlight-line"
        ) as SVGSVGElement;
        const elHighlightBtn = document.querySelector(".highlight-button");
        const elHighlightBtnSVG = document.querySelector(
          ".highlight-button > svg"
        ) as SVGSVGElement;
        if (elHighlight && elHighlightBtn) {
          const elGroup = document.querySelector(".modal-question-group");
          const { width: groupWidth } = elGroup!.getBoundingClientRect();
          elHighlight.setAttribute("width", `${groupWidth + 90}`);

          const elInput = document.querySelector(
            ".modal-question-group > input"
          );
          const { height: inputHeight } = elInput!.getBoundingClientRect();
          elHighlight.setAttribute("height", `${inputHeight + 12}`);

          elHighlightBtn.setAttribute(
            "style",
            `width: ${60}px; height: ${inputHeight + 12}px; right: ${-60}px;`
          );

          elHighlightBtnSVG.setAttribute("height", `${inputHeight + 12}`);
        }
      }
    };
    window.addEventListener("resize", setAspectRatio);
    let vh = window.innerHeight * 0.01;
    //그런 다음 --vh 사용자 정의 속성의 값을 문서의 루트로 설정합니다.
    document.documentElement.style.setProperty("--vh", `${vh}px`);
    setWindowSize([window.innerWidth, vh * 100]);

    return () => {
      window.removeEventListener("resize", setAspectRatio);
    };
  }, []);

  React.useEffect(() => {
    if (result) {
      if (!interpolation) setInitCenters(result.centers!);
    } else {
      setInitCenters(null);
    }
  }, [result, interpolation, calcInterpolation]);

  const clearColors = React.useCallback(() => {
    const points = document.querySelectorAll("#scatter-area > .point");
    points.forEach((p) => {
      p.setAttribute("fill", IOSGrayLight[0]);
    });
  }, []);

  const moveCenters = React.useCallback(
    (interpolation: IPoint[], label: number, count: number) => {
      if (count === interpolation.length) return;
      const [nx, ny] = interpolation[count];
      const el = document.querySelector(`.center-${label}`);
      const roundEl = document.querySelector(`.center-round-${label}`);
      if (el && roundEl) {
        el.setAttribute("cx", nx + "%");
        el.setAttribute("cy", ny + "%");
        roundEl.setAttribute("cx", nx + "%");
        roundEl.setAttribute("cy", ny + "%");

        requestAnimationFrame(() =>
          moveCenters(interpolation, label, count + 1)
        );
      }
    },
    []
  );

  const paintPoints = React.useCallback(
    (interpolation: number[][], label: number, count: number) => {
      if (count === interpolation.length) return;
      const targetPoints = interpolation[count];
      for (let targetPoint of targetPoints) {
        const el = document.querySelector(`.point-${targetPoint}`);
        if (el) el.setAttribute("fill", IOSDefault[label]);
      }
      requestAnimationFrame(() => paintPoints(interpolation, label, count + 1));
    },
    []
  );

  React.useEffect(() => {
    if (interpolation) {
      const { centers, labels } = interpolation;
      console.log(labels);
      for (let label = 0; label < centers.length; label++) {
        moveCenters(centers[label], label, 0);
        paintPoints(labels[label], label, 0);
      }
    } else {
      clearColors();
    }
  }, [interpolation, moveCenters, paintPoints, clearColors]);

  return (
    <svg
      id="scatter-area"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox={`0 0 ${windowSize[0]} ${windowSize[1]}`}>
      {points &&
        points.map(([x, y], i) => (
          <circle
            key={`point-${i}`}
            className={`point point-${i}`}
            cx={`${x}%`}
            cy={`${y}%`}
            r={10}
            fill={IOSGrayLight[0]}
          />
        ))}
      {initCenters &&
        initCenters.map(([x, y], i) => (
          <React.Fragment key={`center-${i}`}>
            <circle
              className={`center-${i}`}
              cx={`${x}%`}
              cy={`${y}%`}
              r={10}
              fill={IOSDefault[i]}
            />
            <circle
              className={`center-round-${i}`}
              cx={`${x}%`}
              cy={`${y}%`}
              r={100}
              strokeWidth={4}
              fill="none"
              stroke={IOSDefault[i]}
            />
          </React.Fragment>
        ))}
    </svg>
  );
}
