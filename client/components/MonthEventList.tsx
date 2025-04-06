"use client";

import API from "@/utils/api";
import { EventType } from "@/types";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { use, useEffect, useMemo, useState } from "react";
import MonthEvent from "./MonthEvent";
import EventViewer from "./EventViewer";
import LoadingSpinner from "./LoadingSpinner";

const Calendar = React.memo(() => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [monthEvents, setMonthEvents] = useState<EventType[]>([]);
  const [isDataFetching, setIsDataFetching] = useState(false);

  const prevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
  const nextMonth = () => setCurrentDate(currentDate.add(1, "month"));

  const [eventToView, setEventToView] = useState<EventType | null>(null);

  useEffect(() => {
    setIsDataFetching(true);
    API.get(
      `/events/get?year=${currentDate.year()}&month=${currentDate.month()}`
    )
      .then((res: any) => setMonthEvents(res.data.events))
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsDataFetching(false);
      });
  }, [currentDate]);

  const eventsMemoized = useMemo(
    () =>
      monthEvents.map((e) => (
        <MonthEvent key={e.id} event={e} onClick={() => setEventToView(e)} />
      )),
    [monthEvents]
  );

  return (
    <>
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

        <div className="w-[500px] mt-5 flex-1 overflow-auto pr-1">
          <ul>{eventsMemoized}</ul>
          {isDataFetching && (
            <div className="flex justify-center my-10">
              <LoadingSpinner />
            </div>
          )}
          {!monthEvents.length && !isDataFetching && (
            <div className="mt-10 text-gray-400">No events this month...</div>
          )}
        </div>
      </div>
      {eventToView && (
        <EventViewer
          event={eventToView}
          isOpen={eventToView !== null}
          onClose={() => setEventToView(null)}
          onUpdate={(event: EventType) =>
            setMonthEvents((prev) =>
              prev.map((e) => (e.id === event.id ? event : e))
            )
          }
          onDelete={() =>
            setMonthEvents((prev) =>
              prev.filter((e) => e.id !== eventToView.id)
            )
          }
        />
      )}
    </>
  );
});

export default Calendar;
