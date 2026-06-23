/**********************************************************************
 * 99_diagnostic_check.js   —  ONE-TIME LIVE CHECK
 * SPREP / UNEP GEE Climate Workshop 2026
 *
 * RUN THIS ONCE after you sign in (Exercise 1) to confirm, live in your
 * own account, that:
 *   (A) which Pacific country names exist as polygons in LSIB_SIMPLE, and
 *   (B) every climate dataset used in the workshop loads correctly.
 *
 * HOW: paste the whole file into https://code.earthengine.google.com and
 * click Run. Read the results in the Console on the right. Nothing is
 * exported or changed — it only prints.
 **********************************************************************/

print('===== PACIFIC GEE WORKSHOP — DIAGNOSTIC =====');

// ---------- (A) Which country names exist in LSIB_SIMPLE/2017? ----------
var LSIB = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');

// Friendly name -> exact 'country_na' we expect in the dataset.
var EXPECTED = {
  'Fiji':'Fiji', 'Papua New Guinea':'Papua New Guinea', 'Solomon Islands':'Solomon Is',
  'Vanuatu':'Vanuatu', 'Samoa':'Samoa', 'New Caledonia':'New Caledonia (Fr)',
  'Tonga':'Tonga', 'Palau':'Palau', 'Kiribati':'Kiribati', 'Nauru':'Nauru',
  'Tuvalu':'Tuvalu', 'Niue':'Niue (NZ)', 'Cook Islands':'Cook Is (NZ)',
  'Marshall Islands':'Marshall Is', 'Federated States of Micronesia':'Micronesia, Fed States of',
  'Tokelau':'Tokelau (NZ)', 'American Samoa':'American Samoa (US)'
};

print('--- (A) LSIB_SIMPLE polygon check (feature count per country) ---');
Object.keys(EXPECTED).forEach(function (friendly) {
  var na = EXPECTED[friendly];
  var n = LSIB.filter(ee.Filter.eq('country_na', na)).size();
  // A count of 0 means: NOT in LSIB_SIMPLE -> use the point+buffer method.
  print(friendly + "  ->  country_na '" + na + "'  features:", n);
});

// ---------- (B) Does every dataset load? ----------
print('--- (B) Dataset access check (band names should print) ---');

print('CHIRPS rainfall:',
  ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY').first().bandNames());
print('ERA5-Land air temp:',
  ee.ImageCollection('ECMWF/ERA5_LAND/DAILY_AGGR').first().bandNames());
print('MODIS LST:',
  ee.ImageCollection('MODIS/061/MOD11A1').first().bandNames());
print('NOAA OISST:',
  ee.ImageCollection('NOAA/CDR/OISST/V2_1').first().bandNames());
print('NASADEM elevation:',
  ee.Image('NASA/NASADEM_HGT/001').bandNames());
print('JRC Global Surface Water:',
  ee.Image('JRC/GSW1_4/GlobalSurfaceWater').bandNames());

print('===== If every band list printed and you noted the LSIB counts, ' +
      'all workshop datasets are reachable from your account. =====');
