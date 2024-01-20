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

  return <div ref={refGenPoint} className="gen-point" />;
}
