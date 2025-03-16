"use client";

import { useAuth } from "../context/AuthContext";
import Calendar from "@/components/Calendar";

export default function CalendarPage() {
  const { user, logout } = useAuth();

  return (
    <div className="flex-1 flex flex-col p-4 pb-20 gap-3 sm:py-10 max-w-[1400px]">
      <div className=" flex gap-3 items-center">
        <span className="text-2xl flex-1 overflow-hidden text-ellipsis">
          {user?.name}
        </span>
        <button
          className="text-2xl border rounded-md px-3 py-1 hover:brightness-75 active:brightness-90"
          onClick={() => logout()}
        >
          Log out
        </button>
      </div>
      <div className="flex-1 flex flex-col gap-3 text-center text-2xl mt-7 pb-16">
        <Calendar />
      </div>
    </div>
  );
}
