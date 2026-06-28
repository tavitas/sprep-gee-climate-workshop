# Exercise 3 — Coral Reef Habitats

**Goal:** Map the coral reefs around **your own islands** — where the coral,
seagrass, sand and reef structures are — and measure how much coral habitat
your country has. This is a great first map because reefs are central to
Pacific food security, coastal protection and tourism.

**Dataset:** Allen Coral Atlas (`ACA/reef_habitat/v2_0`), 5 m, mapped
2018–2021. **Companion script:**
[`05_coral_reefs_aca`](../scripts/javascript.md)

**Time:** ~25 minutes · **Before you start:** finish Exercise 2.

---

## The idea
The **Allen Coral Atlas** mapped the world's shallow tropical reefs from
satellite imagery at 5 m. For the Pacific it gives two views of every reef:

- **Benthic habitat** — what the seafloor is made of: *Coral/Algae, Seagrass,
  Sand, Rubble, Rock, Microalgal mats*.
- **Geomorphic zones** — the shape of the reef: *reef flat, reef crest, reef
  slope, lagoon, patch reef*, and so on.

It is a single image, so there is no date range to filter — you just clip it to
your country and display it.

## Step 1 — Set up your reef area
Reefs sit just offshore, so we grow the coastline outward by ~25 km.
```javascript
// IMPORTANT — in this simplified snippet, COUNTRY must match the boundary
// layer's EXACT spelling (US State Dept names). The 14 SPREP members are:
//   'Fiji'   'Papua New Guinea'   'Vanuatu'   'Samoa'   'Tonga'   'Tuvalu'
//   'Kiribati'   'Nauru'   'Niue'   'Palau'
//   'Solomon Is'                <- NOT 'Solomon Islands'
//   'Cook Is'                   <- NOT 'Cook Islands'
//   'Marshall Is'               <- NOT 'Marshall Islands'
//   'Fed States of Micronesia'  <- NOT 'FSM' or 'Micronesia'
// Reef-rich examples: 'Fiji', 'Papua New Guinea', 'Solomon Is', 'Palau', 'Cook Is'.
// (The full downloadable script accepts the plain name, e.g. 'Cook Islands'.)
var COUNTRY = 'Fiji';
var land = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
             .filter(ee.Filter.eq('country_na', COUNTRY));
var aoi = land.geometry().bounds().buffer(25000);
Map.centerObject(aoi, 9);
```

## Step 2 — Load the Allen Coral Atlas
```javascript
var aca = ee.Image('ACA/reef_habitat/v2_0').clip(aoi);
print('Bands:', aca.bandNames());   // geomorphic, benthic, reef_mask
```

## Step 3 — Map the benthic habitat
The habitat classes use non-sequential codes, so we **remap** them to 1–6 to
give them a clean colour palette. `selfMask()` hides everything that is not
mapped reef.
```javascript
var benthicColors = ['ffffbe','e0d05e','b19c3a','668438','ff6161','9bcc4f'];
//                    Sand     Rubble   Rock     Seagrass Coral    Microalgae
var benthic = aca.select('benthic')
  .remap([11, 12, 13, 14, 15, 18], [1, 2, 3, 4, 5, 6]).selfMask();
Map.addLayer(benthic, {min: 1, max: 6, palette: benthicColors}, 'Benthic habitat');
```
Run it. The red (`Coral/Algae`) and green (`Seagrass`) patches are the living
habitat; the pale yellows are sand and rubble.

## Step 4 — Add the geomorphic zones
```javascript
var geoColors = ['77d0fc','2ca2f9','c5a7cb','92739d','614272','fbdefb',
                 '10bda6','288471','cd6812','befbff','ffba15'];
var geomorphic = aca.select('geomorphic')
  .remap([11,12,13,14,15,16,21,22,23,24,25], [1,2,3,4,5,6,7,8,9,10,11]).selfMask();
Map.addLayer(geomorphic, {min: 1, max: 11, palette: geoColors}, 'Geomorphic zones');
```
Use the **Layers** button (top-right of the map) to switch between the two and
compare habitat with structure.

## Step 5 — How much coral habitat? (area in km²)
```javascript
var km2 = ee.Image.pixelArea().divide(1e6);
function classArea(value) {
  return km2.updateMask(aca.select('benthic').eq(value)).reduceRegion({
    reducer: ee.Reducer.sum(), geometry: aoi, scale: 30, maxPixels: 1e12, bestEffort: true
  }).get('area');
}
print('Coral/Algae habitat (km²):', classArea(15));
print('Seagrass habitat (km²):',    classArea(14));
```
How much living coral habitat does your country have? Compare it with a
neighbour's.

## Step 6 — Export your reef map (optional)
```javascript
Export.image.toDrive({
  image: aca.select('benthic'),
  description: COUNTRY.replace(/[ ,]/g, '_') + '_ACA_Benthic',   // no spaces allowed
  folder: 'GEE_Workshop_2026',
  scale: 10,
  region: aoi.bounds(),
  maxPixels: 1e13
});
```
Open the **Tasks** tab and click **Run**. The GeoTIFF lands in your Google
Drive — open it in QGIS or ArcGIS to combine with your own reef surveys.

---

> **Country names:** the simplified snippet above filters the boundary layer
> directly, so it needs the exact LSIB spelling (e.g. `Solomon Is`, not
> `Solomon Islands`) — see [Exercise 2](code-editor.md). For **any** nation,
> use the full script
> [`scripts/javascript/05_coral_reefs_aca.js`](../scripts/javascript.md): just
> set `COUNTRY` to the friendly name and its selector picks the right reef area.

## Your turn
1. Change `COUNTRY` to your country and re-run.
2. Use the **Inspector** to click a reef and read its benthic and geomorphic
   class codes.
3. Add up `Coral/Algae` + `Seagrass` to estimate your country's total **living**
   reef habitat.

## Check — did it work?
✅ A colourful benthic-habitat map clipped to your reefs (red = coral).
✅ A geomorphic-zones layer you can toggle on and off.
✅ Printed coral and seagrass areas in km².
✅ (Optional) an export task in the Tasks tab.

**Next:** [Exercise 4 — Rainfall & drought](rainfall.md)
