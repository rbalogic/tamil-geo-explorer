# Tamil Geo Explorer

This project focuses on exploring and rendering OpenStreetMap (OSM) data with Tamil language labels, specifically for the Pondicherry region.

## Project Structure

- `puducherry.osm.pbf` - OSM data extract for Pondicherry region
- `openstreetmap-carto-tamil.lua` - Lua script for osm2pgsql to transform names to Tamil
- `LEARN.md` - Detailed guide on rendering OSM maps in Tamil
- `src/` - React/Vite application for displaying maps
- `GUIDES.md` - Original guide on rendering non-default language in OSM-Carto standard map
- `CLAUDE.md` - Guidance for Claude Code assistants working with this repository

## Getting Started

### For Map Display (Frontend)
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. The React app shows a placeholder for a Tamil OSM map of Pondicherry

### For Tamil OSM Tile Generation (Backend)
Follow the instructions in `LEARN.md` to:
1. Set up PostgreSQL/PostGIS database
2. Process `puducherry.osm.pbf` with `openstreetmap-carto-tamil.lua` using osm2pgsql
3. Clone `openstreetmap-carto` separately when you are ready to render tiles
4. Generate and serve Tamil-labeled map tiles
5. Update the frontend to use your tile server

## Resources

- Original OSM-Carto guide: [GUIDES.md](GUIDES.md)
- Detailed Tamil OSM tutorial: [LEARN.md](LEARN.md)
- Claude Code guidance: [CLAUDE.md](CLAUDE.md)

## Notes

- The pondicherry.osm.pbf file is a small extract suitable for learning and experimentation
- Tamil name coverage depends on the availability of `name:ta` tags in the OSM data
- For production use, consider using a larger geographic extract (state or country level)
