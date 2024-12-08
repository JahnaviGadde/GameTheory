import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Allcentres.css";
import {Link} from "react-router-dom"; 

export default function Allcentres () {
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCentres = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKENDAPI}/api/centre/`);
        setCentres(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCentres();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="allcentres">
        <h2>Find your vibe....</h2>
        <div className="card-container">
    
    {centres.map((centre) => (
      <div className="card" key={centre._id}>

        <h4 className="card-title">{centre.name}</h4>
        <p className="card-info">{centre.location}, {centre.city}</p>
        <Link to = {`/centreschedule/${centre._id}`}>
        <button>View</button>
        </Link>
      </div>
    ))}
  </div>
    </div>
    
  );
};

