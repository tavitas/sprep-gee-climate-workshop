# Dataset quick reference

All datasets are **free for noncommercial use** and were verified against the
Earth Engine Data Catalog in **June 2026**.

| Theme | Dataset ID | Resolution | Key band(s) | Notes |
|-------|------------|:----------:|-------------|-------|
| Rainfall | `NASA/GPM_L3/IMERG_MONTHLY_V07` | ~11 km | `precipitation` (mm/hr) | 2000–present; global incl. ocean — works for all 14 |
| Air temp (high islands) | `ECMWF/ERA5_LAND/DAILY_AGGR` | ~11 km | `temperature_2m` | **Kelvin**; since 1950; land-only |
| Air temp (atolls) | `ECMWF/ERA5/MONTHLY` | ~27 km | `mean_2m_air_temperature` | **Kelvin**; 1979–2020; incl. ocean |
| Land heat | `MODIS/061/MOD11A1` | ~1 km | `LST_Day_1km` | **Kelvin**, scale ×0.02 |
| Sea-surface temp | `NOAA/CDR/OISST/V2_1` | 0.25° | `sst`, `anom` | °C, scale ×0.01 |
| Elevation / coast | `NASA/NASADEM_HGT/001` | ~30 m | `elevation` (m) | `ee.Image` |
| Surface water | `JRC/GSW1_4/GlobalSurfaceWater` | 30 m | `occurrence` (%) | `ee.Image` |
| Boundaries | `USDOS/LSIB_SIMPLE/2017` | vector | `country_na` | all 14 members present; small polygons imprecise |

## Unit gotchas — apply before mapping

!!! warning "Conversions you must not forget"
    - **ERA5 & MODIS temperatures are in Kelvin** → subtract `273.15` for °C.
    - **MODIS LST**: multiply by `0.02` first, then convert from Kelvin.
    - **OISST `sst` and `anom`**: multiply by `0.01` to get °C.
    - **IMERG `precipitation` is mm/HOUR** → multiply by the hours in each month
      (`24 × days`) to get monthly totals, then sum for annual rainfall.
    - **Air temperature is a hybrid**: high islands use ERA5-Land (to present);
      atoll nations use global ERA5 (`ECMWF/ERA5/MONTHLY`, to 2020) because
      ERA5-Land has no data over tiny atolls.
    - **Ocean data (OISST)**: use a buffered offshore area, not the land outline.

## Country boundaries — important

The boundary layer `USDOS/LSIB_SIMPLE/2017` has two quirks:

1. It uses **US State Department spellings** — e.g. it stores `Solomon Is`, not
   "Solomon Islands".
2. **Polygon outlines for small/atoll nations can be imprecise** — tiny
   landmasses may be poorly resolved.

This course covers the **14 SPREP member countries**. The scripts handle the
boundary quirks with a **hybrid** country selector:

- **Larger high islands** (use LSIB outlines): Fiji, Samoa, Vanuatu, Papua New
  Guinea, Solomon Islands (LSIB: `Solomon Is`).
- **Small / atoll nations** (use point + buffer, because LSIB polygons may be
  imprecise for tiny landmasses): Cook Islands, Federated States of Micronesia,
  Kiribati, Marshall Islands, Nauru, Niue, Palau, Tonga, Tuvalu.

You just type the friendly name; the script picks the right area. Confirm it
live in your own account with the
[diagnostic check](../scripts/diagnostic.md).

## Sources

Earth Engine Data Catalog pages:
[GPM IMERG](https://developers.google.com/earth-engine/datasets/catalog/NASA_GPM_L3_IMERG_MONTHLY_V07) ·
[ERA5-Land](https://developers.google.com/earth-engine/datasets/catalog/ECMWF_ERA5_LAND_DAILY_AGGR) ·
[ERA5 global](https://developers.google.com/earth-engine/datasets/catalog/ECMWF_ERA5_MONTHLY) ·
[MODIS LST](https://developers.google.com/earth-engine/datasets/catalog/MODIS_061_MOD11A1) ·
[OISST](https://developers.google.com/earth-engine/datasets/catalog/NOAA_CDR_OISST_V2_1) ·
[NASADEM](https://developers.google.com/earth-engine/datasets/catalog/NASA_NASADEM_HGT_001) ·
[JRC Surface Water](https://developers.google.com/earth-engine/datasets/catalog/JRC_GSW1_4_GlobalSurfaceWater) ·
[LSIB](https://developers.google.com/earth-engine/datasets/catalog/USDOS_LSIB_SIMPLE_2017)
