import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import NavbarAdmin from "../components/NavbarAdmin";
import "./CreateSlots.css";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CreateSlots() {
  const [courts, setCourts] = useState([]); 
  const [selectedDate, setSelectedDate] = useState(""); 
  const [selectedSlots, setSelectedSlots] = useState([]); 
  const [selectedCourt, setSelectedCourt] = useState(""); 
  const [selectedSportsId, setSelectedSportsId] = useState(""); 

  const context = useContext(AuthContext); 
  const centerId = context.user?.centerId;
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKENDAPI}/api/court/center/${centerId}`
        );
        setCourts(response.data);
      } catch (error) {
        console.error("Error fetching courts:", error);
      }
    };

    if (centerId) {
      fetchCourts();
    }
  }, [centerId]);

  const handleDateChange = (e) => setSelectedDate(e.target.value);

  const handleCourtChange = (e) => {
    const courtId = e.target.value;
    setSelectedCourt(courtId);
    const selectedCourtObj = courts.find((court) => court._id === courtId);
    if (selectedCourtObj) {
        console.log(selectedCourtObj)
      setSelectedSportsId(selectedCourtObj.sportId._id);
    }
  };

  const handleSlotChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedSlots([...selectedSlots, value]);
    } else {
      setSelectedSlots(selectedSlots.filter((slot) => slot !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate) return alert("Please select a date.");
    if (!selectedCourt) return alert("Please select a court.");
    if (!selectedSlots.length) return alert("Please select at least one time slot.");

    try {
      
      for (const slot of selectedSlots) {
        await axios.post(
          `${process.env.REACT_APP_BACKENDAPI}/api/booking`,
          {
            date: selectedDate,
            courtId: selectedCourt,
            centerId: centerId,
            sportId: selectedSportsId,
            bookingSlot: slot,
          },
          {
            headers: {
              Authorization: `Bearer ${context.user.token}`,
              'Content-Type': 'application/json',
            },
           }
        );
        
      }

      alert("All selected slots have been booked successfully.");

      setSelectedDate("");
      setSelectedCourt("");
      setSelectedSlots([]);

    } catch (error) {
      console.error("Error booking slot:", error);
        if (error.response?.status === 401 || error.response?.data?.message === "Invalid token") {
          alert("Your session has expired. Please log in again.");
          navigate('/');
        } else {
          alert(
            error.response?.data?.message || "An error occurred. Please try again."
          );
        }
    }
  };

  return (
    <div className="userdashboard">
      <NavbarAdmin />
      <div className="createslots-form-container">
        <h2>Create Booking Slots</h2>
        <form onSubmit={handleSubmit} className="createslots-form">
          <div className="form-group">
            <label htmlFor="date">Select Date:</label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={handleDateChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="court">Select Court:</label>
            <select
              id="court"
              value={selectedCourt}
              onChange={handleCourtChange}
              required
            >
              <option value="">-- Select a court --</option>
              {courts.length > 0 ? (
                courts.map((court) => (
                  <option key={court._id} value={court._id}>
                    {court.name}
                  </option>
                ))
              ) : (
                <option disabled>Loading courts...</option>
              )}
            </select>
          </div>

          <div>
            <label>Select Time Slots:</label>
            <div className="slot-options">
              {["5:00 AM - 6:00 AM", "6:00 AM - 7:00 AM", "7:00 AM - 8:00 AM", "8:00 AM - 9:00 AM", "9:00 AM - 10:00 AM",
                "10:00 AM - 11:00 AM","11:00 AM - 12:00 PM","12:00 PM - 1:00 PM","1:00 PM - 2:00 PM","2:00 PM - 3:00 PM","3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM",
                "5:00 PM - 6:00 PM","6:00 PM - 7:00 PM","7:00 PM - 8:00 PM","8:00 PM - 9:00 PM","9:00 PM - 10:00 PM","10:00 PM - 11:00 PM","11:00 PM - 12:00 AM",
              ].map((slot, index) => (
                <div key={index} className="slot-option">
                  <input
                    type="checkbox"
                    id={slot}
                    value={slot}
                    checked={selectedSlots.includes(slot)}
                    onChange={handleSlotChange}
                  />
                  <label htmlFor={slot}>{slot}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
