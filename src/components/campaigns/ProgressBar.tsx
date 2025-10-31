"use client";

import { useEffect, useState } from "react";

interface ProgressBarProps {
  value: number;
  max: number;
  thin?: boolean; // optional prop for thin bar
}

const ProgressBar = ({ value, max, thin = false }: ProgressBarProps) => {
  const [percent, setPercent] = useState(0);
  const height = thin ? 4 : 8; // thin = 4px, default = 8px

  useEffect(() => {
    const newPercent = Math.min(100, (value / max) * 100);
    setPercent(newPercent);
  }, [value, max]);

  return (
    <div
      className={`w-full bg-gray-200 rounded-full overflow-hidden`}
      style={{ height: `${height}px` }}
    >
      <div
        className="bg-[#094C3B] h-full rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
