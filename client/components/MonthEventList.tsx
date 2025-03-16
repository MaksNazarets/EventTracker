"use client";

import API from "@/app/utils/api";
import { EventType } from "@/types";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import MonthEvent from "./MonthEvent";

const Calendar = React.memo(() => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [monthEvents, setMonthEvents] = useState<EventType[]>([]);

  const prevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
  const nextMonth = () => setCurrentDate(currentDate.add(1, "month"));

  const today = dayjs();

  useEffect(() => {
    API.get(
      `/events/get?year=${currentDate.year()}&month=${currentDate.month()}`
    )
      .then((res: any) => {
        console.log(res.data.events);
        setMonthEvents(res.data.events);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [currentDate]);

  return (
    <div className="flex-1 flex flex-col items-center rounded-lg w-full h-full">
      <div className="flex justify-between self-center gap-3 items-center mb-2 w-72">
        <button
          className="py-1 pl-[0.1rem] pr-1 rounded-full hover:bg-gray-700 active:bg-gray-500 transition"
          onClick={prevMonth}
        >
          <ChevronLeft />
        </button>
        <h2 className="font-bold">{currentDate.format("MMMM YYYY")}</h2>
        <button
          className="py-1 pr-[0.1rem] pl-1 rounded-full hover:bg-gray-700 active:bg-gray-500 transition"
          onClick={nextMonth}
        >
          <ChevronRight />
        </button>
      </div>

      <div className="w-[500px] mt-5  flex-1 overflow-auto ">
        <ul>
          {monthEvents.map((e) => (
            <MonthEvent key={e.id} event={e} />
          ))}
        </ul>
        {!monthEvents.length && (
          <div className="mt-10 text-gray-400">No events this month...</div>
        )}
      </div>
    </div>
  );
});

export default Calendar;
