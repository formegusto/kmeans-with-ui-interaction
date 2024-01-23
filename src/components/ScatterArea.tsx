import { useKMeans } from "@hooks";
import { IOSDefault, IOSGrayLight } from "@styles/palette";
import React from "react";

export function ScatterArea() {
  const { dataset, labels, interpolations, centers } = useKMeans();
  const [windowSize, setWindowSize] = React.useState<IPoint>([0, 0]);
  const [localCenters, setLocalCenters] = React.useState<IPoint[] | null>(null);

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

  const moveCenters = React.useCallback(
    (interpolation: IPoint[], label: number, i: number, moveTime: number) => {
      if (i === interpolation.length) return;
      if (Date.now() >= moveTime) {
        const [nx, ny] = interpolation[i];
        const el = document.querySelector(`.center-${label}`);
        const roundEl = document.querySelector(`.center-round-${label}`);
        if (el && roundEl) {
          el.setAttribute("cx", nx + "%");
          el.setAttribute("cy", ny + "%");
          roundEl.setAttribute("cx", nx + "%");
          roundEl.setAttribute("cy", ny + "%");

          requestAnimationFrame(() =>
            moveCenters(interpolation, label, i + 1, Date.now() + 20)
          );
        }
      } else {
        requestAnimationFrame(() =>
          moveCenters(interpolation, label, i, moveTime)
        );
      }
    },
    []
  );

  React.useEffect(() => {
    if (interpolations) {
      for (let label = 0; label < interpolations.length; label++) {
        moveCenters(interpolations[label], label, 0, Date.now());
      }
    } else {
      if (centers) {
        setLocalCenters(centers);
      }
    }
  }, [centers, interpolations, moveCenters]);

  return (
    <svg
      id="scatter-area"
      xmlns="http://www.w3.org/2000/svg"
      width="100vw"
      height="100vh"
      viewBox={`0 0 ${windowSize[0]} ${windowSize[1]}`}
    >
      {dataset.map(([x, y], i) => (
        <circle
          key={`point-${i}`}
          cx={`${x}%`}
          cy={`${y}%`}
          r={10}
          fill={labels ? IOSDefault[labels[i] + 1] : IOSGrayLight[0]}
        />
      ))}
      {localCenters &&
        localCenters.map(([x, y], i) => (
          <React.Fragment key={`center-${i}`}>
            <circle
              className={`center-${i}`}
              cx={`${x}%`}
              cy={`${y}%`}
              r={10}
              fill={IOSDefault[0]}
            />
            <circle
              className={`center-round-${i}`}
              cx={`${x}%`}
              cy={`${y}%`}
              r={100}
              fill="none"
              stroke={IOSDefault[0]}
            />
          </React.Fragment>
        ))}
    </svg>
  );
}
