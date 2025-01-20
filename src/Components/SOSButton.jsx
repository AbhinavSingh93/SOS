import React from "react";


const SOSButton = ({ onClick }) => {
  return (
    <button className="sos-button" onClick={onClick}>
      🚨 Send SOS
    </button>
  );
};

export default SOSButton;
