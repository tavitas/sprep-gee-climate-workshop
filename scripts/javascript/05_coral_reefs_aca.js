/**********************************************************************
 * 05_coral_reefs_aca.js   —  CORAL REEF HABITATS (Allen Coral Atlas)
 * SPREP / UNEP GEE Climate Workshop 2026
 *
 * GOAL: Map the coral reefs and seafloor habitats around YOUR islands —
 *       where the coral, seagrass, sand and reef structures are — and
 *       measure how much coral habitat your country has.
 *
 * DATASET: Allen Coral Atlas (ACA/reef_habitat/v2_0)
 *   A single ee.Image at 5 m, mapped from satellite imagery 2018-2021.
 *   Bands used here:
 *     'benthic'    seafloor cover: Sand, Rubble, Rock, Seagrass,
 *                  Coral/Algae, Microalgal Mats
 *     'geomorphic' reef zone: reef flat, crest, slope, lagoon, patch reef...
 *     'reef_mask'  1 = reef, 0 = not reef
 *   Coverage is the world's shallow tropical reefs — excellent for the
 *   Pacific (verified live for every SPREP country, June 2026).
 *
 * TO LOCALISE: change COUNTRY below.
 **********************************************************************/

// ===== 1. COUNTRY SELECTOR -> REEF AREA ============================
// Larger high islands use the real LSIB boundary; small / atoll nations &
// territories use a point + buffer. The reef area is the coastline grown by
// ~25 km so we capture the fringing and barrier reefs offshore.
var COUNTRY = 'Fiji';   // reef-rich examples: Fiji, Papua New Guinea, Solomon Islands, Palau, Kiribati
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
var aoi = land.bounds().buffer(25000);   // reef area = coastline + ~25 km
Map.centerObject(aoi, 9);

// ===== 2. LOAD THE ALLEN CORAL ATLAS ===============================
var aca = ee.Image('ACA/reef_habitat/v2_0').clip(aoi);

// ===== 3. BENTHIC HABITAT MAP (what the seafloor is made of) =======
// The classes are non-sequential codes, so we remap them to 1-6 for a clean
// palette. selfMask() hides everything that is not mapped reef.
var benthicNames  = ['Sand', 'Rubble', 'Rock', 'Seagrass', 'Coral/Algae', 'Microalgal mats'];
var benthicColors = ['ffffbe', 'e0d05e', 'b19c3a', '668438', 'ff6161', '9bcc4f'];
var benthic = aca.select('benthic')
  .remap([11, 12, 13, 14, 15, 18], [1, 2, 3, 4, 5, 6]).selfMask();
Map.addLayer(benthic, {min: 1, max: 6, palette: benthicColors}, 'Benthic habitat');

// ===== 4. GEOMORPHIC ZONES (the shape/structure of the reef) =======
var geoColors = ['77d0fc','2ca2f9','c5a7cb','92739d','614272','fbdefb',
                 '10bda6','288471','cd6812','befbff','ffba15'];
var geomorphic = aca.select('geomorphic')
  .remap([11,12,13,14,15,16,21,22,23,24,25], [1,2,3,4,5,6,7,8,9,10,11]).selfMask();
Map.addLayer(geomorphic, {min: 1, max: 11, palette: geoColors},
             'Geomorphic zones', false);   // off by default — tick it on to view

// ===== 5. LEGEND for the benthic habitat map =======================
var legend = ui.Panel({style: {position: 'bottom-left', padding: '8px', backgroundColor: 'white'}});
legend.add(ui.Label('Benthic habitat', {fontWeight: 'bold', margin: '0 0 4px 0'}));
benthicNames.forEach(function (name, i) {
  legend.add(ui.Panel(
    [ui.Label('', {backgroundColor: '#' + benthicColors[i], padding: '8px', margin: '2px'}),
     ui.Label(name, {margin: '3px 6px'})],
    ui.Panel.Layout.flow('horizontal')));
});
Map.add(legend);

// ===== 6. HOW MUCH CORAL? (habitat area in km²) ====================
var km2 = ee.Image.pixelArea().divide(1e6);
function classAreaKm2(value) {
  return km2.updateMask(aca.select('benthic').eq(value)).reduceRegion({
    reducer: ee.Reducer.sum(), geometry: aoi, scale: 30, maxPixels: 1e12, bestEffort: true
  }).get('area');
}
print('Coral/Algae habitat in ' + COUNTRY + ' (km²):', classAreaKm2(15));
print('Seagrass habitat in ' + COUNTRY + ' (km²):',     classAreaKm2(14));
print('Total mapped reef in ' + COUNTRY + ' (km²):',
  km2.updateMask(aca.select('benthic').gt(0)).reduceRegion({
    reducer: ee.Reducer.sum(), geometry: aoi, scale: 30, maxPixels: 1e12, bestEffort: true}).get('area'));

// ===== 7. EXPORT the benthic habitat map (optional) ================
// 5 m native; export at 10 m to keep the file manageable (raise `scale` if it
// is too large, or shrink the buffer in step 1 to a single island).
Export.image.toDrive({
  image: aca.select('benthic'),
  description: COUNTRY.replace(/[ ,]/g, '_') + '_ACA_Benthic',
  folder: 'GEE_Workshop_2026',
  fileNamePrefix: COUNTRY.replace(/[ ,]/g, '_') + '_aca_benthic',
  scale: 10, region: aoi.bounds(), maxPixels: 1e13
});
