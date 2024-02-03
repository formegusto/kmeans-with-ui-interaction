import { useKMeans, useUI } from "@hooks";
import React from "react";

export function GenMouse() {
  const refGenPoint = React.useRef<HTMLDivElement>(null);
  const { appendPoint, mode, appendPrediction } = useUI();
  const { predict } = useKMeans();

  React.useEffect(() => {
    if (refGenPoint.current) {
      const movePoint = (e: MouseEvent) => {
        const { clientX: x, clientY: y } = e;
        refGenPoint.current!.style.setProperty(
          "transform",
          `translateX(${x - 9}px) translateY(${y - 9}px)`
        );
        refGenPoint.current!.style.setProperty("opacity", "1");
      };
      window.addEventListener("mousemove", movePoint);

      return () => {
        window.removeEventListener("mousemove", movePoint);
      };
    }
  }, []);

  const onClick = React.useCallback(
    (e: React.MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      const { innerWidth: windowX, innerHeight: windowY } = window;

      const pointX = (x / windowX) * 100;
      const pointY = (y / windowY) * 100;
      console.log(x, y, windowX, windowY, pointX, pointY);

      if (mode === "gen") appendPoint([pointX, pointY]);
      else if (mode === "predict") {
        const point: IPoint = [pointX, pointY];
        const labels = predict([point]);
        if (labels)
          appendPrediction({
            point,
            label: labels[0],
          });
      }
      // setDatas((prev) => [...prev, [pointX, pointY]]);
      // setLabels((prev) => [...prev, Math.floor(Math.random() * 11)]);
    },
    [appendPoint, mode, predict, appendPrediction]
  );

  return <div ref={refGenPoint} className="gen-point" onClick={onClick} />;
}

export function GenMouseListener() {
  const { mode } = useUI();

  return mode === "gen" || mode === "predict" ? <GenMouse /> : <></>;
}
