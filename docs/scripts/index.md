# Using the scripts

Every script in this course is **copy-paste ready**. The JavaScript runs in the
Earth Engine Code Editor with nothing to install; the Python versions run in
Google Colab or a notebook.

## JavaScript (recommended for the workshop)

1. Open the Code Editor at
   [code.earthengine.google.com](https://code.earthengine.google.com).
2. Open a script on the [JavaScript page](javascript.md), click the
   :material-content-copy: copy button, and paste it into the editor.
3. Change the `COUNTRY` variable at the top to your country.
4. Click **Run**. The map appears below; charts appear in the **Console**.

## Python (geemap, for notebooks)

1. Run the setup script once (easiest in
   [Google Colab](https://colab.research.google.com)).
2. Then run any other script on the [Python page](python.md). They produce the
   same maps plus saved PNG charts.

## What each script does

| File | Theme | Output |
|------|-------|--------|
| `00_pacific_helpers.js` | — | Country boundaries (hybrid), legends, palettes |
| `01_rainfall_chirps` | Rainfall & drought | Mean annual rainfall map + drought chart |
| `02_temperature_era5_modis` | Temperature & heat | Heat map + warming trend chart + warming map |
| `03_sst_reef_heat` | Ocean & reefs | SST map + SST anomaly time series |
| `04_coastal_exposure` | Sea level & coast | Low-lying land map + exposed area (km²) |
| `99_diagnostic_check.js` | — | One-time live check of countries + datasets |

## Localising for your country

Set `COUNTRY` to your nation using the **friendly name** — the scripts translate
it automatically:

`Fiji` · `Samoa` · `Tonga` · `Vanuatu` · `Solomon Islands` ·
`Papua New Guinea` · `Palau` · `Niue` · `Cook Islands` ·
`Federated States of Micronesia` · `Marshall Islands` · `Kiribati` ·
`Nauru` · `Tuvalu` · `Tokelau` · `New Caledonia`

!!! warning "Why a country selector?"
    The global boundary layer uses State Department spellings (e.g.
    `Solomon Is`) and drops smaller islands. The built-in selector uses the real
    outline for larger high islands and a point + buffer for small / atoll
    nations — so any nation works. See the
    [dataset reference](../datasets/reference.md#country-boundaries-important).

Before a workshop, run the [live diagnostic check](diagnostic.md) once to
confirm which names resolve in your account.
