const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); 

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

// Event schema and model
const eventSchema = new mongoose.Schema({
  name: String,
  date: String,
  time: String,
  location: String,
  description: String,
  attendees: [{ name: String, rsvpStatus: String }],
});

const Event = mongoose.model('Event', eventSchema);

// Routes
app.get('/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/events', async (req, res) => {
  const event = new Event(req.body);
  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add attendee


app.post('/events/:id/attendees', async (req, res) => {
  const { id } = req.params;
  const { name, rsvpStatus } = req.body;

  try {
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    event.attendees.push({ name, rsvpStatus });
    await event.save();

    res.status(200).json({ attendees: event.attendees, count: event.attendees.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendees and count


app.get('/events/:id/attendees', async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

  
    const validAttendees = event.attendees.filter(attendee => attendee !== null);

    
    res.status(200).json({ attendees: validAttendees, count: validAttendees.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
