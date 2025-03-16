import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { Event } from "../entities/Event";
import { User } from "../entities/User";
import { Importance } from "../entities/Importance";
import dayjs from "dayjs";
import { Between } from "typeorm";

export const getEvents = async (req: Request, res: Response) => {
  const eventRepo = AppDataSource.getRepository(Event);

  try {
    const dateStr = req.query.date as string;

    let events = [];

    if (!dayjs(dateStr).isValid()) {
      events = await eventRepo.find({
        where: { user: { id: (req as any).user.userId } },
        order: { dateTime: "ASC" },
      });
    } else {
      const parsedDate = dayjs(dateStr);

      const startOfDay = parsedDate.startOf("day").toDate();
      const endOfDay = parsedDate.endOf("day").toDate();

      events = await eventRepo.find({
        where: {
          user: { id: (req as any).user.userId },
          dateTime: Between(startOfDay, endOfDay),
        },
        order: { dateTime: "ASC" },
      });
    }

    const responseEventList = events.map((e) => ({ ...e, importance: e.importance.id }));

    res.json({ events: responseEventList });
  } catch (err) {
    res.status(500).json("Unexpected error occured :(");
  }
};

export const createEvent = async (req: Request, res: Response) => {
  const { title, description, importance, datetime } = req.body;

  if (
    !title ||
    !description ||
    !importance ||
    !datetime ||
    isNaN(parseInt(importance, 10))
  ) {
    console.log(req.body);
    res.status(400).json("All fields required ");
    console.error("All fields required");
    return;
  }

  if (!dayjs(datetime).isValid()) {
    res.status(400).json({ error: "Invalid or missing date" });
    return;
  }

  if (
    title.trim().length === 0 ||
    description.trim().length === 0 ||
    isNaN(parseInt(importance, 10))
  ) {
    res
      .status(400)
      .json(
        "All fields should have at least 1 character and have appropriate formats"
      );
    console.error(
      "All fields should have at least 1 character and have appropriate formats"
    );
    return;
  }

  const eventRepo = AppDataSource.getRepository(Event);
  const userRepo = AppDataSource.getRepository(User);

  try {
    const user = await userRepo.findOne({
      where: { id: (req as any).user.userId },
    });

    const newEvent = eventRepo.create({
      title: title.trim(),
      description: description.trim(),
      dateTime: datetime,
      user: user as User,
      importance: { id: importance } as Importance,
    });

    await eventRepo.save(newEvent);
    res.json({
      message: "Event successfully created",
      newEvent: { ...newEvent, importance: newEvent.importance.id },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Some error occured :(");
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  const { id, title, description, importance, datetime } = req.body;

  if (!id || !title || !description || !importance || !datetime) {
    res.status(400).json("All fields required");
    console.error("All fields required");
    return;
  }

  if (!dayjs(datetime).isValid()) {
    res.status(400).json({ error: "Invalid or missing date" });
    return;
  }

  if (
    title.trim().length === 0 ||
    description.trim().length === 0 ||
    isNaN(parseInt(importance, 10))
  ) {
    res
      .status(400)
      .json(
        "All fields should have at least 1 character and have appropriate formats"
      );
    console.error(
      "All fields should have at least 1 character and have appropriate formats"
    );
    return;
  }

  const eventRepo = AppDataSource.getRepository(Event);

  try {
    const event = await eventRepo.findOne({
      where: { id },
      relations: ["user"],
    });

    if (event?.user.id !== (req as any).user.userId) {
      res.status(403).json();
      console.error("User is forbidden to update");
      return;
    }

    await eventRepo.update(id, {
      title: title.trim(),
      description: description.trim(),
      dateTime: datetime,
      importance: { id: importance } as Importance,
    });

    res.json({ message: "Event successfully updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json("Some error occured :(");
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  const eventRepo = AppDataSource.getRepository(Event);

  try {
    const eventId = parseInt(req.query.id as string, 10);

    const event = await eventRepo.findOne({
      where: { id: eventId },
      relations: ["user"],
    });

    if (event?.user.id !== (req as any).user.userId) {
      res.status(403).json();
      console.log("User is not allowed to delete this event");
      return;
    }

    await eventRepo.delete(eventId);

    res.json({ message: "Event successfully deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json("Some error occured :(");
  }
};
