import { IOSDefault, IOSGray } from "@styles/palette";
import React from "react";

export function ScatterArea() {
  const [datas, setDatas] = React.useState<IPoint[]>([]);
  const [labels, setLabels] = React.useState<number[]>([]);
  const [windowSize, setWindowSize] = React.useState<IPoint>([0, 0]);

  const onClick = React.useCallback(
    (e: React.MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      const [windowX, windowY] = windowSize;

      const pointX = (x / windowX) * 100;
      const pointY = (y / windowY) * 100;
      console.log(x, y, windowX, windowY, pointX, pointY);
      setDatas((prev) => [...prev, [pointX, pointY]]);
      setLabels((prev) => [...prev, Math.floor(Math.random() * 11)]);
    },
    [windowSize]
  );

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

  console.log(windowSize);

  return (
    <svg
      onClick={onClick}
      id="scatter-area"
      xmlns="http://www.w3.org/2000/svg"
      width="100vw"
      height="100vh"
      viewBox={`0 0 ${windowSize[0]} ${windowSize[1]}`}>
      {datas.map(([x, y], i) => (
        <circle
          key={`point-${i}`}
          cx={`${x}%`}
          cy={`${y}%`}
          r={10}
          fill={labels[i] === -1 ? IOSGray[0] : IOSDefault[labels[i]]}
        />
      ))}
    </svg>
  );
}
