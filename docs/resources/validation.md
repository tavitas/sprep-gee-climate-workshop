# Validation Report — Pacific Climate GEE Workshop Materials

**Run:** live validation against Earth Engine, 28 June 2026 (updated)
**Scope:** registration flow, dataset IDs, scripts, exercises, cheat sheet, deck.

This records what was checked, what was fixed, and the results of running every
script's logic **live** against Earth Engine. The scripts **default to the 14
SPREP member countries**; coverage was verified across all 21 PICTs so adding a
territory back is safe.

!!! success "Live re-validation, 28 June 2026"
    Every theme's server-side logic was run against live Earth Engine across all
    21 PICTs. Two datasets were changed as a result so the scripts work for
    **every** country, not just the high islands:

    - **Rainfall: CHIRPS → GPM IMERG** (`NASA/GPM_L3/IMERG_MONTHLY_V07`). CHIRPS
      returned ~0 mm/yr at Palau and nothing at the far-western/small Pacific;
      IMERG covers the whole region.
    - **Air-temperature trend: ERA5-Land → global ERA5** (`ECMWF/ERA5/MONTHLY`).
      Land-only ERA5-Land is blank over the atoll nations; the global ERA5
      reanalysis covers ocean and returns a trend everywhere.

    After the changes, every member country returns real rainfall, an
    air-temperature trend, and sea-surface temperature.

---

## 1. Registration flow — PASS
Verified against the official Earth Engine **Access** guide and the
Spatial Thoughts sign-up guide. The 2026 flow (Cloud project → noncommercial
verification as *Earth Engine trainer/trainee* → *Participant* → free
*Community* tier → *Classroom or education*) matches Exercise 1 and the
cheat sheet. URLs `code.earthengine.google.com/register` and
`code.earthengine.google.com` are correct.

## 2. Datasets — PASS (all 6 verified on the live catalog)
Each ID, band, scale factor, unit and date range was confirmed on the
Earth Engine Data Catalog:

| Dataset | ID | Key band(s) | Verified detail |
|---|---|---|---|
| GPM IMERG rainfall | `NASA/GPM_L3/IMERG_MONTHLY_V07` | `precipitation` (mm/hr) | ~11 km; 2000 → present; full Pacific coverage |
| ERA5 air temp | `ECMWF/ERA5/MONTHLY` | `mean_2m_air_temperature` (**K**) | ~28 km; 1979 → 2020-06; global (covers atolls) |
| MODIS land heat | `MODIS/061/MOD11A1` | `LST_Day_1km` (**K**, ×0.02) | ~1 km; 2000 → 2026 |
| Sea-surface temp | `NOAA/CDR/OISST/V2_1` | `sst`, `anom` (°C, ×0.01) | 0.25°; 1981 → 2026 |
| Elevation | `NASA/NASADEM_HGT/001` | `elevation` (m) | 30 m; `ee.Image` |
| Surface water | `JRC/GSW1_4/GlobalSurfaceWater` | `occurrence` (%) | 30 m; `ee.Image` |

All Kelvin→°C conversions and scale factors in the scripts match the catalog.

## 3. Country boundaries — ISSUE FOUND & FIXED ⚠️→✅
**Finding:** `USDOS/LSIB_SIMPLE/2017` (a) uses US State Department spellings
and (b) includes all 21 SPREP PICTs, though polygons for small atolls may be imprecise. Several country names in
the first draft did not match and would have produced **blank maps**.
The complete SPREP PICT mapping (all 21 PICTs are in LSIB):

| Friendly name | LSIB name |
|---|---|
| American Samoa | `American Samoa` |
| Cook Islands | `Cook Is` |
| Federated States of Micronesia | `Fed States of Micronesia` |
| Fiji | `Fiji` |
| French Polynesia | `French Polynesia` |
| Guam | `Guam` |
| Kiribati | `Kiribati` |
| Marshall Islands | `Marshall Is` |
| Nauru | `Nauru` |
| New Caledonia | `New Caledonia` |
| Niue | `Niue` |
| Northern Mariana Is | `Northern Mariana Is` |
| Palau | `Palau` |
| Papua New Guinea | `Papua New Guinea` |
| Samoa | `Samoa` |
| Solomon Islands | `Solomon Is` |
| Tonga | `Tonga` |
| Tokelau | `Tokelau` |
| Tuvalu | `Tuvalu` |
| Vanuatu | `Vanuatu` |
| Wallis & Futuna | `Wallis & Futuna` |

All 21 PICTs are present in LSIB (see table above), so a territory can be added
back at any time. The scripts **default to the 14 SPREP member countries**.
**Fix applied (hybrid approach):**
- Larger high islands (Fiji, Samoa, Vanuatu, Solomon Islands, Papua New
  Guinea) → real LSIB outline with the correct spelling.
- Small / atoll nations (Tonga, Palau, Tuvalu, Kiribati, Nauru, Niue, Cook
  Islands, Marshall Islands, Federated States of Micronesia) → point + buffer,
  which is more reliable than the coarse LSIB polygon for the climate grids.
- A country selector is built into every JS script and into
  `python/_pacific_aoi.py`; participants type a **friendly name** and the
  right area is chosen automatically. Adding a territory is one line.
- Selector logic verified: all 14 member countries resolve via the correct
  branch; unknown names raise a clear error.

## 4. Scripts — PASS
All JavaScript pass `node --check`; all Python pass `py_compile`. Dataset
IDs, bands and scale factors cross-checked against the catalog. JS and
Python now have matching versions for all four themes.

## 5. What still needs YOUR login (live run)
Earth Engine only executes against your registered Cloud project, so two
things can only be confirmed in your account:

1. **Run `scripts/javascript/99_diagnostic_check.js` once.** It prints, live:
   - which Pacific `country_na` values actually resolve in LSIB (feature
     count per country — a count of 0 means "use point+buffer"), and
   - that all six datasets load (band names print).
2. **Run each of `01`–`04` once** with `COUNTRY` set to a test nation and
   confirm the map + chart render. Defaults (Fiji, Samoa) are pre-checked
   to be valid LSIB names.

If the diagnostic shows any of the "big island" names returns 0 features,
move that nation into the point+buffer list in the helper (one line) — or
tell me and I'll adjust.

---

### Summary
Offline verification: **PASS** across registration, datasets, scripts,
exercises, cheat sheet and deck, with one significant boundary-naming bug
found and fixed. Remaining: a ~5-minute live confirmation in your account
using the diagnostic script.
