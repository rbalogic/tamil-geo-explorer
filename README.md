# Tamil Geo Explorer

Tamil Geo Explorer is a React + Leaflet app for viewing Puducherry with Tamil-first OpenStreetMap labels from a local tile server.

This repo includes:
- a frontend app in `src/`
- a small Puducherry OSM extract in `maps/`
- a patched Carto style in `tile-style/` that prefers `name:ta`
- setup docs for running the full stack locally

## Start Here

If you want to clone this repo and get the Tamil map working locally, use:

- [docs/SETUP.md](docs/SETUP.md)

That guide covers:
- `npm install`
- Docker-based OSM import
- starting the local Tamil tile server
- running the frontend against the tile server

## How It Works

The frontend does not translate labels by itself.

Tamil labels appear because the local tile server renders tiles from OSM data using a patched Carto Lua transform that replaces `name` with `name:ta` when available.

Current frontend default tile URL:

```text
http://localhost:8090/tile/{z}/{x}/{y}.png
```

You can override that at runtime with `VITE_TILE_URL`.

## Project Structure

- `src/` - React/Vite frontend
- `maps/puducherry.osm.pbf` - local OSM extract used for import
- `tile-style/` - patched Carto render style used by the Docker tile server
- `docs/SETUP.md` - primary local setup guide
- `docs/TAMIL_OSM_GUIDE.md` - implementation notes about how the Tamil rendering works in this repo
- `scripts/openstreetmap-carto-tamil.lua` - original minimal Tamil transform script used during early exploration

## Screenshots
<img width="1272" height="881" alt="Screenshot 2026-05-16 at 8 33 55 AM" src="https://github.com/user-attachments/assets/49195118-eb65-4758-9ec7-2e3b5de470f2" />


## Notes

- `tile-style/data/` is intentionally ignored in Git because it contains downloaded Carto shapefiles that can exceed GitHub's file-size limits
- not every feature will display in Tamil; features without `name:ta` fall back to the default `name`
- the checked-in local workflow is Docker-first; older manual PostgreSQL/Mapnik/renderd instructions are no longer the primary path for this repo
