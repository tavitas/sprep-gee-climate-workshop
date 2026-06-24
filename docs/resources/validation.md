# Validation Report — Pacific Climate GEE Workshop Materials

**Run:** simulation / dry-run review, 24 June 2026
**Scope:** registration flow, dataset IDs, scripts, exercises, cheat sheet, deck.

This records what was checked, what was fixed, and the one step that
requires your Google login to finish.

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
| CHIRPS rainfall | `UCSB-CHG/CHIRPS/DAILY` | `precipitation` (mm/d) | ~5.5 km; 1981 → 2026; covers 1991–2020 normal |
| ERA5-Land air temp | `ECMWF/ERA5_LAND/DAILY_AGGR` | `temperature_2m` (**K**) | ~11 km; 1950 → 2026 |
| MODIS land heat | `MODIS/061/MOD11A1` | `LST_Day_1km` (**K**, ×0.02) | ~1 km; 2000 → 2026 |
| Sea-surface temp | `NOAA/CDR/OISST/V2_1` | `sst`, `anom` (°C, ×0.01) | 0.25°; 1981 → 2026 |
| Elevation | `NASA/NASADEM_HGT/001` | `elevation` (m) | 30 m; `ee.Image` |
| Surface water | `JRC/GSW1_4/GlobalSurfaceWater` | `occurrence` (%) | 30 m; `ee.Image` |

All Kelvin→°C conversions and scale factors in the scripts match the catalog.

## 3. Country boundaries — ISSUE FOUND & FIXED ⚠️→✅
**Finding:** `USDOS/LSIB_SIMPLE/2017` (a) uses US State Department spellings
and (b) **excludes medium and smaller islands**. Several country names in
the first draft did not match and would have produced **blank maps**.
The complete SPREP PICT mapping (15 LSIB entries, 6 point+buffer):

| Friendly name | LSIB name |
|---|---|
| Cook Islands | `Cook Is (NZ)` |
| Federated States of Micronesia | `Micronesia, Fed States of` |
| Fiji | `Fiji` |
| Kiribati | `Kiribati` |
| Marshall Islands | `Marshall Is` |
| Nauru | `Nauru` |
| New Caledonia | `New Caledonia (Fr)` |
| Niue | `Niue (NZ)` |
| Palau | `Palau` |
| Papua New Guinea | `Papua New Guinea` |
| Samoa | `Samoa` |
| Solomon Islands | `Solomon Is` |
| Tonga | `Tonga` |
| Tuvalu | `Tuvalu` |
| Vanuatu | `Vanuatu` |

The six remaining PICTs have no separate LSIB entry and always use
point+buffer: American Samoa, French Polynesia, Guam, Northern Mariana
Islands, Tokelau, and Wallis and Futuna.
**Fix applied (hybrid approach):**
- Larger high islands (Fiji, Samoa, Vanuatu, Solomon Islands, Papua New
  Guinea, New Caledonia) → real LSIB outline with the correct spelling.
- Small / atoll nations and territories (Tonga, Palau, Tuvalu, Kiribati, Nauru,
  Niue, Cook Islands, Marshall Islands, Federated States of Micronesia,
  American Samoa, French Polynesia, Guam, Northern Mariana Islands, Tokelau,
  Wallis and Futuna) → point + buffer, which
  always works for the coarse climate grids.
- A country selector is built into every JS script and into
  `python/_pacific_aoi.py`; participants type a **friendly name** and the
  right area is chosen automatically.
- Selector logic was unit-tested offline: all 21 PICTs resolve via the
  correct branch; unknown names raise a clear error.

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
