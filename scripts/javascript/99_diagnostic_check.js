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

// Friendly name -> exact 'country_na' in the dataset (verified live, June 2026).
// The 14 SPREP member countries — each ARE present in LSIB_SIMPLE and should
// report 1 feature.
var EXPECTED = {
  'Fiji':'Fiji', 'Papua New Guinea':'Papua New Guinea', 'Solomon Islands':'Solomon Is',
  'Vanuatu':'Vanuatu', 'Samoa':'Samoa',
  'Tonga':'Tonga', 'Palau':'Palau', 'Kiribati':'Kiribati', 'Nauru':'Nauru',
  'Tuvalu':'Tuvalu', 'Niue':'Niue', 'Cook Islands':'Cook Is',
  'Marshall Islands':'Marshall Is', 'Federated States of Micronesia':'Fed States of Micronesia'
};

print('--- (A) LSIB_SIMPLE polygon check (feature count per country) ---');
Object.keys(EXPECTED).forEach(function (friendly) {
  var na = EXPECTED[friendly];
  var n = LSIB.filter(ee.Filter.eq('country_na', na)).size();
  // Each should print 1. The scripts still use point+buffer for small/atoll
  // nations because the LSIB polygon is too coarse for the climate grids.
  print(friendly + "  ->  country_na '" + na + "'  features:", n);
});

// ---------- (B) Does every dataset load? ----------
print('--- (B) Dataset access check (band names should print) ---');

print('IMERG rainfall:',
  ee.ImageCollection('NASA/GPM_L3/IMERG_MONTHLY_V07').first().bandNames());
print('ERA5 air temp:',
  ee.ImageCollection('ECMWF/ERA5/MONTHLY').first().bandNames());
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
