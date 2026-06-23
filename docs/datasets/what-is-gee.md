# What is Google Earth Engine?

Google Earth Engine (GEE) is a **free, cloud-based platform** that lets you
analyse decades of satellite and climate data on Google's servers — straight
from your browser, with no large downloads and no powerful computer required.

<div class="grid" markdown>

!!! abstract "90+ petabytes"
    of open Earth-observation and climate data in the catalog.

!!! abstract "1000s of datasets"
    ready to use, including the climate datasets in this course.

!!! abstract "Free"
    for research, education and noncommercial use.

</div>

## Why it matters for the Pacific

- **Ocean and climate data for vast sea areas** — perfect for island nations
  whose territory is mostly ocean.
- **No need to download huge satellite files** — the processing happens on
  Google's side; you only pull back the final map or chart.
- **Localise global data to your own islands** — clip global datasets to your
  country with one line.
- **Track change over decades** — rainfall, temperature and sea-surface
  temperature records going back to the 1980s.

## What Earth Engine is good for

- Mapping rainfall, temperature and sea-surface temperature.
- Detecting change and trends over 30+ years.
- Spectral indices (NDVI vegetation, NDWI water).
- Zonal statistics and time-series charts.
- Classification and machine learning.
- Exporting maps to Google Drive for QGIS / ArcGIS.

## What it is *not* designed for

- Cartographic page layout / final print maps.
- Heavy 3D visualisation and photogrammetry.
- LiDAR point-cloud processing.
- SAR interferometry.
- Detailed hydrological / hydraulic models.

!!! note "Use desktop GIS for these"
    Earth Engine exports (GeoTIFFs) feed straight into QGIS or ArcGIS, where you
    finish maps and combine them with your own national datasets.

## What changed in 2026

!!! warning "Accounts now need a Cloud project"
    Since late 2024, every Earth Engine user signs up through a free Google
    Cloud project and verifies for **noncommercial** use. No credit card is
    needed. See [Exercise 1](../exercises/account-setup.md).

!!! note "CHIRPS rainfall is moving v2 → v3"
    The CHIRPS v2 product used in this course stops production after **December
    2026**. The successor is `UCSB-CHC/CHIRPS/V3/DAILY_SAT`. We teach the stable
    v2 for the 1991–2020 climate normal and point to v3 for future work.
