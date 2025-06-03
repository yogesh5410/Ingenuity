import Event from "../models/event.model.js";

// GET /get — Public
export const getEvents = async (req, res) => {
  try {
    const currentDate = new Date();

    const events = await Event.find({ end: { $gte: currentDate } }).sort({ start: 1 });

    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch upcoming events", error: err });
  }
};


// POST /create — Admin only
export const createEvent = async (req, res) => {
  try {
    const {
      name,
      start,
      end,
      desc,
      mode,
      location,
      image,
      links,
    } = req.body;

    const newEvent = new Event({
      name,
      start,
      end,
      desc,
      mode,
      location,
      image, // direct image URL
      links,
    });

    await newEvent.save();
    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (err) {
    res.status(500).json({ message: "Failed to create event", error: err });
  }
};

// PUT /update — Admin only
export const updateEvent = async (req, res) => {
  try {
    const { id, name, start, end, desc, location, mode, links, image } = req.body;
    console.log("Update event data:", req.body);

    if (!id) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        name,
        start,
        end,
        desc,
        location,
        mode,
        links,
        image,
      },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (err) {
    console.error("Update event error:", err);
    res.status(500).json({ message: "Failed to update event", error: err });
  }
};


// DELETE /delete — Admin only
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.body;

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete event", error: err });
  }
};
