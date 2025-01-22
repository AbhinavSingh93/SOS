import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// API URL for sending location to the server
const API_URL = "http://localhost:5000/getLocation"; // Update this to your backend URL

const MapView = () => {
  const [map, setMap] = useState(null);
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [userMarker, setUserMarker] = useState(null);

  useEffect(() => {
    const mapInstance = L.map("map").setView([0, 0], 13);
    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(mapInstance);
    setMap(mapInstance);

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
        handleGeoError
      );
    }

    let isMounted = true;
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (isMounted) {
            setLocation({ lat: latitude, lng: longitude });
            if (userMarker) {
              userMarker.setLatLng([latitude, longitude]);
              userMarker.setPopupContent("You are here.").openPopup();
            }
          }

          fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({ lat: latitude, lng: longitude }),
            headers: {
              "Content-Type": "application/json",
            },
          }).catch((err) => console.error("Error sending location:", err));
        },
        handleGeoError,
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 27000 }
      );

      return () => {
        isMounted = false;
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, []);

  useEffect(() => {
    if (map && location.lat && location.lng) {
      map.setView([location.lat, location.lng], 15);
    }
  }, [location, map]);

  const handleGeoError = (error) => {
    console.error("Error occurred while fetching location:", error);
    alert("Unable to fetch location. Please enable GPS.");
  };

  return <div id="map" style={{ height: "400px", width: "80%", margin: "0 auto" }}></div>;
};

export default MapView;
