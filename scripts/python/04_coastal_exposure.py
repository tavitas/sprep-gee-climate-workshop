"""
04_coastal_exposure.py  —  SEA LEVEL & LOW-LYING COASTAL EXPOSURE (Python / geemap)
SPREP / UNEP GEE Climate Workshop 2026

Python equivalent of javascript/04_coastal_exposure.js.
Flags low-lying land exposed to sea-level rise / storm surge, shows where
surface water already sits, and prints the exposed land area in km².

Datasets:
  NASADEM elevation (NASA/NASADEM_HGT/001) band 'elevation' (metres)
  JRC Global Surface Water (JRC/GSW1_4/GlobalSurfaceWater) band 'occurrence' (%)

NOTE: 30 m DEMs are coarse for very flat atolls — treat as a screening /
awareness tool, not a survey-grade flood model. Use a larger high island
(Samoa, Fiji, Tonga) for this exercise.
"""

import ee
import geemap
# Shared country selector (the 14 SPREP member countries). In Colab / Jupyter
# this helper file may not be present, so fetch it from the workshop repo if so.
try:
    from _pacific_aoi import get_country, get_outline
except ModuleNotFoundError:
    import urllib.request
    urllib.request.urlretrieve(
        'https://raw.githubusercontent.com/tavitas/sprep-gee-climate-workshop/'
        'main/scripts/python/_pacific_aoi.py', '_pacific_aoi.py')
    from _pacific_aoi import get_country, get_outline

ee.Initialize(project='your-project-id')   # <-- your registered project

# ===== 1. SETTINGS =====
COUNTRY      = 'Samoa'   # best on larger high islands (Fiji, Vanuatu, Solomon Islands)
FLOOD_HEIGHT = 5    # metres above sea level flagged as "low-lying"

aoi = get_country(COUNTRY)       # ee.Geometry
outline = get_outline(COUNTRY)   # ee.FeatureCollection for drawing

# ===== 2. ELEVATION & LOW-LYING ZONE =====
dem = ee.Image('NASA/NASADEM_HGT/001').select('elevation').clip(aoi)
elev_palette = ['d73027', 'fc8d59', 'fee08b', 'd9ef8b', '91cf60', '1a9850']

Map = geemap.Map()
Map.centerObject(aoi, 10)
Map.addLayer(dem, {'min': 0, 'max': 200, 'palette': elev_palette}, 'Elevation (m)')

low_lying = dem.lte(FLOOD_HEIGHT).selfMask()
Map.addLayer(low_lying, {'palette': ['ff0000']},
             f'Land below {FLOOD_HEIGHT} m (most exposed)')

# ===== 3. EXISTING SURFACE WATER =====
water = ee.Image('JRC/GSW1_4/GlobalSurfaceWater').select('occurrence').clip(aoi)
Map.addLayer(water.updateMask(water.gt(20)),
             {'min': 0, 'max': 100, 'palette': ['c7e9b4', '41b6c4', '225ea8', '0c2c84']},
             'Surface water occurrence 1984-2021 (%)')
Map.addLayer(outline.style(color='black', fillColor='00000000', width=1), {}, f'{COUNTRY} outline')
Map   # displays in a notebook

# ===== 4. HOW MUCH LAND IS EXPOSED? (area in km²) =====
km2 = ee.Image.pixelArea().divide(1e6)

exposed = km2.updateMask(low_lying).reduceRegion(
    reducer=ee.Reducer.sum(), geometry=aoi, scale=30, maxPixels=int(1e13)
).get('area').getInfo()

total = km2.updateMask(dem.gte(-100)).reduceRegion(
    reducer=ee.Reducer.sum(), geometry=aoi, scale=30, maxPixels=int(1e13)
).get('area').getInfo()

print(f'{COUNTRY}: land below {FLOOD_HEIGHT} m = {exposed:,.1f} km²')
print(f'{COUNTRY}: total land area      = {total:,.1f} km²')
if total:
    print(f'Share of land below {FLOOD_HEIGHT} m = {100 * exposed / total:.1f}%')

# ===== 5. EXPORT the low-lying zone (optional) =====
task = ee.batch.Export.image.toDrive(
    image=low_lying.unmask(0),
    description=f'{COUNTRY}_LowLying_below{FLOOD_HEIGHT}m',
    folder='GEE_Workshop_2026',
    fileNamePrefix=f'{COUNTRY.replace(" ", "_")}_lowlying_{FLOOD_HEIGHT}m',
    scale=30,
    region=aoi.bounds(),
    maxPixels=int(1e13))
task.start()
print('Export started — check the Tasks panel at https://code.earthengine.google.com')
