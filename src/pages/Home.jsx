import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SOSButton from "../Components/SOSButton";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [sosRequests, setSOSRequests] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to access this page.");
      navigate("/login");
    } else {
      fetchSOSRequests(token);
    }
  }, [navigate]);

  const sendSOS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const token = localStorage.getItem("token");

          try {
            await axios.post(
              "http://localhost:5000/sos",
              { latitude, longitude },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("SOS Sent!");
            fetchSOSRequests(token); // Refresh the list of SOS requests
          } catch (error) {
            console.error("Error sending SOS:", error);
            alert("Failed to send SOS request. Please try again.");
          }
        },
        () => alert("Unable to fetch location. Please enable GPS.")
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const fetchSOSRequests = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/sos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSOSRequests(response.data.sosRequests || []);
    } catch (error) {
      console.error("Error fetching SOS requests:", error);
      alert("Failed to fetch SOS requests. Please try again.");
    }
  };

  const renderSOSRequests = () => {
    return sosRequests.map((request, index) => (
      <li key={index}>
        <span>
          Latitude: {request.latitude}, Longitude: {request.longitude}, Time:{" "}
          {new Date(request.timestamp).toLocaleString()}
        </span>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${request.latitude},${request.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Get Directions
        </a>
      </li>
    ));
  };

  return (
    <div className="home-page">
      <h2>Welcome to SOS Helper</h2>
      <p>Press the button below in case of an emergency.</p>
      <SOSButton onClick={sendSOS} />

      <div className="sos-requests">
        <h3>SOS Requests</h3>
        <ul>{renderSOSRequests()}</ul>
      </div>
    </div>
  );
};

export default Home;
