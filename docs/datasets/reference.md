# Dataset quick reference

All datasets are **free for noncommercial use** and were verified against the
Earth Engine Data Catalog in **June 2026**.

| Theme | Dataset ID | Resolution | Key band(s) | Notes |
|-------|------------|:----------:|-------------|-------|
| Rainfall | `UCSB-CHG/CHIRPS/DAILY` | ~5.5 km | `precipitation` (mm/d) | 1981–present; v2 ends Dec 2026 |
| Rainfall (v3) | `UCSB-CHC/CHIRPS/V3/DAILY_SAT` | ~5.5 km | `precipitation` | successor to v2 |
| Air temperature | `ECMWF/ERA5_LAND/DAILY_AGGR` | ~11 km | `temperature_2m` | **Kelvin**; since 1950 |
| Land heat | `MODIS/061/MOD11A1` | ~1 km | `LST_Day_1km` | **Kelvin**, scale ×0.02 |
| Sea-surface temp | `NOAA/CDR/OISST/V2_1` | 0.25° | `sst`, `anom` | °C, scale ×0.01 |
| Elevation / coast | `NASA/NASADEM_HGT/001` | ~30 m | `elevation` (m) | `ee.Image` |
| Surface water | `JRC/GSW1_4/GlobalSurfaceWater` | 30 m | `occurrence` (%) | `ee.Image` |
| Boundaries | `USDOS/LSIB_SIMPLE/2017` | vector | `country_na` | excludes small islands |

## Unit gotchas — apply before mapping

!!! warning "Conversions you must not forget"
    - **ERA5 & MODIS temperatures are in Kelvin** → subtract `273.15` for °C.
    - **MODIS LST**: multiply by `0.02` first, then convert from Kelvin.
    - **OISST `sst` and `anom`**: multiply by `0.01` to get °C.
    - **CHIRPS v2** ends after Dec 2026 → switch to v3 for future work.
    - **Ocean data (OISST)**: use a buffered offshore area, not the land outline.

## Country boundaries — important

The boundary layer `USDOS/LSIB_SIMPLE/2017` has two quirks:

1. It uses **US State Department spellings** — e.g. it stores `Solomon Is`, not
   "Solomon Islands".
2. It **excludes medium and smaller islands**, so the tiniest nations have **no
   polygon at all**.

The course scripts handle this with a **hybrid** country selector:

- **Larger high islands** (use LSIB outlines): Fiji, Samoa, Vanuatu, Papua New
  Guinea, Solomon Islands (LSIB: `Solomon Is`), New Caledonia (LSIB:
  `New Caledonia (Fr)`).
- **Small / atoll / territory nations** (use point + buffer, including nations
  whose LSIB polygons are too coarse for small islands): American Samoa,
  Cook Islands (LSIB: `Cook Is (NZ)`), Federated States of Micronesia (LSIB:
  `Micronesia, Fed States of`), French Polynesia, Guam, Kiribati, Marshall
  Islands (LSIB: `Marshall Is`), Nauru, Niue (LSIB: `Niue (NZ)`), Northern
  Mariana Islands, Palau, Tokelau, Tonga, Tuvalu, Wallis and Futuna.

You just type the friendly name; the script picks the right area. Confirm it
live in your own account with the
[diagnostic check](../scripts/diagnostic.md).

## Sources

Earth Engine Data Catalog pages:
[CHIRPS](https://developers.google.com/earth-engine/datasets/catalog/UCSB-CHG_CHIRPS_DAILY) ·
[ERA5-Land](https://developers.google.com/earth-engine/datasets/catalog/ECMWF_ERA5_LAND_DAILY_AGGR) ·
[MODIS LST](https://developers.google.com/earth-engine/datasets/catalog/MODIS_061_MOD11A1) ·
[OISST](https://developers.google.com/earth-engine/datasets/catalog/NOAA_CDR_OISST_V2_1) ·
[NASADEM](https://developers.google.com/earth-engine/datasets/catalog/NASA_NASADEM_HGT_001) ·
[JRC Surface Water](https://developers.google.com/earth-engine/datasets/catalog/JRC_GSW1_4_GlobalSurfaceWater) ·
[LSIB](https://developers.google.com/earth-engine/datasets/catalog/USDOS_LSIB_SIMPLE_2017)
