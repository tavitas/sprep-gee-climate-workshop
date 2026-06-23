/**********************************************************************
 * 00_pacific_helpers.js
 * SPREP / UNEP — Regional Capacity Building on GIS & Data Management 2026
 * Reusable helpers for the Google Earth Engine climate workshop.
 *
 * HOW TO USE
 * ----------
 * Copy the blocks you need into your own script. The key function is
 * getCountry('Fiji') which returns an area of interest (AOI) for any
 * Pacific nation.
 *
 * IMPORTANT — why two methods? (verified June 2026)
 * The global boundary layer USDOS/LSIB_SIMPLE/2017 "excludes medium and
 * smaller islands" and uses US State Department spellings (e.g. it stores
 * 'Solomon Is', not 'Solomon Islands'). So:
 *   • Larger high islands  -> we use the real LSIB outline.
 *   • Small / atoll nations -> LSIB has no polygon, so we use a point +
 *     buffer (a circle) that always works for clipping gridded data.
 * getCountry() handles both automatically.
 **********************************************************************/

// ---------------------------------------------------------------
// 1. PACIFIC COUNTRY AREAS OF INTEREST
// ---------------------------------------------------------------
var LSIB = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');

// Larger high islands that HAVE a polygon in LSIB_SIMPLE/2017.
// KEY = the friendly name you type;  VALUE = the exact 'country_na' string.
var LSIB_NAMES = {
  'Fiji': 'Fiji',
  'Papua New Guinea': 'Papua New Guinea',
  'Solomon Islands': 'Solomon Is',          // note the State Dept spelling
  'Vanuatu': 'Vanuatu',
  'Samoa': 'Samoa',
  'New Caledonia': 'New Caledonia (Fr)'
};

// Small / low-lying / scattered nations that LSIB_SIMPLE drops.
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
  'Federated States of Micronesia': [158.21, 6.92, 500000], // centred on Pohnpei
  'Tokelau':         [-171.85,  -9.20,  60000],
  'American Samoa':  [-170.70, -14.30,  60000]
};

/**
 * Return a Pacific country area of interest as an ee.Geometry.
 * Works for every nation: LSIB outline where available, else point+buffer.
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
