import React, { useEffect, useState } from "react";
import "./Slotstable.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// Main component
export default function CourtSchedule() {
  const navigate = useNavigate();
  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(formattedToday);
  const [courts, setCourts] = useState([]); // List of all courts
  const [bookings, setBookings] = useState({}); // Map of courtId & time slot bookings

  const { centreId } = useParams(); // Fetching centreId dynamically from route

  // Handle date change
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const times = ["5:00 AM - 6:00 AM", "6:00 AM - 7:00 AM", "7:00 AM - 8:00 AM", "8:00 AM - 9:00 AM", "9:00 AM - 10:00 AM","10:00 AM - 11:00 AM","11:00 AM - 12:00 PM","12:00 PM - 1:00 PM","1:00 PM - 2:00 PM","2:00 PM - 3:00 PM","3:00 PM - 4:00 PM","4:00 PM - 5:00 PM","5:00 PM - 6:00 PM","6:00 PM - 7:00 PM","7:00 PM - 8:00 PM","8:00 PM - 9:00 PM","9:00 PM - 10:00 PM","10:00 PM - 11:00 PM","11:00 PM - 12:00 AM",];

  // Fetch courts dynamically from the server
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKENDAPI}/api/court/center/${centreId}`
        );
        setCourts(response.data);
      } catch (error) {
        console.error("Error fetching courts:", error);
      }
    };

    fetchCourts();
  }, [centreId]);

  // Fetch booking slots for courts & selected date dynamically
  useEffect(() => {
    const fetchBookings = async () => {
      const bookingData = {}; // Prepare a map of bookings

      try {
        for (let court of courts) {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKENDAPI}/api/booking/court/${court._id}/date/${selectedDate}`
          );

          const bookingsForCourt = response.data;
          bookingData[court._id] = {};

          bookingsForCourt.forEach((booking) => {
            const timeSlot = booking.bookingSlot;
            bookingData[court._id][timeSlot] = booking;
          });
        }

        setBookings(bookingData);
      } catch (error) {
        console.error("Error fetching booking data", error);
      }
    };

    if (courts.length) fetchBookings();
  }, [courts, selectedDate]);

  return (
    <div className="court-schedule">
      {/* Date Selector */}
      <div className="date-selector">
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="calendar-input"
        />
      </div>

      {/* Render the table dynamically */}
      <div className="schedule-table">
        <table>
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>Court Name</th>
              {times.map((time, index) => (
                <th key={index} style={{ textAlign: "center" }}>
                  {time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {courts.map((court) => (
              <tr key={court._id}>

                <td className="court-name" style={{ textAlign: "center" }}>
                  {court.name}
                </td>
                {times.map((timeSlot) => {
                  const bookingStatus = bookings[court._id]?.[timeSlot]?.bookingStatus;
                  const bookingId = bookings[court._id]?.[timeSlot]?._id; 
                  return (
                    <td
                  key={timeSlot}
                  style={{
                    textAlign: "center",
                    backgroundColor:
                      bookingStatus === "booked"
                        ? "#FF7f7f" // Red for booked
                        : bookingStatus === "empty"
                        ? "#ADD8E6" // Light blue for available
                        : "#D3D3D3", // Gray for no slot
                    padding: "8px",
                  }}
                >
                  {bookingStatus === "booked" && "Booked"}
                  {bookingStatus === "empty" && (
                    <button
                      onClick={() =>
                        navigate(`/bookslots/${bookingId}`, {
                          state: { courtId: court._id, timeSlot, selectedDate },
                        })
                      }
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#007BFF",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Book Now
                    </button>
                  )}
                  {bookingStatus !== "booked" && bookingStatus !== "empty" && ""}
                </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
