

import React, { useState, useEffect } from 'react';
import './Signup.css'; 

const Signup = () => {
  const [name, setName] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState('');
  const [eventId, setEventId] = useState(null);
  const [events, setEvents] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const url="https://event-mangement-ptas.onrender.com"
  // Fetch events from the server
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(url+'/events');
        const data = await response.json();
        setEvents(data);
        if (data.length > 0) {
          setEventId(data[0]._id); 
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  // Fetch attendees when eventId changes
  const fetchAttendees = async () => {
    if (eventId) {
      try {
        const response = await fetch(url+`/events/${eventId}/attendees`);
        const data = await response.json();
       
        setAttendees((data.attendees || []).filter(Boolean));
      } catch (error) {
        console.error('Error fetching attendees:', error);
      }
    }
  };

  useEffect(() => {
    fetchAttendees();
  }, [eventId]);

  const handleRSVP = async (status) => {
    if (!eventId) {
      console.error('Event ID is required');
      return;
    }

    try {
      const response = await fetch(url+`/events/${eventId}/attendees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          rsvpStatus: status
        }),
      });

      if (response.ok) {
        console.log('RSVP submitted successfully');
    
        fetchAttendees();
      } else {
        console.error('Failed to submit RSVP');
      }
    } catch (error) {
      console.error('Error during RSVP:', error);
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-heading">Sign Up</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="signup-input"
      />
      <div className="signup-buttons-container">
        <button onClick={() => handleRSVP('Attending')} className="signup-rsvp-button attending">
          RSVP Attending
        </button>
        <button onClick={() => handleRSVP('Not Attending')} className="signup-rsvp-button not-attending">
          RSVP Not Attending
        </button>
      </div>
      <h3 className="signup-events-heading">Available Events</h3>
      <ul className="signup-events-list">
        {events.map((event) => (
          <li key={event._id} onClick={() => setEventId(event._id)} className="signup-event-item">
            {event.name}
          </li>
        ))}
      </ul>
      <h3 className="signup-attendees-heading">Attendees List</h3>
      <ul className="signup-attendees-list">
        {attendees.map((attendee) => (
          <li key={attendee._id} className="signup-attendee-item">
            {attendee.name} - {attendee.rsvpStatus}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Signup;
