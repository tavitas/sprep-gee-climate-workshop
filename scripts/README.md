# Workshop Scripts — Pacific Climate Datasets in Google Earth Engine

Helper scripts for the SPREP / UNEP CIS-Pac5 Regional Capacity Building
workshop (2026). Everything here is **copy-paste ready** — no software to
install for the JavaScript versions.

## How to use

**JavaScript (recommended for the workshop):**
1. Open the Code Editor at https://code.earthengine.google.com
2. Open a file from `javascript/`, copy all of it, paste into the Code Editor.
3. Change the `COUNTRY` variable at the top to your country.
4. Click **Run**. The map appears below; charts appear in the **Console**.

**Python (geemap, for those moving into notebooks):**
- Run `python/00_setup_geemap.py` once (easiest in Google Colab).
- Then run any other `python/` script. They produce the same maps plus
  saved PNG charts.

## What each script does

| File | Theme | Datasets | Output |
|------|-------|----------|--------|
| `00_pacific_helpers.js` | — | LSIB boundaries | Reusable functions: country boundaries (incl. atoll fallback), legends, palettes |
| `99_diagnostic_check.js` | — | all | One-time live check: which countries resolve in LSIB + every dataset loads |
| `python/_pacific_aoi.py` | — | LSIB boundaries | Shared Python country selector imported by the other Python scripts |
| `05_coral_reefs_aca.js` / `.py` | Coral reef habitats | Allen Coral Atlas | Benthic & geomorphic reef map + habitat area (km²) |
| `01_rainfall_chirps.js` / `.py` | Rainfall & drought | GPM IMERG | Mean annual rainfall map + year-by-year rainfall chart |
| `02_temperature_era5_modis.js` / `.py` | Temperature & heat | ERA5 Monthly, MODIS LST | Hottest-areas map + warming trend chart + warming map |
| `03_sst_reef_heat.js` / `.py` | Ocean & reefs | NOAA OISST v2.1 | SST map + SST anomaly time series (bleaching signal) |
| `04_coastal_exposure.js` / `.py` | Sea level & coast | NASADEM, JRC Surface Water | Low-lying land map + exposed area (km²) |

All five themes have both a JavaScript (Code Editor) and a Python
(geemap) version. The JavaScript is the primary path for the workshop;
the Python scripts are for participants moving into Colab / notebooks.

> **Note:** the file names `01_rainfall_chirps` and `02_temperature_era5_modis`
> are kept for stability, but the scripts now use **GPM IMERG** for rainfall and
> **global ERA5** for the temperature trend (see Dataset notes below).

## Localising for your country

Set `COUNTRY` (top of each script) to your nation using these **friendly
names** — the scripts translate them automatically. The default scope is the
**14 SPREP member countries**:

`Fiji`, `Samoa`, `Tonga`, `Vanuatu`, `Solomon Islands`,
`Papua New Guinea`, `Palau`, `Niue`, `Cook Islands`,
`Federated States of Micronesia`, `Marshall Islands`, `Kiribati`,
`Nauru`, `Tuvalu`.

### How boundaries work (important, verified June 2026)

The global boundary layer `USDOS/LSIB_SIMPLE/2017` uses US State Department
spellings (it stores `Solomon Is`, not `Solomon Islands`) and its polygons for
smaller islands are coarse/imprecise. So the scripts use a **hybrid** approach,
built into the country selector at the top of every script:

- **Larger high islands** (Fiji, Papua New Guinea, Solomon Islands,
  Vanuatu, Samoa) use the real LSIB outline.
- **Small / atoll nations** (everyone else) use a **point + buffer** area,
  which reliably clips the coarse (5–28 km) gridded climate data.

You don't need to remember which is which — just type the friendly name.
The Python scripts import this logic from `python/_pacific_aoi.py`. To add a
territory (e.g. `New Caledonia`, `Guam`), add a line to the selector.

### Confirm it live (recommended)

Run **`javascript/99_diagnostic_check.js`** once in the Code Editor after
you sign in. It prints (A) which country names actually resolve in LSIB in
your account, and (B) that every dataset loads. This is the definitive
check before a workshop.

## Dataset notes (verified live, June 2026)

- **Allen Coral Atlas** (`ACA/reef_habitat/v2_0`) — `benthic`, `geomorphic`,
  `reef_mask` (integer class codes; remap to a palette). 5 m, 2018–2021.
- **GPM IMERG Monthly** (`NASA/GPM_L3/IMERG_MONTHLY_V07`) — `precipitation` is a
  monthly mean **rate in mm/hour**; multiply by hours to get millimetres. Full
  Pacific coverage (CHIRPS has holes at Palau / Tokelau).
- **ERA5 Monthly** (`ECMWF/ERA5/MONTHLY`) — `mean_2m_air_temperature` in Kelvin
  (subtract 273.15). Global reanalysis (covers atolls); ends 2020-06.
- **MODIS LST** (`MODIS/061/MOD11A1`) — `LST_Day_1km`, scale 0.02, Kelvin.
- **NOAA OISST v2.1** (`NOAA/CDR/OISST/V2_1`) — `sst` and `anom`, scale 0.01.
- **NASADEM** (`NASA/NASADEM_HGT/001`) — `elevation` in metres.
- **JRC Global Surface Water** (`JRC/GSW1_4/GlobalSurfaceWater`) — `occurrence` %.
