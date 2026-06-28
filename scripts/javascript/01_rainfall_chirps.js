/**********************************************************************
 * 01_rainfall_chirps.js   —  RAINFALL & DROUGHT
 * SPREP / UNEP GEE Climate Workshop 2026
 *
 * GOAL: Map long-term average rainfall for YOUR country and chart how
 *       rainfall has changed year to year (a simple drought signal).
 *
 * DATASET: GPM IMERG Monthly v07  (NASA/GPM_L3/IMERG_MONTHLY_V07)
 *   - Band 'precipitation' = monthly mean rain RATE in mm/HOUR, ~11 km,
 *     2000-present. We convert the rate to annual millimetres.
 *   - WHY NOT CHIRPS? CHIRPS has data holes over the far-western / small
 *     Pacific (e.g. Palau reads ~0 mm/yr, Tokelau is empty). IMERG is a
 *     satellite product with full Pacific ocean+island coverage, so the
 *     same script works for EVERY country. (Verified live, June 2026.)
 *
 * TO LOCALISE: change the COUNTRY value below to your nation.
 **********************************************************************/

// ===== 1. COUNTRY SELECTOR (works for every Pacific nation) =========
// Larger high islands use the real LSIB boundary (note the exact spellings).
// Small / atoll nations & territories use a point + buffer.
var COUNTRY = 'Fiji';
var START_YEAR = 2001;
var END_YEAR   = 2020;            // 2001-2020 = 20-year climate normal (IMERG era)

var LSIB_NAMES = {
  'Fiji':'Fiji', 'Papua New Guinea':'Papua New Guinea', 'Solomon Islands':'Solomon Is',
  'Vanuatu':'Vanuatu', 'Samoa':'Samoa'};
var POINT_AOI = {
  'Tonga':[-174.8,-20.0,300000], 'Palau':[134.58,7.5,120000], 'Tuvalu':[178.5,-7.8,350000],
  'Kiribati':[173.0,1.4,500000], 'Nauru':[166.93,-0.52,40000], 'Niue':[-169.87,-19.05,40000],
  'Cook Islands':[-159.78,-21.23,300000], 'Marshall Islands':[169.0,8.0,600000],
  'Federated States of Micronesia':[158.21,6.92,500000]};
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

// ===== 2. LOAD & FILTER IMERG =====================================
// 'precipitation' is a monthly mean RATE in mm/hour. Multiply by the hours
// in a month (~730.5) to turn each monthly image into millimetres.
var HOURS_PER_MONTH = 730.5;     // 8766 hours/year ÷ 12
var imerg = ee.ImageCollection('NASA/GPM_L3/IMERG_MONTHLY_V07')
  .select('precipitation')
  .filter(ee.Filter.date(START_YEAR + '-01-01', (END_YEAR + 1) + '-01-01'));

// ===== 3. MEAN ANNUAL RAINFALL (climatology) ======================
// For each year, sum the 12 monthly totals to get annual mm, then average
// across all years.
var years = ee.List.sequence(START_YEAR, END_YEAR);
var annualTotals = ee.ImageCollection.fromImages(
  years.map(function (y) {
    return imerg.filter(ee.Filter.calendarRange(y, y, 'year'))
                .map(function (img) { return img.multiply(HOURS_PER_MONTH); })
                .sum().set('year', y);     // sum of 12 months = annual mm
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
  vAxis: {title: 'mm/year'}, hAxis: {title: 'Year'},
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
