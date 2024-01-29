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
      setWindowSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener("resize", setAspectRatio);
    setWindowSize([window.innerWidth, window.innerHeight]);

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
      width="100vw"
      height="100vh"
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
