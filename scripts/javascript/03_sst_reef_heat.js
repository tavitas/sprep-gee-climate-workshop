/**********************************************************************
 * 03_sst_reef_heat.js   —  OCEAN, SEA SURFACE TEMPERATURE & REEF HEAT
 * SPREP / UNEP GEE Climate Workshop 2026
 *
 * GOAL: Map sea surface temperature (SST) around your islands and chart
 *       SST anomalies — the warm spikes that drive coral bleaching.
 *
 * DATASET: NOAA CDR OISST v2.1  (NOAA/CDR/OISST/V2_1)
 *   - Daily, 0.25°, global ocean, 1981-present.
 *   - Band 'sst'  = sea surface temp, scale 0.01 -> °C
 *   - Band 'anom' = SST anomaly vs climatology, scale 0.01 -> °C
 *
 * This uses an OCEAN area (a buffer around the country), so it works the
 * same for high islands and atolls.
 **********************************************************************/

// ===== 1. COUNTRY SELECTOR -> OCEAN AREA ============================
var COUNTRY = 'Fiji';
var LSIB_NAMES = {
  'Fiji':'Fiji', 'Papua New Guinea':'Papua New Guinea', 'Solomon Islands':'Solomon Is',
  'Vanuatu':'Vanuatu', 'Samoa':'Samoa'};
var POINT_AOI = {
  'Tonga':[-174.8,-20.0,300000], 'Palau':[134.58,7.5,120000], 'Tuvalu':[178.5,-7.8,350000],
  'Kiribati':[173.0,1.4,500000], 'Nauru':[166.93,-0.52,40000], 'Niue':[-169.87,-19.05,40000],
  'Cook Islands':[-159.78,-21.23,300000], 'Marshall Islands':[169.0,8.0,600000],
  'Federated States of Micronesia':[158.21,6.92,500000]};
var land;
if (LSIB_NAMES[COUNTRY]) {
  land = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
           .filter(ee.Filter.eq('country_na', LSIB_NAMES[COUNTRY])).geometry();
} else {
  var pt = POINT_AOI[COUNTRY];
  land = ee.Geometry.Point([pt[0], pt[1]]).buffer(pt[2]);
}
// Ocean area of interest = land bounding box grown by ~150 km.
var ocean = land.bounds().buffer(150000);
Map.centerObject(ocean, 7);

var sstPalette  = ['000080','0000ff','00ffff','ffff00','ff8000','ff0000','800000'];
var anomPalette = ['2166ac','67a9cf','d1e5f0','f7f7f7','fddbc7','ef8a62','b2182b'];

// ===== 2. RECENT MEAN SST =========================================
var oisst = ee.ImageCollection('NOAA/CDR/OISST/V2_1');
var meanSST = oisst.select('sst')
  .filter(ee.Filter.date('2024-01-01', '2025-01-01'))
  .mean().multiply(0.01).clip(ocean);          // scale 0.01 -> °C
Map.addLayer(meanSST, {min: 24, max: 31, palette: sstPalette}, 'Mean SST 2024 (°C)');

// ===== 3. WARM-SEASON SST ANOMALY (bleaching risk snapshot) ========
var meanAnom = oisst.select('anom')
  .filter(ee.Filter.date('2024-01-01', '2024-04-01'))   // Pacific warm season
  .mean().multiply(0.01).clip(ocean);
Map.addLayer(meanAnom, {min: -2, max: 2, palette: anomPalette},
             'SST anomaly Jan-Mar 2024 (°C vs normal)');

// ===== 4. TIME SERIES: monthly SST anomaly (the bleaching signal) ==
var startMonth = ee.Date('2015-01-01');
var nMonths = ee.Date(Date.now()).difference(startMonth, 'month').floor();
var monthlyAnom = ee.ImageCollection.fromImages(
  ee.List.sequence(0, nMonths).map(function (m) {
    var t0 = startMonth.advance(m, 'month');
    return oisst.select('anom')
      .filter(ee.Filter.date(t0, t0.advance(1, 'month')))
      .mean().multiply(0.01).set('system:time_start', t0.millis());
  })
);
print(ui.Chart.image.series({
  imageCollection: monthlyAnom, region: ocean,
  reducer: ee.Reducer.mean(), scale: 25000
}).setOptions({
  title: 'Monthly sea surface temperature anomaly around ' + COUNTRY + ' (2015-present)',
  vAxis: {title: 'SST anomaly (°C vs normal)'}, hAxis: {title: 'Date'},
  lineWidth: 1.5, series: {0: {color: 'b2182b'}}, legend: {position: 'none'}
}));
print('Tip: anomalies sustained above +1°C for weeks indicate coral bleaching heat stress.');

// ===== 5. EXPORT (optional) ========================================
Export.image.toDrive({
  image: meanSST,
  description: COUNTRY.replace(/[ ,]/g, '_') + '_MeanSST_2024',
  folder: 'GEE_Workshop_2026',
  fileNamePrefix: COUNTRY.replace(/[ ,]/g, '_') + '_mean_sst_2024',
  scale: 25000, region: ocean.bounds(), maxPixels: 1e13
});
