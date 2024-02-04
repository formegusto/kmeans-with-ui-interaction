import { useKMeans, useUI } from "@hooks";
import { IOSDefault, IOSGrayLight } from "@styles/palette";
import React from "react";

export function ScatterArea() {
  const {
    dots,
    interpolation,
    calcInterpolation,
    mode,
    predictions,
    MAX_X,
    MAX_Y,
  } = useUI();
  const { result } = useKMeans();
  const [initCenters, setInitCenters] = React.useState<IDot[] | null>(null);

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
    const dots = document.querySelectorAll("#scatter-area > .dot");
    dots.forEach((d) => {
      d.setAttribute("fill", IOSGrayLight[0]);
    });
  }, []);

  const moveCenters = React.useCallback(
    (interpolation: IDot[], label: number, count: number) => {
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

  const paintDots = React.useCallback(
    (interpolation: number[][], label: number, count: number) => {
      if (count === interpolation.length) return;
      const targetDots = interpolation[count];
      for (let targetDot of targetDots) {
        const el = document.querySelector(`.dot-${targetDot}`);
        if (el) el.setAttribute("fill", IOSDefault[label]);
      }
      requestAnimationFrame(() => paintDots(interpolation, label, count + 1));
    },
    []
  );

  React.useEffect(() => {
    if (interpolation) {
      const { centers, labels } = interpolation;
      console.log(labels);
      for (let label = 0; label < centers.length; label++) {
        moveCenters(centers[label], label, 0);
        paintDots(labels[label], label, 0);
      }
    } else {
      clearColors();
    }
  }, [interpolation, moveCenters, paintDots, clearColors]);

  return (
    <>
      <svg
        id={`scatter-area`}
        className={`${
          mode === "run" ? "run" : mode === "predict" ? "predict" : ""
        }`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {dots &&
          dots.map(([x, y], i) => (
            <circle
              key={`dot-${i}`}
              className={`dot dot-${i}`}
              cx={`${(x / MAX_X) * 100}%`}
              cy={`${(y / MAX_Y) * 100}%`}
              r={10}
              fill={IOSGrayLight[0]}
            />
          ))}
        {predictions &&
          predictions.map(({ dot: [x, y], label }, i) => (
            <circle
              key={`prediction-dot-${i}`}
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
