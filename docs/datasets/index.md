# Workshop Datasets

All datasets used in this course are **free for noncommercial use** from the
[Earth Engine Data Catalog](https://developers.google.com/earth-engine/datasets).
Click any dataset ID to open its official catalog page.

---

## Country boundaries

### LSIB Simplified Boundaries

| | |
|---|---|
| **Dataset ID** | [`USDOS/LSIB_SIMPLE/2017`](https://developers.google.com/earth-engine/datasets/catalog/USDOS_LSIB_SIMPLE_2017) |
| **Type** | Vector polygons (FeatureCollection) |
| **Resolution** | n/a — country outlines |
| **Time span** | 2017 snapshot |

**What it is:** The Large Scale International Boundary (LSIB) dataset from the
US Department of State — a clean, global set of country outlines.

**What we derive from it:** Every exercise clips climate data to your country's
boundary. The LSIB outline becomes your **Area of Interest (AOI)**.

> **Note:** LSIB uses US State Department spellings (e.g. `Solomon Is`, not
> "Solomon Islands"), and small-island polygons can be imprecise. The workshop
> covers the **14 SPREP member countries** and the scripts handle the boundary
> quirks automatically — see the [Dataset quick reference](reference.md) for the
> full country-name table.

**Used in:** **Exercise 2** (setup), **3** (rainfall), **4** (temperature),
**5** (ocean & coast).

---

## Climate — Rainfall

### GPM IMERG Monthly v07

| | |
|---|---|
| **Dataset ID** | [`NASA/GPM_L3/IMERG_MONTHLY_V07`](https://developers.google.com/earth-engine/datasets/catalog/NASA_GPM_L3_IMERG_MONTHLY_V07) |
| **Source** | NASA Global Precipitation Measurement (GPM) mission |
| **Resolution** | ~11 km (0.1°) |
| **Time span** | 2000 – present |

**What it is:** Global satellite precipitation from the GPM constellation —
truly global, covering land *and* open ocean, so it returns valid rainfall for
every island.

**Why not CHIRPS?** CHIRPS (~5 km) is widely used, but a live check found it has
a **data hole over Palau** and parts of the far-western Pacific, reporting almost
no rain there. IMERG returns correct rainfall for **all 14 SPREP member
countries**. Trade-off: IMERG starts in 2000, so the normal here is 2001–2020.

**What we derive from it:**
- A **mean annual rainfall map** (annual totals averaged 2001–2020).
- A **year-by-year rainfall chart** that reveals drought years as dips.

**Key band:** `precipitation` (mm/**hour** — multiply by hours in the month for
monthly totals, then sum for annual rainfall).

**Used in:** **Exercise 3 — Rainfall & Drought**.

---

## Climate — Temperature

### ERA5-Land Daily Aggregated

| | |
|---|---|
| **Dataset ID** | [`ECMWF/ERA5_LAND/DAILY_AGGR`](https://developers.google.com/earth-engine/datasets/catalog/ECMWF_ERA5_LAND_DAILY_AGGR) |
| **Source** | European Centre for Medium-Range Weather Forecasts (ECMWF) |
| **Resolution** | ~11 km |
| **Time span** | 1950 – present |

**What it is:** Reanalysis-based daily air temperature, combining model
forecasts with observations. The best long-term record for the **high
islands** — but it is **land-only**, so it has no data over tiny atolls.

**What we derive from it:**
- An **average annual air temperature** from daily mean values (1991–present).
- A **warming trend chart** with a trend line showing how much temperatures
  have risen since the 1990s.
- A **warming map** comparing the most recent decade against an earlier decade.

**Key band:** `temperature_2m` (Kelvin — subtract 273.15 for °C).

**Used in:** **Exercise 4 — Temperature & Heat** (high islands).

---

### ERA5 Monthly (global)

| | |
|---|---|
| **Dataset ID** | [`ECMWF/ERA5/MONTHLY`](https://developers.google.com/earth-engine/datasets/catalog/ECMWF_ERA5_MONTHLY) |
| **Source** | ECMWF / Copernicus |
| **Resolution** | ~27 km |
| **Time span** | 1979 – 2020 |

**What it is:** The full ERA5 reanalysis (land **and** ocean). The scripts use
this for the **7 atoll nations** (Cook Islands, Kiribati, Marshall Islands,
Nauru, Niue, Tonga, Tuvalu) where ERA5-Land returns no data. The country
selector switches to it automatically.

**Key band:** `mean_2m_air_temperature` (Kelvin — subtract 273.15 for °C).

**Used in:** **Exercise 4 — Temperature & Heat** (atolls).

---

### MODIS Land Surface Temperature

| | |
|---|---|
| **Dataset ID** | [`MODIS/061/MOD11A1`](https://developers.google.com/earth-engine/datasets/catalog/MODIS_061_MOD11A1) |
| **Source** | NASA LP DAAC |
| **Resolution** | ~1 km |
| **Time span** | 2000 – present |

**What it is:** Satellite-derived land surface temperature from NASA's
Terra satellite. Shows the actual temperature of the ground, not the air.

**What we derive from it:** A **hottest-areas map** for a recent year —
identifying which parts of your country are hottest, for heat-island
awareness.

**Key band:** `LST_Day_1km` (Kelvin ×0.02 scale factor; subtract 273.15 for °C).

**Used in:** **Exercise 4 — Temperature & Heat**.

---

## Climate — Ocean

### NOAA OISST v2.1

| | |
|---|---|
| **Dataset ID** | [`NOAA/CDR/OISST/V2_1`](https://developers.google.com/earth-engine/datasets/catalog/NOAA_CDR_OISST_V2_1) |
| **Source** | NOAA / NCEI |
| **Resolution** | 0.25° (~28 km) |
| **Time span** | 1981 – present |

**What it is:** Daily sea surface temperature and anomaly fields, blending
satellite, ship and buoy observations. The standard dataset for monitoring
ocean heat stress.

**What we derive from it:**
- A **sea surface temperature (SST) map** for a recent year.
- A **monthly SST anomaly chart** — sustained positive anomalies above
  ~+1 °C indicate coral-bleaching heat stress.

**Key bands:** `sst` (×0.01 → °C), `anom` (×0.01 → °C anomaly vs 1971–2000).

**Used in:** **Exercise 5 — Ocean, Reefs & Coast**.

---

## Physical — Elevation & Water

### NASADEM

| | |
|---|---|
| **Dataset ID** | [`NASA/NASADEM_HGT/001`](https://developers.google.com/earth-engine/datasets/catalog/NASA_NASADEM_HGT_001) |
| **Source** | NASA |
| **Resolution** | ~30 m |
| **Time span** | 2000 snapshot |

**What it is:** A reprocessed version of the SRTM digital elevation model
with improved accuracy — the best free global elevation dataset at this
resolution.

**What we derive from it:** A **low-lying land map** showing areas below 5 m
elevation, and the **exposed area in km²** — identifying the coast most
vulnerable to sea-level rise and storm surge.

**Key band:** `elevation` (metres above sea level).

> **Note on atolls:** 30 m DEMs are coarse for very flat atolls. Treat this
> as an awareness / screening tool, not a survey-grade flood model.

**Used in:** **Exercise 5 — Ocean, Reefs & Coast**.

---

### JRC Global Surface Water

| | |
|---|---|
| **Dataset ID** | [`JRC/GSW1_4/GlobalSurfaceWater`](https://developers.google.com/earth-engine/datasets/catalog/JRC_GSW1_4_GlobalSurfaceWater) |
| **Source** | European Commission Joint Research Centre |
| **Resolution** | 30 m |
| **Time span** | 1984 – 2021 |

**What it is:** A 37-year record of where surface water has been detected
by Landsat satellites — rivers, lakes, wetlands and coastal water bodies.

**What we derive from it:** A **surface water occurrence map** showing where
water has consistently been present (%), complementary to the low-lying land
layer for coastal exposure assessment.

**Key band:** `occurrence` (percentage of time water was detected).

**Used in:** **Exercise 5 — Ocean, Reefs & Coast**.

---

## Quick reference

| Dataset | ID | Type | Resolution | Key band(s) | Exercise |
|---------|----|------|:----------:|-------------|:--------:|
| LSIB | `USDOS/LSIB_SIMPLE/2017` | vector | — | `country_na` | 2–5 |
| GPM IMERG | `NASA/GPM_L3/IMERG_MONTHLY_V07` | image | ~11 km | `precipitation` | 3 |
| ERA5-Land | `ECMWF/ERA5_LAND/DAILY_AGGR` | image | ~11 km | `temperature_2m` | 4 (high islands) |
| ERA5 global | `ECMWF/ERA5/MONTHLY` | image | ~27 km | `mean_2m_air_temperature` | 4 (atolls) |
| MODIS LST | `MODIS/061/MOD11A1` | image | ~1 km | `LST_Day_1km` | 4 |
| OISST v2.1 | `NOAA/CDR/OISST/V2_1` | image | 0.25° | `sst`, `anom` | 5 |
| NASADEM | `NASA/NASADEM_HGT/001` | image | ~30 m | `elevation` | 5 |
| JRC Water | `JRC/GSW1_4/GlobalSurfaceWater` | image | 30 m | `occurrence` | 5 |

For scale factors, unit conversions and the official country-name table, see
the [Dataset quick reference](reference.md) under **Google Earth Engine**.
