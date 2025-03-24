"use client";

import DayEventsInfo from "@/components/calendar/DayEventsInfo";
import { EventType, Importance } from "@/types";
import dayjs from "dayjs";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";
import API from "../../utils/api";
import { parseTime } from "../../utils/time";

interface EventContextType {
  setSelectedDate: Dispatch<SetStateAction<dayjs.Dayjs | null>>;
  createEvent: (e: {
    title: string;
    description: string;
    importance: Importance;
    time: string;
  }) => Promise<EventType | null>;
  updateEvent: (e: EventType) => Promise<boolean>;
  deleteEvent: (id: number) => Promise<boolean>;
}

const EventContext = createContext<EventContextType | null>(null);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

  const createEvent = async ({
    title,
    description,
    importance,
    time,
  }: {
    title: string;
    description: string;
    importance: Importance;
    time: string;
  }) => {
    try {
      const parsedTime = parseTime(time);

      const res = await API.post("/events/new", {
        title,
        description,
        importance,
        datetime: selectedDate
          ?.hour(parsedTime.hour)
          .minute(parsedTime.minute)
          .toISOString(),
      });

      console.log("Event created successfullly");

      return res.data.newEvent;
    } catch (err: any) {
      alert("Unexpected error :(");
      console.error(err);

      return null;
    }
  };

  const updateEvent = async (event: EventType) => {
    const { id, title, description, importance, dateTime: datetime } = event;

    try {
      await API.post("/events/update", {
        id,
        title,
        description,
        importance,
        datetime,
      });

      console.log("Event updated successfullly");
      return true;
    } catch (err: any) {
      alert("Unexpected server error :(");
      console.error(err);

      return false;
    }
  };

  const deleteEvent = async (id: number) => {
    try {
      await API.get(`/events/delete?id=${id}`);

      console.log("Event deleted successfullly");
      return true;
    } catch (err: any) {
      alert("Unexpected server error :(");
      console.error(err);
      return false;
    }
  };

  const value = useMemo(
    () => ({
      deleteEvent,
      createEvent,
      updateEvent,
      setSelectedDate,
    }),
    [selectedDate]
  );

  return (
    <EventContext.Provider value={value}>
      {children}

      <DayEventsInfo
        date={selectedDate}
        onClose={() => setSelectedDate(null)}
      />
    </EventContext.Provider>
  );
}
export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEventContext must be used within an EventProvider");
  }
  return context;
};
