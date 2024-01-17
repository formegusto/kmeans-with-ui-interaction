import React from "react";

export function UtilsButton() {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  return (
    <button className="kmeans-utils-btn">
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
