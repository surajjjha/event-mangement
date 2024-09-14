import React, { useState, useEffect, useRef } from 'react';
import './EventList.css'; 
import EventDetail from './EventDetail';
const url="https://event-mangement-ptas.onrender.com"


const fetchEvents = async () => {
      try {
        const response = await fetch(url+'/events');
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching events:', error);
        return [];
      }
    };

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [fadeAnim, setFadeAnim] = useState(0);

  useEffect(() => {
    const loadEvents = async () => {
      const eventsData = await fetchEvents();
      setEvents(eventsData);
    };

    loadEvents();
  }, []);

  useEffect(() => {
    let start = 0;
    const fade = () => {
      start += 0.05;
      setFadeAnim(start);
      if (start < 1) {
        requestAnimationFrame(fade);
      }
    };
    fade();
  }, [events]);

  if (selectedEvent) {
    return <EventDetail event={selectedEvent} goBack={() => setSelectedEvent(null)} />;
  }

  return (
    <div className="container" style={{ opacity: fadeAnim }}>
      <h1 className="header">Upcoming Events</h1>
      <div className="event-list">
        {events.map((item) => (
          <div key={item.id} className="event" onClick={() => setSelectedEvent(item)}>
            <h2 className="event-name">{item.name}</h2>
            <p className="event-details">{item.date} at {item.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
