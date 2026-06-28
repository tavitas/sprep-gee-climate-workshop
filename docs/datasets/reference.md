# Dataset quick reference

All datasets are **free for noncommercial use** and were verified against the
Earth Engine Data Catalog in **June 2026**.

| Theme | Dataset ID | Resolution | Key band(s) | Notes |
|-------|------------|:----------:|-------------|-------|
| Rainfall | `NASA/GPM_L3/IMERG_MONTHLY_V07` | ~11 km | `precipitation` (mm/hr) | 2000–present; full Pacific ocean+island coverage |
| Air temperature | `ECMWF/ERA5/MONTHLY` | ~28 km | `mean_2m_air_temperature` | **Kelvin**; 1979 → 2020-06; global (covers atolls) |
| Land heat | `MODIS/061/MOD11A1` | ~1 km | `LST_Day_1km` | **Kelvin**, scale ×0.02 |
| Sea-surface temp | `NOAA/CDR/OISST/V2_1` | 0.25° | `sst`, `anom` | °C, scale ×0.01 |
| Elevation / coast | `NASA/NASADEM_HGT/001` | ~30 m | `elevation` (m) | `ee.Image` |
| Surface water | `JRC/GSW1_4/GlobalSurfaceWater` | 30 m | `occurrence` (%) | `ee.Image` |
| Boundaries | `USDOS/LSIB_SIMPLE/2017` | vector | `country_na` | all 21 PICTs present; small polygons imprecise |

## Unit gotchas — apply before mapping

!!! warning "Conversions you must not forget"
    - **ERA5 & MODIS temperatures are in Kelvin** → subtract `273.15` for °C.
    - **MODIS LST**: multiply by `0.02` first, then convert from Kelvin.
    - **OISST `sst` and `anom`**: multiply by `0.01` to get °C.
    - **IMERG `precipitation`** is a rate in **mm/hour** → multiply by the hours
      in the period (~730.5 per month) to get millimetres.
    - **Ocean data (OISST)**: use a buffered offshore area, not the land outline.

## Country boundaries — important

The boundary layer `USDOS/LSIB_SIMPLE/2017` has two quirks:

1. It uses **US State Department spellings** — e.g. it stores `Solomon Is`, not
   "Solomon Islands".
2. While all 21 SPREP PICTs are in LSIB, **polygon outlines for small/atoll
   nations can be imprecise** — tiny landmasses may be poorly resolved.

The course scripts handle this with a **hybrid** country selector:

- **Larger high islands** (use LSIB outlines): Fiji, Samoa, Vanuatu, Papua New
  Guinea, Solomon Islands (LSIB: `Solomon Is`), New Caledonia.
- **Small / atoll / territory nations** (use point + buffer — all 21 PICTs are
  in LSIB, but point+buffer is recommended for small/atoll nations because LSIB
  polygons may be imprecise for tiny landmasses): American Samoa, Cook Islands
  (LSIB: `Cook Is`), Federated States of Micronesia (LSIB:
  `Fed States of Micronesia`), French Polynesia, Guam, Kiribati, Marshall
  Islands (LSIB: `Marshall Is`), Nauru, Niue (LSIB: `Niue`), Northern Mariana
  Islands (LSIB: `Northern Mariana Is`), Palau, Tokelau, Tonga, Tuvalu, Wallis
  and Futuna (LSIB: `Wallis & Futuna`).

You just type the friendly name; the script picks the right area. Confirm it
live in your own account with the
[diagnostic check](../scripts/diagnostic.md).

## Sources

Earth Engine Data Catalog pages:
[GPM IMERG](https://developers.google.com/earth-engine/datasets/catalog/NASA_GPM_L3_IMERG_MONTHLY_V07) ·
[ERA5 Monthly](https://developers.google.com/earth-engine/datasets/catalog/ECMWF_ERA5_MONTHLY) ·
[MODIS LST](https://developers.google.com/earth-engine/datasets/catalog/MODIS_061_MOD11A1) ·
[OISST](https://developers.google.com/earth-engine/datasets/catalog/NOAA_CDR_OISST_V2_1) ·
[NASADEM](https://developers.google.com/earth-engine/datasets/catalog/NASA_NASADEM_HGT_001) ·
[JRC Surface Water](https://developers.google.com/earth-engine/datasets/catalog/JRC_GSW1_4_GlobalSurfaceWater) ·
[LSIB](https://developers.google.com/earth-engine/datasets/catalog/USDOS_LSIB_SIMPLE_2017)
