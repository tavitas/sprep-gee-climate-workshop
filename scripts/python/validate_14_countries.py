"""
validate_14_countries.py — live "do all 14 pass?" check for the workshop.

Imports the REAL selector from _pacific_aoi.py (get_country / get_temp_source)
and reproduces each script's server-side logic against live Earth Engine, so a
green run here means the JS + Python scripts will work for every SPREP member.

Datasets mirror the scripts:
  rainfall    -> GPM IMERG monthly (NASA/GPM_L3/IMERG_MONTHLY_V07)
  air temp    -> HYBRID: ERA5-Land (high islands) / global ERA5 (atolls)
  land heat   -> MODIS LST (MODIS/061/MOD11A1)
  ocean SST   -> NOAA OISST (NOAA/CDR/OISST/V2_1)

Read-only (no Export). Usage:
    python3 scripts/python/validate_14_countries.py
"""
import ee, sys
from _pacific_aoi import (LSIB_NAMES, POINT_AOI, get_country, get_temp_source)

ee.Initialize(project='sprep-gee-data-2026')

FOURTEEN = list(LSIB_NAMES) + list(POINT_AOI)


def mean(img, geom, scale, band):
    d = img.reduceRegion(ee.Reducer.mean(), geom, scale,
                         maxPixels=int(1e13), bestEffort=True).getInfo()
    v = d.get(band)
    return None if v is None else float(v)


# --- rainfall: IMERG monthly -> 2019 annual total (mm) ---
imerg = (ee.ImageCollection('NASA/GPM_L3/IMERG_MONTHLY_V07').select('precipitation')
         .filterDate('2019-01-01', '2020-01-01'))
def _to_mm(img):
    s = ee.Date(img.get('system:time_start'))
    days = s.advance(1, 'month').difference(s, 'day')
    return img.multiply(24).multiply(days)
imerg_2019 = imerg.map(_to_mm).sum()

modis = (ee.ImageCollection('MODIS/061/MOD11A1').select('LST_Day_1km')
         .filterDate('2024-01-01', '2025-01-01').mean().multiply(0.02).subtract(273.15))
oisst = (ee.ImageCollection('NOAA/CDR/OISST/V2_1').select('sst')
         .filterDate('2024-01-01', '2025-01-01').mean().multiply(0.01))


def air_temp_2019(country, geom):
    """Hybrid air temp via the real get_temp_source()."""
    src = get_temp_source(country)
    img = (ee.ImageCollection(src['collection']).select(src['band'])
           .filterDate('2019-01-01', '2020-01-01').mean().subtract(273.15))
    return mean(img, geom, src['scale'], src['band']), src['collection']


print('=' * 78)
print('SPREP GEE Workshop — all 14 members, final datasets (live)')
print('=' * 78)
print(f"{'Country':<32}{'IMERG':>8}{'AirT':>7}{'MODIS':>7}{'OISST':>7}  src / verdict")
print('-' * 78)

allok = True
for c in FOURTEEN:
    g = get_country(c)
    ocean = g.bounds().buffer(150000)
    rain = mean(imerg_2019, g, 11000, 'precipitation')
    air, src = air_temp_2019(c, g)
    land = mean(modis, g, 1000, 'LST_Day_1km')
    sst = mean(oisst, ocean, 25000, 'sst')
    ok = all(isinstance(x, float) for x in (rain, air, land, sst))
    allok = allok and ok
    f = lambda v: ('NULL' if not isinstance(v, float) else f'{v:.0f}')
    tag = 'ERA5-Land' if 'LAND' in src else 'ERA5-glob'
    print(f"{c:<32}{f(rain):>8}{f(air):>7}{f(land):>7}{f(sst):>7}  {tag} {'OK' if ok else 'GAP'}")

print('-' * 78)
print('ALL 14 PASS' if allok else 'STILL GAPS — see NULLs above')
sys.exit(0 if allok else 1)
