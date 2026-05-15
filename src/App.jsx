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

    const map = L.map('map').setView([11.9416, 79.8083], 13); // Pondicherry coordinates
    mapRef.current = map;

    // Add OpenStreetMap tile layer (replace with Tamil tile layer when available)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker for Pondicherry
    L.marker([11.9416, 79.8083]).addTo(map)
      .bindPopup('Pondicherry')
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
        <div className="hero">
          {/* Original logos can be kept or removed */}
        </div>
        <div>
          <h1>Tamil Geo Explorer - Pondicherry</h1>
          <p>
            This page will display an OpenStreetMap of Pondicherry with labels
            in Tamil. To enable Tamil rendering, follow the steps in LEARN.md
            to process the puducherry.osm.pbf file with the
            openstreetmap-carto-tamil.lua script.
          </p>
          <div
            id="map"
            style={{ height: "500px", width: "100%", marginTop: "20px" }}
          >
            Map is showing OpenStreetMap default tiles. To see Tamil labels, generate and serve Tamil tiles then update the tile layer URL in the code.
          </div>
          <p>
            <strong>Next steps:</strong>
            <br />
            1. Install Leaflet: <code>npm install leaflet react-leaflet</code> (completed)
            <br />
            2. Verify the map displays default OpenStreetMap tiles
            <br />
            3. Process OSM data with Tamil names using the guide in LEARN.md
            <br />
            4. Serve the generated tiles and update the tile layer URL in the code
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => alert("Follow the guide to render OSM in Tamil!")}
        >
          Learn Tamil OSM Rendering
        </button>
      </section>

      <div className="ticks"></div>
      <section id="next-steps">
        <div id="docs">
          <h2>Documentation</h2>
          <p>Follow LEARN.md for the project workflow and GUIDES.md for background reference</p>
          <ul>
            <li>
              <a
                href="https://github.com/gravitystorm/openstreetmap-carto"
                target="_blank"
              >
                OpenStreetMap Carto Repository
              </a>
            </li>
            <li>
              <a
                href="https://osm2pgsql.org/doc/manual.html#_tag_transformation_scripts"
                target="_blank"
              >
                osm2pgsql Tag Transformation Scripts Documentation
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  );
}

export default App;
