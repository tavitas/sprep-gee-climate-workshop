/**********************************************************************
 * 02_temperature_era5_modis.js   —  TEMPERATURE & HEAT
 * SPREP / UNEP GEE Climate Workshop 2026
 *
 * GOAL: Show (a) where it is hottest in your country, and
 *       (b) the long-term warming trend in air temperature.
 *
 * DATASETS:
 *   - ERA5-Land Daily Aggregated (ECMWF/ERA5_LAND/DAILY_AGGR)
 *       'temperature_2m' = 2 m air temperature in KELVIN, ~11 km, 1950-present.
 *   - MODIS Land Surface Temperature (MODIS/061/MOD11A1)
 *       'LST_Day_1km' = daytime surface temp, scale 0.02, KELVIN, ~1 km.
 *
 * TO LOCALISE: change COUNTRY below.
 **********************************************************************/

// ===== 1. COUNTRY SELECTOR (works for every Pacific nation) =========
var COUNTRY = 'Samoa';
var LSIB_NAMES = {
  'Fiji':'Fiji', 'Papua New Guinea':'Papua New Guinea', 'Solomon Islands':'Solomon Is',
  'Vanuatu':'Vanuatu', 'Samoa':'Samoa', 'New Caledonia':'New Caledonia (Fr)'};
var POINT_AOI = {
  'Tonga':[-174.8,-20.0,300000], 'Palau':[134.58,7.5,120000], 'Tuvalu':[178.5,-7.8,350000],
  'Kiribati':[173.0,1.4,500000], 'Nauru':[166.93,-0.52,40000], 'Niue':[-169.87,-19.05,40000],
  'Cook Islands':[-159.78,-21.23,300000], 'Marshall Islands':[169.0,8.0,600000],
  'Federated States of Micronesia':[158.21,6.92,500000], 'Tokelau':[-171.85,-9.2,60000]};
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
Map.centerObject(aoi, 9);

var tempPalette = ['313695','4575b4','74add1','abd9e9','fee090','f46d43','d73027','a50026'];

// ===== 2. WHERE IS IT HOTTEST?  (MODIS land surface temperature) ===
var modisLST = ee.ImageCollection('MODIS/061/MOD11A1')
  .select('LST_Day_1km')
  .filter(ee.Filter.date('2024-01-01', '2025-01-01'))
  .mean()
  .multiply(0.02)        // MODIS scale factor -> Kelvin
  .subtract(273.15)      // Kelvin -> Celsius
  .clip(aoi);
Map.addLayer(modisLST, {min: 20, max: 40, palette: tempPalette},
             'Mean daytime land surface temp 2024 (°C)');

// ===== 3. WARMING TREND (ERA5-Land air temperature) ================
var START_YEAR = 1991;
var END_YEAR   = 2024;
var years = ee.List.sequence(START_YEAR, END_YEAR);

var annualMeanTemp = ee.ImageCollection.fromImages(
  years.map(function (y) {
    var img = ee.ImageCollection('ECMWF/ERA5_LAND/DAILY_AGGR')
      .select('temperature_2m')
      .filter(ee.Filter.calendarRange(y, y, 'year'))
      .mean()
      .subtract(273.15);   // Kelvin -> Celsius
    return img.set('year', y).set('system:time_start', ee.Date.fromYMD(y, 1, 1).millis());
  })
);

print(ui.Chart.image.series({
  imageCollection: annualMeanTemp, region: aoi,
  reducer: ee.Reducer.mean(), scale: 11000
}).setOptions({
  title: 'Average annual air temperature over ' + COUNTRY + ' (' + START_YEAR + '-' + END_YEAR + ')',
  vAxis: {title: 'Temperature (°C)'}, hAxis: {title: 'Year'},
  trendlines: {0: {color: 'red', visibleInLegend: true}},
  lineWidth: 2, pointSize: 3, legend: {position: 'none'}
}));

// ===== 4. WARMING MAP: recent decade minus earlier decade ==========
function decadeMean(y1, y2) {
  return ee.ImageCollection('ECMWF/ERA5_LAND/DAILY_AGGR')
    .select('temperature_2m')
    .filter(ee.Filter.date(y1 + '-01-01', (y2 + 1) + '-01-01')).mean();
}
var warming = decadeMean(2015, 2024).subtract(decadeMean(1991, 2000)).clip(aoi);
Map.addLayer(warming, {min: -1, max: 1,
  palette: ['2166ac','67a9cf','d1e5f0','f7f7f7','fddbc7','ef8a62','b2182b']},
  'Warming: 2015-2024 minus 1991-2000 (°C)');

Map.addLayer(outline.style({color: 'black', fillColor: '00000000', width: 1}), {}, COUNTRY + ' outline');

// ===== 5. EXPORT (optional) ========================================
Export.image.toDrive({
  image: modisLST,
  description: COUNTRY.replace(/[ ,]/g, '_') + '_MODIS_LST_2024',
  folder: 'GEE_Workshop_2026',
  fileNamePrefix: COUNTRY.replace(/[ ,]/g, '_') + '_modis_lst_2024',
  scale: 1000, region: aoi.bounds(), maxPixels: 1e13
});
