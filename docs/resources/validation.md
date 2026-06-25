# Validation Report — Pacific Climate GEE Workshop Materials

**Run:** **live** validation against Earth Engine (project `sprep-gee-data-2026`), 25 June 2026
**Scope:** the 14 SPREP member countries × every dataset, run server-side on GEE.

Unlike a syntax check, this executed each script's real `ee.*` logic against
live Earth Engine — confirming dataset IDs, band names, unit conversions, and
that **every script returns a valid result for all 14 countries**.

---

## 1. Registration flow — PASS
Verified against the official Earth Engine **Access** guide and the
Spatial Thoughts sign-up guide. The 2026 flow (Cloud project → noncommercial
verification as *Earth Engine trainer/trainee* → *Participant* → free
*Community* tier → *Classroom or education*) matches Exercise 1 and the
cheat sheet. URLs `code.earthengine.google.com/register` and
`code.earthengine.google.com` are correct.

## 2. Datasets — PASS (verified live, with two dataset changes)
Each ID, band, scale factor and unit was confirmed by computing a real value
over a Pacific AOI. Two datasets were **changed** because the originals failed
for some member countries (see §3):

| Dataset | ID | Key band(s) | Verified detail |
|---|---|---|---|
| **Rainfall (IMERG)** | `NASA/GPM_L3/IMERG_MONTHLY_V07` | `precipitation` (mm/hr) | ~11 km; 2000 → present; global incl. ocean |
| Air temp — high islands | `ECMWF/ERA5_LAND/DAILY_AGGR` | `temperature_2m` (**K**) | ~11 km; 1950 → 2026; land-only |
| Air temp — atolls | `ECMWF/ERA5/MONTHLY` | `mean_2m_air_temperature` (**K**) | ~27 km; 1979 → 2020; incl. ocean |
| MODIS land heat | `MODIS/061/MOD11A1` | `LST_Day_1km` (**K**, ×0.02) | ~1 km; 2000 → present |
| Sea-surface temp | `NOAA/CDR/OISST/V2_1` | `sst`, `anom` (°C, ×0.01) | 0.25°; 1981 → present |
| Elevation | `NASA/NASADEM_HGT/001` | `elevation` (m) | 30 m; `ee.Image` |
| Surface water | `JRC/GSW1_4/GlobalSurfaceWater` | `occurrence` (%) | 30 m; `ee.Image` |

All Kelvin→°C conversions, the IMERG mm/hr→mm conversion, and scale factors in
the scripts were checked against live values.

### Why IMERG and hybrid ERA5? (the two findings)

- **CHIRPS → GPM IMERG.** CHIRPS returned ~3 mm/yr for **Palau** (real ≈ 3,700)
  — a data hole in the far-western Pacific. IMERG returns correct rainfall for
  all 14 countries.
- **ERA5-Land → hybrid.** ERA5-Land is land-only and returned **no data** for 7
  atoll nations (Cook Islands, Kiribati, Marshall Islands, Nauru, Niue, Tonga,
  Tuvalu). Those countries now use global ERA5; high islands keep ERA5-Land.

## 3. Coverage — all 14 member countries PASS ✅
Every script's logic was run live for each of the 14 SPREP member countries.
With the two dataset changes, **all 14 return a valid value for rainfall, air
temperature, land heat and sea-surface temperature** (NASADEM elevation is
high-island-only by design — atolls are too flat for a 30 m DEM).

| Friendly name | LSIB name | AOI method | Air-temp source |
|---|---|---|---|
| Fiji | `Fiji` | LSIB outline | ERA5-Land |
| Papua New Guinea | `Papua New Guinea` | LSIB outline | ERA5-Land |
| Solomon Islands | `Solomon Is` | LSIB outline | ERA5-Land |
| Vanuatu | `Vanuatu` | LSIB outline | ERA5-Land |
| Samoa | `Samoa` | LSIB outline | ERA5-Land |
| Palau | (point+buffer) | point + buffer | ERA5-Land |
| Federated States of Micronesia | (point+buffer) | point + buffer | ERA5-Land |
| Cook Islands | (point+buffer) | point + buffer | **ERA5 global** |
| Kiribati | (point+buffer) | point + buffer | **ERA5 global** |
| Marshall Islands | (point+buffer) | point + buffer | **ERA5 global** |
| Nauru | (point+buffer) | point + buffer | **ERA5 global** |
| Niue | (point+buffer) | point + buffer | **ERA5 global** |
| Tonga | (point+buffer) | point + buffer | **ERA5 global** |
| Tuvalu | (point+buffer) | point + buffer | **ERA5 global** |

A country selector (`getCountry` / `get_country`) and an air-temp selector
(`getTempSource` / `get_temp_source`) are built into the scripts; participants
type a **friendly name** and the right area and dataset are chosen automatically.

> **Note:** the earlier `'New Caledonia (Fr)'` selector bug (no matching LSIB
> feature → blank map) is gone — New Caledonia is a territory, outside the 14
> member-country scope, and was removed from the selectors.

## 4. Scripts — PASS
All JavaScript pass `node --check`; all Python pass `py_compile`. The live
14-country matrix (`scripts/python/validate_14_countries.py`, which imports the
real `_pacific_aoi.py` selector) reports **ALL 14 PASS**.

## 5. What still needs YOUR login (visual check)
The live validation confirms every **server-side computation**. The only thing
it cannot do is render the map layers and `ui.Chart` charts, which exist only in
the Code Editor. So, once in your account:

1. **Run `scripts/javascript/99_diagnostic_check.js` once** — confirms all 14
   countries resolve and every dataset loads.
2. **Run `01`–`04` once** with `COUNTRY` set to a test nation (e.g. a high
   island like Samoa and an atoll like Tuvalu) and confirm the map + chart
   render.

---

### Summary
**Live validation: PASS.** All 14 SPREP member countries return valid results
across rainfall, temperature, land heat and SST, after switching rainfall to
GPM IMERG and air temperature to a hybrid ERA5. Remaining: a ~5-minute visual
confirmation of the maps/charts in your account.
