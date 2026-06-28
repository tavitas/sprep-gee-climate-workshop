/**********************************************************************
 * 04_coastal_exposure.js   —  SEA LEVEL & LOW-LYING COASTAL EXPOSURE
 * SPREP / UNEP GEE Climate Workshop 2026
 *
 * GOAL: Highlight the low-elevation land most exposed to sea-level rise
 *       and storm surge, and where surface water already sits.
 *
 * DATASETS:
 *   - NASADEM elevation (NASA/NASADEM_HGT/001), 'elevation' (metres, ~30 m)
 *   - JRC Global Surface Water (JRC/GSW1_4/GlobalSurfaceWater), 'occurrence' %
 *
 * NOTE: 30 m DEMs are coarse for very flat atolls, so treat this as an
 *       awareness / screening tool. Best results on the larger high islands
 *       (Samoa, Fiji, Vanuatu, Solomon Islands, PNG).
 *
 * TO LOCALISE: change COUNTRY below.
 **********************************************************************/

// ===== 1. COUNTRY SELECTOR =========================================
var COUNTRY      = 'Samoa';
var FLOOD_HEIGHT = 5;    // metres above sea level to flag as "low-lying"

var LSIB_NAMES = {
  'Fiji':'Fiji', 'Papua New Guinea':'Papua New Guinea', 'Solomon Islands':'Solomon Is',
  'Vanuatu':'Vanuatu', 'Samoa':'Samoa', 'New Caledonia':'New Caledonia'};
var POINT_AOI = {
  'Tonga':[-174.8,-20.0,300000], 'Palau':[134.58,7.5,120000], 'Tuvalu':[178.5,-7.8,350000],
  'Kiribati':[173.0,1.4,500000], 'Nauru':[166.93,-0.52,40000], 'Niue':[-169.87,-19.05,40000],
  'Cook Islands':[-159.78,-21.23,300000], 'Marshall Islands':[169.0,8.0,600000],
  'Federated States of Micronesia':[158.21,6.92,500000], 'Tokelau':[-171.85,-9.2,150000],
  'American Samoa':[-170.70,-14.30,60000], 'French Polynesia':[-149.5,-17.6,200000],
  'Guam':[144.79,13.44,60000], 'Northern Mariana Islands':[145.6,15.6,200000],
  'Wallis & Futuna':[-176.2,-13.3,80000]};
var aoi, outline;
if (LSIB_NAMES[COUNTRY]) {
  outline = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
              .filter(ee.Filter.eq('country_na', LSIB_NAMES[COUNTRY]));
  aoi = outline.geometry();
} else {
  var pt = POINT_AOI[COUNTRY];
  aoi = ee.Geometry.Point([pt[0], pt[1]]).buffer(pt[2]);
  outline = ee.FeatureCollection([ee.Feature(aoi)]);
}
Map.centerObject(aoi, 10);

// ===== 2. ELEVATION & LOW-LYING ZONE ==============================
var dem = ee.Image('NASA/NASADEM_HGT/001').select('elevation').clip(aoi);
var elevPalette = ['d73027','fc8d59','fee08b','d9ef8b','91cf60','1a9850'];
Map.addLayer(dem, {min: 0, max: 200, palette: elevPalette}, 'Elevation (m)');

var lowLying = dem.lte(FLOOD_HEIGHT).selfMask();   // ocean is masked (no data)
Map.addLayer(lowLying, {palette: ['ff0000']},
             'Land below ' + FLOOD_HEIGHT + ' m (most exposed)');

// ===== 3. EXISTING SURFACE WATER ==================================
var water = ee.Image('JRC/GSW1_4/GlobalSurfaceWater').select('occurrence').clip(aoi);
Map.addLayer(water.updateMask(water.gt(20)),
             {min: 0, max: 100, palette: ['c7e9b4','41b6c4','225ea8','0c2c84']},
             'Surface water occurrence 1984-2021 (%)');

// ===== 4. HOW MUCH LAND IS EXPOSED? (area in km²) ==================
var pixelAreaKm2 = ee.Image.pixelArea().divide(1e6);
print('Land area below ' + FLOOD_HEIGHT + ' m in ' + COUNTRY + ' (km²):',
  pixelAreaKm2.updateMask(lowLying).reduceRegion({
    reducer: ee.Reducer.sum(), geometry: aoi, scale: 30, maxPixels: 1e13}));
print('Total land area of ' + COUNTRY + ' (km²):',
  pixelAreaKm2.updateMask(dem.gte(-100)).reduceRegion({
    reducer: ee.Reducer.sum(), geometry: aoi, scale: 30, maxPixels: 1e13}));

Map.addLayer(outline.style({color: 'black', fillColor: '00000000', width: 1}), {}, COUNTRY + ' outline');

// ===== 5. EXPORT the low-lying zone (optional) =====================
Export.image.toDrive({
  image: lowLying.unmask(0),
  description: COUNTRY.replace(/[ ,]/g, '_') + '_LowLying_below' + FLOOD_HEIGHT + 'm',
  folder: 'GEE_Workshop_2026',
  fileNamePrefix: COUNTRY.replace(/[ ,]/g, '_') + '_lowlying_' + FLOOD_HEIGHT + 'm',
  scale: 30, region: aoi.bounds(), maxPixels: 1e13
});
