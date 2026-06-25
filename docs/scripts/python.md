# Python scripts (geemap)

The Code Editor needs nothing installed. To use Earth Engine from **Python**,
run the setup once (easiest in [Google Colab](https://colab.research.google.com))
then run any script below. They produce the same maps plus saved PNG charts.

!!! note "Shared helper"
    `01`–`04` import a small country selector from `_pacific_aoi.py` (shown last).
    Keep all the Python files in the same folder.

## Setup (run once) — `00_setup_geemap.py`

```python title="00_setup_geemap.py"
--8<-- "scripts/python/00_setup_geemap.py"
```

## 1 · Rainfall & drought — `01_rainfall_imerg.py`

```python title="01_rainfall_imerg.py"
--8<-- "scripts/python/01_rainfall_imerg.py"
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

## Shared country selector — `_pacific_aoi.py`

```python title="_pacific_aoi.py"
--8<-- "scripts/python/_pacific_aoi.py"
```
