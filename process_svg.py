import json
import math

with open('amazonas_municipios.json', 'r', encoding='utf-8') as f:
    geo = json.load(f)

# Width and height of tactical board canvas
WIDTH = 2200
HEIGHT = 1400
PADDING = 80

min_lon = -73.801
max_lon = -56.097
min_lat = -9.818
max_lat = 2.247

def project(lon, lat):
    # Mercator projection
    x = (lon - min_lon) / (max_lon - min_lon) * (WIDTH - 2 * PADDING) + PADDING
    # Invert Y because lat increases northward while SVG Y increases downward
    y = (max_lat - lat) / (max_lat - min_lat) * (HEIGHT - 2 * PADDING) + PADDING
    return round(x, 2), round(y, 2)

def coords_to_path(coords):
    path_parts = []
    for ring in coords:
        if not ring:
            continue
        # Check if ring is list of coordinates
        if isinstance(ring[0], (int, float)):
            # ring itself is a point (shouldn't happen in standard polygon, but defensive)
            continue
        first = True
        for pt in ring:
            if isinstance(pt[0], list):
                # multipolygon nesting handled recursively
                continue
            x, y = project(pt[0], pt[1])
            if first:
                path_parts.append(f"M {x} {y}")
                first = False
            else:
                path_parts.append(f"L {x} {y}")
        path_parts.append("Z")
    return " ".join(path_parts)

def geom_to_path(geom):
    gtype = geom['type']
    coords = geom['coordinates']
    if gtype == 'Polygon':
        return coords_to_path(coords)
    elif gtype == 'MultiPolygon':
        parts = []
        for poly in coords:
            parts.append(coords_to_path(poly))
        return " ".join(parts)
    return ""

def calculate_centroid(coords):
    total_x, total_y, count = 0, 0, 0
    def recurse(pts):
        nonlocal total_x, total_y, count
        if not pts: return
        if isinstance(pts[0], (int, float)):
            x, y = project(pts[0], pts[1])
            total_x += x
            total_y += y
            count += 1
        else:
            for p in pts:
                recurse(p)
    recurse(coords)
    if count == 0: return (0, 0)
    return (round(total_x / count, 2), round(total_y / count, 2))

# Strategic color palette matching the physical tactical board
PALETTE = [
    "#FEF08A", # Soft yellow (São Gabriel, Codajás...)
    "#DDD6FE", # Soft lavender/purple (Santa Isabel, Lábrea...)
    "#BBF7D0", # Soft mint/green (Barcelos, Maraã, Manicoré...)
    "#FECDD3", # Soft rose/pink (Tapauá, Japurá...)
    "#BAE6FD", # Soft aqua/sky (Canutama, Tefé, Borba...)
    "#FED7AA", # Soft peach/orange (Apuí, Tonantins...)
    "#A7F3D0", # Emerald pale
    "#E9D5FF", # Light violet
    "#FDE68A", # Warm amber pale
    "#C7D2FE", # Soft indigo
]

processed_munis = []

for i, feat in enumerate(geo['features']):
    name = feat['properties'].get('name', '')
    ibge_id = feat['properties'].get('id', '')
    geom = feat['geometry']
    svg_d = geom_to_path(geom)
    cx, cy = calculate_centroid(geom['coordinates'])
    color = PALETTE[i % len(PALETTE)]
    
    processed_munis.append({
        'id': ibge_id,
        'name': name,
        'path': svg_d,
        'cx': cx,
        'cy': cy,
        'color': color
    })

print(f"Processed {len(processed_munis)} municipalities.")

with open('processed_municipalities.json', 'w', encoding='utf-8') as f:
    json.dump({
        'width': WIDTH,
        'height': HEIGHT,
        'bounds': {
            'min_lon': min_lon, 'max_lon': max_lon,
            'min_lat': min_lat, 'max_lat': max_lat
        },
        'municipalities': processed_munis
    }, f, ensure_ascii=False, indent=2)

print("Saved processed_municipalities.json successfully!")
