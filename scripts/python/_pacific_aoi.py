"""
_pacific_aoi.py  —  shared country-selector for the Python workshop scripts
SPREP / UNEP GEE Climate Workshop 2026

Returns an area of interest (AOI) for any of the 14 SPREP member countries.
Larger high islands use the real LSIB boundary (note the exact State Dept
spellings); small / atoll nations use a point + buffer, because
USDOS/LSIB_SIMPLE/2017 resolves them imprecisely.

Scope (2026): the 14 independent SPREP member countries — Cook Islands, FSM,
Fiji, Kiribati, Marshall Islands, Nauru, Niue, Palau, Papua New Guinea, Samoa,
Solomon Islands, Tonga, Tuvalu, Vanuatu.

Usage:
    import ee
    from _pacific_aoi import get_country, get_outline, get_temp_source
    aoi = get_country('Solomon Islands')      # ee.Geometry
    outline = get_outline('Solomon Islands')  # ee.FeatureCollection
"""

import ee

# friendly name -> exact 'country_na' string in LSIB_SIMPLE/2017
LSIB_NAMES = {
    'Fiji': 'Fiji',
    'Papua New Guinea': 'Papua New Guinea',
    'Solomon Islands': 'Solomon Is',
    'Vanuatu': 'Vanuatu',
    'Samoa': 'Samoa',
}

# friendly name -> [lon, lat, buffer_radius_metres] for small / atoll nations
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

# Atoll nations where ERA5-Land (land-only, 11 km) returns no data, so the
# air-temperature scripts fall back to global ERA5 (27 km, ends mid-2020).
TEMP_GLOBAL = {
    'Cook Islands', 'Kiribati', 'Marshall Islands', 'Nauru',
    'Niue', 'Tonga', 'Tuvalu',
}


def get_country(name):
    """Return an ee.Geometry AOI for any of the 14 SPREP member countries."""
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


def get_temp_source(name):
    """Return the air-temperature dataset config for a country.

    ERA5-Land (11 km, to present) has no data over tiny atolls, so those use
    the global ERA5 reanalysis (27 km, ends mid-2020), which includes ocean.
    """
    if name in TEMP_GLOBAL:
        return {'collection': 'ECMWF/ERA5/MONTHLY', 'band': 'mean_2m_air_temperature',
                'scale': 27000, 'end_year': 2019, 'recent_start': 2010}
    return {'collection': 'ECMWF/ERA5_LAND/DAILY_AGGR', 'band': 'temperature_2m',
            'scale': 11000, 'end_year': 2024, 'recent_start': 2015}
