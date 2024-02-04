import { useKMeans, useUI } from "@hooks";
import React from "react";

export function GenMouse() {
  const refGenDot = React.useRef<HTMLDivElement>(null);
  const { appendDot, mode, appendPrediction, MAX_X, MAX_Y } = useUI();
  const { predict } = useKMeans();

  React.useEffect(() => {
    if (refGenDot.current) {
      const moveDot = (e: MouseEvent) => {
        const { clientX: x, clientY: y } = e;
        refGenDot.current!.style.setProperty(
          "transform",
          `translateX(${x - 9}px) translateY(${y - 9}px)`
        );
        refGenDot.current!.style.setProperty("opacity", "1");
      };
      window.addEventListener("mousemove", moveDot);

      return () => {
        window.removeEventListener("mousemove", moveDot);
      };
    }
  }, []);

  const stampDot = React.useCallback(
    (e: React.MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
      const dotX = (x / windowWidth) * MAX_X;
      const dotY = (y / windowHeight) * MAX_Y;

      console.log(x, y, windowWidth, windowHeight, dotX, dotY);

      if (mode === "gen") appendDot([dotX, dotY]);
      else if (mode === "predict") {
        const dot: IDot = [dotX, dotY];
        const labels = predict([dot]);
        if (labels)
          appendPrediction({
            dot,
            label: labels[0],
          });
      }
    },
    [appendDot, mode, predict, appendPrediction, MAX_X, MAX_Y]
  );

  return <div ref={refGenDot} className="gen-dot" onClick={stampDot} />;
}

export function GenMouseListener() {
  const { mode } = useUI();

  return mode === "gen" || mode === "predict" ? <GenMouse /> : <></>;
}
