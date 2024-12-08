import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function UserBookedSlots() {
  const [bookedSlots, setBookedSlots] = useState([]);
  const context = useContext(AuthContext);
  const backendAPI = process.env.REACT_APP_BACKENDAPI;

  
  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const response = await axios.get(
          `${backendAPI}/api/booking/user/${context.user.user.id}`
        );
        setBookedSlots(response.data);
      } catch (error) {
        console.error("Error fetching user bookings:", error);
      }
    };

    fetchUserBookings();
  }, [context.user.user.id]);

  return (
    <div className="allcentres">
      <h2 className="heading">Your Booked Slots</h2>
      <div className="card-container">
        {bookedSlots.length > 0 ? (
          bookedSlots.map((booking) => (
            <div className="card" key={booking._id}>
              <h3 className="card-title">{booking.courtId.name}</h3>
              <p className="card-location">{booking.centerId.name}</p>
              <p className="card-date">{new Date(booking.date).toLocaleDateString()}</p>
              <p className="card-slot">Slot: {booking.bookingSlot}</p>
            </div>
          ))
        ) : (
          <p className="no-bookings">No Bookings Found.</p>
        )}
      </div>
    </div>
  );
}
