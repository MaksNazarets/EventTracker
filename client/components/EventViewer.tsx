"use client";

import { useEvent } from "@/app/context/EventContext";
import { parseTime } from "@/app/utils/time";
import { EventType, Importance } from "@/types";
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
  const [importance, setImportance] = useState<Importance>(1);
  const [editMode, setEditMode] = useState(false);

  const dayObj = dayjs(event.dateTime);
  const [time, setTime] = useState(dayObj.format("HH:mm"));

  const { updateEvent, deleteEvent } = useEvent();

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) onClose();
  };

  useEffect(() => {
    if (isOpen) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [isOpen]);

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

    const success = await updateEvent(updatedEvent);

    if (!success) return;
    onUpdate(updatedEvent);
    onClose();
  };

  const handleDelete = async () => {
    const success = await deleteEvent(event.id!);

    if (!success) return;

    onClose();
    onDelete();
  };

  return (
    <dialog
      ref={dialogRef}
      className="fixed top-1/2 bg-gray-900 rounded-xl border-2 border-gray-700 text-foreground shadow-xl transition duration-200 overflow-hidden bubble-fade-in mx-auto -translate-y-1/2"
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
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="custom-input"
          required
          disabled={!editMode}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="custom-input flex-1"
          required
          disabled={!editMode}
        ></textarea>
        <div className="flex gap-2">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="custom-input min-w-24"
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
            <div className="custom-input">
              {["ordinary", "important", "critical"][importance]}
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
          <div className="w-1/2 self-end flex gap-1">
            <button
              type="submit"
              className="flex-1 mt-3 text-[1.4rem] border border-gray-500 p-2 rounded-md hover:bg-gray-700 active:bg-gray-700 transition disabled:brightness-75"
              onClick={(e) => setEditMode(true)}
            >
              Update
            </button>
            <button
              type="submit"
              className="flex-1 mt-3 text-[1.4rem] bg-red-900/50 p-2 rounded-md hover:bg-red-800/50 active:bg-gray-700 transition disabled:brightness-75"
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
