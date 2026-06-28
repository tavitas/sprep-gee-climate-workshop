# JavaScript scripts (Code Editor)

Copy any block below into the
[Earth Engine Code Editor](https://code.earthengine.google.com) and click
**Run**. Change `COUNTRY` at the top to your nation.

## Helper functions — `00_pacific_helpers.js`

Reusable country boundaries (hybrid LSIB + point/buffer), legends and palettes.

```javascript title="00_pacific_helpers.js"
--8<-- "scripts/javascript/00_pacific_helpers.js"
```

## 1 · Rainfall & drought — `01_rainfall_chirps.js`

```javascript title="01_rainfall_chirps.js"
--8<-- "scripts/javascript/01_rainfall_chirps.js"
```

## 2 · Temperature & heat — `02_temperature_era5_modis.js`

```javascript title="02_temperature_era5_modis.js"
--8<-- "scripts/javascript/02_temperature_era5_modis.js"
```

## 3 · Ocean, SST & reef heat — `03_sst_reef_heat.js`

```javascript title="03_sst_reef_heat.js"
--8<-- "scripts/javascript/03_sst_reef_heat.js"
```

## 4 · Coastal exposure — `04_coastal_exposure.js`

```javascript title="04_coastal_exposure.js"
--8<-- "scripts/javascript/04_coastal_exposure.js"
```

## 5 · Coral reef habitats — `05_coral_reefs_aca.js`

The companion script for [Exercise 3 — Coral reef habitats](../exercises/coral-reefs.md)
(Allen Coral Atlas).

```javascript title="05_coral_reefs_aca.js"
--8<-- "scripts/javascript/05_coral_reefs_aca.js"
```
