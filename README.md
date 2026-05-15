# Tamil Geo Explorer

This project focuses on exploring and rendering OpenStreetMap (OSM) data with Tamil language labels, specifically for the Pondicherry region.

## Project Structure

- `puducherry.osm.pbf` - OSM data extract for Pondicherry region
- `scripts/openstreetmap-carto-tamil.lua` - Lua script for osm2pgsql to transform names to Tamil
- `docs/TAMIL_OSM_GUIDE.md` - Detailed guide on rendering OSM maps in Tamil
- `src/` - React/Vite application for displaying maps

## Getting Started

### For Map Display (Frontend)

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. The React app shows a placeholder for a Tamil OSM map of Pondicherry

### For Tamil OSM Tile Generation (Backend)

Follow the instructions in `docs/TAMIL_OSM_GUIDE.md` to:

1. Set up PostgreSQL/PostGIS database
2. Process `maps/puducherry.osm.pbf` with `scripts/openstreetmap-carto-tamil.lua` using osm2pgsql
3. Clone `openstreetmap-carto` separately when you are ready to render tiles
4. Generate and serve Tamil-labeled map tiles
5. Update the frontend to use your tile server

## Resources

- Detailed Tamil OSM tutorial: [TAMIL_OSM_GUIDE.md](docs/TAMIL_OSM_GUIDE.md)

## Notes

- The pondicherry.osm.pbf file is a small extract suitable for learning and experimentation
- Tamil name coverage depends on the availability of `name:ta` tags in the OSM data
- For production use, consider using a larger geographic extract (state or country level)
