# Tamil OSM Rendering Guide

This document explains how Tamil map rendering works in this repo and what we changed to make it work locally.

If you want step-by-step setup instructions for a fresh clone, use [SETUP.md](./SETUP.md).

## What Actually Works In This Repo

The working local setup for this repo is:

- React + Leaflet frontend
- local Docker tile server using `overv/openstreetmap-tile-server`
- imported `maps/puducherry.osm.pbf`
- patched Carto Lua in `tile-style/openstreetmap-carto.lua`
- frontend tiles loaded from `http://localhost:8090/tile/{z}/{x}/{y}.png`

This is different from the older generic instructions that assumed:

- manual PostgreSQL/PostGIS installation
- manual `osm2pgsql` commands on the host
- manual `renderd` and Apache setup outside Docker
- cloning `openstreetmap-carto` separately and wiring it by hand

Those older instructions are not the primary workflow for this repo anymore.

## Why Tamil Labels Need A Tile Server

Leaflet is only displaying pre-rendered raster tiles.

The browser does not convert English labels to Tamil on its own. To see Tamil labels, the tile renderer must read OSM data where `name:ta` exists and prefer that value while generating tiles.

## What We Changed

We made Tamil rendering work with these changes:

### 1. Patched Carto Lua

The active Lua transform is:

- `tile-style/openstreetmap-carto.lua`

The important behavior is:

- if a feature has `name:ta`
- then the renderer copies it into `name`
- Carto then renders that Tamil text as the visible label

This is the key reason the final tiles show Tamil labels.

### 2. Local Tile Style Directory

We extracted the Carto style used by the Docker tile-server image and kept the necessary runtime files in:

- `tile-style/`

Important files there:

- `openstreetmap-carto.lua`
- `openstreetmap-carto.style`
- `project.mml`
- `mapnik.xml`
- `style/`
- `symbols/`
- `patterns/`

### 3. Docker Import Flow

We did not use host-installed `osm2pgsql`, Mapnik, PostgreSQL, or Apache directly.

Instead, we used the Docker image:

- `overv/openstreetmap-tile-server:latest`

Import flow:

- mount `maps/puducherry.osm.pbf` into `/data/region.osm.pbf`
- mount `tile-style/` into `/data/style/`
- run the image with `import`

That builds the PostGIS database, compiles the style, downloads external Carto shapefiles, and prepares the render stack.

### 4. Tile Server Port

The current working local tile server runs on:

```text
http://localhost:8090/tile/{z}/{x}/{y}.png
```

We use `8090` because `8080` was already occupied in the working environment by an unrelated service.

### 5. Frontend Tile URL

The frontend in `src/App.jsx` now defaults to:

```text
http://localhost:8090/tile/{z}/{x}/{y}.png
```

It also supports override through:

```text
VITE_TILE_URL
```

## Verified Working State

In the working setup, we verified:

- the import completed successfully
- the local tile server returned PNG tiles from `localhost:8090`
- Tamil names existed in the imported database
- the frontend loaded tiles from the local tile server

Examples of imported Tamil names we confirmed:

- `கீழ்புத்துப்பட்டு`
- `சஞ்சீவி நகர்`
- `அன்னை நகர்`

## Files You Need To Keep

For this repo's working Tamil render path, the important pieces are:

- `maps/puducherry.osm.pbf`
- `tile-style/`
- `src/App.jsx`
- `docs/SETUP.md`

The old minimal script is still present for reference:

- `scripts/openstreetmap-carto-tamil.lua`

But the current working renderer path uses:

- `tile-style/openstreetmap-carto.lua`

## Files You Should Not Commit

Do not commit:

- `tile-style/data/`

Why:

- it contains downloaded external Carto shapefiles
- some files are far above GitHub's 100 MB per-file limit
- for example, `water_polygons.shp` is about `1.2G`

That directory is intentionally regenerated locally during the Docker import flow.

## Stale Instructions Removed From The Current Workflow

These are no longer the main instructions for this repo:

- manually creating the `gis` database on the host
- manually running `osm2pgsql` outside Docker
- manually configuring `renderd.conf` on the host
- manually starting Apache/renderd directly on the host
- assuming `localhost:8080` is the tile server
- assuming a fresh clone includes `tile-style/data/`

Those approaches may be valid in general OSM-Carto setups, but they are not the maintained path for this repository.

## References & Credits

- **Original Inspiration**: This demo/learning was made possible by the technical guide shared by [demonshreder](https://www.openstreetmap.org/user/demonshreder) in their **OpenStreetMap Diary**: [Rendering non-default language in OSM-Carto standard map](https://www.openstreetmap.org/user/demonshreder/diary/43956).
- **osm2pgsql documentation**: https://osm2pgsql.org/doc/
- **Switch2OSM tutorial**: https://switch2osm.org/
- **OpenStreetMap Carto**: https://github.com/gravitystorm/openstreetmap-carto

## Recommended Reading Order

1. [SETUP.md](./SETUP.md) for local setup
2. This document for implementation details
3. `src/App.jsx` and `tile-style/openstreetmap-carto.lua` if you want to modify behavior
