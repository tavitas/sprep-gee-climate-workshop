/**********************************************************************
 * 99_diagnostic_check.js   —  ONE-TIME LIVE CHECK
 * SPREP / UNEP GEE Climate Workshop 2026
 *
 * RUN THIS ONCE after you sign in (Exercise 1) to confirm, live in your
 * own account, that:
 *   (A) the country selector resolves for all 14 SPREP member countries, and
 *   (B) every climate dataset used in the workshop loads correctly.
 *
 * HOW: paste the whole file into https://code.earthengine.google.com and
 * click Run. Read the results in the Console on the right. Nothing is
 * exported or changed — it only prints.
 **********************************************************************/

print('===== PACIFIC GEE WORKSHOP — DIAGNOSTIC (14 SPREP members) =====');

// ---------- (A) Country selector resolves for all 14? ----------
var LSIB = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');

// High islands use the real LSIB polygon (exact State Dept spellings).
var LSIB_NAMES = {
  'Fiji':'Fiji', 'Papua New Guinea':'Papua New Guinea', 'Solomon Islands':'Solomon Is',
  'Vanuatu':'Vanuatu', 'Samoa':'Samoa'};
// Small / atoll nations use a point + buffer.
var POINT_AOI = {
  'Tonga':[-174.8,-20.0,300000], 'Palau':[134.58,7.5,120000], 'Tuvalu':[178.5,-7.8,350000],
  'Kiribati':[173.0,1.4,500000], 'Nauru':[166.93,-0.52,40000], 'Niue':[-169.87,-19.05,40000],
  'Cook Islands':[-159.78,-21.23,300000], 'Marshall Islands':[169.0,8.0,600000],
  'Federated States of Micronesia':[158.21,6.92,500000]};

print('--- (A1) LSIB polygon countries (feature count should be 1) ---');
Object.keys(LSIB_NAMES).forEach(function (friendly) {
  var na = LSIB_NAMES[friendly];
  print(friendly + "  ->  country_na '" + na + "'  features:",
        LSIB.filter(ee.Filter.eq('country_na', na)).size());
});

print('--- (A2) Point+buffer countries (area in km2 should be > 0) ---');
Object.keys(POINT_AOI).forEach(function (friendly) {
  var p = POINT_AOI[friendly];
  var area = ee.Geometry.Point([p[0], p[1]]).buffer(p[2]).area().divide(1e6);
  print(friendly + '  ->  buffer area (km2):', area);
});

// ---------- (B) Does every dataset load? ----------
print('--- (B) Dataset access check (band names should print) ---');

print('GPM IMERG rainfall:',
  ee.ImageCollection('NASA/GPM_L3/IMERG_MONTHLY_V07').first().bandNames());
print('ERA5-Land air temp (high islands):',
  ee.ImageCollection('ECMWF/ERA5_LAND/DAILY_AGGR').first().bandNames());
print('ERA5 global air temp (atolls):',
  ee.ImageCollection('ECMWF/ERA5/MONTHLY').first().bandNames());
print('MODIS LST:',
  ee.ImageCollection('MODIS/061/MOD11A1').first().bandNames());
print('NOAA OISST:',
  ee.ImageCollection('NOAA/CDR/OISST/V2_1').first().bandNames());
print('NASADEM elevation:',
  ee.Image('NASA/NASADEM_HGT/001').bandNames());
print('JRC Global Surface Water:',
  ee.Image('JRC/GSW1_4/GlobalSurfaceWater').bandNames());

print('===== If every band list printed and all 14 countries resolved, ' +
      'the workshop is fully reachable from your account. =====');
