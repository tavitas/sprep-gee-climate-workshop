"""
02_temperature_era5_modis.py  —  TEMPERATURE & HEAT (Python / geemap)
SPREP / UNEP GEE Climate Workshop 2026

Python equivalent of javascript/02_temperature_era5_modis.js.
Run in Google Colab or Jupyter after 00_setup_geemap.py.

Produces (a) an interactive MODIS land-surface-temperature map and
(b) a saved warming-trend chart from air temperature.

Datasets:
  MODIS LST (MODIS/061/MOD11A1) band LST_Day_1km, scale 0.02 (Kelvin)
  Air temperature — HYBRID (get_temp_source in _pacific_aoi.py):
    High islands  -> ERA5-Land (ECMWF/ERA5_LAND/DAILY_AGGR, to present)
    Atoll nations -> global ERA5 (ECMWF/ERA5/MONTHLY, ends mid-2020)
  ERA5-Land is land-only and returns no data over tiny atolls, so those
  nations fall back to the global reanalysis (which includes ocean).
"""

import ee
import geemap
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from _pacific_aoi import get_country, get_outline, get_temp_source

ee.Initialize(project='your-project-id')   # <-- your registered project

# ===== 1. SETTINGS =====
COUNTRY = 'Samoa'        # any member country, e.g. 'Solomon Islands', 'Tuvalu'
aoi = get_country(COUNTRY)       # ee.Geometry
outline = get_outline(COUNTRY)   # ee.FeatureCollection for drawing

temp_palette = ['313695', '4575b4', '74add1', 'abd9e9',
                'fee090', 'f46d43', 'd73027', 'a50026']

# ===== 2. WHERE IS IT HOTTEST? (MODIS land surface temperature) =====
modis_lst = (ee.ImageCollection('MODIS/061/MOD11A1')
             .select('LST_Day_1km')
             .filter(ee.Filter.date('2024-01-01', '2025-01-01'))
             .mean()
             .multiply(0.02)       # MODIS scale factor -> Kelvin
             .subtract(273.15)     # Kelvin -> Celsius
             .clip(aoi))

vis = {'min': 20, 'max': 40, 'palette': temp_palette}
Map = geemap.Map()
Map.centerObject(aoi, 9)
Map.addLayer(modis_lst, vis, 'Mean daytime land surface temp 2024 (°C)')
Map.addLayer(outline.style(color='black', fillColor='00000000', width=1),
             {}, f'{COUNTRY} border')
Map.add_colorbar(vis, label='Land surface temperature (°C)')
Map   # displays in a notebook

# ===== 3. WARMING TREND (hybrid air-temperature source) =====
src = get_temp_source(COUNTRY)        # picks ERA5-Land or global ERA5
START_YEAR, END_YEAR = 1991, src['end_year']
years = ee.List.sequence(START_YEAR, END_YEAR)

def annual_mean_temp(y):
    img = (ee.ImageCollection(src['collection'])
           .select(src['band'])
           .filter(ee.Filter.calendarRange(y, y, 'year'))
           .mean()
           .subtract(273.15))
    val = img.reduceRegion(ee.Reducer.mean(), aoi, src['scale']).get(src['band'])
    return ee.Feature(None, {'year': y, 'temp': val})

fc = ee.FeatureCollection(years.map(annual_mean_temp))
data = fc.getInfo()['features']
df = (pd.DataFrame([(f['properties']['year'], f['properties']['temp']) for f in data],
                   columns=['year', 'temp'])
      .dropna().sort_values('year'))

# Fit a simple linear trend line.
m, b = np.polyfit(df['year'], df['temp'], 1)

plt.figure(figsize=(10, 4))
plt.plot(df['year'], df['temp'], marker='o', label='annual mean')
plt.plot(df['year'], m * df['year'] + b, color='red', ls='--',
         label=f'trend: {m*10:+.2f} °C/decade')
plt.title(f'Average annual air temperature over {COUNTRY} ({START_YEAR}-{END_YEAR})')
plt.ylabel('Temperature (°C)')
plt.xlabel('Year')
plt.legend()
plt.tight_layout()
plt.savefig(f'{COUNTRY}_temperature_trend.png', dpi=150)
print(f'Saved chart: {COUNTRY}_temperature_trend.png')
print(f'Warming rate: {m*10:+.2f} °C per decade')

# ===== 4. EXPORT THE MODIS MAP (optional) =====
task = ee.batch.Export.image.toDrive(
    image=modis_lst,
    description=f'{COUNTRY}_MODIS_LST_2024',
    folder='GEE_Workshop_2026',
    fileNamePrefix=f'{COUNTRY.replace(" ", "_")}_modis_lst_2024',
    scale=1000,
    region=aoi.bounds(),
    maxPixels=int(1e13))
task.start()
print('Export started — check the Tasks panel at https://code.earthengine.google.com')
