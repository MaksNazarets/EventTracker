"use client";

import { useState } from "react";
import Calendar from "@/components/Calendar";
import MonthEventList from "@/components/MonthEventList";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { stat } from "fs";
import { logoutUser } from "@/lib/slices/userSlice";

export default function CalendarPage() {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [mode, setMode] = useState<"calendar" | "list">("calendar");

  return (
    <div className="flex-1 flex flex-col  gap-3 sm:py-10 max-w-[1400px]">
      <div className="flex gap-3 justify-between items-center">
        <span className="text-2xl overflow-hidden text-ellipsis">
          {user?.name}
        </span>

        <div className="flex gap-1">
          <button
            className={`text-2xl border-b px-3 py-1 hover:brightness-75 active:brightness-90 ${
              mode === "calendar" ? "border-white" : "border-transparent"
            }`}
            onClick={() => setMode("calendar")}
          >
            Calendar
          </button>
          <button
            className={`text-2xl border-b px-3 py-1 hover:brightness-75 active:brightness-90 ${
              mode === "list" ? "border-white" : "border-transparent"
            }`}
            onClick={() => setMode("list")}
          >
            List
          </button>{" "}
        </div>

        <button
          className="text-2xl border rounded-md px-3 py-1 hover:brightness-75 active:brightness-90"
          onClick={() => dispatch(logoutUser())}
        >
          Log out
        </button>
      </div>
      <div className="flex-1 h-full flex flex-col gap-3 text-center text-2xl pt-5 pb-3">
        {mode === "calendar" ? <Calendar /> : <MonthEventList />}
      </div>
    </div>
  );
}
