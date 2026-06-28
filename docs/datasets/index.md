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
> "Solomon Islands"). All 21 SPREP PICTs are present, but small-island
> polygons can be imprecise. The workshop scripts handle this automatically —
> see the [Dataset quick reference](reference.md) for the full country-name table.

**Used in:** **Exercise 2** (setup), **3** (coral reefs), **4** (rainfall),
**5** (temperature), **6** (ocean & coast).

---

## Marine — Coral reefs

### Allen Coral Atlas

| | |
|---|---|
| **Dataset ID** | [`ACA/reef_habitat/v2_0`](https://developers.google.com/earth-engine/datasets/catalog/ACA_reef_habitat_v2_0) |
| **Source** | Allen Coral Atlas / Arizona State University & partners |
| **Resolution** | 5 m |
| **Time span** | mapped 2018–2021 (single image) |

**What it is:** A satellite-derived map of the world's shallow coral reefs.
A single `ee.Image` with three bands: `benthic` (seafloor cover — Coral/Algae,
Seagrass, Sand, Rubble, Rock, Microalgal Mats), `geomorphic` (reef zones — reef
flat, crest, slope, lagoon, patch reef) and `reef_mask` (1 = reef). Coverage is
excellent for the Pacific (verified live for every SPREP country, June 2026).

**What we derive from it:**
- A **benthic habitat map** showing where the coral and seagrass are.
- A **geomorphic zones map** showing the reef's structure.
- The **area of coral and seagrass habitat** (km²) for your country.

**Key bands:** `benthic`, `geomorphic`, `reef_mask` (integer class codes —
remap to a palette; see the script).

**Used in:** **Exercise 3 — Coral Reef Habitats**.

---

## Climate — Rainfall

### GPM IMERG Monthly v07

| | |
|---|---|
| **Dataset ID** | [`NASA/GPM_L3/IMERG_MONTHLY_V07`](https://developers.google.com/earth-engine/datasets/catalog/NASA_GPM_L3_IMERG_MONTHLY_V07) |
| **Source** | NASA Global Precipitation Measurement (GPM) mission |
| **Resolution** | ~11 km (0.1°) |
| **Time span** | 2000 – present |

**What it is:** Satellite-based monthly precipitation from NASA's GPM
mission. Unlike CHIRPS, IMERG has full coverage over the open ocean and the
small / far-western Pacific, so the same script works for **every** country —
including Palau and Tokelau, where CHIRPS is empty. (Verified live, June 2026.)

**What we derive from it:**
- A **mean annual rainfall map** (annual precipitation averaged 2001–2020).
- A **year-by-year rainfall chart** that reveals drought years as dips.

**Key band:** `precipitation` — a monthly mean **rate in mm/hour**. Multiply by
the hours in a month (~730.5) to get millimetres, then sum the 12 months for an
annual total.

**Used in:** **Exercise 4 — Rainfall & Drought**.

---

## Climate — Temperature

### ERA5 Monthly

| | |
|---|---|
| **Dataset ID** | [`ECMWF/ERA5/MONTHLY`](https://developers.google.com/earth-engine/datasets/catalog/ECMWF_ERA5_MONTHLY) |
| **Source** | European Centre for Medium-Range Weather Forecasts (ECMWF) |
| **Resolution** | ~28 km (0.25°) |
| **Time span** | 1979 – 2020-06 |

**What it is:** Reanalysis-based monthly air temperature, combining model
forecasts with observations. This is the **global** ERA5 product, so it covers
ocean as well as land — and therefore returns a warming trend for **every**
country, including atolls where the land-only ERA5-Land product is blank.
(Verified live, June 2026.)

**What we derive from it:**
- An **average annual air temperature** from the monthly means (1991–2019).
- A **warming trend chart** with a trend line showing how much temperatures
  have risen since the 1990s.
- A **warming map** comparing the most recent decade against an earlier decade.

**Key band:** `mean_2m_air_temperature` (Kelvin — subtract 273.15 for °C).

**Used in:** **Exercise 5 — Temperature & Heat**.

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

**Used in:** **Exercise 5 — Temperature & Heat**.

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

**Used in:** **Exercise 6 — Ocean & Coast**.

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

**Used in:** **Exercise 6 — Ocean & Coast**.

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

**Used in:** **Exercise 6 — Ocean & Coast**.

---

## Quick reference

| Dataset | ID | Type | Resolution | Key band(s) | Exercise |
|---------|----|------|:----------:|-------------|:--------:|
| LSIB | `USDOS/LSIB_SIMPLE/2017` | vector | — | `country_na` | 2–6 |
| Allen Coral Atlas | `ACA/reef_habitat/v2_0` | image | 5 m | `benthic`, `geomorphic`, `reef_mask` | 3 |
| GPM IMERG | `NASA/GPM_L3/IMERG_MONTHLY_V07` | image | ~11 km | `precipitation` | 4 |
| ERA5 Monthly | `ECMWF/ERA5/MONTHLY` | image | ~28 km | `mean_2m_air_temperature` | 5 |
| MODIS LST | `MODIS/061/MOD11A1` | image | ~1 km | `LST_Day_1km` | 5 |
| OISST v2.1 | `NOAA/CDR/OISST/V2_1` | image | 0.25° | `sst`, `anom` | 6 |
| NASADEM | `NASA/NASADEM_HGT/001` | image | ~30 m | `elevation` | 6 |
| JRC Water | `JRC/GSW1_4/GlobalSurfaceWater` | image | 30 m | `occurrence` | 6 |

For scale factors, unit conversions and the official country-name table, see
the [Dataset quick reference](reference.md) under **Google Earth Engine**.
