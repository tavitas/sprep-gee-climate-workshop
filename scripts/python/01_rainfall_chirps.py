"""
01_rainfall_chirps.py  —  RAINFALL & DROUGHT (Python / geemap)
SPREP / UNEP GEE Climate Workshop 2026

Python equivalent of javascript/01_rainfall_chirps.js.
Run in Google Colab or Jupyter after 00_setup_geemap.py.

Produces an interactive map of mean annual rainfall for your country
and saves a year-by-year rainfall chart as a PNG.

Dataset: GPM IMERG Monthly v07 (NASA/GPM_L3/IMERG_MONTHLY_V07)
  band 'precipitation' = monthly mean rain RATE in mm/HOUR, ~11 km, 2000-present.
  IMERG (not CHIRPS) is used so the same script works for EVERY Pacific
  country — CHIRPS has data holes over the far-west / small Pacific (Palau,
  Tokelau). Verified live, June 2026.
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
COUNTRY    = 'Fiji'        # 'Samoa', 'Solomon Islands', 'Tuvalu', ... (any Pacific nation)
START_YEAR = 2001
END_YEAR   = 2020          # 2001-2020 = 20-year climate normal (IMERG era)

# ===== 2. COUNTRY BOUNDARY =====
aoi = get_country(COUNTRY)       # ee.Geometry (LSIB outline or point+buffer)
outline = get_outline(COUNTRY)   # ee.FeatureCollection for drawing

# ===== 3. IMERG MONTHLY RAINFALL =====
# 'precipitation' is a monthly mean RATE in mm/hour; multiply by the hours in
# a month (~730.5) to get millimetres.
HOURS_PER_MONTH = 730.5          # 8766 hours/year / 12
imerg = (ee.ImageCollection('NASA/GPM_L3/IMERG_MONTHLY_V07')
         .select('precipitation')
         .filter(ee.Filter.date(f'{START_YEAR}-01-01', f'{END_YEAR + 1}-01-01')))

# ===== 4. MEAN ANNUAL RAINFALL CLIMATOLOGY =====
years = ee.List.sequence(START_YEAR, END_YEAR)

def annual_total(y):
    # sum the 12 monthly totals (rate * hours) to get annual mm
    total = (imerg.filter(ee.Filter.calendarRange(y, y, 'year'))
             .map(lambda img: img.multiply(HOURS_PER_MONTH)).sum())
    return total.set('year', y).set(
        'system:time_start', ee.Date.fromYMD(y, 1, 1).millis())

annual_totals = ee.ImageCollection.fromImages(years.map(annual_total))
mean_annual_rain = annual_totals.mean().clip(aoi)

# ===== 5. INTERACTIVE MAP =====
rain_palette = ['ffffcc', 'c7e9b4', '7fcdbb', '41b6c4',
                '1d91c0', '225ea8', '0c2c84']
vis = {'min': 1000, 'max': 4000, 'palette': rain_palette}

Map = geemap.Map()
Map.centerObject(aoi, 8)
Map.addLayer(mean_annual_rain, vis,
             f'Mean annual rainfall {START_YEAR}-{END_YEAR} (mm)')
Map.addLayer(outline.style(color='black', fillColor='00000000', width=1),
             {}, f'{COUNTRY} border')
Map.add_colorbar(vis, label='Mean annual rainfall (mm/year)')
Map   # displays in a notebook

# ===== 6. YEAR-BY-YEAR CHART (drought signal) =====
# Reduce each yearly image to a single mean value over the country.
import pandas as pd
import matplotlib.pyplot as plt

def reduce_year(img):
    val = img.reduceRegion(ee.Reducer.mean(), aoi, 5000).get('precipitation')
    return ee.Feature(None, {'year': img.get('year'), 'rain': val})

table = annual_totals.map(reduce_year).getInfo()
rows = [(f['properties']['year'], f['properties']['rain'])
        for f in table['features']]
df = pd.DataFrame(rows, columns=['year', 'rain']).sort_values('year')

plt.figure(figsize=(10, 4))
plt.plot(df['year'], df['rain'], marker='o')
plt.axhline(df['rain'].mean(), color='grey', ls='--', label='average')
plt.title(f'Total annual rainfall over {COUNTRY} ({START_YEAR}-{END_YEAR})')
plt.ylabel('Rainfall (mm/year)')
plt.xlabel('Year')
plt.legend()
plt.tight_layout()
plt.savefig(f'{COUNTRY}_annual_rainfall.png', dpi=150)
print(f'Saved chart: {COUNTRY}_annual_rainfall.png')

# ===== 7. EXPORT THE MAP TO GOOGLE DRIVE (optional) =====
task = ee.batch.Export.image.toDrive(
    image=mean_annual_rain,
    description=f'{COUNTRY}_MeanAnnualRainfall',
    folder='GEE_Workshop_2026',
    fileNamePrefix=f'{COUNTRY.replace(" ", "_")}_mean_annual_rainfall',
    scale=5000,
    region=aoi.bounds(),
    maxPixels=int(1e13))
task.start()
print('Export started — check the Tasks panel at https://code.earthengine.google.com')
