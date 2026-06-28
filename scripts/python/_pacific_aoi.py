"""
_pacific_aoi.py  —  shared country-selector for the Python workshop scripts
SPREP / UNEP GEE Climate Workshop 2026

Returns an area of interest (AOI) that works for EVERY Pacific nation.
Larger high islands use the real LSIB boundary (note the exact State Dept
spellings); small / atoll nations use a point + buffer, because
USDOS/LSIB_SIMPLE/2017 drops smaller islands.

Usage:
    import ee
    from _pacific_aoi import get_country, get_outline
    aoi = get_country('Solomon Islands')      # ee.Geometry
    outline = get_outline('Solomon Islands')  # ee.FeatureCollection
"""

import ee

# friendly name -> exact 'country_na' string in LSIB_SIMPLE/2017 (verified live)
LSIB_NAMES = {
    'Fiji': 'Fiji',
    'Papua New Guinea': 'Papua New Guinea',
    'Solomon Islands': 'Solomon Is',
    'Vanuatu': 'Vanuatu',
    'Samoa': 'Samoa',
}

# friendly name -> [lon, lat, buffer_radius_metres] for small / atoll nations
# (point+buffer is more reliable than the coarse LSIB polygon).
# LSIB_NAMES + POINT_AOI together cover the 14 SPREP member countries. To add a
# territory (e.g. 'New Caledonia', 'Guam'), add a line here or in LSIB_NAMES.
POINT_AOI = {
    'Tonga': [-174.80, -20.00, 300000],
    'Palau': [134.58, 7.50, 120000],
    'Tuvalu': [178.50, -7.80, 350000],
    'Kiribati': [173.00, 1.40, 500000],
    'Nauru': [166.93, -0.52, 40000],
    'Niue': [-169.87, -19.05, 40000],
    'Cook Islands': [-159.78, -21.23, 300000],
    'Marshall Islands': [169.00, 8.00, 600000],
    'Federated States of Micronesia': [158.21, 6.92, 500000],
}


def get_country(name):
    """Return an ee.Geometry AOI for any Pacific nation."""
    if name in LSIB_NAMES:
        return (ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
                .filter(ee.Filter.eq('country_na', LSIB_NAMES[name]))
                .geometry())
    if name in POINT_AOI:
        lon, lat, radius = POINT_AOI[name]
        return ee.Geometry.Point([lon, lat]).buffer(radius)
    raise ValueError("Unknown country: %s. Add it to LSIB_NAMES or POINT_AOI." % name)


def get_outline(name):
    """Return an ee.FeatureCollection to draw as the country's outline."""
    if name in LSIB_NAMES:
        return (ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
                .filter(ee.Filter.eq('country_na', LSIB_NAMES[name])))
    return ee.FeatureCollection([ee.Feature(get_country(name))])
