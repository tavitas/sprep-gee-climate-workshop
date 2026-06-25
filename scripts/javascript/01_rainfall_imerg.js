/**********************************************************************
 * 01_rainfall_imerg.js   —  RAINFALL & DROUGHT
 * SPREP / UNEP GEE Climate Workshop 2026
 *
 * GOAL: Map long-term average rainfall for YOUR country and chart how
 *       rainfall has changed year to year (a simple drought signal).
 *
 * DATASET: GPM IMERG Monthly v07  (NASA/GPM_L3/IMERG_MONTHLY_V07)
 *   - Band 'precipitation' in mm/HOUR (monthly mean rate), ~11 km, 2000-present.
 *   - We convert each month to a millimetre total, then sum to annual totals.
 *
 * WHY IMERG, NOT CHIRPS? (validated live, June 2026)
 *   CHIRPS (~5.5 km) is widely used, but it has a data hole over Palau and
 *   parts of the far-western Pacific — it returns near-zero rainfall there.
 *   GPM IMERG is a true global satellite product (it includes the open ocean)
 *   and returns correct rainfall for all 14 SPREP member countries. The trade-
 *   off: IMERG starts in 2000, so the climate normal here is 2001-2020.
 *
 * TO LOCALISE: change the COUNTRY value below to your nation.
 **********************************************************************/

// ===== 1. COUNTRY SELECTOR (works for every SPREP member country) ===
// Larger high islands use the real LSIB boundary (note the exact spellings).
// Small / atoll nations use a point + buffer.
var COUNTRY = 'Fiji';
var START_YEAR = 2001;
var END_YEAR   = 2020;            // 2001-2020 = 20-year climate normal (IMERG starts 2000)

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

// ===== 2. LOAD IMERG & CONVERT mm/hr -> mm PER MONTH ==============
var imerg = ee.ImageCollection('NASA/GPM_L3/IMERG_MONTHLY_V07')
  .select('precipitation')
  .filter(ee.Filter.date(START_YEAR + '-01-01', (END_YEAR + 1) + '-01-01'));

// IMERG monthly 'precipitation' is a mean rate in mm/hour. Multiply by the
// number of hours in that month to get the month's total rainfall in mm.
var monthlyMM = imerg.map(function (img) {
  var start = ee.Date(img.get('system:time_start'));
  var days  = start.advance(1, 'month').difference(start, 'day');
  return img.multiply(24).multiply(days)          // mm/hr -> mm/month
            .set('system:time_start', img.get('system:time_start'))
            .set('year', start.get('year'));
});

// ===== 3. MEAN ANNUAL RAINFALL (climatology) ======================
var years = ee.List.sequence(START_YEAR, END_YEAR);
var annualTotals = ee.ImageCollection.fromImages(
  years.map(function (y) {
    return monthlyMM.filter(ee.Filter.calendarRange(y, y, 'year')).sum()
      .set('year', y)
      .set('system:time_start', ee.Date.fromYMD(y, 1, 1).millis());
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
  imageCollection: annualTotals,
  region: aoi, reducer: ee.Reducer.mean(), scale: 11000
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
  scale: 10000, region: aoi.bounds(), maxPixels: 1e13
});
