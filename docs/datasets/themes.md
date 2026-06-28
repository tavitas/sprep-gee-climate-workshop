# The four climate themes

This course focuses on four themes that matter most to Pacific Island nations.
Each has a hands-on exercise and a ready-to-run script.

## :material-weather-pouring: Rainfall & drought

Rainfall in any single year is noisy. To describe a country's *climate* we
average rainfall over a **2001–2020** 20-year period, then plot each year
against that average so **drought years show up as dips**.

- **Dataset:** GPM IMERG Monthly (`NASA/GPM_L3/IMERG_MONTHLY_V07`), ~11 km,
  2000–present. Full Pacific ocean+island coverage — works for every country.
- **You make:** a mean annual rainfall map + a year-by-year rainfall chart.
- **Go to:** [Exercise 3](../exercises/rainfall.md).

## :material-thermometer: Temperature & heat

Two datasets, two questions: *where* is it hottest, and *how fast* is it warming?

- **MODIS Land Surface Temperature** (`MODIS/061/MOD11A1`, ~1 km) shows where
  heat sits on the land.
- **ERA5 air temperature** (`ECMWF/ERA5/MONTHLY`, ~28 km, 1979 → 2020-06) shows
  the long-term warming trend. This *global* reanalysis covers ocean as well as
  land, so the trend works for atolls too.
- **You make:** a heat map + an air-temperature trend chart + a warming map.
- **Go to:** [Exercise 4](../exercises/temperature.md).

!!! warning "Both are in Kelvin"
    Subtract 273.15 to get °C. MODIS LST also needs a ×0.02 scale factor first.

## :material-fish: Ocean, reefs & sea-surface temperature

A positive SST **anomaly** means the ocean is warmer than normal. Anomalies
sustained above about **+1 °C** are coral-bleaching heat stress.

- **Dataset:** NOAA OISST v2.1 (`NOAA/CDR/OISST/V2_1`), 0.25°, daily, since 1981.
  Bands `sst` and `anom` (×0.01 → °C).
- **You make:** an SST map + a monthly anomaly chart that reveals marine
  heatwaves (e.g. the strong 2016 El Niño event).
- **Go to:** [Exercise 5](../exercises/ocean-coast.md).

## :material-image-filter-hdr: Sea level & low-lying coast

Flag the land most exposed to sea-level rise and storm surge, and see where
surface water already sits.

- **Datasets:** NASADEM elevation (`NASA/NASADEM_HGT/001`, ~30 m) and JRC Global
  Surface Water (`JRC/GSW1_4/GlobalSurfaceWater`, 30 m).
- **You make:** a map of land below 5 m + the exposed area in km².
- **Go to:** [Exercise 5](../exercises/ocean-coast.md).

!!! note "Atolls need care"
    30 m elevation data is coarse for very flat atolls. Treat the coastal layer
    as an **awareness / screening tool**, not a survey-grade flood model.

See the [Dataset quick reference](reference.md) for all IDs, bands and units in
one table.
