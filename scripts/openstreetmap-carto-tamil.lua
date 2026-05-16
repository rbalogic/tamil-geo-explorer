-- Tamil language OSM Carto Lua script for osm2pgsql
-- This script replaces the 'name' tag with 'name:ta' (Tamil) if available

-- Function to process nodes
function filter_tags_node (keyvalues, numberofkeys)
    if keyvalues["name:ta"] then
        keyvalues["name"] = keyvalues["name:ta"]
    end
    return 1, keyvalues
end

-- Function to process ways
function filter_tags_way (keyvalues, numberofkeys)
    if keyvalues["name:ta"] then
        keyvalues["name"] = keyvalues["name:ta"]
    end
    return 1, keyvalues
end

-- Function to process relations
function filter_basic_tags_rel (keyvalues, numberofkeys)
    if keyvalues["name:ta"] then
        keyvalues["name"] = keyvalues["name:ta"]
    end
    return 1, keyvalues
end

-- Function to process relation members (required by newer osm2pgsql versions)
function filter_tags_relation_member (keyvalues, member_tags, roles, numberofmembers)
    return 1, keyvalues
end