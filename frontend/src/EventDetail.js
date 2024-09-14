import React, { useState, useEffect, useRef } from 'react';
import './EventDetail.css'; 
import Signup from './Signup'; 
const url="https://event-mangement-ptas.onrender.com"

const EventDetail = ({ event, goBack }) => {
  const [rsvpStatus, setRsvpStatus] = useState('Not Responded');
  const [attendees, setAttendees] = useState([]);
  const [attendeesCount, setAttendeesCount] = useState(0);
  const [showSignup, setShowSignup] = useState(false);
  const fadeAnim = useRef(0);

  useEffect(() => {
    let start = 0;
    const fade = () => {
      start += 0.05;
      fadeAnim.current = start;
      const fadeElement = document.getElementById('fade');
      if (fadeElement) fadeElement.style.opacity = start;
      if (start < 1) {
        requestAnimationFrame(fade);
      }
    };
    fade();
  }, []);

  const handleRSVP = async (status) => {
  
    setShowSignup(true); 

    try {
      
    } catch (error) {
      console.error('Error updating RSVP:', error);
    }
  };

  const fetchAttendees = async () => {
    try {
      const response = await fetch(url+`/events/${event.id}/attendees`);
      const data = await response.json();
      setAttendees(data.attendees || []); 
      setAttendeesCount(data.count || 0); 
    } catch (error) {
      console.error('Error fetching attendees:', error);
    }
  };
  
  useEffect(() => {
    let start = 0;
    const fade = () => {
      start += 0.05;
      fadeAnim.current = start;
      const fadeElement = document.getElementById('fade');
      if (fadeElement) {
        fadeElement.style.opacity = start;
      }
      if (start < 1) {
        requestAnimationFrame(fade);
      }
    };
    fade();
  }, []);
  

  const handleSignupSuccess = () => {
    setShowSignup(false);
    fetchAttendees(); 
  };

  return (
    <div id="fade" className="container">
      <button className="back-button" onClick={goBack}>Back</button>
      <h1 className="title">{event.name}</h1>
      <p className="detail">Date: {event.date}</p>
      <p className="detail">Time: {event.time}</p>
      <p className="detail">Location: {event.location}</p>
      <p className="detail">Description: {event.description}</p>
      
      <div className="button-container">
        <button className="button" onClick={() => handleRSVP('Attending')}>
          Give Response
        </button>
        
      </div>
      <div className="attendees-container">
       
        
      </div>
      {showSignup && <Signup eventId={event.id} onSuccess={handleSignupSuccess} />}
    </div>
  );
};

export default EventDetail;
