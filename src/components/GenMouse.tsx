import { useKMeans, useUI } from "@hooks";
import React from "react";

export function GenMouse() {
  const refGenPoint = React.useRef<HTMLDivElement>(null);
  const { appendPoint, mode, appendPrediction, MAX_X, MAX_Y } = useUI();
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

  const stampPoint = React.useCallback(
    (e: React.MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
      const pointX = (x / windowWidth) * MAX_X;
      const pointY = (y / windowHeight) * MAX_Y;

      if (mode === "gen") appendPoint([pointX, pointY]);
      else if (mode === "prediction") {
        const point: IPoint = [pointX, pointY];
        const labels = predict([point]);
        if (labels)
          appendPrediction({
            point,
            label: labels[0],
          });
      }
    },
    [appendPoint, mode, predict, appendPrediction, MAX_X, MAX_Y]
  );

  return <div ref={refGenPoint} className="gen-point" onClick={stampPoint} />;
}

export function GenMouseListener() {
  const { mode } = useUI();

  return mode === "gen" || mode === "prediction" ? <GenMouse /> : <></>;
}
