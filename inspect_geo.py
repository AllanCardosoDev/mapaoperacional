import json

with open('amazonas_municipios.json', 'r', encoding='utf-8') as f:
    geo = json.load(f)

print(f"Total features: {len(geo['features'])}")

min_lon = 999
max_lon = -999
min_lat = 999
max_lat = -999

def update_bounds(coords):
    global min_lon, max_lon, min_lat, max_lat
    for pt in coords:
        if isinstance(pt[0], list):
            update_bounds(pt)
        else:
            lon, lat = pt[0], pt[1]
            if lon < min_lon: min_lon = lon
            if lon > max_lon: max_lon = lon
            if lat < min_lat: min_lat = lat
            if lat > max_lat: max_lat = lat

for feat in geo['features']:
    update_bounds(feat['geometry']['coordinates'])

print(f"Bounds: Lon [{min_lon}, {max_lon}], Lat [{min_lat}, {max_lat}]")
