import { useUI } from "@hooks";
import React from "react";

export function GenMouse() {
  const refGenPoint = React.useRef<HTMLDivElement>(null);
  const { mode } = useUI();

  React.useEffect(() => {
    if (refGenPoint.current) {
      const movePoint = (e: MouseEvent) => {
        const { clientX: x, clientY: y } = e;
        refGenPoint.current!.style.setProperty(
          "transform",
          "translateX(" + (x - 9) + "px)" + " translateY(" + (y - 9) + "px)"
        );
      };
      window.addEventListener("mousemove", movePoint);
    }
  }, []);

  const onClick = React.useCallback((e: React.MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;

    const { innerWidth: windowX, innerHeight: windowY } = window;

    const pointX = (x / windowX) * 100;
    const pointY = (y / windowY) * 100;
    console.log(x, y, windowX, windowY, pointX, pointY);
    // setDatas((prev) => [...prev, [pointX, pointY]]);
    // setLabels((prev) => [...prev, Math.floor(Math.random() * 11)]);
  }, []);

  return <div ref={refGenPoint} className="gen-point" onClick={onClick} />;
}
