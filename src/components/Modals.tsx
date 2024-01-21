import { useUI } from "@hooks";

export function SetModal() {
  const { mode } = useUI();
  return mode === "set" ? (
    <div className="set-modal-container">
      <div className="modal-question-group">
        <span>Your K is</span>
        <input type="text" maxLength={2} />
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 129.53 2"
        className="highlight-line"
      >
        <path
          d="M 0 1 
            L 129.53 1 
            L 129.53 -30
            L 98.53 -30
            L 98.53 1"
        />
      </svg>
    </div>
  ) : (
    <></>
  );
}
