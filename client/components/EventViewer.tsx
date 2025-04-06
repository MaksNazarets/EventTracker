"use client";

import { decrementDayEventsNumber } from "@/lib/slices/eventsSlice";
import { useAppDispatch } from "@/lib/store";
import { EventType, Importance } from "@/types";
import API from "@/utils/api";
import { parseTime } from "@/utils/time";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";

interface Props {
  event: EventType;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (event: EventType) => void;
  onDelete: () => void;
}

function EventViewer({ event, isOpen, onClose, onUpdate, onDelete }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [importance, setImportance] = useState<Importance>(event.importance);
  const [editMode, setEditMode] = useState(false);

  const dayObj = dayjs(event.dateTime);
  const [time, setTime] = useState(dayObj.format("HH:mm"));

  const dispatch = useAppDispatch();

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) onClose();
  };

  useEffect(() => {
    if (isOpen) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [isOpen]);

  useEffect(() => {
    if (editMode) return;

    setTitle(event.title);
    setDescription(event.description);
    setTime(dayObj.format("HH:mm"));
    setImportance(event.importance);
  }, [editMode]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedTime = parseTime(time);

    const updatedEvent = {
      ...event,
      title,
      description,
      importance,
      dateTime: dayObj
        .hour(parsedTime.hour)
        .minute(parsedTime.minute)
        .toISOString(),
    };

    try {
      await API.post("/events/update", updatedEvent);

      console.log("Event updated successfullly");

      onUpdate(updatedEvent);
      onClose();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await API.get(`/events/delete?id=${event.id}`);

      dispatch(decrementDayEventsNumber(dayObj.date() - 1));

      console.log("Event deleted successfullly");
      onClose();
      onDelete();
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="fixed top-1/2 bg-gray-900 rounded-xl border-2 border-gray-700 text-foreground text-left shadow-xl transition duration-200 overflow-hidden bubble-fade-in mx-auto -translate-y-1/2"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => handleBackdropClick(e)}
    >
      <div className="flex flex-col gap-5 max-w-full max-h-full w-[700px] h-[500px] px-3 sm:px-8 py-6">
        <span className="text-center text-3xl">
          {editMode ? "Update event" : "Event"}
        </span>
        {editMode ? (
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="custom-input"
            required
          />
        ) : (
          <div className="custom-input-borderless font-bold">{title}</div>
        )}

        {editMode ? (
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="custom-input flex-1"
            required
            disabled={!editMode}
          ></textarea>
        ) : (
          <div className="custom-input-borderless flex-1">{description}</div>
        )}

        <div className="flex gap-2">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={`custom-input${editMode ? "" : "-borderless"}`}
            disabled={!editMode}
          />
          {editMode ? (
            <select
              value={importance}
              className="bg-gray-800 p-2 px-4 rounded-md text-xl"
              onChange={(e) =>
                setImportance(parseInt(e.target.value, 10) as Importance)
              }
            >
              <option value="1">ordinary</option>
              <option value="2">important</option>
              <option value="3">critical</option>
            </select>
          ) : (
            <div className="custom-input-borderless">
              {["ordinary", "important", "critical"][importance - 1]}
            </div>
          )}
        </div>

        {editMode ? (
          <div className="w-full self-end flex gap-1">
            <button
              type="submit"
              className="flex-1 mt-3 text-[1.4rem] bg-gray-600 p-2 rounded-md hover:bg-gray-700 active:bg-gray-700 transition disabled:brightness-75"
              onClick={(e) => handleUpdate(e)}
              disabled={
                title.trim().length === 0 || description.trim().length === 0
              }
            >
              Confirm
            </button>
            <button
              type="submit"
              className="mt-3 text-[1.4rem]  border border-gray-500  p-2 rounded-md hover:border-gray-300 active:bg-gray-700 transition disabled:brightness-75"
              onClick={(e) => setEditMode(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="w-1/2 self-end flex gap-1 use-select-none">
            <button
              type="submit"
              className="flex-1 mt-3 text-[1.4rem] border border-gray-500 p-2 rounded-md hover:bg-gray-700 active:bg-gray-800 transition disabled:brightness-75"
              onClick={(e) => setEditMode(true)}
            >
              Update
            </button>
            <button
              type="submit"
              className="flex-1 mt-3 text-[1.4rem] bg-red-900/50 p-2 rounded-md border border-red-900/75 hover:bg-red-800/50 hover:border-red-500 active:bg-red-900/75 transition disabled:brightness-75"
              onClick={() => handleDelete()}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}
export default EventViewer;
