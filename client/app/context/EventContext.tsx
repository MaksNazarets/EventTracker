"use client";

import DayEventsInfo from "@/components/calendar/DayEventsInfo";
import EventViewer from "@/components/EventViewer";
import { EventType, Importance } from "@/types";
import dayjs from "dayjs";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import API from "../utils/api";
import { parseTime } from "../utils/time";

interface EventContextType {
  events: EventType[];
  filter: "all" | Importance;
  setFilter: Dispatch<SetStateAction<Importance | "all">>;
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
  const [events, setEvents] = useState<EventType[]>([]);
  const [filter, setFilter] = useState<"all" | Importance>("all");
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

  useEffect(() => {
    API.get("/events/get")
      .then((res: any) => {
        console.log(res.data.events);
        setEvents(res.data.events);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

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

      setEvents((prev) =>
        prev.map((e) => {
          if (e.id === id) return event;
          return e;
        })
      );

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
      setEvents((val) => val.filter((t) => t.id !== id));
      return true;
    } catch (err: any) {
      alert("Unexpected server error :(");
      console.error(err);
      return false;
    }
  };

  const value = useMemo(
    () => ({
      events,
      deleteEvent,
      createEvent,
      updateEvent,
      filter,
      setFilter,
      setSelectedDate,
    }),
    [events, filter, selectedDate]
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
    throw new Error("useAuthContext must be used within a AuthProvider");
  }
  return context;
};
