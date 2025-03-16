import React, { HTMLProps } from "react";

interface Props extends HTMLProps<HTMLDivElement> {
  day: number;
  today?: boolean;
}

function Day({ day, today, ...props }: Props) {
  return (
    <div
      className={`p-2 text-center border rounded-md hover:border-gray-300 cursor-pointer select-none ${
        today ? "border-gray-200 outline" : "border-gray-500"
      }`}
      {...props}
    >
      {day}
    </div>
  );
}

export default Day;
