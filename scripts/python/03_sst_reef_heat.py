"""
03_sst_reef_heat.py  —  SEA SURFACE TEMPERATURE & REEF HEAT (Python / geemap)
SPREP / UNEP GEE Climate Workshop 2026

Python equivalent of javascript/03_sst_reef_heat.js.
Maps recent SST around your islands and plots the monthly SST anomaly
time series (the coral-bleaching heat-stress signal).

Dataset: NOAA CDR OISST v2.1 (NOAA/CDR/OISST/V2_1)
  band 'sst'  scale 0.01 -> °C
  band 'anom' scale 0.01 -> °C anomaly vs 1971-2000
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
COUNTRY = 'Fiji'        # any Pacific nation, e.g. 'Tuvalu', 'Marshall Islands'

land = get_country(COUNTRY)                       # ee.Geometry
ocean = land.bounds().buffer(150000)              # ocean AOI ~150 km offshore

oisst = ee.ImageCollection('NOAA/CDR/OISST/V2_1')

# ===== 2. RECENT MEAN SST MAP =====
mean_sst = (oisst.select('sst')
            .filter(ee.Filter.date('2024-01-01', '2025-01-01'))
            .mean().multiply(0.01).clip(ocean))

sst_palette = ['000080', '0000ff', '00ffff', 'ffff00', 'ff8000', 'ff0000', '800000']
vis = {'min': 24, 'max': 31, 'palette': sst_palette}

Map = geemap.Map()
Map.centerObject(ocean, 7)
Map.addLayer(mean_sst, vis, 'Mean SST 2024 (°C)')
Map.add_colorbar(vis, label='Sea surface temperature (°C)')
Map

# ===== 3. MONTHLY SST ANOMALY TIME SERIES =====
start = ee.Date('2015-01-01')
n_months = ee.Date(pd.Timestamp.today().strftime('%Y-%m-01')).difference(start, 'month').floor()

def monthly_anom(m):
    t0 = start.advance(m, 'month')
    t1 = t0.advance(1, 'month')
    img = oisst.select('anom').filter(ee.Filter.date(t0, t1)).mean().multiply(0.01)
    val = img.reduceRegion(ee.Reducer.mean(), ocean, 25000).get('anom')
    return ee.Feature(None, {'date': t0.format('YYYY-MM-dd'), 'anom': val})

fc = ee.FeatureCollection(ee.List.sequence(0, n_months).map(monthly_anom))
data = fc.getInfo()['features']
df = pd.DataFrame([(f['properties']['date'], f['properties']['anom']) for f in data],
                  columns=['date', 'anom'])
df['date'] = pd.to_datetime(df['date'])
df = df.dropna().sort_values('date')

plt.figure(figsize=(11, 4))
plt.plot(df['date'], df['anom'], color='#b2182b', lw=1.5)
plt.axhline(0, color='grey')
plt.axhline(1, color='orange', ls='--', label='+1°C (bleaching watch)')
plt.title(f'Monthly SST anomaly around {COUNTRY} (2015-present)')
plt.ylabel('SST anomaly (°C vs normal)')
plt.legend()
plt.tight_layout()
plt.savefig(f'{COUNTRY}_sst_anomaly.png', dpi=150)
print(f'Saved chart: {COUNTRY}_sst_anomaly.png')
print('Sustained anomalies above +1°C indicate coral bleaching heat stress.')
