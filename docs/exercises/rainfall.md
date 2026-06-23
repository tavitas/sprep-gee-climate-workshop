# Exercise 3 — Rainfall & Drought

**Goal:** Make a map of long-term average rainfall for your country, and a
chart that reveals which years were unusually dry (drought) or wet.

**Dataset:** CHIRPS Daily rainfall (`UCSB-CHG/CHIRPS/DAILY`), ~5 km,
1981–present. **Companion script:**
[`../scripts/javascript.md`](../scripts/javascript.md)

**Time:** ~30 minutes · **Before you start:** finish Exercise 2.

---

## The idea
Rainfall in any single year is noisy. To describe a country's *climate* we
average rainfall over a 30-year period (the standard **1991–2020 climate
normal**). Then, by plotting each year against that average, dry years
(droughts) stand out as dips.

## Step 1 — Set up your country and dates
```javascript
var COUNTRY    = 'Fiji';     // change to your country
var START_YEAR = 1991;
var END_YEAR   = 2020;

var aoi = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
            .filter(ee.Filter.eq('country_na', COUNTRY));
Map.centerObject(aoi, 8);
```

## Step 2 — Load and filter the rainfall data
```javascript
var chirps = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
  .select('precipitation')
  .filter(ee.Filter.date(START_YEAR + '-01-01', (END_YEAR + 1) + '-01-01'));
```

## Step 3 — Build the mean annual rainfall map
We total the rainfall for each year, then average across all years.
```javascript
var years = ee.List.sequence(START_YEAR, END_YEAR);
var annualTotals = ee.ImageCollection.fromImages(
  years.map(function (y) {
    return chirps.filter(ee.Filter.calendarRange(y, y, 'year'))
                 .sum().set('year', y);
  })
);
var meanAnnualRain = annualTotals.mean().clip(aoi);

var rainPalette = ['ffffcc','c7e9b4','7fcdbb','41b6c4','1d91c0','225ea8','0c2c84'];
Map.addLayer(meanAnnualRain, {min: 1000, max: 4000, palette: rainPalette},
             'Mean annual rainfall (mm)');
```
Run it. Wetter areas appear dark blue, drier areas pale yellow.

## Step 4 — Chart rainfall year by year (the drought signal)
```javascript
var withTime = annualTotals.map(function (img) {
  return img.set('system:time_start',
                 ee.Date.fromYMD(img.get('year'), 1, 1).millis());
});
var chart = ui.Chart.image.series({
  imageCollection: withTime,
  region: aoi,
  reducer: ee.Reducer.mean(),
  scale: 5000
}).setOptions({
  title: 'Total annual rainfall over ' + COUNTRY,
  vAxis: {title: 'mm/year'}, hAxis: {title: 'Year', format: '####'},
  lineWidth: 2, pointSize: 4, legend: {position: 'none'}
});
print(chart);
```
Look at the chart in the Console. **Dips far below the others are drought
years.** Which years were driest for your country?

## Step 5 — Export your map (optional)
```javascript
Export.image.toDrive({
  image: meanAnnualRain,
  description: COUNTRY + '_MeanAnnualRainfall',
  folder: 'GEE_Workshop_2026',
  scale: 5000,
  region: aoi.geometry().bounds(),
  maxPixels: 1e13
});
```
Then open the **Tasks** tab (top-right) and click **Run**. The GeoTIFF
lands in your Google Drive — open it in QGIS or ArcGIS later.

---

> **Country names:** the simplified code above filters the boundary layer
> directly, which only works for the larger high islands and needs exact
> spellings (e.g. `Solomon Is`, not `Solomon Islands`) — see
> [Exercise 2](code-editor.md). For **any** nation
> (including atolls), use the full script
> [`scripts/javascript/01_rainfall_chirps.js`](../scripts/javascript.md):
> just set `COUNTRY` to the friendly name and its built-in selector picks
> the right area automatically.

## Your turn
1. Change `COUNTRY` to your country and re-run.
2. **Seasonality:** add `.filter(ee.Filter.calendarRange(11, 4, 'month'))`
   logic to look at the wet season only — or copy the April-only approach
   from the original `MeanRainfallTemplate.js`.
3. Identify the **three driest years** in your country's record.

> **2026 note:** CHIRPS v2 ends after Dec 2026. For future-proof work,
> swap the dataset ID to the v3 product `UCSB-CHC/CHIRPS/V3/DAILY_SAT`.

## Check — did it work?
✅ A rainfall map clipped to your country (blue = wet, yellow = dry).
✅ A line chart of yearly rainfall with visible dry-year dips.
✅ (Optional) an export task that completes in the Tasks tab.

**Next:** [Exercise 4 — Temperature & heat](temperature.md)
