/**********************************************************************
 * 00_pacific_helpers.js
 * SPREP / UNEP — Regional Capacity Building on GIS & Data Management 2026
 * Reusable helpers for the Google Earth Engine climate workshop.
 *
 * HOW TO USE
 * ----------
 * Copy the blocks you need into your own script. The key function is
 * getCountry('Fiji') which returns an area of interest (AOI) for any of
 * the 14 SPREP member countries.
 *
 * SCOPE (2026): the 14 independent SPREP member countries —
 *   Cook Islands, Federated States of Micronesia, Fiji, Kiribati, Marshall
 *   Islands, Nauru, Niue, Palau, Papua New Guinea, Samoa, Solomon Islands,
 *   Tonga, Tuvalu, Vanuatu.
 *
 * IMPORTANT — why two AOI methods? (validated live, June 2026)
 * The global boundary layer USDOS/LSIB_SIMPLE/2017 uses US State Department
 * spellings (e.g. it stores 'Solomon Is', not 'Solomon Islands') and its
 * polygons for tiny atoll nations are imprecise. So:
 *   • Larger high islands  -> we use the real LSIB outline.
 *   • Small / atoll nations -> we use a point + buffer (a circle) that
 *     always works for clipping gridded data.
 * getCountry() handles both automatically.
 **********************************************************************/

// ---------------------------------------------------------------
// 1. PACIFIC COUNTRY AREAS OF INTEREST (14 SPREP member countries)
// ---------------------------------------------------------------
var LSIB = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');

// Larger high islands -> use the real LSIB polygon.
// KEY = the friendly name you type;  VALUE = the exact 'country_na' string.
var LSIB_NAMES = {
  'Fiji': 'Fiji',
  'Papua New Guinea': 'Papua New Guinea',
  'Solomon Islands': 'Solomon Is',          // note the State Dept spelling
  'Vanuatu': 'Vanuatu',
  'Samoa': 'Samoa'
};

// Small / low-lying / scattered nations -> point + buffer.
// [longitude, latitude, buffer_radius_in_metres] centred on the main group.
var POINT_AOI = {
  'Tonga':           [-174.80, -20.00, 300000],
  'Palau':           [ 134.58,   7.50, 120000],
  'Tuvalu':          [ 178.50,  -7.80, 350000],
  'Kiribati':        [ 173.00,   1.40, 500000],   // Gilbert group (very spread nation)
  'Nauru':           [ 166.93,  -0.52,  40000],
  'Niue':            [-169.87, -19.05,  40000],
  'Cook Islands':    [-159.78, -21.23, 300000],   // southern group
  'Marshall Islands':[ 169.00,   8.00, 600000],
  'Federated States of Micronesia': [158.21, 6.92, 500000]  // centred on Pohnpei
};

/**
 * Return a Pacific country area of interest as an ee.Geometry.
 * Works for every member country: LSIB outline where available, else point+buffer.
 * @param {string} name  friendly name, e.g. 'Samoa', 'Solomon Islands', 'Tuvalu'
 * @return {ee.Geometry}
 */
function getCountry(name) {
  if (LSIB_NAMES.hasOwnProperty(name)) {
    return LSIB.filter(ee.Filter.eq('country_na', LSIB_NAMES[name])).geometry();
  }
  if (POINT_AOI.hasOwnProperty(name)) {
    var p = POINT_AOI[name];
    return ee.Geometry.Point([p[0], p[1]]).buffer(p[2]);
  }
  throw 'Unknown country: ' + name +
        '. Add it to LSIB_NAMES (with its exact country_na) or POINT_AOI.';
}

/**
 * Return a FeatureCollection to draw as the country's outline.
 * For LSIB nations this is the true boundary; for point+buffer nations it
 * is the circle, so Map.addLayer(getOutline(name)) always shows something.
 * @param {string} name
 * @return {ee.FeatureCollection}
 */
