/**********************************************************************
 * 01_rainfall_chirps.js   —  RAINFALL & DROUGHT
 * SPREP / UNEP GEE Climate Workshop 2026
 *
 * GOAL: Map long-term average rainfall for YOUR country and chart how
 *       rainfall has changed year to year (a simple drought signal).
 *
 * DATASET: CHIRPS Daily v2  (UCSB-CHG/CHIRPS/DAILY)
 *   - Band 'precipitation' (mm/day), ~5.5 km, 1981-present (verified to 2026).
 *   - NOTE (2026): CHIRPS v2 production ends after Dec 2026. The newer v3
 *     product is 'UCSB-CHC/CHIRPS/V3/DAILY_SAT'. v2 is used here because it
 *     gives a clean 1991-2020 climate normal.
 *
 * TO LOCALISE: change the COUNTRY value below to your nation.
 **********************************************************************/

// ===== 1. COUNTRY SELECTOR (works for every Pacific nation) =========
// Larger high islands use the real LSIB boundary (note the exact spellings).
// Small / atoll nations use a point + buffer, because LSIB_SIMPLE drops them.
var COUNTRY = 'Fiji';
var START_YEAR = 1991;
var END_YEAR   = 2020;            // 1991-2020 = standard 30-year climate normal

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
Map.centerObject(aoi, 8);

// ===== 2. LOAD & FILTER CHIRPS ====================================
var chirps = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
  .select('precipitation')
  .filter(ee.Filter.date(START_YEAR + '-01-01', (END_YEAR + 1) + '-01-01'));

// ===== 3. MEAN ANNUAL RAINFALL (climatology) ======================
var years = ee.List.sequence(START_YEAR, END_YEAR);
var annualTotals = ee.ImageCollection.fromImages(
  years.map(function (y) {
    return chirps.filter(ee.Filter.calendarRange(y, y, 'year')).sum().set('year', y);
  })
);
var meanAnnualRain = annualTotals.mean().clip(aoi);

// ===== 4. SHOW IT ON THE MAP ======================================
var rainPalette = ['ffffcc','c7e9b4','7fcdbb','41b6c4','1d91c0','225ea8','0c2c84'];
Map.addLayer(meanAnnualRain, {min: 1000, max: 4000, palette: rainPalette},
             'Mean annual rainfall ' + START_YEAR + '-' + END_YEAR + ' (mm)');
Map.addLayer(outline.style({color: 'black', fillColor: '00000000', width: 1}),
             {}, COUNTRY + ' outline');

// ===== 5. LEGEND ==================================================
var legend = ui.Panel({style: {position: 'bottom-left', padding: '8px', backgroundColor: 'white'}});
legend.add(ui.Label('Mean annual rainfall (mm)', {fontWeight: 'bold'}));
legend.add(ui.Thumbnail({
  image: ee.Image.pixelLonLat().select(0),
  params: {bbox: [0,0,1,0.1], dimensions: '200x18', format: 'png', min: 0, max: 1, palette: rainPalette},
  style: {stretch: 'horizontal', maxHeight: '18px'}}));
legend.add(ui.Panel(
  [ui.Label('1000', {margin: '2px 4px'}),
   ui.Label('4000+', {margin: '2px 4px', textAlign: 'right', stretch: 'horizontal'})],
  ui.Panel.Layout.flow('horizontal')));
Map.add(legend);

// ===== 6. YEAR-BY-YEAR RAINFALL CHART (drought signal) ============
var chart = ui.Chart.image.series({
  imageCollection: annualTotals.map(function (img) {
    return img.set('system:time_start', ee.Date.fromYMD(img.get('year'), 1, 1).millis());
  }),
  region: aoi, reducer: ee.Reducer.mean(), scale: 5000
}).setOptions({
  title: 'Total annual rainfall over ' + COUNTRY + ' (' + START_YEAR + '-' + END_YEAR + ')',
  vAxis: {title: 'Rainfall (mm/year)'}, hAxis: {title: 'Year', format: '####'},
  lineWidth: 2, pointSize: 4, legend: {position: 'none'}
});
print(chart);

// ===== 7. EXPORT THE MAP (optional) ===============================
Export.image.toDrive({
  image: meanAnnualRain,
  description: COUNTRY.replace(/[ ,]/g, '_') + '_MeanAnnualRainfall_' + START_YEAR + '_' + END_YEAR,
  folder: 'GEE_Workshop_2026',
  fileNamePrefix: COUNTRY.replace(/[ ,]/g, '_') + '_mean_annual_rainfall',
  scale: 5000, region: aoi.bounds(), maxPixels: 1e13
});
