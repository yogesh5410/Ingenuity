import { Router } from "express";
import auth from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";

const eventRouter = Router();

// GET all events
eventRouter.get("/get", getEvents);

// POST create a new event
eventRouter.post("/create",auth, admin, createEvent);

// PUT update an event
eventRouter.put("/update",auth, admin, updateEvent);

// DELETE an event
eventRouter.delete("/delete",auth, admin, deleteEvent);

export default eventRouter;
