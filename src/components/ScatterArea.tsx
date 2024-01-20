import { KMeansContext } from "@context";
import { useKMeans } from "@hooks";
import { IOSDefault, IOSGrayLight } from "@styles/palette";
import React from "react";

export function ScatterArea() {
  const { dataset } = useKMeans();
  const [windowSize, setWindowSize] = React.useState<IPoint>([0, 0]);

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
          fill={IOSGrayLight[0]}
          // fill={labels[i] === -1 ? IOSGrayLight[0] : IOSDefault[labels[i]]}
        />
      ))}
    </svg>
  );
}
