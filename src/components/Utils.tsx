import React from "react";

export function UtilsItems() {
  return (
    <div className="kmeans-utils-items">
      <button className="kmeans-utils-item">b1</button>
      <button className="kmeans-utils-item">b2</button>
      <button className="kmeans-utils-item">b3</button>
      <button className="kmeans-utils-item">b4</button>
    </div>
  );
}

export function UtilsButton({ isOpen, onClick }: any) {
  return (
    <button
      className={`kmeans-utils-btn ${isOpen ? "open" : ""}`}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className="utils-burger"
      >
        <path d="M 3 6 L 45 6" />
        <path d="M 3 22 L 45 22" />
        <path d="M 3 22 L 45 22" />
        <path d="M 3 40 L 45 40" />
      </svg>
    </button>
  );
}

export function UtilsArea() {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  return (
    <div className="kmeans-utils-area">
      <UtilsItems />
      <UtilsButton
        isOpen={isOpen}
        onClick={isOpen ? () => setIsOpen(false) : () => setIsOpen(true)}
      />
    </div>
  );
}
