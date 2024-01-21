import { useUI } from "@hooks";

export function SetModal() {
  const { mode } = useUI();
  return mode === "set" ? <div className="set-modal-container"></div> : <></>;
}
