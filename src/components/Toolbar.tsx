import { useKMeans, useUI } from "@hooks";

export function RunToolbar() {
  const { mode } = useUI();
  const { K } = useKMeans();

  return mode === "run" ? (
    <div className="kmeans-run-toolbar">
      <span>K={3}</span>
      <button>next</button>
      <button>auto next</button>
      <span>round={0}</span>
      <button>refresh</button>
    </div>
  ) : (
    <></>
  );
}
