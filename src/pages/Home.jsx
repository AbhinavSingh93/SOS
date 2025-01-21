
import React from "react";
import SOSButton from "../Components/SOSButton";

const Home = () => {
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
