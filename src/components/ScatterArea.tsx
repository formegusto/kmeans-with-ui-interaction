import { KMeansContext } from "@context";
import { useKMeans } from "@hooks";
import { IOSDefault, IOSGrayLight } from "@styles/palette";
import { euclideanDistance } from "@utils";
import React from "react";

const moveUnit = 10;

export function ScatterArea() {
  const { dataset, centers, labels } = useKMeans();
  const [aniStatus, setAniStatus] = React.useState<boolean[] | null>(null);
  const [windowSize, setWindowSize] = React.useState<IPoint>([0, 0]);
  const [now, setNow] = React.useState<IPoint[] | null>(null);

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
    (move: IPoint, now: IPoint, next: IPoint, label: number) => {
      const [nox, noy] = now;
      const [nex, ney] = next;
      const [mox, moy] = move;

      if (label === 0) console.log([nox, noy], [mox, moy], [nex, ney]);
      if (
        Math.round(mox) === Math.round(nex) &&
        Math.round(moy) === Math.round(ney)
      ) {
        setAniStatus((prev) => {
          prev![label] = true;
          return prev;
        });
        return;
      } else {
        const [mx, my] = [(nex - nox) / moveUnit, (ney - noy) / moveUnit];
        let [nx, ny] = [mox + mx, moy + my];
        const dis = euclideanDistance([nx, ny], next);
        console.log(dis);
        if (dis <= 5) {
          nx = nex;
          ny = ney;
        }

        const el = document.querySelector(`.center-${label}`);
        const roundEl = document.querySelector(`.center-round-${label}`);
        if (el && roundEl) {
          el.setAttribute("cx", nx + "%");
          el.setAttribute("cy", ny + "%");
          roundEl.setAttribute("cx", nx + "%");
          roundEl.setAttribute("cy", ny + "%");

          requestAnimationFrame(() => moveCenters([nx, ny], now, next, label));
        }
      }
    },
    []
  );

  const acceptCenters = React.useCallback(() => {
    setNow(centers);
  }, [centers]);

  React.useEffect(() => {
    if (!aniStatus) {
      if (centers!) {
        if (now === null) {
          setNow(centers);
        } else {
          for (let i = 0; i < centers.length; i++)
            moveCenters([...now[i]], [...now[i]], centers[i], i);
          setAniStatus(centers.map(() => false));
        }
      }
    } else {
      setAniStatus(null);
    }
  }, [now, centers]);

  React.useEffect(() => {
    if (aniStatus) {
      console.log(aniStatus);
      for (let i = 0; i < aniStatus.length; i++) {
        if (!aniStatus[i]) return;
      }
      acceptCenters();
    }
  }, [aniStatus, acceptCenters]);

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
      {now &&
        now.map(([x, y], i) => (
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
