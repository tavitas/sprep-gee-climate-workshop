# Exercise 4 — Rainfall & Drought

**Goal:** Make a map of long-term average rainfall for your country, and a
chart that reveals which years were unusually dry (drought) or wet.

**Dataset:** GPM IMERG Monthly rainfall (`NASA/GPM_L3/IMERG_MONTHLY_V07`),
~11 km, 2000–present. **Companion script:**
[`../scripts/javascript.md`](../scripts/javascript.md)

**Time:** ~30 minutes · **Before you start:** finish Exercise 2.
Exercises 4–6 are independent — do them in any order.

---

## The idea
Rainfall in any single year is noisy. To describe a country's *climate* we
average rainfall over a 20-year period (a **2001–2020 climate normal**, the
satellite-rainfall era). Then, by plotting each year against that average, dry
years (droughts) stand out as dips.

> **Why IMERG, not CHIRPS?** CHIRPS has data holes over the far-western and
> very small Pacific (Palau reads ~0 mm/yr, Tokelau is empty). GPM **IMERG** is
> a satellite product with full ocean+island coverage, so the same script works
> for **every** Pacific country.

## Step 1 — Set up your country and dates
```javascript
// IMPORTANT — in this simplified snippet, COUNTRY must match the boundary
// layer's EXACT spelling (US State Dept names). The 14 SPREP members are:
//   'Fiji'   'Papua New Guinea'   'Vanuatu'   'Samoa'   'Tonga'   'Tuvalu'
//   'Kiribati'   'Nauru'   'Niue'   'Palau'
//   'Solomon Is'                <- NOT 'Solomon Islands'
//   'Cook Is'                   <- NOT 'Cook Islands'
//   'Marshall Is'               <- NOT 'Marshall Islands'
//   'Fed States of Micronesia'  <- NOT 'FSM' or 'Micronesia'
// (The full downloadable script accepts the plain name, e.g. 'Solomon Islands',
//  and handles atoll nations automatically.)
var COUNTRY    = 'Fiji';     // change to your country
var START_YEAR = 2001;
var END_YEAR   = 2020;

var aoi = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
            .filter(ee.Filter.eq('country_na', COUNTRY));
Map.centerObject(aoi, 8);
```

## Step 2 — Load and filter the rainfall data
IMERG's `precipitation` band is a monthly mean **rate** in mm/hour, so we keep
the hours-in-a-month constant handy to turn it into millimetres.
```javascript
var HOURS_PER_MONTH = 730.5;   // 8766 hours/year ÷ 12
var imerg = ee.ImageCollection('NASA/GPM_L3/IMERG_MONTHLY_V07')
  .select('precipitation')
  .filter(ee.Filter.date(START_YEAR + '-01-01', (END_YEAR + 1) + '-01-01'));
```

## Step 3 — Build the mean annual rainfall map
For each year we sum the 12 monthly totals (rate × hours) to get annual
millimetres, then average across all years.
```javascript
var years = ee.List.sequence(START_YEAR, END_YEAR);
var annualTotals = ee.ImageCollection.fromImages(
  years.map(function (y) {
    return imerg.filter(ee.Filter.calendarRange(y, y, 'year'))
                .map(function (img) { return img.multiply(HOURS_PER_MONTH); })
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
  description: COUNTRY.replace(/[ ,]/g, '_') + '_MeanAnnualRainfall',   // no spaces allowed
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
2. **Seasonality:** add a `.filter(ee.Filter.calendarRange(11, 4, 'month'))`
   step to look at the wet season (Nov–Apr) only, and compare it with the
   dry season.
3. Identify the **three driest years** in your country's record.

> **Tip:** for any nation (including atolls and territories), use the full
> script [`scripts/javascript/01_rainfall_chirps.js`](../scripts/javascript.md)
> — it has the built-in country selector so you just set the friendly name.

## Check — did it work?
✅ A rainfall map clipped to your country (blue = wet, yellow = dry).
✅ A line chart of yearly rainfall with visible dry-year dips.
✅ (Optional) an export task that completes in the Tasks tab.

**Next:** [Exercise 5 — Temperature & heat](temperature.md)
