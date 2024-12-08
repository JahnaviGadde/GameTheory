import "./Navbar.css";
import profilepic from "./profile.jpg";
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function NavbarAdmin() {
  const context = useContext(AuthContext);
  const [centerInfo, setCenterInfo] = useState({ name: '', location: '', city: '' });

  useEffect(() => {
    const fetchCenterDetails = async () => {
      try {
        if (context.user?.centerId) {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKENDAPI}/api/centre/${context.user.centerId}`
          );
          console.log(response)
          setCenterInfo({
            name: response.data.name,
            location: response.data.location,
            city : response.data.city
          });
        }
      } catch (error) {
        console.error("Error fetching center details:", error);
      }
    };

    fetchCenterDetails();
  }, [context.user?.centerId, context]);

  return (
    <div className="navbar">
      <div className="navbar-logo">Game Theory</div>
      <div className="navbar-menu">
        <div className="navbar-item">
        <Link to={`/monitorslots/${context.user.centerId}`}>
          <span>Schedule</span>
          </Link>
        </div>
        <div className="navbar-item">
          <Link to = {`/createslots`}>
             <span>Create Slots</span>
          </Link>
        </div>
      </div>
      <div className="navbar-footer">
        <div className="profile">
          <img src={profilepic} alt="Profile" />
          <div>
            <p className="profile-name">{centerInfo.name}</p>
            <p className="profile-role">Admin</p>
          </div>
        </div>
        <div className="location">
          {centerInfo.location } , {centerInfo.city}
        </div>
      </div>
    </div>
  );
}
