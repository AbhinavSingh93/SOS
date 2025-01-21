import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SOSButton from "../Components/SOSButton";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to access this page.");
      navigate("/login");
    }
  }, [navigate]);

  const sendSOS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          alert(`SOS Sent! Location: (${latitude}, ${longitude})`);
          // API integration here to notify nearby users
        },
        () => alert("Unable to fetch location. Please enable GPS.")
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="home-page">
      <h2>Welcome to SOS Helper</h2>
      <p>Press the button below in case of an emergency.</p>
      <SOSButton onClick={sendSOS} />
    </div>
  );
};

export default Home;
