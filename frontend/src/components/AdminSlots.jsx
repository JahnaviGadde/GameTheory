import React, { useEffect, useState } from "react";
import "./Slotstable.css";
import { useParams} from "react-router-dom";
import axios from "axios";

// Main component
export default function Adminslots() {
  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(formattedToday);
  const [courts, setCourts] = useState([]);
  const [bookings, setBookings] = useState({}); 

  const { centreId } = useParams(); 

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const times = ["5:00 AM - 6:00 AM", "6:00 AM - 7:00 AM", "7:00 AM - 8:00 AM", "8:00 AM - 9:00 AM", "9:00 AM - 10:00 AM","10:00 AM - 11:00 AM","11:00 AM - 12:00 PM","12:00 PM - 1:00 PM","1:00 PM - 2:00 PM","2:00 PM - 3:00 PM","3:00 PM - 4:00 PM","4:00 PM - 5:00 PM","5:00 PM - 6:00 PM","6:00 PM - 7:00 PM","7:00 PM - 8:00 PM","8:00 PM - 9:00 PM","9:00 PM - 10:00 PM","10:00 PM - 11:00 PM","11:00 PM - 12:00 AM",];

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

  useEffect(() => {
    const fetchBookings = async () => {
      const bookingData = {}; 

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
      <div className="date-selector">
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="calendar-input"
        />
      </div>

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
                  const userName = bookings[court._id]?.[timeSlot]?.customerName;
                  return (
                    <td
                  key={timeSlot}
                  style={{
                    textAlign: "center",
                    backgroundColor:
                      bookingStatus === "booked"
                        ? "#FF7f7f" 
                        : bookingStatus === "empty"
                        ? "#ADD8E6" 
                        : "#D3D3D3",
                    padding: "8px",
                  }}
                >
                  {bookingStatus === "booked" && `Booked by ${userName}`}
                  {bookingStatus === "empty" && "Available"}
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
