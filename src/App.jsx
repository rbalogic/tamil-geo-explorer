import { useEffect, useRef } from "react";
import "./App.css";

// Leaflet imports for map functionality
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const PONDICHERRY_CENTER = [11.9416, 79.8083];
const TILE_URL =
  import.meta.env.VITE_TILE_URL ?? "http://localhost:8090/tile/{z}/{x}/{y}.png";

function App() {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("map", {
      zoomControl: false,
      attributionControl: false
    }).setView(PONDICHERRY_CENTER, 13);
    mapRef.current = map;

    // Custom subtle attribution
    L.control.attribution({ position: 'bottomleft' }).addTo(map);

    L.tileLayer(TILE_URL, {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 18,
    }).addTo(map);

    L.circle(PONDICHERRY_CENTER, {
      radius: 2200,
      color: "#b9652f",
      weight: 1.5,
      fillColor: "#d58d58",
      fillOpacity: 0.14,
    }).addTo(map);

    L.marker(PONDICHERRY_CENTER)
      .addTo(map)
      .bindPopup("<b>Pondicherry / புதுச்சேரி</b><br>Tamil tile server active.");

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const resetView = () => {
    if (mapRef.current) {
      mapRef.current.flyTo(PONDICHERRY_CENTER, 13, { duration: 1.5 });
    }
  };

  return (
    <div className="viewer-root">
      <div id="map"></div>
      
      <div className="overlay-ui">
        <div className="branding">
          <h1>Tamil Geo Explorer</h1>
          <p>Pondicherry / புதுச்சேரி</p>
        </div>
        
        <button onClick={resetView} className="btn-reset" title="Reset to Pondicherry">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
          </svg>
          <span>Reset View</span>
        </button>
      </div>
    </div>
  );
}

export default App;
