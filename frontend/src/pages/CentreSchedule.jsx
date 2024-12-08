import NavbarUser from "../components/NavbarUser";
import "./CentreSchedule.css";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CourtSchedule from "../components/CourtSchedule";

export default function Viewslots() {

    const { centreId } = useParams();
    const [center, setCenter] = useState("");
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          console.log(centreId)
          const centerRes = await axios.get(`${process.env.REACT_APP_BACKENDAPI}/api/centre/${centreId}`);
          setCenter(centerRes.data);
        } catch (err) {
          console.log(err);
        }
      };
      fetchData();
    }, [centreId]);

    return (
        <div className="centreschedule">
        <NavbarUser/>
        <div className="schedule">
        <div >
            <h2>Schedule</h2>
            <h4>{center.name}</h4>
        </div>
        <CourtSchedule/>
        </div>
        </div>
    )
}