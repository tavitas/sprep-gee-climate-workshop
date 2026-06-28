# Python scripts (geemap)

The Code Editor needs nothing installed. To use Earth Engine from **Python**,
run the setup once (easiest in [Google Colab](https://colab.research.google.com))
then run any script below. They produce the same maps plus saved PNG charts.

!!! tip "New to Colab? Start in the Google Colab section"
    See [**Set up Colab & Earth Engine**](../colab/setup.md) for the step-by-step
    notebook setup, and [**Run the workshop scripts**](../colab/run-scripts.md)
    for how to load the helper and run the code below in Colab.

!!! note "Shared helper"
    `01`–`05` import a small country selector from `_pacific_aoi.py` (shown last).
    Keep all the Python files in the same folder.

## Setup (run once) — `00_setup_geemap.py`

```python title="00_setup_geemap.py"
--8<-- "scripts/python/00_setup_geemap.py"
```

## 1 · Rainfall & drought — `01_rainfall_chirps.py`

```python title="01_rainfall_chirps.py"
--8<-- "scripts/python/01_rainfall_chirps.py"
```

## 2 · Temperature & heat — `02_temperature_era5_modis.py`

```python title="02_temperature_era5_modis.py"
--8<-- "scripts/python/02_temperature_era5_modis.py"
```

## 3 · Ocean, SST & reef heat — `03_sst_reef_heat.py`

```python title="03_sst_reef_heat.py"
--8<-- "scripts/python/03_sst_reef_heat.py"
```

## 4 · Coastal exposure — `04_coastal_exposure.py`

```python title="04_coastal_exposure.py"
--8<-- "scripts/python/04_coastal_exposure.py"
```

## 5 · Coral reef habitats — `05_coral_reefs_aca.py`

The companion script for [Exercise 3 — Coral reef habitats](../exercises/coral-reefs.md)
(Allen Coral Atlas).

```python title="05_coral_reefs_aca.py"
--8<-- "scripts/python/05_coral_reefs_aca.py"
```

## Shared country selector — `_pacific_aoi.py`

```python title="_pacific_aoi.py"
--8<-- "scripts/python/_pacific_aoi.py"
```
