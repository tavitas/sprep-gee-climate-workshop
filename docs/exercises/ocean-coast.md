# Exercise 5 — Ocean, Reefs & Coast (Capstone)

**Goal:** Bring it all together. Map sea surface temperature (SST) around
your islands, chart the SST anomalies that stress coral reefs, and flag
the low-lying coast most exposed to sea-level rise. You finish with a
localised climate map for **your** country.

**Datasets:**
- NOAA OISST v2.1 (`NOAA/CDR/OISST/V2_1`) — daily SST + anomaly.
- NASADEM (`NASA/NASADEM_HGT/001`) — elevation, for low-lying land.
- JRC Global Surface Water (`JRC/GSW1_4/GlobalSurfaceWater`) — where water sits.

**Companion scripts:**
[`03_sst_reef_heat`](../scripts/javascript.md) ·
[`04_coastal_exposure`](../scripts/javascript.md)

**Time:** ~40 minutes · **Before you start:** finish Exercise 4.

---

## Part A — Sea surface temperature & reef heat stress

### Step 1 — An ocean area of interest
Ocean data needs an offshore area, not just the land outline. We grow the
country's bounding box by ~150 km.
```javascript
var COUNTRY = 'Fiji';
var land = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
             .filter(ee.Filter.eq('country_na', COUNTRY));
var ocean = land.geometry().bounds().buffer(150000);
Map.centerObject(ocean, 7);
var oisst = ee.ImageCollection('NOAA/CDR/OISST/V2_1');
```

### Step 2 — Map recent sea surface temperature
```javascript
var meanSST = oisst.select('sst')
  .filter(ee.Filter.date('2024-01-01', '2025-01-01'))
  .mean().multiply(0.01).clip(ocean);   // scale 0.01 -> °C
Map.addLayer(meanSST, {min: 24, max: 31,
  palette: ['000080','0000ff','00ffff','ffff00','ff8000','ff0000','800000']},
  'Mean SST 2024 (°C)');
```

### Step 3 — Chart the SST anomaly (the bleaching signal)
A positive anomaly means the ocean is **warmer than normal**. Sustained
anomalies above about **+1 °C** are coral-bleaching heat stress.
```javascript
var start = ee.Date('2015-01-01');
var n = ee.Date(Date.now()).difference(start, 'month').floor();
var monthlyAnom = ee.ImageCollection.fromImages(
  ee.List.sequence(0, n).map(function (m) {
    var t0 = start.advance(m, 'month');
    return oisst.select('anom')
      .filter(ee.Filter.date(t0, t0.advance(1, 'month')))
      .mean().multiply(0.01).set('system:time_start', t0.millis());
  })
);
print(ui.Chart.image.series({
  imageCollection: monthlyAnom, region: ocean,
  reducer: ee.Reducer.mean(), scale: 25000
}).setOptions({
  title: 'Monthly SST anomaly around ' + COUNTRY,
  vAxis: {title: '°C vs normal'}, lineWidth: 1.5,
  series: {0: {color: 'b2182b'}}, legend: {position: 'none'}
}));
```
Find the **warm spikes** — those are the marine heatwaves that bleach reefs
(e.g. the strong 2016 El Niño event).

## Part B — Low-lying coast exposed to sea-level rise

### Step 4 — Flag land below 5 m
*(Use a larger island like Samoa, Fiji or Tonga for this part — 30 m DEMs
are too coarse for flat atolls.)*
```javascript
var aoi = land;                 // land outline for elevation
var FLOOD_HEIGHT = 5;           // metres
var dem = ee.Image('NASA/NASADEM_HGT/001').select('elevation').clip(aoi);
Map.addLayer(dem, {min: 0, max: 200,
  palette: ['d73027','fc8d59','fee08b','d9ef8b','91cf60','1a9850']}, 'Elevation (m)');

var lowLying = dem.lte(FLOOD_HEIGHT).selfMask();
Map.addLayer(lowLying, {palette: ['ff0000']}, 'Land below 5 m');
```

### Step 5 — Measure the exposed area
```javascript
var km2 = ee.Image.pixelArea().divide(1e6);
print('Land below 5 m (km²):', km2.updateMask(lowLying).reduceRegion({
  reducer: ee.Reducer.sum(), geometry: aoi.geometry(), scale: 30, maxPixels: 1e13
}));
```
How much of your country's land sits below 5 m? Compare that to the total
land area.

---

## Capstone — your turn
Produce **one localised climate map + chart for your country** and export
it. Choose the theme that matters most to your nation:
- **Atolls (Tuvalu, Kiribati, RMI, Tokelau):** SST anomaly chart + SST map
  using a point+buffer ocean AOI.
- **High islands (Fiji, Samoa, Vanuatu, Solomon Islands, PNG):** rainfall
  or temperature map *plus* the low-lying coast layer.

Then **Export** your map to Drive (Tasks tab) and, if you like, open it in
QGIS to combine with your own national datasets. **This is the whole point
of the workshop:** taking a global dataset and turning it into something
local and decision-ready for your country.

## Check — did it work?
✅ An SST map and an anomaly chart with visible warm spikes.
✅ (High islands) a low-lying coast map and an exposed-area number.
✅ One exported map saved to your Google Drive.

---

🎉 **You're done!** You can now sign in to Earth Engine, find climate
datasets, clip them to your country, visualise them, chart change over
time, and export the result. Keep your saved scripts — they're your
starting templates for real work back home.

**Resources:** Earth Engine Data Catalog · Awesome GEE Community Catalog ·
*Earth Engine Fundamentals and Applications* (free book) · Spatial Thoughts
OpenCourseWare.
