# Glossary

A quick reference to the terms used across this course.

**Anomaly**
: The difference between a value and its long-term average. A positive
  sea-surface temperature anomaly means the ocean is warmer than normal.

**AOI (Area of Interest)**
: The region you analyse — here, a country boundary or a point + buffer.

**Band**
: A single layer of values in a dataset (e.g. `precipitation`, `temperature_2m`,
  `sst`).

**Climate normal**
: The 30-year average used to describe a "typical" climate. This course uses
  **1991–2020**.

**Clip**
: Cutting a dataset to the shape of your area of interest.

**Cloud project**
: A free Google Cloud workspace that every Earth Engine account is now linked to.

**Code Editor**
: The Earth Engine web application at
  [code.earthengine.google.com](https://code.earthengine.google.com) where you
  write and run JavaScript.

**Degree Heating Weeks (DHW)**
: A NOAA Coral Reef Watch measure of accumulated ocean heat stress; values above
  4 °C-weeks are linked to coral bleaching.

**FeatureCollection**
: A set of vector features (e.g. country boundaries).

**filter / map / reduce / clip**
: The core Earth Engine workflow: narrow a collection, process each image,
  collapse to one result, and cut it to your area.

**geemap**
: A Python package for using Earth Engine interactively in notebooks / Colab.

**ImageCollection**
: A time series of images (e.g. daily rainfall, daily SST).

**Kelvin (K)**
: The temperature unit used by ERA5 and MODIS. Subtract 273.15 to get °C.

**LSIB**
: Large Scale International Boundary dataset from the US Department of State,
  used here for country outlines. The simplified version excludes small islands.

**LST (Land Surface Temperature)**
: The temperature of the land surface measured from space (MODIS), as opposed to
  air temperature.

**Noncommercial use**
: Free Earth Engine access for research, education and nonprofit work; must be
  re-verified once a year.

**Point + buffer**
: An area of interest made from a point and a radius (a circle) — used for small
  island nations that have no polygon in the boundary layer.

**Reducer**
: A function that summarises data (mean, sum, etc.), e.g. `ee.Reducer.mean()`.

**Scale factor**
: A multiplier stored with a dataset that converts raw values to real units
  (e.g. MODIS LST ×0.02, OISST ×0.01).

**SST (Sea Surface Temperature)**
: The temperature of the ocean surface; warm anomalies drive coral bleaching.
