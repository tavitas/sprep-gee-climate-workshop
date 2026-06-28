# Exercise 2 — Code Editor Basics & Your Country

**Goal:** Get comfortable with the Earth Engine Code Editor and put **your
own country** on the map. This boundary becomes the "area of interest"
(AOI) you reuse in every later exercise.

**Time:** ~25 minutes · **Before you start:** finish Exercise 1.

---

## The Code Editor at a glance
When you open https://code.earthengine.google.com you see four areas:

- **Left — Scripts:** save and open your code files (your repositories).
- **Centre — Editor:** where you type/paste JavaScript. **Run** is at the top.
- **Right — Console:** where `print()` output and charts appear.
- **Bottom — Map:** where layers you add appear.

There are tabs top-right: **Inspector** (click the map to read pixel
values), **Console** (text output), **Tasks** (exports), and **Ask** — a
built-in **AI assistant** that can write, explain and debug scripts for you.
See [AI assistant (Ask)](../scripts/ai-assistant.md).

## Step 1 — Print a message
Type this and click **Run**:
```javascript
print('My first Earth Engine script');
```
Output appears in the **Console** on the right.

## Step 2 — Load your country's boundary
We use the global **LSIB** boundary dataset. Change `'Samoa'` to your
country. Run it:
```javascript
// IMPORTANT — type the name EXACTLY as the LSIB boundary layer stores it
// (US State Dept spellings). The 14 SPREP member countries are:
//   'Fiji'   'Papua New Guinea'   'Vanuatu'   'Samoa'   'Tonga'   'Tuvalu'
//   'Kiribati'   'Nauru'   'Niue'   'Palau'
//   'Solomon Is'                <- NOT 'Solomon Islands'
//   'Cook Is'                   <- NOT 'Cook Islands'
//   'Marshall Is'               <- NOT 'Marshall Islands'
//   'Fed States of Micronesia'  <- NOT 'FSM' or 'Micronesia'
// (Other PICTs/territories also have LSIB entries — see the table below. Tiny
//  atolls clip best with the point+buffer method shown later.)
var countryName = 'Samoa';

// 2. Load the global boundaries and keep just your country
var country = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
                .filter(ee.Filter.eq('country_na', countryName));

// 3. Center and zoom the map to fit your country
Map.centerObject(country);

// 4. Draw it
Map.addLayer(country, {color: 'red'}, countryName);
```

The map at the bottom should jump to your country with a red outline.

## Step 3 — Use the Inspector
1. Click the **Inspector** tab (top-right).
2. Click anywhere on your country on the map.
3. Read the feature's properties (area, name, etc.) in the panel.

## Step 4 — Save your script
1. Click **Save** (top of editor).
2. If prompted, create a repository, e.g. `sprep-gee-data-workshop-2026`.
3. Name the file `02-my-country`. It now lives in the **Scripts** panel.

![Save script — create repository and name your file dialogue](../assets/images/gee-signup/save-repo.png)

---

## Your turn — and an important gotcha about country names

The boundary layer `USDOS/LSIB_SIMPLE/2017` has **two quirks** you must know:

1. It uses **US State Department spellings**, which are not always the
   plain-English name. For example you must filter on `Solomon Is`, not
   `Solomon Islands`.
2. It uses a **coarse simplification**, so smaller-island polygons may be
   imprecise — a point + buffer is more reliable for small nations
   (see the next section).

### LSIB country names — use these exact spellings

The 14 SPREP member countries (each is present in LSIB):

| Type this `countryName` | Result |
|-------------------------|--------|
| `Fiji` | works |
| `Samoa` | works |
| `Vanuatu` | works |
| `Papua New Guinea` | works |
| `Solomon Is` | works (note: **not** "Solomon Islands") |
| `Tonga` | works |
| `Kiribati` | works |
| `Nauru` | works |
| `Tuvalu` | works |
| `Palau` | works |
| `Marshall Is` | works |
| `Fed States of Micronesia` | works |
| `Cook Is` | works |
| `Niue` | works |

(The other PICTs/territories — e.g. `New Caledonia`, `Guam`, `American Samoa` —
are also in LSIB if you need them.)

### Small islands and atolls — point + buffer recommended

LSIB polygons for small island and atoll nations can be imprecise — the coarse
(5–28 km) climate grids may miss tiny land areas. A point + buffer is more
reliable for these: Tonga, Palau, Tuvalu, Kiribati, Nauru, Niue, Cook Islands,
Marshall Islands, Federated States of Micronesia.
Define your area as a **point with a circle (buffer)**:
```javascript
// Funafuti, Tuvalu + 350 km of surrounding ocean/atolls
var country = ee.Geometry.Point([178.5, -7.8]).buffer(350000);
Map.centerObject(country, 7);
Map.addLayer(country, {color: 'red'}, 'Tuvalu (point + buffer)');
```

### The easy way — let the helper handle both

The climate scripts in [`../scripts`](../scripts/index.md) and the helper file
[`../scripts/javascript.md`](../scripts/javascript.md)
do this for you: you type the **friendly name** (e.g. `Solomon Islands` or
`Tuvalu`) and `getCountry('Solomon Islands')` returns the right area
automatically. Run **`99_diagnostic_check.js`** once to see live which
names resolve in your account.

---

## Check — did it work?
✅ The map centres on your country.
✅ A red boundary (or circle) is drawn.
✅ Clicking with the Inspector shows properties.
✅ Your script is saved in the Scripts panel.

**Next:** [Exercise 3 — Coral reef habitats](coral-reefs.md)
