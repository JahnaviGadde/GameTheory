import NavbarAdmin from "../components/NavbarAdmin";
import Adminslots from "../components/AdminSlots";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Monitorslots () {

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
        <div className="userdashboard">
            <NavbarAdmin/>

            <div className="schedule">
            <h2>Schedule</h2>
            <h4>{center.name}</h4>
                <Adminslots/>
            </div>
        </div>
    )
};