import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ✅ Create new calendar event
export const createEvent = async (req, res) => {
  try {
    const { title, description, type, date, duration, instructor } = req.body;

    if (!title || !type || !date) {
      return res.status(400).json({ error: "Title, type, and date are required." });
    }

    const event = await prisma.calendar.create({
      data: {
        title,
        description,
        type,
        date: new Date(date),
        duration,
        instructor,
      },
    });

    res.status(201).json(event);
  } catch (error) {
    console.error("❌ Create Event Error:", error);
    res.status(500).json({ error: "Failed to create event." });
  }
};

// ✅ Get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await prisma.calendar.findMany({
      orderBy: { date: "asc" },
    });
    res.json(events);
  } catch (error) {
    console.error("❌ Fetch Events Error:", error);
    res.status(500).json({ error: "Failed to fetch events." });
  }
};

// ✅ Get single event by ID
export const getEventById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const event = await prisma.calendar.findUnique({ where: { id } });

    if (!event) return res.status(404).json({ error: "Event not found." });
    res.json(event);
  } catch (error) {
    console.error("❌ Get Event Error:", error);
    res.status(500).json({ error: "Failed to fetch event." });
  }
};

// ✅ Update event
export const updateEvent = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description, type, date, duration, instructor } = req.body;

    const event = await prisma.calendar.update({
      where: { id },
      data: { title, description, type, date: new Date(date), duration, instructor },
    });

    res.json(event);
  } catch (error) {
    console.error("❌ Update Event Error:", error);
    res.status(500).json({ error: "Failed to update event." });
  }
};

// ✅ Delete event
export const deleteEvent = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.calendar.delete({ where: { id } });
    res.json({ message: "Event deleted successfully." });
  } catch (error) {
    console.error("❌ Delete Event Error:", error);
    res.status(500).json({ error: "Failed to delete event." });
  }
};
