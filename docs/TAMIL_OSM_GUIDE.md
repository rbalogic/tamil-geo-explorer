# Rendering OSM Maps in Tamil for Pondicherry

This guide explains how to process the puducherry.osm.pbf file to generate OSM tiles with Tamil labels.

## Overview

To render OSM maps in Tamil, we need to:
1. Process the OSM data to replace English names with Tamil names (where available)
2. Import the processed data into a PostGIS database
3. Generate map tiles using Mapnik and mod_tile/renderd
4. Serve the tiles via a web server

## Step 1: Prepare the Tamil Lua Script

We've created `openstreetmap-carto-tamil.lua` which implements the name transformation:

```lua
-- Tamil language OSM Carto Lua script for osm2pgsql
-- This script replaces the 'name' tag with 'name:ta' (Tamil) if available

function filter_tags_node (keyvalues, numberofkeys)
    if keyvalues["name:ta"] then
        keyvalues["name"] = keyvalues["name:ta"]
    end
    return 1, keyvalues
end

function filter_tags_way (keyvalues, numberofkeys)
    if keyvalues["name:ta"] then
        keyvalues["name"] = keyvalues["name:ta"]
    end
    return 1, keyvalues
end

function filter_basic_tags_rel (keyvalues, numberofkeys)
    if keyvalues["name:ta"] then
        keyvalues["name"] = keyvalues["name:ta"]
    end
    return 1, keyvalues
end
```

## Step 2: Install Required Software

You'll need to install:
- PostgreSQL with PostGIS extension
- osm2pgsql
- Mapnik
- mod_tile and renderd
- Apache web server (or similar)

## Step 3: Set Up the Database

```bash
# As root or with sudo:
sudo -u postgres createuser mapper
sudo -u postgres createdb -E UTF8 -O mapper gis
sudo -u postgres psql -d gis -f /usr/share/postgresql/contrib/postgis-*/postgis.sql
sudo -u postgres psql -d gis -c "ALTER TABLE spatial_ref_sys OWNER TO mapper;"
sudo -u postgres psql -d gis -U mapper -f /usr/share/postgresql/contrib/postgis-*/spatial_ref_sys.sql
```

## Step 4: Import the OSM Data with Tamil Names

```bash
osm2pgsql -d gis --create --slim -G --hstore \\
  --tag-transform-script ./openstreetmap-carto-tamil.lua \\
  -C 2500 --number-processes 1 \\
  ./puducherry.osm.pbf
```

Note: Adjust the `-C` (cache) value based on your available RAM. The pondicherry.osm.pbf file is much smaller than a country or state extract, so you can use a lower cache value.

## Step 5: Set Up Mapnik and Generate Tiles

1. Clone `openstreetmap-carto` outside this repo:
   ```bash
   git clone https://github.com/gravitystorm/openstreetmap-carto.git
   ```

2. Enter the cloned directory and follow its install prerequisites:
   ```bash
   cd openstreetmap-carto
   ```

3. Configure Mapnik to use your database by editing `project.mml` or the datasource settings file expected by your chosen workflow:
   ```xml
   <Parameter name="host">localhost</Parameter>
   <Parameter name="port">5432</Parameter>
   <Parameter name="dbname">gis</Parameter>
   <Parameter name="user">mapper</Parameter>
   <Parameter name="password"></Parameter>
   <Parameter name="estimate_extent">true</Parameter>
   ```

4. Build the Mapnik XML and configure renderd (`/etc/renderd.conf`) to point to the generated style:
   - Set `tile_dir` and `TILEDIR` to your tile cache directory
   - Set `num_threads` to the number of processor cores
   - In the `[mapnik]` section, set `font_dir` to your TTF fonts directory
   - In the `[default]` section, set `XML` to the generated Mapnik XML from your `openstreetmap-carto` clone

5. Start renderd:
   ```bash
   sudo -u http renderd
   ```

6. Generate tiles for Pondicherry area:
   First, find the tile coordinates for Pondicherry at various zoom levels using OpenStreetMap.org, then use render_list:
   ```bash
   render_list -z 10 -Z 12 -x <minx> -X <maxx> -y <miny> -Y <maxy>
   ```

## Step 6: Serve the Tiles

Configure your web server (Apache/Nginx) to serve the tile cache directory. Then you can use the tiles in a web map library like Leaflet:

```javascript
L.tileLayer('http://your-server/osm_tiles/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tamil labels'
}).addTo(map);
```

## Step 7: View the Tamil Map

Once the tiles are generated and served, you can view them in a web browser using a map library like Leaflet, OpenLayers, or Mapbox GL JS.

## Notes

- The puducherry.osm.pbf file contains only Pondicherry and surrounding area, so processing will be relatively fast.
- Tamil name availability: Not all features will have `name:ta` tags. Features without Tamil names will fall back to the default `name` tag (usually in English).
- For better coverage, consider using a larger extract (like Tamil Nadu or India) if you want more features to have Tamil labels.

## Troubleshooting

- If you encounter memory issues during osm2pgsql import, try reducing the `-C` cache value or increasing swap space.
- Ensure all services (PostgreSQL, renderd, Apache) are running.
- Check logs for errors: `/var/log/daemon.log` or use `journalctl -u renderd` (if using systemd).

## References

- osm2pgsql documentation: https://osm2pgsql.org/doc/
- Switch2OSM tutorial: https://switch2osm.org/
- OpenStreetMap Carto: https://github.com/gravitystorm/openstreetmap-carto

## Repository Layout Note

This repo does not need to vendor `openstreetmap-carto`. Keep the frontend app, Tamil Lua script, and learning material here, and clone `openstreetmap-carto` separately only when you are doing tile rendering work.
