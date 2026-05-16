# Local Setup

This guide gets a fresh clone of this repo to a working local Tamil map.

It covers:
- installing the frontend dependencies
- importing the Puducherry OSM extract into a local Docker tile server
- starting the tile server
- running the React app against that tile server

## Prerequisites

You need:
- `Node.js` 20+ and `npm`
- `Docker`

You do not need to install PostgreSQL, PostGIS, Mapnik, or `osm2pgsql` directly on your machine for this repo's local path. The Docker image handles that.

## Repo Layout

Important paths:
- `maps/puducherry.osm.pbf`: local OSM extract used for import
- `tile-style/`: patched Carto style used to render Tamil labels
- `src/App.jsx`: frontend map configuration
- `docs/TAMIL_OSM_GUIDE.md`: deeper background and manual rendering notes

## 1. Clone And Install

```bash
git clone <your-repo-url>
cd tamil-geo-explorer
npm install
```

## 2. Build The Tamil Tile Database

This repo uses the local `tile-style/` directory, which already contains the patched Carto Lua that prefers `name:ta`.

Create a persistent Docker volume for the map database:

```bash
docker volume create tamil-osm-data
```

Run the import:

```bash
docker run --name tamil-osm-import --rm \
  -v tamil-osm-data:/data/database/ \
  -v "$PWD/maps/puducherry.osm.pbf:/data/region.osm.pbf" \
  -v "$PWD/tile-style:/data/style/" \
  -e NAME_LUA=openstreetmap-carto.lua \
  -e NAME_STYLE=openstreetmap-carto.style \
  -e NAME_MML=project.mml \
  -e NAME_SQL=indexes.sql \
  overv/openstreetmap-tile-server:latest import
```

Notes:
- This step downloads Carto external shapefiles into `tile-style/data/`
- The first run can take several minutes
- `tile-style/data/` is intentionally not committed to GitHub because some files exceed GitHub's 100 MB limit

## 3. Start The Tamil Tile Server

Run the tile server on port `8090`:

```bash
docker run -d --name tamil-osm-server \
  -p 8090:80 \
  -v tamil-osm-data:/data/database/ \
  -v "$PWD/tile-style:/data/style/" \
  -e NAME_LUA=openstreetmap-carto.lua \
  -e NAME_STYLE=openstreetmap-carto.style \
  -e NAME_MML=project.mml \
  -e NAME_SQL=indexes.sql \
  overv/openstreetmap-tile-server:latest run
```

Why `8090`:
- this repo's frontend defaults to `http://localhost:8090/tile/{z}/{x}/{y}.png`
- `8080` is commonly occupied by other local services

Verify the server responds:

```bash
curl -I http://localhost:8090/tile/13/5912/3822.png
```

You should get `HTTP/1.1 200 OK`.

## 4. Run The Frontend

Start the app:

```bash
npm run dev
```

Then open the Vite local URL shown in the terminal.

The app already defaults to:

```text
http://localhost:8090/tile/{z}/{x}/{y}.png
```

So if the tile server is running on `8090`, no frontend change is required.

## 5. Optional: Change The Tile URL

If your tile server runs on a different port or host, set `VITE_TILE_URL` before starting the frontend.

Example:

```bash
VITE_TILE_URL="http://localhost:8091/tile/{z}/{x}/{y}.png" npm run dev
```

The frontend reads this in `src/App.jsx`.

## 6. What Success Looks Like

You should see:
- the map loading in the browser
- map tiles coming from your local Docker tile server
- at least some place labels in Tamil where `name:ta` exists in the OSM data

Not every label will necessarily be Tamil. Features without `name:ta` fall back to their normal `name`.

## Common Commands

Start an existing tile server container:

```bash
docker start tamil-osm-server
```

Stop it:

```bash
docker stop tamil-osm-server
```

See logs:

```bash
docker logs -f tamil-osm-server
```

Remove the running server container:

```bash
docker rm -f tamil-osm-server
```

Remove the imported database volume and start over:

```bash
docker rm -f tamil-osm-server tamil-osm-import 2>/dev/null || true
docker volume rm tamil-osm-data
```

## Troubleshooting

### Blank map

Check:
- `docker ps` shows `tamil-osm-server` running
- `curl -I http://localhost:8090/tile/13/5912/3822.png` returns `200 OK`
- the frontend is using the correct `VITE_TILE_URL`

### Port already in use

If `8090` is occupied, use another host port:

```bash
docker run -d --name tamil-osm-server \
  -p 8091:80 \
  -v tamil-osm-data:/data/database/ \
  -v "$PWD/tile-style:/data/style/" \
  -e NAME_LUA=openstreetmap-carto.lua \
  -e NAME_STYLE=openstreetmap-carto.style \
  -e NAME_MML=project.mml \
  -e NAME_SQL=indexes.sql \
  overv/openstreetmap-tile-server:latest run
```

Then start the frontend with:

```bash
VITE_TILE_URL="http://localhost:8091/tile/{z}/{x}/{y}.png" npm run dev
```

### `tile-style/data/` missing

That is expected on a fresh clone. It is generated during the Docker import step.

### Need a full rebuild

Delete the old server container and the Docker volume, then rerun the import and run steps.

## Related Docs

- [TAMIL_OSM_GUIDE.md](./TAMIL_OSM_GUIDE.md)
- [README.md](../README.md)
