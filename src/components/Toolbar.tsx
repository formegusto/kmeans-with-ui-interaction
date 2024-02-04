import { useKMeans, useUI } from "@hooks";

export function RunToolbar() {
  const { mode, dots } = useUI();
  const { K, next, round, refresh, autoNext, isDone } = useKMeans();

  return mode === "run" || mode === "predict" ? (
    <div className="kmeans-run-toolbar">
      <span>K={K}</span>
      {mode === "predict" ? (
        <span>Prediction Mode</span>
      ) : (
        <>
          <button onClick={next} className="run-next">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
              <path
                d="M 4 6
              L 4 30
              C 4 32 6 32 6 32
              L 30 19
              C 32 18 32 16 30 15
              L 5 5
              C 5 5 4 5 4 6"
              />
            </svg>
          </button>
          <button className="auto-run" onClick={autoNext}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
              <path
                d="M 4 6
              L 4 30
              C 4 32 6 32 6 32
              L 15 28
              L 15 10
              L 5 5
              C 5 5 4 5 4 6"
              />
              <path
                d="M 17 6
              L 17 30
              C 17 32 17 32 19 32
              L 30 20
              C 31 19 32 17 30 16
              L 18 5
              C 18 5 17 5 17 6"
              />
            </svg>
          </button>
        </>
      )}

      <span>round={isDone ? "End" : round}</span>
      <button className="iter-refresh" onClick={() => refresh(dots!)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
          <path
            d="M 28 20
               C 21 42 -10 20 20 8
               "
          />
          <path
            d="M 20 8
            L 14 4
            "
          />
          <path
            d="M 20 8
            L 20 16
            "
          />
        </svg>
      </button>
    </div>
  ) : (
    <></>
  );
}
