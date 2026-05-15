import { useEffect, useRef } from "react";
import "./App.css";

// Leaflet imports for map functionality
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function App() {
  const mapRef = useRef(null);

  useEffect(() => {
    // Initialize map only once
    if (mapRef.current) return;

    const map = L.map("map").setView([11.9416, 79.8083], 13); // Pondicherry coordinates
    mapRef.current = map;

    // Add OpenStreetMap tile layer (replace with Tamil tile layer when available)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add a marker for Pondicherry
    L.marker([11.9416, 79.8083])
      .addTo(map)
      .bindPopup("Pondicherry")
      .openPopup();

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Empty dependency array means run once on mount

  return (
    <>
      <section id="center">
        <div>
          <h1>Tamil Geo Explorer - Pondicherry</h1>
          <p>
            This page will display OpenStreetMap of Pondicherry with labels in
            Tamil.
          </p>
          <div
            id="map"
            style={{ height: "500px", width: "100%", marginTop: "20px" }}
          ></div>
        </div>
      </section>
    </>
  );
}

export default App;
