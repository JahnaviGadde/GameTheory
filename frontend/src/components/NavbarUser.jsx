import "./Navbar.css";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import profilepic from "./profile.jpg";
import { Link } from "react-router-dom";


export default function NavbarUser () {

  const user = useContext(AuthContext);

    return (
        <div className="navbar">
        <div className="navbar-logo">Game Theory</div>
        <div className="navbar-menu">
          <div className="navbar-item">
            <Link to={`/dashboard/${user.user.user.name}`}>
            <span>Dashboard</span>
            </Link>
          </div>
        </div>
        <div className="navbar-footer">
          <div className="profile">
            <img src={profilepic} alt="" />
            <div>
              <p className="profile-name">{user.user.user.name}</p>
              <p className="profile-role">User</p>
            </div>
          </div>
          <div className="location"></div>
        </div>
      </div>
    );
  };
