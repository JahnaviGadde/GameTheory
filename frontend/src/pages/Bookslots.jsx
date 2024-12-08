import React, { useEffect, useState, useContext } from "react";
import NavbarUser from "../components/NavbarUser";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function Bookslots() {
  const { bookingId } = useParams(); 
  const navigate = useNavigate(); 
  const context = useContext(AuthContext);
  const [formData, setFormData] = useState({}); 
  const username = context.user.user.name;

  // Fetch booking data on page load
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKENDAPI}/api/booking/${bookingId}`
        );

        const booking = response.data;

        setFormData({
          courtName: booking.courtId?.name,
          sportName: booking.sportId?.name,
          centerName: booking.centerId?.name,
          bookingDate: new Date(booking.date).toISOString().split("T")[0],
          bookingSlot: booking.bookingSlot,
        });
      } catch (error) {
        console.error("Error fetching booking data:", error);
        alert("Could not load the booking data.");
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKENDAPI}/api/booking/book/${bookingId}`,
        {
          userId: context?.user?.user?.id, 
          customername: context?.user?.user?.name,
        },
        
        {
            headers: {
              Authorization: `Bearer ${context.user.token}`,
              'Content-Type': 'application/json',
            },
        }
      );

      alert(response.data.message); 
      navigate(`/dashboard/${username}`); 
    } catch (error) {
        console.error("Error booking slot:", error);
        if (error.response?.status === 400 || error.response?.data?.message === "Invalid token") {
          alert("Your session has expired. Please log in again.");
          navigate('/');
        } else {
          alert(
            error.response?.data?.message || "An error occurred. Please try again."
          );
        }
    }
  };

  if (!formData.courtName) return <div>Loading...</div>; // Wait until data is loaded

  return (
    <div className="centreschedule">
      <NavbarUser />
      <div className="form-container">
        <h2>Book Slot</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Center</label>
            <input type="text" value={formData.centerName} readOnly />
          </div>
          <div>
            <label>Court</label>
            <input type="text" value={formData.courtName} readOnly />
          </div>
          <div>
            <label>Sport</label>
            <input type="text" value={formData.sportName} readOnly />
          </div>
          <div>
            <label>Date</label>
            <input type="date" value={formData.bookingDate} readOnly />
          </div>
          <div>
            <label>Time Slot</label>
            <input type="text" value={formData.bookingSlot} readOnly />
          </div>
          <button type="submit" className="submit-button">
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
}
