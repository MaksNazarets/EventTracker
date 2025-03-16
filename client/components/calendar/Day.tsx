import React, { HTMLProps } from "react";

interface Props extends HTMLProps<HTMLDivElement> {
  day: number;
  today?: boolean;
  eventsNumber?: number;
}

function Day({ day, today, eventsNumber = 0, ...props }: Props) {
  return (
    <div
      className={`p-2 text-center border rounded-md hover:border-gray-300 cursor-pointer select-none ${
        today ? "border-gray-200 outline" : "border-gray-500"
      }`}
      {...props}
    >
      <div>{day}</div>
      {eventsNumber !== 0 && (
        <div className="text-xl text-gray-300">{eventsNumber} events</div>
      )}
    </div>
  );
}

export default Day;
