import React from "react";
import MapView from "../Components/MapView";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2>Nearby Alerts</h2>
      <p>View real-time Location on the map:</p>
      <MapView />
    </div>
  );
};

export default Dashboard;