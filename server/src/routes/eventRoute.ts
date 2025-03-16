import express from "express";
import {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
} from "../controllers/eventController";
import { authMiddleware } from "../middleware/auth";

export const router = express.Router();

router.get("/get", authMiddleware, getEvents);

router.post("/new", authMiddleware, createEvent);

router.post("/update", authMiddleware, updateEvent);

router.get("/delete", authMiddleware, deleteEvent);
