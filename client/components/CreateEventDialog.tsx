"use client";

import { useEvent } from "@/app/context/EventContext";
import { EventType, Importance } from "@/types";
import { useEffect, useRef, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (event: EventType) => void;
}

function CreateEventDialog({ isOpen, onSuccess, onClose: closeFn }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [importance, setImportance] = useState<Importance>(1);
  const [time, setTime] = useState("00:00");

  const { createEvent } = useEvent();

  const close = () => {
    closeFn();
    setTitle("");
    setDescription("");
    setImportance(1);
    setTime("00:00");
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) close();
  };

  useEffect(() => {
    if (isOpen) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newEvent = await createEvent({
      title,
      description,
      importance,
      time,
    });

    if (!newEvent) return;

    onSuccess(newEvent);
    close();
  };

  return (
    <dialog
      ref={dialogRef}
      className="fixed top-1/2 bg-gray-900 rounded-xl border-2 border-gray-700 text-foreground shadow-xl transition duration-200 overflow-hidden bubble-fade-in mx-auto -translate-y-1/2"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => handleBackdropClick(e)}
    >
      <div className="flex flex-col gap-5 max-w-full max-h-full w-[700px] h-[500px] px-3 sm:px-8 py-6">
        <span className="text-center text-3xl">New event</span>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="custom-input"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="custom-input flex-1"
          required
        ></textarea>
        <div className="flex gap-2">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="custom-input min-w-24"
          />
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
        </div>
        <button
          type="submit"
          className="mt-3 text-[1.4rem] bg-gray-600 p-2 rounded-md hover:bg-gray-700 active:bg-gray-700 transition disabled:brightness-75"
          onClick={(e) => handleSubmit(e)}
          disabled={
            title.trim().length === 0 ||
            description.trim().length === 0 ||
            time.length < 5
          }
        >
          Confirm
        </button>
      </div>
    </dialog>
  );
}
export default CreateEventDialog;
