import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// API URL or websocket endpoint for sending real-time location
const API_URL = "http://api.positionstack.com/v1/forward ? access_key = 5080e1fe544d222e55cca14ccaee6132"; 

const MapView = () => {
  const [map, setMap] = useState(null);
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [userMarker, setUserMarker] = useState(null);

  useEffect(() => {
    // Initialize the map
    const mapInstance = L.map("map").setView([0, 0], 13);
    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(mapInstance);
    setMap(mapInstance);

    // Get the initial user location and set the map view
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          mapInstance.setView([latitude, longitude], 15);
          const marker = L.marker([latitude, longitude]).addTo(mapInstance);
          marker.bindPopup("You are here.").openPopup();
          setUserMarker(marker);
        },
        () => alert("Unable to fetch location. Please enable GPS.")
      );
    }

    // Watch for changes in location
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          if (userMarker) {
            // Update the marker position
            userMarker.setLatLng([latitude, longitude]);
            userMarker.setPopupContent("You are here.").openPopup();
          }

          // Send updated location to server (using fetch or socket)
          // Example: You might send the new location to your API or WebSocket server
          fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({ lat: latitude, lng: longitude }),
            headers: {
              "Content-Type": "application/json",
            },
          }).catch((err) => console.error("Error sending location:", err));
        },
        () => alert("Unable to fetch location. Please enable GPS."),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 27000 }
      );

      // Cleanup on component unmount
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, []);

  useEffect(() => {
    if (map && location.lat && location.lng) {
      map.setView([location.lat, location.lng], 15);
    }
  }, [location, map]);

  return <div id="map" style={{ height: "400px", width: "80%", margin: "0 auto" }}></div>;
};

export default MapView;
