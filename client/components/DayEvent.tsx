import { EventType } from "@/types";
import dayjs from "dayjs";
import { HTMLProps } from "react";

interface Props extends HTMLProps<HTMLLIElement> {
  event: EventType;
}

function DayEvent({ event, ...props }: Props) {
  const dateObject = dayjs(event.dateTime || "");

  return (
    <li {...props}>
      <div
        className={`flex gap-2 w-full px-3 py-1 text-2xl mb-2 border border-gray-700 border-l-4 select-none hover:border-gray-600 rounded-md ${
          event.importance === 2
            ? "border-l-orange-400 hover:border-l-orange-500"
            : event.importance === 3
            ? "border-l-red-800 hover:border-l-red-700"
            : ""
        }`}
      >
        <div className="w-77 flex-1 flex flex-col">
          <h3 className="max-w-full truncate">{event.title}</h3>
          <p className="text-xl max-h-16 truncate">{event.description}</p>
        </div>
        <div className="flex items-center justify-center w-14">
          {dateObject.format("HH:mm")}
        </div>
      </div>
    </li>
  );
}

export default DayEvent;
