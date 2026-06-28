"""
05_coral_reefs_aca.py  —  CORAL REEF HABITATS (Python / geemap)
SPREP / UNEP GEE Climate Workshop 2026

Python equivalent of javascript/05_coral_reefs_aca.js.
Run in Google Colab or Jupyter after 00_setup_geemap.py.

Maps the seafloor habitats (coral, seagrass, sand, ...) and reef zones around
your country from the Allen Coral Atlas, and saves a bar chart of how much of
each habitat your country has.

Dataset: Allen Coral Atlas (ACA/reef_habitat/v2_0)
  ee.Image, 5 m, mapped 2018-2021. Bands:
    'benthic'    seafloor cover (Sand, Rubble, Rock, Seagrass, Coral/Algae,
                 Microalgal Mats)
    'geomorphic' reef zone (reef flat, crest, slope, lagoon, patch reef...)
    'reef_mask'  1 = reef, 0 = not reef
  Covers the world's shallow tropical reefs — verified live for every SPREP
  country (June 2026).
"""

import ee
import geemap
import pandas as pd
import matplotlib.pyplot as plt
# Shared country selector (the 14 SPREP member countries). In Colab / Jupyter
# this helper file may not be present, so fetch it from the workshop repo if so.
try:
    from _pacific_aoi import get_country
except ModuleNotFoundError:
    import urllib.request
    urllib.request.urlretrieve(
        'https://raw.githubusercontent.com/tavitas/sprep-gee-climate-workshop/'
        'main/scripts/python/_pacific_aoi.py', '_pacific_aoi.py')
    from _pacific_aoi import get_country

ee.Initialize(project='your-project-id')   # <-- your registered project

# ===== 1. SETTINGS =====
COUNTRY = 'Fiji'   # reef-rich examples: 'Papua New Guinea', 'Solomon Islands', 'Palau'

land = get_country(COUNTRY)                  # ee.Geometry
aoi = land.bounds().buffer(25000)            # reef area = coastline + ~25 km

# ===== 2. LOAD THE ALLEN CORAL ATLAS =====
aca = ee.Image('ACA/reef_habitat/v2_0').clip(aoi)

# ===== 3. BENTHIC HABITAT MAP =====
# Remap the non-sequential class codes to 1-6 for a clean palette.
benthic_codes  = [11, 12, 13, 14, 15, 18]
benthic_names  = ['Sand', 'Rubble', 'Rock', 'Seagrass', 'Coral/Algae', 'Microalgal mats']
benthic_colors = ['ffffbe', 'e0d05e', 'b19c3a', '668438', 'ff6161', '9bcc4f']
benthic = aca.select('benthic').remap(benthic_codes, [1, 2, 3, 4, 5, 6]).selfMask()

Map = geemap.Map()
Map.centerObject(aoi, 9)
Map.addLayer(benthic, {'min': 1, 'max': 6, 'palette': benthic_colors}, 'Benthic habitat')
Map.add_legend(title='Benthic habitat',
               labels=benthic_names, colors=['#' + c for c in benthic_colors])
Map   # displays in a notebook

# ===== 4. HOW MUCH OF EACH HABITAT? (area in km²) =====
km2 = ee.Image.pixelArea().divide(1e6)


def class_area_km2(code):
    return km2.updateMask(aca.select('benthic').eq(code)).reduceRegion(
        reducer=ee.Reducer.sum(), geometry=aoi, scale=30,
        maxPixels=int(1e12), bestEffort=True).get('area')


areas = ee.Dictionary(
    {name: class_area_km2(code) for name, code in zip(benthic_names, benthic_codes)}
).getInfo()
df = (pd.DataFrame([(n, areas.get(n) or 0) for n in benthic_names], columns=['habitat', 'km2'])
      .sort_values('km2', ascending=True))

plt.figure(figsize=(8, 4))
plt.barh(df['habitat'], df['km2'], color=['#' + benthic_colors[benthic_names.index(h)] for h in df['habitat']])
plt.title(f'Coral reef benthic habitat in {COUNTRY} (Allen Coral Atlas)')
plt.xlabel('Area (km²)')
plt.tight_layout()
plt.savefig(f'{COUNTRY}_coral_habitat.png', dpi=150)
print(f'Saved chart: {COUNTRY}_coral_habitat.png')
for _, r in df.sort_values('km2', ascending=False).iterrows():
    print(f"  {r['habitat']:<16} {r['km2']:,.1f} km²")

# ===== 5. EXPORT the benthic habitat map (optional) =====
# 5 m native; export at 10 m to keep the file manageable.
task = ee.batch.Export.image.toDrive(
    image=aca.select('benthic'),
    description=f'{COUNTRY}_ACA_Benthic',
    folder='GEE_Workshop_2026',
    fileNamePrefix=f'{COUNTRY.replace(" ", "_")}_aca_benthic',
    scale=10,
    region=aoi.bounds(),
    maxPixels=int(1e13))
task.start()
print('Export started — check the Tasks panel at https://code.earthengine.google.com')
