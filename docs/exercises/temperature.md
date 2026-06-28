# Exercise 4 — Temperature & Heat

**Goal:** Show *where* it is hottest across your country, and reveal the
*long-term warming trend* in air temperature.

**Datasets:**
- MODIS Land Surface Temperature (`MODIS/061/MOD11A1`) — ~1 km, where heat is.
- ERA5 Monthly (`ECMWF/ERA5/MONTHLY`) — air temperature trend (global
  reanalysis; covers ocean + atolls, so it works for every country).

**Companion script:**
[`../scripts/javascript.md`](../scripts/javascript.md)

**Time:** ~30 minutes · **Before you start:** finish Exercise 3.

---

## Two ideas, two datasets
- **MODIS** measures the temperature of the **land surface** from space at
  1 km — good for a map of *where* the heat sits. (Land only, so it is sparse
  over smaller islands with very little land.)
- **ERA5** is a climate **reanalysis** of 2 m **air** temperature. We use the
  *global* monthly product (`ECMWF/ERA5/MONTHLY`, 1979 → 2020-06), which covers
  ocean as well as land — so it returns a trend for **every** country,
  including atolls.

Both store temperature in **Kelvin**, so we subtract 273.15 to get °C.

## Step 1 — Country and palette
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
var COUNTRY = 'Samoa';
var aoi = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
            .filter(ee.Filter.eq('country_na', COUNTRY));
Map.centerObject(aoi, 9);
var tempPalette = ['313695','4575b4','74add1','abd9e9','fee090','f46d43','d73027','a50026'];
```

## Step 2 — Where is it hottest? (MODIS land surface temperature)
```javascript
var modisLST = ee.ImageCollection('MODIS/061/MOD11A1')
  .select('LST_Day_1km')
  .filter(ee.Filter.date('2024-01-01', '2025-01-01'))
  .mean()
  .multiply(0.02)      // MODIS scale factor -> Kelvin
  .subtract(273.15)    // Kelvin -> Celsius
  .clip(aoi);
Map.addLayer(modisLST, {min: 20, max: 40, palette: tempPalette},
             'Mean daytime land surface temp 2024 (°C)');
```
Run it. Towns, cleared land and airports usually glow hot; forest and
high ground stay cooler.

## Step 3 — The warming trend (ERA5 air temperature)
Build a yearly average air temperature and chart it with a trend line.
(ERA5 Monthly ends 2020-06, so the last full year is 2019.)
```javascript
var years = ee.List.sequence(1991, 2019);
var annualTemp = ee.ImageCollection.fromImages(
  years.map(function (y) {
    var img = ee.ImageCollection('ECMWF/ERA5/MONTHLY')
      .select('mean_2m_air_temperature')
      .filter(ee.Filter.calendarRange(y, y, 'year'))
      .mean().subtract(273.15);
    return img.set('system:time_start', ee.Date.fromYMD(y, 1, 1).millis());
  })
);
print(ui.Chart.image.series({
  imageCollection: annualTemp, region: aoi,
  reducer: ee.Reducer.mean(), scale: 28000
}).setOptions({
  title: 'Average annual air temperature over ' + COUNTRY,
  vAxis: {title: '°C'}, hAxis: {title: 'Year'},
  trendlines: {0: {color: 'red'}}, lineWidth: 2, pointSize: 3,
  legend: {position: 'none'}
}));
```
The **red trend line** sloping upward is the warming signal. Note roughly
how much warmer the last few years are than the early 1990s.

## Step 4 — A warming map (recent decade minus earlier decade)
```javascript
function decadeMean(y1, y2) {
  return ee.ImageCollection('ECMWF/ERA5/MONTHLY')
    .select('mean_2m_air_temperature')
    .filter(ee.Filter.date(y1 + '-01-01', (y2 + 1) + '-01-01')).mean();
}
var warming = decadeMean(2010, 2019).subtract(decadeMean(1991, 2000)).clip(aoi);
Map.addLayer(warming, {min: -1, max: 1,
  palette: ['2166ac','67a9cf','d1e5f0','f7f7f7','fddbc7','ef8a62','b2182b']},
  'Warming 2010-2019 minus 1991-2000 (°C)');
```
Red = areas that have warmed.

---

> **Country names:** to run this for *any* nation (including atolls), use
> the full script
> [`scripts/javascript/02_temperature_era5_modis.js`](../scripts/javascript.md)
> and set `COUNTRY` to the friendly name — its built-in selector handles the
> boundary-vs-buffer choice for you (see
> [Exercise 2](code-editor.md) for why this matters).

## Your turn
1. Change `COUNTRY` and re-run.
2. Change the MODIS year to an **El Niño year** (e.g. 2016) and compare.
3. Use the **Inspector** to click a town vs. a forest and read the LST
   difference.

## Check — did it work?
✅ A MODIS heat map of your country (hot spots visible).
✅ An air-temperature chart with an upward red trend line.
✅ A warming-difference map (mostly red).

**Next:** [Exercise 5 — Ocean, reefs & coast (capstone)](ocean-coast.md)
