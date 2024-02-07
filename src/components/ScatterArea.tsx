import { useKMeans, useUI } from "@hooks";
import { IOSDefault, IOSGrayLight } from "@styles/palette";
import React from "react";

export function ScatterArea() {
  const {
    points,
    interpolation,
    calcInterpolation,
    mode,
    predictions,
    MAX_X,
    MAX_Y,
  } = useUI();
  const { result } = useKMeans();
  const [initCenters, setInitCenters] = React.useState<IPoint[] | null>(null);

  React.useEffect(() => {
    const setAspectRatio = () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    window.addEventListener("resize", setAspectRatio);
    setAspectRatio();

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
    points.forEach((d) => {
      d.setAttribute("fill", IOSGrayLight[0]);
    });
  }, []);

  const moveCenters = React.useCallback(
    (interpolation: IPoint[], label: number, count: number) => {
      if (count === interpolation.length) return;
      const [nx, ny] = interpolation[count];
      const el = document.querySelector(`.center-${label}`);
      const roundEl = document.querySelector(`.center-round-${label}`);
      // const elFrameCount = document.querySelector(`.frame-count`);
      if (el && roundEl) {
        el.setAttribute("cx", (nx / MAX_X) * 100 + "%");
        el.setAttribute("cy", (ny / MAX_Y) * 100 + "%");
        roundEl.setAttribute("cx", (nx / MAX_X) * 100 + "%");
        roundEl.setAttribute("cy", (ny / MAX_Y) * 100 + "%");

        // elFrameCount!.textContent = `Frame : ${count}/1500`;

        requestAnimationFrame(() =>
          moveCenters(interpolation, label, count + 1)
        );
      }
    },
    [MAX_X, MAX_Y]
  );

  const paintPoints = React.useCallback(
    (frame: number[][], label: number, count: number) => {
      if (count === frame.length) return;
      const targetPoints = frame[count];
      for (let targetPoint of targetPoints) {
        const el = document.querySelector(`.point-${targetPoint}`);
        if (el) el.setAttribute("fill", IOSDefault[label]);
      }
      requestAnimationFrame(() => paintPoints(frame, label, count + 1));
    },
    []
  );

  React.useEffect(() => {
    if (interpolation) {
      const { centers, labels } = interpolation;
      for (let label = 0; label < centers.length; label++) {
        moveCenters(centers[label], label, 0);
        paintPoints(labels[label], label, 0);
      }
    } else {
      clearColors();
    }
  }, [interpolation, moveCenters, paintPoints, clearColors]);

  return (
    <>
      <svg
        id={`scatter-area`}
        className={`${
          mode === "run" ? "run" : mode === "predict" ? "predict" : ""
        }`}
        xmlns="http://www.w3.org/2000/svg">
        {points &&
          points.map(([x, y], i) => (
            <circle
              key={`point-${i}`}
              className={`point point-${i}`}
              cx={`${(x / MAX_X) * 100}%`}
              cy={`${(y / MAX_Y) * 100}%`}
              r={10}
              fill={IOSGrayLight[0]}
            />
          ))}
        {predictions &&
          predictions.map(({ point: [x, y], label }, i) => (
            <circle
              key={`prediction-point-${i}`}
              className={`prediction prediction-${i}`}
              cx={`${(x / MAX_X) * 100}%`}
              cy={`${(y / MAX_Y) * 100}%`}
              r={10}
              fill={IOSDefault[label]}
            />
          ))}
        {initCenters &&
          initCenters.map(([x, y], i) => (
            <React.Fragment key={`center-${i}`}>
              <circle
                className={`center-${i}`}
                cx={`${(x / MAX_X) * 100}%`}
                cy={`${(y / MAX_Y) * 100}%`}
                r={10}
                fill={IOSDefault[i]}
              />
              <circle
                className={`center-round-${i}`}
                cx={`${(x / MAX_X) * 100}%`}
                cy={`${(y / MAX_Y) * 100}%`}
                r={100}
                strokeWidth={4}
                fill="none"
                stroke={IOSDefault[i]}
              />
            </React.Fragment>
          ))}
      </svg>
      {/* <div className="frame-count">Frame : {0}/1500</div> */}
    </>
  );
}
