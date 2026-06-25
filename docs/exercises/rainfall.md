# Exercise 3 — Rainfall & Drought

**Goal:** Make a map of long-term average rainfall for your country, and a
chart that reveals which years were unusually dry (drought) or wet.

**Dataset:** GPM IMERG Monthly rainfall (`NASA/GPM_L3/IMERG_MONTHLY_V07`),
~11 km, 2000–present. **Companion script:**
[`../scripts/javascript.md`](../scripts/javascript.md)

**Time:** ~30 minutes · **Before you start:** finish Exercise 2.

---

## The idea
Rainfall in any single year is noisy. To describe a country's *climate* we
average rainfall over a 20-year period (the **2001–2020 normal**). Then, by
plotting each year against that average, dry years (droughts) stand out as dips.

!!! info "Why IMERG and not CHIRPS?"
    CHIRPS (~5 km) is popular, but a live check showed it has a **data hole over
    Palau** and parts of the far-western Pacific — it reports almost no rain
    there. **GPM IMERG** is a true global satellite product that covers the open
    ocean, so it returns correct rainfall for **all 14 SPREP member countries**.
    Trade-off: IMERG starts in 2000, so the normal here is 2001–2020.

## Step 1 — Set up your country and dates
```javascript
var COUNTRY    = 'Fiji';     // change to your country
var START_YEAR = 2001;
var END_YEAR   = 2020;

var aoi = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
            .filter(ee.Filter.eq('country_na', COUNTRY));
Map.centerObject(aoi, 8);
```

## Step 2 — Load IMERG and convert mm/hour → mm/month
IMERG's `precipitation` band is a **rate in mm/hour**, so we multiply each
month by its number of hours to get that month's total rainfall in mm.
```javascript
var imerg = ee.ImageCollection('NASA/GPM_L3/IMERG_MONTHLY_V07')
  .select('precipitation')
  .filter(ee.Filter.date(START_YEAR + '-01-01', (END_YEAR + 1) + '-01-01'));

var monthlyMM = imerg.map(function (img) {
  var start = ee.Date(img.get('system:time_start'));
  var days  = start.advance(1, 'month').difference(start, 'day');
  return img.multiply(24).multiply(days)        // mm/hr -> mm/month
            .set('year', start.get('year'));
});
```

## Step 3 — Build the mean annual rainfall map
We total each year's months, then average across all years.
```javascript
var years = ee.List.sequence(START_YEAR, END_YEAR);
var annualTotals = ee.ImageCollection.fromImages(
  years.map(function (y) {
    return monthlyMM.filter(ee.Filter.calendarRange(y, y, 'year'))
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
  scale: 11000
}).setOptions({
  title: 'Total annual rainfall over ' + COUNTRY,
  vAxis: {title: 'mm/year'}, hAxis: {title: 'Year'},
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
  scale: 10000,
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
> [`scripts/javascript/01_rainfall_imerg.js`](../scripts/javascript.md):
> just set `COUNTRY` to the friendly name and its built-in selector picks
> the right area automatically.

## Your turn
1. Change `COUNTRY` to your country and re-run.
2. **Seasonality:** add `.filter(ee.Filter.calendarRange(11, 4, 'month'))`
   logic to look at the wet season only.
3. Identify the **three driest years** in your country's record.

## Check — did it work?
✅ A rainfall map clipped to your country (blue = wet, yellow = dry).
✅ A line chart of yearly rainfall with visible dry-year dips.
✅ (Optional) an export task that completes in the Tasks tab.

**Next:** [Exercise 4 — Temperature & heat](temperature.md)
