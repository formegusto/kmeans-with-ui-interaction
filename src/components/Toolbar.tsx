import { useKMeans, useUI } from "@hooks";

export function RunToolbar() {
  const { mode } = useUI();
  const { K, next } = useKMeans();

  return mode === "run" ? (
    <div className="kmeans-run-toolbar">
      <span>K={K}</span>
      <button onClick={next}>next</button>
      <button>auto next</button>
      <span>round={0}</span>
      <button>refresh</button>
    </div>
  ) : (
    <></>
  );
}