function getOutline(name) {
  if (LSIB_NAMES.hasOwnProperty(name)) {
    return LSIB.filter(ee.Filter.eq('country_na', LSIB_NAMES[name]));
  }
  return ee.FeatureCollection([ee.Feature(getCountry(name))]);
}

// ---------------------------------------------------------------
// 1b. AIR-TEMPERATURE SOURCE (validated live, June 2026)
// ---------------------------------------------------------------
// ERA5-Land (11 km, to present) is a LAND-ONLY reanalysis and returns NO
// data over the smallest atoll nations. Those countries use the global ERA5
// reanalysis (27 km, ends mid-2020) instead, which includes the ocean.
var TEMP_GLOBAL = {
  'Cook Islands': 1, 'Kiribati': 1, 'Marshall Islands': 1, 'Nauru': 1,
  'Niue': 1, 'Tonga': 1, 'Tuvalu': 1
};

/**
 * Return the air-temperature dataset config to use for a country.
 * @param {string} name
 * @return {{collection:string, band:string, scale:number, endYear:number, recentStart:number}}
 */
function getTempSource(name) {
  if (TEMP_GLOBAL.hasOwnProperty(name)) {
    return {collection: 'ECMWF/ERA5/MONTHLY', band: 'mean_2m_air_temperature',
            scale: 27000, endYear: 2019, recentStart: 2010};   // global, to 2020
  }
  return {collection: 'ECMWF/ERA5_LAND/DAILY_AGGR', band: 'temperature_2m',
          scale: 11000, endYear: 2024, recentStart: 2015};     // land, to present
}

// ---------------------------------------------------------------
// 2. A SIMPLE MAP LEGEND (continuous colour bar)
// ---------------------------------------------------------------
function addLegend(title, palette, min, max) {
  var bar = ui.Thumbnail({
    image: ee.Image.pixelLonLat().select(0),
    params: {bbox: [0, 0, 1, 0.1], dimensions: '200x20', format: 'png',
             min: 0, max: 1, palette: palette},
    style: {stretch: 'horizontal', margin: '0 8px', maxHeight: '20px'}
  });
  var labels = ui.Panel({
    widgets: [ui.Label(min, {margin: '4px 8px'}),
              ui.Label('', {margin: '4px 8px', textAlign: 'center', stretch: 'horizontal'}),
              ui.Label(max, {margin: '4px 8px'})],
    layout: ui.Panel.Layout.flow('horizontal')
  });
  Map.add(ui.Panel({
    widgets: [ui.Label(title, {fontWeight: 'bold', margin: '4px 8px'}), bar, labels],
    style: {position: 'bottom-left', padding: '8px', backgroundColor: 'white'}
  }));
}

// ---------------------------------------------------------------
// 3. SHARED COLOUR PALETTES
// ---------------------------------------------------------------
var PALETTES = {
  rainfall:    ['ffffcc','c7e9b4','7fcdbb','41b6c4','1d91c0','225ea8','0c2c84'],
  temperature: ['313695','4575b4','74add1','abd9e9','fee090','f46d43','d73027','a50026'],
  sst:         ['000080','0000ff','00ffff','ffff00','ff8000','ff0000','800000'],
  anomaly:     ['2166ac','67a9cf','d1e5f0','f7f7f7','fddbc7','ef8a62','b2182b'],
  elevation:   ['d73027','fc8d59','fee08b','d9ef8b','91cf60','1a9850']
};

// ---------------------------------------------------------------
// 4. CONVENIENCE FUNCTIONS
// ---------------------------------------------------------------
function kelvinToC(img) {
  return img.subtract(273.15).copyProperties(img, img.propertyNames());
}
function showBands(image, label) { print(label || 'Bands:', image.bandNames()); }

// ---------------------------------------------------------------
// QUICK DEMO (delete when copying into your script)
// ---------------------------------------------------------------
var demo = getCountry('Samoa');
Map.centerObject(demo, 9);
Map.addLayer(getOutline('Samoa'), {color: 'red'}, 'Samoa outline (demo)');
print('Helpers loaded. Try getCountry("Solomon Islands") or getCountry("Tuvalu").');
