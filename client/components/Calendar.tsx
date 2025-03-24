"use client";

import { useEvent } from "@/app/context/EventContext";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import Day from "./calendar/Day";
import API from "@/utils/api";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = React.memo(() => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const { setSelectedDate } = useEvent();
  const [eventsPerDay, setEventsPerDay] = useState([]);

  const startOfMonth = currentDate.startOf("month").day();
  const endOfMonth = currentDate.endOf("month");
  const daysInMonth = endOfMonth.date();

  const prevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
  const nextMonth = () => setCurrentDate(currentDate.add(1, "month"));

  const today = dayjs();

  useEffect(() => {
    API.get(
      `/events/events-per-day?year=${currentDate.year()}&month=${currentDate.month()}`
    )
      .then((res: any) => setEventsPerDay(res.data.eventsPerDay))
      .catch((err) => {
        console.error(err);
      });

    return () => setEventsPerDay([]);
  }, [currentDate]);

  const isToday = (day: number) =>
    currentDate.year() === today.year() &&
    currentDate.month() === today.month() &&
    today.date() === day;

  return (
    <div className="flex-1 flex flex-col rounded-lg w-full h-full">
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
      <div className="flex justify-around gap-1 mt-3 mb-1">
        {weekDays.map((d, i) => (
          <div
            key={`weekday-${i}`}
            className="flex-1 text-center text-gray-300"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-1">
        {Array.from({ length: startOfMonth }, (_, i) => (
          <div key={`empty-${i}`}></div>
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => (
          <Day
            key={i + 1}
            day={i + 1}
            today={isToday(i + 1)}
            eventsNumber={eventsPerDay[i] || 0}
            onClick={() => setSelectedDate(currentDate.date(i + 1))}
          />
        ))}
      </div>
    </div>
  );
});

export default Calendar;
